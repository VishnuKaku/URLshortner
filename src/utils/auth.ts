// Auth utility functions 
// src/utils/auth.ts
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { IUserDocument } from '@/models/interfaces';


export class AuthUtils {
  public static generateToken(user: IUserDocument): string {
    return jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );
  }

  public static verifyToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (error) {
      throw new AppError('Invalid or expired token', 401);
    }
  }

  public static extractTokenFromHeader(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  }
}