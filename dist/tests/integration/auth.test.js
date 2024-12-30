// Integration test for auth
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../src/app';
import { User } from '../../src/models/User';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
describe('Auth Integration Tests', () => {
    let mongoServer;
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });
    beforeEach(async () => {
        await User.deleteMany({});
    });
    describe('Google Authentication', () => {
        it('should handle Google callback successfully', async () => {
            // Mock successful Google OAuth response
            const response = await request(app)
                .get('/auth/google/callback')
                .query({
                code: 'mock-auth-code',
            })
                .set('Accept', 'application/json');
            expect(response.status).toBe(302); // Should redirect after success
        });
    });
    describe('Authentication Middleware', () => {
        it('should protect routes requiring authentication', async () => {
            const response = await request(app)
                .post('/api/shorten')
                .set('Accept', 'application/json')
                .send({
                longUrl: 'https://example.com',
            });
            expect(response.status).toBe(401);
        });
        it('should allow access with valid token', async () => {
            const user = await User.create({
                email: 'test@example.com',
                googleId: '123456789',
                name: 'Test User',
            });
            const token = user.generateAuthToken();
            const response = await request(app)
                .post('/api/shorten')
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .send({
                longUrl: 'https://example.com',
            });
            expect(response.status).not.toBe(401);
        });
    });
});
