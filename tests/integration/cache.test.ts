// Integration test for cache 
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { RedisClient } from '../../src/cache/redis/client';
import { URLCache } from '../../src/cache/strategies/urlCache';
import { AnalyticsCache } from '../../src/cache/strategies/analyticsCache';

describe('Cache Integration Tests', () => {
  let mongoServer: MongoMemoryServer;
  let urlCache: URLCache;
  let analyticsCache: AnalyticsCache;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    urlCache = new URLCache();
    analyticsCache = new AnalyticsCache();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    await RedisClient.getInstance().quit();
  });

  describe('URL Cache', () => {
    it('should cache and retrieve URLs', async () => {
      const shortCode = 'test-cache';
      const longUrl = 'https://example.com';

      await urlCache.setURL(shortCode, longUrl);
      const cached = await urlCache.getURL(shortCode);

      expect(cached).toBe(longUrl);
    });

    it('should delete cached URLs', async () => {
      const shortCode = 'test-delete';
      const longUrl = 'https://example.com';

      await urlCache.setURL(shortCode, longUrl);
      await urlCache.deleteURL(shortCode);
      const cached = await urlCache.getURL(shortCode);

      expect(cached).toBeNull();
    });
  });

  describe('Analytics Cache', () => {
    it('should cache and retrieve URL analytics', async () => {
      const shortCode = 'test-analytics';
      const analyticsData = JSON.stringify({
        clicks: 10,
        uniqueClicks: 5
      });

      await analyticsCache.setURLAnalytics(shortCode, analyticsData);
      const cached = await analyticsCache.getURLAnalytics(shortCode);

      expect(cached).toBe(analyticsData);
    });

    it('should cache and retrieve topic analytics', async () => {
      const topic = 'activation';
      const analyticsData = JSON.stringify({
        totalClicks: 20,
        uniqueClicks: 10
      });

      await analyticsCache.setTopicAnalytics(topic, analyticsData);
      const cached = await analyticsCache.getTopicAnalytics(topic);

      expect(cached).toBe(analyticsData);
    });

    it('should cache and retrieve overall analytics', async () => {
      const userId = 'test-user';
      const analyticsData = JSON.stringify({
        totalUrls: 5,
        totalClicks: 100
      });

      await analyticsCache.setOverallAnalytics(userId, analyticsData);
      const cached = await analyticsCache.getOverallAnalytics(userId);

      expect(cached).toBe(analyticsData);
    });
  });
});