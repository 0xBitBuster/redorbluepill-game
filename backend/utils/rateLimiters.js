const { RateLimiterMemory, RateLimiterRedis } = require("rate-limiter-flexible");
const AppError = require("./AppError")
const redisClient = require("../lib/redis")

const allRateLimiterMemory = new RateLimiterMemory({
    points: 40, // 40 requests per 120min
    duration: 120,
});
exports.allRateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    points: 50, // 50 requests per 60min
    duration: 60, 
    insuranceLimiter: allRateLimiterMemory,
});

exports.rateLimiterMiddleware = (rateLimiter) => (req, res, next) => {
    rateLimiter.consume(req.ip)
        .then(() => next())
        .catch(() => {
            return next(new AppError("Too Many Requests. Please try again later", 429))
        });
};
