// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { IRequestWithUser, IUserPayload } from '../models/interfaces';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.config';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, authConfig.jwtSecret) as IUserPayload;
    (req as IRequestWithUser).user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};