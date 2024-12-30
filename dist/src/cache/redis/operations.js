// Redis operations logic 
import { RedisClient } from './client';
import { logger } from '../../utils/logger';
export class RedisOperations {
    client;
    constructor() {
        this.client = RedisClient.getInstance();
    }
    async set(key, value, ttl) {
        try {
            if (ttl) {
                await this.client.setex(key, ttl, value);
            }
            else {
                await this.client.set(key, value);
            }
        }
        catch (error) {
            logger.error('Redis set operation failed:', error);
            throw error;
        }
    }
    async get(key) {
        try {
            return await this.client.get(key);
        }
        catch (error) {
            logger.error('Redis get operation failed:', error);
            throw error;
        }
    }
    async del(key) {
        try {
            await this.client.del(key);
        }
        catch (error) {
            logger.error('Redis delete operation failed:', error);
            throw error;
        }
    }
    async exists(key) {
        try {
            const result = await this.client.exists(key);
            return result === 1;
        }
        catch (error) {
            logger.error('Redis exists operation failed:', error);
            throw error;
        }
    }
}
