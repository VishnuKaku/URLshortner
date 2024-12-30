// URL caching logic 
// src/cache/strategies/urlCache.ts
import { RedisOperations } from '../redis/operations';
export class URLCache {
    redis;
    URL_PREFIX = 'url:';
    DEFAULT_TTL = 86400; // 24 hours
    constructor() {
        this.redis = new RedisOperations();
    }
    getKey(shortCode) {
        return `${this.URL_PREFIX}${shortCode}`;
    }
    async setURL(shortCode, longUrl) {
        await this.redis.set(this.getKey(shortCode), longUrl, this.DEFAULT_TTL);
    }
    async getURL(shortCode) {
        return await this.redis.get(this.getKey(shortCode));
    }
    async deleteURL(shortCode) {
        await this.redis.del(this.getKey(shortCode));
    }
}
