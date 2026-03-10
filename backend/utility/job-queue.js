// Redis-backed job queue for async LLM processing
// Keeps main thread non-blocking by queuing AI requests
const redis = require('./redis');

const QUEUE_KEY = 'ai:job:queue';
const RESULT_PREFIX = 'ai:result:';
const JOB_TTL = 300; // Results expire after 5 minutes

let jobCounter = 0;

function generateJobId() {
    return `job_${Date.now()}_${++jobCounter}`;
}

// Enqueue an AI job — returns jobId immediately
async function enqueueJob(type, data) {
    const jobId = generateJobId();
    const job = { jobId, type, data, status: 'queued', createdAt: Date.now() };

    if (redis) {
        try {
            await redis.lpush(QUEUE_KEY, JSON.stringify(job));
            await redis.set(`${RESULT_PREFIX}${jobId}`, JSON.stringify({ status: 'queued' }), 'EX', JOB_TTL);
            return jobId;
        } catch (err) {
            // Redis down — fall through to in-memory
        }
    }

    // Fallback: in-memory queue (works without Redis)
    if (!global._aiJobQueue) global._aiJobQueue = [];
    if (!global._aiResults) global._aiResults = new Map();
    global._aiJobQueue.push(job);
    global._aiResults.set(jobId, { status: 'queued' });
    return jobId;
}

// Get job result
async function getJobResult(jobId) {
    if (redis) {
        try {
            const result = await redis.get(`${RESULT_PREFIX}${jobId}`);
            return result ? JSON.parse(result) : null;
        } catch (err) {
            // Fall through
        }
    }
    if (global._aiResults) {
        return global._aiResults.get(jobId) || null;
    }
    return null;
}

// Store job result
async function storeJobResult(jobId, result) {
    const data = { status: 'completed', result, completedAt: Date.now() };

    if (redis) {
        try {
            await redis.set(`${RESULT_PREFIX}${jobId}`, JSON.stringify(data), 'EX', JOB_TTL);
            return;
        } catch (err) {
            // Fall through
        }
    }
    if (global._aiResults) {
        global._aiResults.set(jobId, data);
        // Auto-cleanup after TTL
        setTimeout(() => global._aiResults.delete(jobId), JOB_TTL * 1000);
    }
}

// Store job error
async function storeJobError(jobId, error) {
    const data = { status: 'failed', error: error.message, failedAt: Date.now() };

    if (redis) {
        try {
            await redis.set(`${RESULT_PREFIX}${jobId}`, JSON.stringify(data), 'EX', JOB_TTL);
            return;
        } catch (err) {
            // Fall through
        }
    }
    if (global._aiResults) {
        global._aiResults.set(jobId, data);
    }
}

// Process next job from queue (called by worker loop)
async function dequeueJob() {
    if (redis) {
        try {
            const raw = await redis.rpop(QUEUE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (err) {
            // Fall through
        }
    }
    if (global._aiJobQueue && global._aiJobQueue.length > 0) {
        return global._aiJobQueue.shift();
    }
    return null;
}

// Worker: processes AI jobs from the queue
function startWorker(aiService, io) {
    const POLL_INTERVAL = 500; // Check queue every 500ms

    async function processNext() {
        try {
            const job = await dequeueJob();
            if (!job) return;

            const { jobId, type, data } = job;
            console.log(`Processing AI job: ${jobId} (${type})`);

            let result;
            switch (type) {
                case 'pitch-evaluation':
                    result = await aiService.evaluatePitchReadiness(data);
                    break;
                case 'market-analysis':
                    result = await aiService.analyzeMarketSignals(data);
                    break;
                case 'quick-feedback':
                    result = await aiService.quickPitchFeedback(data.statement);
                    break;
                default:
                    throw new Error(`Unknown job type: ${type}`);
            }

            await storeJobResult(jobId, result);

            // Broadcast result via WebSocket if userId/sessionId provided
            if (io && data._socketRoom) {
                io.to(data._socketRoom).emit('aiResult', { jobId, type, result });
            }
            if (io && data._userId) {
                const connectedUsers = io.sockets.adapter.rooms;
                // Emit to user directly if connected
                io.emit('aiJobComplete', { jobId, type, userId: data._userId });
            }
        } catch (err) {
            console.error('AI job processing error:', err.message);
            // Try to store error if we have the jobId
        }
    }

    setInterval(processNext, POLL_INTERVAL);
    console.log('AI job worker started');
}

module.exports = {
    enqueueJob,
    getJobResult,
    storeJobResult,
    storeJobError,
    dequeueJob,
    startWorker,
};
