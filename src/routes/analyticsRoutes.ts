// src/routes/analyticsRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { IRequestWithUser } from '../models/interfaces';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();
const analyticsController = new AnalyticsController();

// Type-safe middleware wrapper
const withUser = (
  handler: (req: IRequestWithUser, res: Response, next: NextFunction) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req as IRequestWithUser, res, next);
    } catch (error) {
      next(error);
    }
  };
};

router.get(
  '/:alias',
  authenticate,
  rateLimiter,
  withUser(analyticsController.getUrlAnalytics)
);

router.get(
  '/topic/:topic',
  authenticate,
  rateLimiter,
  withUser(analyticsController.getTopicAnalytics)
);

router.get(
  '/overall',
  authenticate,
  rateLimiter,
  withUser(analyticsController.getOverallAnalytics)
);

export default router;