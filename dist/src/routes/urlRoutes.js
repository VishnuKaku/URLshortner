// src/routes/urlRoutes.ts
import { Router } from 'express';
import { UrlController } from '../controllers/urlController';
import { authenticate } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';
const router = Router();
const urlController = new UrlController();
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
// Create short URL - Protected & Rate Limited
router.post('/shorten', authenticate, rateLimiter, withUser(urlController.createShortUrl));
// Redirect to original URL - Public
router.get('/:shortCode', async (req, res, next) => {
    try {
        await urlController.redirectToUrl(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
export default router;
