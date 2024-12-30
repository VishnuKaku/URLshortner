import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../src/app';
import { User } from '../../src/models/User';
import { RedisClient } from '../../src/cache/redis/client';
import { Url } from '../../src/models/Url';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import IORedis from 'ioredis';
import RedisMock from 'ioredis-mock';

describe('URL Integration Tests', () => {
  let mongoServer: MongoMemoryServer;
  let authToken: string;
  let redis: IORedis; // Use IORedis type instead

  beforeAll(async () => {
    // Setup MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    // Initialize the Redis Mock
    redis = new RedisMock() as unknown as IORedis; // Cast to IORedis type

    // Manually set the mocked Redis client in RedisClient
    const redisClientInstance = RedisClient.getInstance() as any;
    redisClientInstance.client = redis;

    // Create test user and get auth token
    const user = await User.create({
      email: 'test@example.com',
      googleId: '123456789',
      name: 'Test User'
    });
    authToken = user.generateAuthToken();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    await RedisClient.getInstance().quit();
  });

  beforeEach(async () => {
    await Url.deleteMany({});
  });

  describe('POST /api/shorten', () => {
    it('should create a new short URL', async () => {
      const response = await request(app)
        .post('/api/shorten')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          longUrl: 'https://example.com',
          topic: 'acquisition'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('shortUrl');
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should create URL with custom alias', async () => {
      const response = await request(app)
        .post('/api/shorten')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          longUrl: 'https://example.com',
          customAlias: 'custom-test',
          topic: 'retention'
        });

      expect(response.status).toBe(201);
      expect(response.body.shortUrl).toContain('custom-test');
    });

    it('should reject invalid URLs', async () => {
      const response = await request(app)
        .post('/api/shorten')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          longUrl: 'invalid-url',
          topic: 'activation'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/shorten/:alias', () => {
    it('should redirect to long URL', async () => {
      // First create a URL
      const url = await Url.create({
        userId: new mongoose.Types.ObjectId(),
        longUrl: 'https://example.com',
        shortCode: 'test-redirect',
        topic: 'acquisition'
      });

      const response = await request(app)
        .get(`/api/shorten/${url.shortCode}`)
        .send();

      expect(response.status).toBe(302);
      expect(response.header.location).toBe('https://example.com');
    });

    it('should return 404 for non-existent alias', async () => {
      const response = await request(app)
        .get('/api/shorten/non-existent')
        .send();

      expect(response.status).toBe(404);
    });
  });
});