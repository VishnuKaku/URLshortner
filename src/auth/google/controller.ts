// src/auth/google/controller.ts
import { Response, NextFunction } from 'express';
import { AuthUtils } from '../../utils/auth';
import { AppError } from '../../utils/errorHandler';
import { IAuthRequest } from '../../models/interfaces';

export class GoogleAuthController {
  public static async handleCallback(
    req: IAuthRequest,
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