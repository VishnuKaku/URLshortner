// tests/config/setup.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Redis from 'ioredis'; // Import the correct Redis type
import { RedisClient } from '../../src/cache/redis/client'; // Import the actual redisClient
import { afterEach } from 'node:test';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const mongoUri = mongod.getUri();
  await mongoose.connect(mongoUri);

    // Mock Redis
    jest.mock('../../src/cache/redis/client', () => {
        const MockRedis = require('ioredis-mock');
        return {
            redisClient: new MockRedis() as unknown as Redis // Type assertion here
        };
    });
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

function afterAll(arg0: () => Promise<void>) {
  throw new Error('Function not implemented.');
}
function beforeAll(arg0: () => Promise<void>) {
  throw new Error('Function not implemented.');
}

