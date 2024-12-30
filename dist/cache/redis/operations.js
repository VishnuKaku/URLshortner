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
exports.RedisOperations = void 0;
// Redis operations logic 
const client_1 = require("./client");
const logger_1 = require("../../utils/logger");
class RedisOperations {
    constructor() {
        this.client = client_1.RedisClient.getInstance();
    }
    set(key, value, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (ttl) {
                    yield this.client.setex(key, ttl, value);
                }
                else {
                    yield this.client.set(key, value);
                }
            }
            catch (error) {
                logger_1.logger.error('Redis set operation failed:', error);
                throw error;
            }
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.client.get(key);
            }
            catch (error) {
                logger_1.logger.error('Redis get operation failed:', error);
                throw error;
            }
        });
    }
    del(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.del(key);
            }
            catch (error) {
                logger_1.logger.error('Redis delete operation failed:', error);
                throw error;
            }
        });
    }
    exists(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.client.exists(key);
                return result === 1;
            }
            catch (error) {
                logger_1.logger.error('Redis exists operation failed:', error);
                throw error;
            }
        });
    }
}
exports.RedisOperations = RedisOperations;
