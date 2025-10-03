const redis = require('../utility/redis');

const cacheMiddleware = (duration = 60) => async (req, res, next) => {
    // Skip caching if Redis is not available
    if (!redis) {
        return next();
    }
    
    const key = `cache:${req.originalUrl}`;
    try {
        const cached = await redis.get(key);
        if (cached) {
            // Serve from cache
            return res.json(JSON.parse(cached));
        }
        // Monkey-patch res.json to cache the response
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            if (redis) {
                redis.setex(key, duration, JSON.stringify(body)).catch(err => {
                    console.warn('Cache write failed:', err.message);
                });
            }
            return originalJson(body);
        };
        next();
    } catch (err) {
        // On error, just proceed without cache
        console.warn('Cache middleware error:', err.message);
        next();
    }
};

module.exports = cacheMiddleware;