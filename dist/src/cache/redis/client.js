// Redis client configuration 
import Redis from 'ioredis';
import { logger } from '../../utils/logger';
export class RedisClient {
    static instance;
    constructor() { }
    static getInstance() {
        if (!RedisClient.instance) {
            RedisClient.instance = new Redis({
                host: process.env.REDIS_HOST || 'localhost',
                port: Number(process.env.REDIS_PORT) || 6379,
                password: process.env.REDIS_PASSWORD,
                retryStrategy: (times) => {
                    return Math.min(times * 50, 2000);
                }
            });
            RedisClient.instance.on('error', (err) => {
                logger.error('Redis connection error:', err);
            });
            RedisClient.instance.on('connect', () => {
                logger.info('Redis connected successfully');
            });
        }
        return RedisClient.instance;
    }
}
