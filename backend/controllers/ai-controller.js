const aiService = require('../utility/ai-service');
const jobQueue = require('../utility/job-queue');
const { sendNotificationEvent } = require('../utility/kafka');

// POST /api/ai/evaluate-pitch — async via job queue
const evaluatePitch = async (req, res) => {
    try {
        const { companyName, idea, description, businessModel, marketSize, stage, teamSize, fundingAsk } = req.body;

        if (!idea && !description) {
            return res.status(400).json({ msg: 'Startup idea/description is required' });
        }

        const jobId = await jobQueue.enqueueJob('pitch-evaluation', {
            companyName,
            idea: idea || description,
            description,
            businessModel,
            marketSize,
            stage,
            teamSize,
            fundingAsk,
            _userId: req.user._id.toString(),
        });

        // Send Kafka event
        sendNotificationEvent({
            type: 'PITCH_EVALUATION_REQUESTED',
            userId: req.user._id,
            jobId,
        }).catch(() => {});

        res.status(202).json({ jobId, status: 'queued', message: 'Pitch evaluation queued' });
    } catch (err) {
        console.error('Error queuing pitch evaluation:', err);
        res.status(500).json({ msg: 'Failed to queue evaluation' });
    }
};

// POST /api/ai/evaluate-pitch/sync — synchronous (direct response)
const evaluatePitchSync = async (req, res) => {
    try {
        const { companyName, idea, description, businessModel, marketSize, stage, teamSize, fundingAsk } = req.body;

        if (!idea && !description) {
            return res.status(400).json({ msg: 'Startup idea/description is required' });
        }

        const result = await aiService.evaluatePitchReadiness({
            companyName,
            idea: idea || description,
            businessModel,
            marketSize,
            stage,
            teamSize,
            fundingAsk,
        });

        // Broadcast via socket if pitch session
        const io = req.app.get('io');
        if (io && req.body.sessionId) {
            io.to(`pitch_${req.body.sessionId}`).emit('aiPitchEvaluation', {
                userId: req.user._id,
                evaluation: result,
                timestamp: new Date(),
            });
        }

        res.json(result);
    } catch (err) {
        console.error('Pitch evaluation error:', err);
        res.status(500).json({ msg: 'AI evaluation failed' });
    }
};

// POST /api/ai/market-analysis
const analyzeMarket = async (req, res) => {
    try {
        const { domain, industry, idea, targetMarket, competition } = req.body;

        if (!idea) {
            return res.status(400).json({ msg: 'Business idea is required' });
        }

        const jobId = await jobQueue.enqueueJob('market-analysis', {
            domain: domain || industry,
            idea,
            targetMarket,
            competition,
            _userId: req.user._id.toString(),
        });

        res.status(202).json({ jobId, status: 'queued', message: 'Market analysis queued' });
    } catch (err) {
        console.error('Error queuing market analysis:', err);
        res.status(500).json({ msg: 'Failed to queue analysis' });
    }
};

// POST /api/ai/market-analysis/sync
const analyzeMarketSync = async (req, res) => {
    try {
        const { domain, industry, idea, targetMarket, competition } = req.body;

        if (!idea) {
            return res.status(400).json({ msg: 'Business idea is required' });
        }

        const result = await aiService.analyzeMarketSignals({
            domain: domain || industry,
            idea,
            targetMarket,
            competition,
        });

        res.json(result);
    } catch (err) {
        console.error('Market analysis error:', err);
        res.status(500).json({ msg: 'AI analysis failed' });
    }
};

// POST /api/ai/quick-feedback — lightweight, for real-time pitch rooms
const quickFeedback = async (req, res) => {
    try {
        const { statement, sessionId } = req.body;

        if (!statement) {
            return res.status(400).json({ msg: 'Statement is required' });
        }

        const result = await aiService.quickPitchFeedback(statement);

        // Broadcast to pitch room via WebSocket for sub-100ms delivery to other participants
        const io = req.app.get('io');
        if (io && sessionId) {
            io.to(`pitch_${sessionId}`).emit('aiQuickFeedback', {
                userId: req.user._id,
                statement,
                ...result,
                timestamp: new Date(),
            });
        }

        res.json(result);
    } catch (err) {
        console.error('Quick feedback error:', err);
        res.status(500).json({ msg: 'AI feedback failed' });
    }
};

// GET /api/ai/job/:jobId — poll job result
const getJobStatus = async (req, res) => {
    try {
        const { jobId } = req.params;
        const result = await jobQueue.getJobResult(jobId);

        if (!result) {
            return res.status(404).json({ msg: 'Job not found or expired' });
        }

        res.json(result);
    } catch (err) {
        console.error('Error fetching job status:', err);
        res.status(500).json({ msg: 'Failed to get job status' });
    }
};

module.exports = {
    evaluatePitch,
    evaluatePitchSync,
    analyzeMarket,
    analyzeMarketSync,
    quickFeedback,
    getJobStatus,
};
