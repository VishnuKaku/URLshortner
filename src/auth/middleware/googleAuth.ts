// Google auth middleware 
// src/auth/middleware/googleAuth.ts
import { Request, Response, NextFunction } from 'express';
import { User } from '../../models/User';
import { AppError } from '../../utils/errorHandler';

interface GoogleProfile {
  id: string;
  emails?: { value: string; verified: boolean }[];
  displayName?: string;
}

export async function googleAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const profile = req.user as GoogleProfile;
    
    if (!profile || !profile.emails?.[0]?.value) {
      throw new AppError('Invalid Google profile data', 401);
    }

    // Find or create user based on Google profile
    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      user = await User.create({
        email: profile.emails[0].value,
        googleId: profile.id,
        isVerified: true
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}