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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const Analytics_1 = __importDefault(require("@/models/Analytics"));
const urlService_1 = require("./urlService");
class AnalyticsService {
    constructor() {
        this.urlService = new urlService_1.UrlService();
    }
    logAccess(urlId, userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new Error('User ID must be provided');
            }
            yield Analytics_1.default.create(Object.assign({ urlId,
                userId }, data));
        });
    }
    getUrlAnalytics(shortCode, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = yield this.urlService.getOriginalUrl(shortCode);
            const analytics = yield Analytics_1.default.find({ urlId: url });
            // Ensure the userId is defined and cast to the correct type
            const validAnalytics = analytics.filter(doc => doc.userId !== undefined);
            return this.processAnalytics(validAnalytics);
        });
    }
    getTopicAnalytics(topic, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const urls = yield this.urlService.getUrlsByTopic(topic, userId);
            const urlIds = urls.map(url => url.id);
            const analytics = yield Analytics_1.default.find({ urlId: { $in: urlIds } });
            // Ensure the userId is defined and cast to the correct type
            const validAnalytics = analytics.filter(doc => doc.userId !== undefined);
            return this.processTopicAnalytics(urls, validAnalytics);
        });
    }
    getOverallAnalytics(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const urls = yield this.urlService.getAllUserUrls(userId);
            const urlIds = urls.map(url => url.id);
            const analytics = yield Analytics_1.default.find({ urlId: { $in: urlIds } });
            // Ensure the userId is defined and cast to the correct type
            const validAnalytics = analytics.filter(doc => doc.userId !== undefined);
            return this.processOverallAnalytics(urls, validAnalytics);
        });
    }
    processAnalytics(analytics) {
        // Implement your analytics processing logic here
        return {};
    }
    processTopicAnalytics(urls, analytics) {
        // Implement your topic analytics processing logic here
        return {};
    }
    processOverallAnalytics(urls, analytics) {
        // Implement your overall analytics processing logic here
        return {};
    }
}
exports.AnalyticsService = AnalyticsService;
