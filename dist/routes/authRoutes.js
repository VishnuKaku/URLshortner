"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/authRoutes.ts
const express_1 = require("express");
const rateLimiter_1 = require("../middleware/rateLimiter");
const authController_1 = require("../../src/controllers/authController");
const router = (0, express_1.Router)();
const authController = new authController_1.AuthController();
// Google authentication
router.post('/google', rateLimiter_1.rateLimiter, authController.googleAuth);
exports.default = router;
