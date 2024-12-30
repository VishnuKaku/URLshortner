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
exports.URLCache = void 0;
// URL caching logic 
// src/cache/strategies/urlCache.ts
const operations_1 = require("../redis/operations");
class URLCache {
    constructor() {
        this.URL_PREFIX = 'url:';
        this.DEFAULT_TTL = 86400; // 24 hours
        this.redis = new operations_1.RedisOperations();
    }
    getKey(shortCode) {
        return `${this.URL_PREFIX}${shortCode}`;
    }
    setURL(shortCode, longUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redis.set(this.getKey(shortCode), longUrl, this.DEFAULT_TTL);
        });
    }
    getURL(shortCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.redis.get(this.getKey(shortCode));
        });
    }
    deleteURL(shortCode) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redis.del(this.getKey(shortCode));
        });
    }
}
exports.URLCache = URLCache;
