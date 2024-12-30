"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClient = void 0;
// Redis client configuration 
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = require("../../utils/logger");
class RedisClient {
    constructor() { }
    static getInstance() {
        if (!RedisClient.instance) {
            RedisClient.instance = new ioredis_1.default({
                host: process.env.REDIS_HOST || 'localhost',
                port: Number(process.env.REDIS_PORT) || 6379,
                password: process.env.REDIS_PASSWORD,
                retryStrategy: (times) => {
                    return Math.min(times * 50, 2000);
                }
            });
            RedisClient.instance.on('error', (err) => {
                logger_1.logger.error('Redis connection error:', err);
            });
            RedisClient.instance.on('connect', () => {
                logger_1.logger.info('Redis connected successfully');
            });
        }
        return RedisClient.instance;
    }
}
exports.RedisClient = RedisClient;
