"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const urlRoutes_1 = __importDefault(require("./routes/urlRoutes"));
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const error_middleware_1 = require("./middleware/error.middleware");
const rateLimiter_1 = require("./middleware/rateLimiter");
const redis_1 = require("./config/redis");
// Load environment variables
dotenv_1.default.config();
// Initialize the Express application
const app = (0, express_1.default)();
// Middleware
app.use(body_parser_1.default.json());
app.use(rateLimiter_1.rateLimiter);
// Routes
app.use('/api/url', urlRoutes_1.default);
app.use('/api/analytics', analyticsRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
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
app.use(error_middleware_1.errorHandler);
// Connect to the database and Redis
(0, database_1.default)();
(0, redis_1.configureRedis)();
exports.default = app;
