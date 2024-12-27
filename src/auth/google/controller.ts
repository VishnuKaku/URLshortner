// Google auth controller 
// src/auth/google/controller.ts
import { Request, Response, NextFunction } from 'express';
import { AuthUtils } from '../../utils/auth';
import { AppError } from '../../utils/errorHandler';

export class GoogleAuthController {
  public static async handleCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        throw new AppError('Authentication failed', 401);
      }

      const token = AuthUtils.generateToken(req.user);

      res.redirect(`/auth-success?token=${token}`);
    } catch (error) {
      next(error);
    }
  }
}