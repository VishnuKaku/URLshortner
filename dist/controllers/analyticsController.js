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
exports.AnalyticsController = void 0;
const analyticsService_1 = require("../services/analyticsService");
const errorHandler_1 = require("../utils/errorHandler");
class AnalyticsController {
    constructor() {
        this.getUrlAnalytics = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { alias } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw new errorHandler_1.AppError('User not authenticated', 401);
                }
                const analytics = yield this.analyticsService.getUrlAnalytics(alias, userId);
                res.json({
                    success: true,
                    data: analytics
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.getTopicAnalytics = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { topic } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw new errorHandler_1.AppError('User not authenticated', 401);
                }
                const analytics = yield this.analyticsService.getTopicAnalytics(topic, userId);
                res.json({
                    success: true,
                    data: analytics
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.getOverallAnalytics = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw new errorHandler_1.AppError('User not authenticated', 401);
                }
                const analytics = yield this.analyticsService.getOverallAnalytics(userId);
                res.json({
                    success: true,
                    data: analytics
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.analyticsService = new analyticsService_1.AnalyticsService();
    }
}
exports.AnalyticsController = AnalyticsController;
