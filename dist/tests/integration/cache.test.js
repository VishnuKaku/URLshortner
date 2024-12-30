import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { RedisClient } from '../../src/cache/redis/client';
import { URLCache } from '../../src/cache/strategies/urlCache';
import { AnalyticsCache } from '../../src/cache/strategies/analyticsCache';
import { afterAll, beforeAll, describe, expect, it, beforeEach, afterEach } from '@jest/globals';
import RedisMock from 'ioredis-mock';
describe('Cache Integration Tests', () => {
    let mongoServer;
    let urlCache;
    let analyticsCache;
    let redis;
    beforeAll(async () => {
        // Ensure any existing connections are closed
        await mongoose.disconnect();
        // Create new MongoDB memory server
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        // Connect to the in-memory database
        await mongoose.connect(mongoUri);
        // Initialize Redis mock
        redis = new RedisMock();
        // Reset the RedisClient singleton and set the mock
        RedisClient._instance = null;
        const redisClientInstance = RedisClient.getInstance();
        redisClientInstance.client = redis;
    });
    beforeEach(() => {
        // Create fresh instances before each test
        urlCache = new URLCache();
        analyticsCache = new AnalyticsCache();
    });
    afterEach(async () => {
        // Clear all collections after each test
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
        // Clear Redis cache
        await redis.flushall();
    });
    afterAll(async () => {
        // Clean up all connections
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        if (mongoServer) {
            await mongoServer.stop();
        }
        await redis.quit();
        RedisClient._instance = null;
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
                uniqueClicks: 5,
            });
            await analyticsCache.setURLAnalytics(shortCode, analyticsData);
            const cached = await analyticsCache.getURLAnalytics(shortCode);
            expect(cached).toBe(analyticsData);
        });
        it('should cache and retrieve topic analytics', async () => {
            const topic = 'activation';
            const analyticsData = JSON.stringify({
                totalClicks: 20,
                uniqueClicks: 10,
            });
            await analyticsCache.setTopicAnalytics(topic, analyticsData);
            const cached = await analyticsCache.getTopicAnalytics(topic);
            expect(cached).toBe(analyticsData);
        });
        it('should cache and retrieve overall analytics', async () => {
            const userId = 'test-user';
            const analyticsData = JSON.stringify({
                totalUrls: 5,
                totalClicks: 100,
            });
            await analyticsCache.setOverallAnalytics(userId, analyticsData);
            const cached = await analyticsCache.getOverallAnalytics(userId);
            expect(cached).toBe(analyticsData);
        });
    });
});
