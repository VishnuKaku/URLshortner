// src/routes/authRoutes.ts
import { Router } from 'express';
import { rateLimiter } from '../middleware/rateLimiter';
import { AuthController } from '../../src/controllers/authController';
const router = Router();
const authController = new AuthController();
// Google authentication
router.post('/google', rateLimiter, authController.googleAuth);
export default router;
