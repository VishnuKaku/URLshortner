// Integration test for analytics 
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../src/app';
import { URLModel } from '../../src/models/URL';
import { Analytics } from '../../src/models/Analytics';
import { User } from '../../src/models/User';
import { RedisClient } from '../../src/cache/redis/client';

describe('Analytics Integration Tests', () => {
  let mongoServer: MongoMemoryServer;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    const user = await User.create({
      email: 'test@example.com',
      googleId: '123456789',
      name: 'Test User'
    });
    userId = user._id.toString();
    authToken = user.generateAuthToken();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    await RedisClient.getInstance().quit();
  });

  beforeEach(async () => {
    await URLModel.deleteMany({});
    await Analytics.deleteMany({});
  });

  describe('GET /api/analytics/:alias', () => {
    it('should return URL analytics', async () => {
      // Create test URL and analytics data
      const url = await URLModel.create({
        userId,
        longUrl: 'https://example.com',
        shortCode: 'test-analytics',
        topic: 'acquisition'
      });

      await Analytics.create({
        urlId: url._id,
        clicks: 5,
        uniqueClicks: 3,
        deviceType: [
          { deviceName: 'desktop', uniqueClicks: 2, uniqueUsers: 2 },
          { deviceName: 'mobile', uniqueClicks: 1, uniqueUsers: 1 }
        ],
        osType: [
          { osName: 'Windows', uniqueClicks: 2, uniqueUsers: 2 },
          { osName: 'iOS', uniqueClicks: 1, uniqueUsers: 1 }
        ]
      });

      const response = await request(app)
        .get(`/api/analytics/${url.shortCode}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalClicks', 5);
      expect(response.body).toHaveProperty('uniqueClicks', 3);
      expect(response.body.deviceType).toHaveLength(2);
      expect(response.body.osType).toHaveLength(2);
    });
  });

  describe('GET /api/analytics/topic/:topic', () => {
    it('should return topic-based analytics', async () => {
      // Create test URLs and analytics data for a topic
      const url1 = await URLModel.create({
        userId,
        longUrl: 'https://example1.com',
        shortCode: 'test-topic-1',
        topic: 'activation'
      });

      const url2 = await URLModel.create({
        userId,
        longUrl: 'https://example2.com',
        shortCode: 'test-topic-2',
        topic: 'activation'
      });

      await Analytics.create({
        urlId: url1._id,
        clicks: 3,
        uniqueClicks: 2
      });

      await Analytics.create({
        urlId: url2._id,
        clicks: 4,
        uniqueClicks: 3
      });

      const response = await request(app)
        .get('/api/analytics/topic/activation')
        .set('Authorization', `Bearer ${authToken}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalClicks', 7);
      expect(response.body).toHaveProperty('uniqueClicks', 5);
      expect(response.body.urls).toHaveLength(2);
    });
  });
});