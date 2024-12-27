// Analytics caching logic 
// src/cache/strategies/analyticsCache.ts
import { RedisOperations } from '../redis/operations';

export class AnalyticsCache {
  private redis: RedisOperations;
  private readonly ANALYTICS_PREFIX = 'analytics:';
  private readonly DEFAULT_TTL = 300; // 5 minutes

  constructor() {
    this.redis = new RedisOperations();
  }

  private getKey(identifier: string, type: string): string {
    return `${this.ANALYTICS_PREFIX}${type}:${identifier}`;
  }

  async setAnalytics(identifier: string, type: string, data: string): Promise<void> {
    await this.redis.set(
      this.getKey(identifier, type),
      data,
      this.DEFAULT_TTL
    );
  }

  async getAnalytics(identifier: string, type: string): Promise<string | null> {
    return await this.redis.get(this.getKey(identifier, type));
  }

  async deleteAnalytics(identifier: string, type: string): Promise<void> {
    await this.redis.del(this.getKey(identifier, type));
  }

  // Special methods for analytics data
  async setURLAnalytics(shortCode: string, data: string): Promise<void> {
    await this.setAnalytics(shortCode, 'url', data);
  }

  async getURLAnalytics(shortCode: string): Promise<string | null> {
    return await this.getAnalytics(shortCode, 'url');
  }

  async setTopicAnalytics(topic: string, data: string): Promise<void> {
    await this.setAnalytics(topic, 'topic', data);
  }

  async getTopicAnalytics(topic: string): Promise<string | null> {
    return await this.getAnalytics(topic, 'topic');
  }

  async setOverallAnalytics(userId: string, data: string): Promise<void> {
    await this.setAnalytics(userId, 'overall', data);
  }

  async getOverallAnalytics(userId: string): Promise<string | null> {
    return await this.getAnalytics(userId, 'overall');
  }
}