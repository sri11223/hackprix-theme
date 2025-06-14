const { redis } = require('../utility/redis');

const cacheMiddleware = (duration = 60) => async (req, res, next) => {
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
            redis.setex(key, duration, JSON.stringify(body));
            return originalJson(body);
        };
        next();
    } catch (err) {
        // On error, just proceed without cache
        next();
    }
};

module.exports = cacheMiddleware;