// utility/redis.js
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisConfig = {
    host: process.env.REDIS_CLOUD_HOST,
    port: process.env.REDIS_CLOUD_PORT,
    password: process.env.REDIS_CLOUD_PASSWORD,
    tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
    retryStrategy: (times) => Math.min(times * 500, 2000),
    reconnectOnError: (err) => {
        console.error('Redis reconnect error:', err.message);
        return true; // Always attempt to reconnect
    }
};

const redis = new Redis(redisConfig);

// Test connection
redis.on('ready', () => {
    console.log('🚀 Redis connected successfully!');
    redis.ping().then(() => console.log('✅ Redis PING successful'));
});

redis.on('error', (err) => {
    console.error('❌ Redis error:', err.message);
});

export default redis;