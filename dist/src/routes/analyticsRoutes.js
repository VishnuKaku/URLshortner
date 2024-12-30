// src/routes/analyticsRoutes.ts
import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';
const router = Router();
const analyticsController = new AnalyticsController();
// Type-safe middleware wrapper
const withUser = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        }
        catch (error) {
            next(error);
        }
    };
};
router.get('/:alias', authenticate, rateLimiter, withUser(analyticsController.getUrlAnalytics));
router.get('/topic/:topic', authenticate, rateLimiter, withUser(analyticsController.getTopicAnalytics));
router.get('/overall', authenticate, rateLimiter, withUser(analyticsController.getOverallAnalytics));
export default router;
