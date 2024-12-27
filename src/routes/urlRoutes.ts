// URL routes 
// src/routes/urlRoutes.ts
import { Router } from 'express';
import { UrlController } from '../controllers/urlController';
import { authenticate } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();
const urlController = new UrlController();

// Create short URL - Protected & Rate Limited
router.post(
  '/shorten',
  authenticate,
  rateLimiter,
  urlController.createShortUrl // Use the instance method here
);

// Redirect to original URL - Public
router.get('/:shortCode', urlController.redirectToUrl);

export default router;
