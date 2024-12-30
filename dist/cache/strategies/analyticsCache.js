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
exports.AnalyticsCache = void 0;
// Analytics caching logic 
// src/cache/strategies/analyticsCache.ts
const operations_1 = require("../redis/operations");
class AnalyticsCache {
    constructor() {
        this.ANALYTICS_PREFIX = 'analytics:';
        this.DEFAULT_TTL = 300; // 5 minutes
        this.redis = new operations_1.RedisOperations();
    }
    getKey(identifier, type) {
        return `${this.ANALYTICS_PREFIX}${type}:${identifier}`;
    }
    setAnalytics(identifier, type, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redis.set(this.getKey(identifier, type), data, this.DEFAULT_TTL);
        });
    }
    getAnalytics(identifier, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.redis.get(this.getKey(identifier, type));
        });
    }
    deleteAnalytics(identifier, type) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redis.del(this.getKey(identifier, type));
        });
    }
    // Special methods for analytics data
    setURLAnalytics(shortCode, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setAnalytics(shortCode, 'url', data);
        });
    }
    getURLAnalytics(shortCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getAnalytics(shortCode, 'url');
        });
    }
    setTopicAnalytics(topic, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setAnalytics(topic, 'topic', data);
        });
    }
    getTopicAnalytics(topic) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getAnalytics(topic, 'topic');
        });
    }
    setOverallAnalytics(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setAnalytics(userId, 'overall', data);
        });
    }
    getOverallAnalytics(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getAnalytics(userId, 'overall');
        });
    }
}
exports.AnalyticsCache = AnalyticsCache;
