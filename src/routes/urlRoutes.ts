// src/routes/urlRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { UrlController } from '../controllers/urlController';
import { authenticate } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';
import { IRequestWithUser } from '../models/interfaces';

const router = Router();
const urlController = new UrlController();

// Type-safe middleware wrapper
const withUser = (
  handler: (req: IRequestWithUser, res: Response, next: NextFunction) => Promise<void>
): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req as IRequestWithUser, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// Create short URL - Protected & Rate Limited
router.post(
  '/shorten',
  authenticate,
  rateLimiter,
  withUser(urlController.createShortUrl)
);

// Redirect to original URL - Public
router.get(
  '/:shortCode',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await urlController.redirectToUrl(req as IRequestWithUser, res, next);
    } catch (error) {
      next(error);
    }
  }
);

export default router;