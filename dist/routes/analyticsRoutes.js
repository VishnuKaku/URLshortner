"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/analyticsRoutes.ts
const express_1 = require("express");
const analyticsController_1 = require("../controllers/analyticsController");
const auth_1 = require("../middleware/auth");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
const analyticsController = new analyticsController_1.AnalyticsController();
// Type-safe middleware wrapper
const withUser = (handler) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield handler(req, res, next);
        }
        catch (error) {
            next(error);
        }
    });
};
router.get('/:alias', auth_1.authenticate, rateLimiter_1.rateLimiter, withUser(analyticsController.getUrlAnalytics));
router.get('/topic/:topic', auth_1.authenticate, rateLimiter_1.rateLimiter, withUser(analyticsController.getTopicAnalytics));
router.get('/overall', auth_1.authenticate, rateLimiter_1.rateLimiter, withUser(analyticsController.getOverallAnalytics));
exports.default = router;
