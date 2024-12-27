// Analytics routes 
// src/routes/analyticsRoutes.ts
import { Router } from 'express';

import { authenticate } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';
import { AnalyticsController } from '../controllers/analyticsController';

const router = Router();
const analyticsController = new AnalyticsController();

// Get URL-specific analytics
router.get(
  '/:alias',
  authenticate,
  rateLimiter,
  analyticsController.getUrlAnalytics
);

// Get topic-based analytics
router.get(
  '/topic/:topic',
  authenticate,
  rateLimiter,
  analyticsController.getTopicAnalytics
);

// Get overall analytics
router.get(
  '/overall',
  authenticate,
  rateLimiter,
  analyticsController.getOverallAnalytics
);

export default router;