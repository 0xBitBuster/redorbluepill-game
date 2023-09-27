const Redis = require("ioredis");

// Create a redis instance. By default, it will connect to redis:6379
const redisClient = new Redis({ enableOfflineQueue: false, host: process.env.REDIS_HOST });

module.exports = redisClient