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
exports.UrlService = void 0;
// URL service 
// src/services/urlService.ts
const nanoid_1 = require("nanoid");
const redis_1 = require("../config/redis");
const errorHandler_1 = require("../utils/errorHandler");
const Url_1 = require("../models/Url");
class UrlService {
    constructor() {
        this.nanoid = (0, nanoid_1.customAlphabet)('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);
    }
    createShortUrl(urlData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { longUrl, customAlias, topic } = urlData;
            // Validate URL
            if (!this.isValidUrl(longUrl)) {
                throw new errorHandler_1.AppError('Invalid URL provided', 400);
            }
            // Check if custom alias is available if provided
            if (customAlias) {
                const existingUrl = yield Url_1.Url.findOne({ shortCode: customAlias });
                if (existingUrl) {
                    throw new errorHandler_1.AppError('Custom alias already in use', 400);
                }
            }
            // Generate short code if no custom alias
            const shortCode = customAlias || this.nanoid();
            // Create new URL document
            const url = yield Url_1.Url.create({
                originalUrl: longUrl,
                shortCode,
                userId,
                topic,
                isCustom: !!customAlias,
            });
            // Cache the URL mapping
            yield this.cacheUrl(shortCode, longUrl);
            return url;
        });
    }
    getOriginalUrl(shortCode) {
        return __awaiter(this, void 0, void 0, function* () {
            // Try to get from cache first
            const cachedUrl = yield redis_1.redisClient.get(`url:${shortCode}`);
            if (cachedUrl) {
                return cachedUrl;
            }
            // If not in cache, get from database
            const url = yield Url_1.Url.findOne({ shortCode });
            if (!url) {
                throw new errorHandler_1.AppError('URL not found', 404);
            }
            // Cache for future use
            yield this.cacheUrl(shortCode, url.originalUrl);
            return url.originalUrl;
        });
    }
    getUrlsByTopic(topic, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Url_1.Url.find({ topic, userId });
        });
    }
    getAllUserUrls(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Url_1.Url.find({ userId });
        });
    }
    cacheUrl(shortCode, originalUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            yield redis_1.redisClient.set(`url:${shortCode}`, originalUrl, {
                EX: 86400, // Cache for 24 hours
            });
        });
    }
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        }
        catch (_a) {
            return false;
        }
    }
}
exports.UrlService = UrlService;
