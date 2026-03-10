// utility/redis.js
const Redis = require('ioredis');
const dotenv = require('dotenv');

dotenv.config();

// Check if Redis configuration is available
const isRedisConfigured = process.env.REDIS_CLOUD_HOST || process.env.REDIS_URL;

let redis = null;

if (isRedisConfigured) {
    const redisConfig = {
        host: process.env.REDIS_CLOUD_HOST,
        port: process.env.REDIS_CLOUD_PORT,
        password: process.env.REDIS_CLOUD_PASSWORD,
        tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
        retryStrategy: (times) => {
            if (times > 3) return null; // Stop retrying after 3 attempts
            return Math.min(times * 500, 2000);
        },
        maxRetriesPerRequest: 3, // Limit retries to prevent hanging
        reconnectOnError: (err) => {
            console.error('Redis reconnect error:', err.message);
            return false; // Don't reconnect on error in production
        }
    };

    try {
        redis = new Redis(redisConfig);
        
        // Test connection
        redis.on('ready', () => {
            console.log('🚀 Redis connected successfully!');
        });

        let redisErrorLogged = false;
        redis.on('error', (err) => {
            if (!redisErrorLogged) {
                console.warn('Redis not available - running without cache');
                redisErrorLogged = true;
            }
            redis = null; // Disable Redis on error
        });
    } catch (error) {
        console.warn('⚠️ Redis initialization failed:', error.message);
        redis = null;
    }
} else {
    console.log('ℹ️ Redis not configured - running without caching');
}

module.exports = redis;