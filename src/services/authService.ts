// Auth service 
// src/services/authService.ts
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { IUserDocument, IUserPayload } from '../models/interfaces';
import { authConfig } from '../config/auth.config';
import { ApiError } from '../utils/errorHandler';

export class AuthService {
  private googleClient: OAuth2Client;

  constructor() {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async authenticateWithGoogle(token: string): Promise<{ user: IUserDocument; accessToken: string }> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new ApiError('Invalid Google token', 401);
      }

      // Find or create user
      let user = await User.findOne({ email: payload.email });
      if (!user) {
        user = await User.create({
          email: payload.email,
          googleId: payload.sub,
        });
      }

      // Generate JWT
      const accessToken = this.generateToken(user);

      return { user, accessToken };
    } catch (error) {
      throw new ApiError('Authentication failed', 401);
    }
  }

  private generateToken(user: IUserDocument): string {
    const payload: IUserPayload = {
      id: user.id,
      email: user.email
    };

    return jwt.sign(payload, authConfig.jwtSecret, {
      expiresIn: authConfig.jwtExpiry
    });
  }
}