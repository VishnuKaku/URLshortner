// src/routes/authRoutes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();
const authController = new AuthController();

// Google authentication
router.post(
  '/google',
  rateLimiter,
  authController.googleAuth
);

export default router;
