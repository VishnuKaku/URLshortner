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
exports.UrlController = void 0;
const urlService_1 = require("../services/urlService");
const analyticsService_1 = require("../services/analyticsService");
const errorHandler_1 = require("../utils/errorHandler");
class UrlController {
    constructor() {
        this.createShortUrl = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const urlData = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw new errorHandler_1.AppError('User not authenticated', 401);
                }
                const url = yield this.urlService.createShortUrl(urlData, userId);
                res.status(201).json({
                    success: true,
                    data: {
                        shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
                        createdAt: url.createdAt
                    }
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.redirectToUrl = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { shortCode } = req.params;
                const originalUrl = yield this.urlService.getOriginalUrl(shortCode);
                // Log analytics data
                yield this.analyticsService.logAccess(shortCode, ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || 'anonymous', {
                    ipAddress: req.ip,
                    userAgent: req.headers['user-agent'] || '',
                    referrer: req.headers.referer || ''
                });
                res.redirect(originalUrl);
            }
            catch (error) {
                next(error);
            }
        });
        this.urlService = new urlService_1.UrlService();
        this.analyticsService = new analyticsService_1.AnalyticsService();
    }
}
exports.UrlController = UrlController;
