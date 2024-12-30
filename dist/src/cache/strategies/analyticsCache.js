// Analytics caching logic 
// src/cache/strategies/analyticsCache.ts
import { RedisOperations } from '../redis/operations';
export class AnalyticsCache {
    redis;
    ANALYTICS_PREFIX = 'analytics:';
    DEFAULT_TTL = 300; // 5 minutes
    constructor() {
        this.redis = new RedisOperations();
    }
    getKey(identifier, type) {
        return `${this.ANALYTICS_PREFIX}${type}:${identifier}`;
    }
    async setAnalytics(identifier, type, data) {
        await this.redis.set(this.getKey(identifier, type), data, this.DEFAULT_TTL);
    }
    async getAnalytics(identifier, type) {
        return await this.redis.get(this.getKey(identifier, type));
    }
    async deleteAnalytics(identifier, type) {
        await this.redis.del(this.getKey(identifier, type));
    }
    // Special methods for analytics data
    async setURLAnalytics(shortCode, data) {
        await this.setAnalytics(shortCode, 'url', data);
    }
    async getURLAnalytics(shortCode) {
        return await this.getAnalytics(shortCode, 'url');
    }
    async setTopicAnalytics(topic, data) {
        await this.setAnalytics(topic, 'topic', data);
    }
    async getTopicAnalytics(topic) {
        return await this.getAnalytics(topic, 'topic');
    }
    async setOverallAnalytics(userId, data) {
        await this.setAnalytics(userId, 'overall', data);
    }
    async getOverallAnalytics(userId) {
        return await this.getAnalytics(userId, 'overall');
    }
}
