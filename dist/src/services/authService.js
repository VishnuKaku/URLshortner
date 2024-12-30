// src/services/authService.ts
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import authConfig from '../config/auth.config';
import { AppError } from '../utils/errorHandler';
export class AuthService {
    googleClient;
    constructor() {
        this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }
    async authenticateWithGoogle(token) {
        try {
            const ticket = await this.googleClient.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();
            if (!payload || !payload.email) {
                throw new AppError('Invalid Google token', 401);
            }
            let user = await User.findOne({ email: payload.email });
            if (!user) {
                user = await User.create({
                    email: payload.email,
                    googleId: payload.sub,
                    createdAt: new Date()
                });
            }
            // Type assertion since we know the structure matches IUserDocument
            const userDoc = user;
            const accessToken = this.generateToken(userDoc);
            return { user: userDoc, accessToken };
        }
        catch (error) {
            throw new AppError('Authentication failed', 401);
        }
    }
    generateToken(user) {
        const payload = {
            id: user._id.toString(),
            email: user.email
        };
        return jwt.sign(payload, authConfig.jwtSecret, {
            expiresIn: authConfig.jwtExpiry
        });
    }
}
