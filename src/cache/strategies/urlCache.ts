// URL caching logic 
// src/cache/strategies/urlCache.ts
import { RedisOperations } from '../redis/operations';

export class URLCache {
  private redis: RedisOperations;
  private readonly URL_PREFIX = 'url:';
  private readonly DEFAULT_TTL = 86400; // 24 hours

  constructor() {
    this.redis = new RedisOperations();
  }

  private getKey(shortCode: string): string {
    return `${this.URL_PREFIX}${shortCode}`;
  }

  async setURL(shortCode: string, longUrl: string): Promise<void> {
    await this.redis.set(
      this.getKey(shortCode),
      longUrl,
      this.DEFAULT_TTL
    );
  }

  async getURL(shortCode: string): Promise<string | null> {
    return await this.redis.get(this.getKey(shortCode));
  }

  async deleteURL(shortCode: string): Promise<void> {
    await this.redis.del(this.getKey(shortCode));
  }
}