// Auth controller 
// src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { AppError } from '../utils/errorHandler';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  googleAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;

      if (!token) {
        throw new AppError('Google token is required', 400);
      }

      const { user, accessToken } = await this.authService.authenticateWithGoogle(token);

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email
          },
          accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  };
}