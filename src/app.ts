import express, { Application } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import urlRoutes from './routes/urlRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middleware/error.middleware';
import { rateLimiter } from './middleware/rateLimiter';
import { configureRedis } from './config/redis';

// Load environment variables
dotenv.config();

// Initialize the Express application
const app: Application = express();

// Middleware
app.use(bodyParser.json());
app.use(rateLimiter);

// Routes
app.use('/api/url', urlRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Global Error Handler
app.use(errorHandler);

// Connect to the database and Redis
connectDatabase();
configureRedis();

export default app;
