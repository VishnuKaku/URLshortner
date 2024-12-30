"use strict";
// Redis configuration
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
exports.configureRedis = exports.redisClient = exports.redisConfig = void 0;
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
};
exports.redisClient = (0, redis_1.createClient)({
    socket: {
        host: exports.redisConfig.host,
        port: exports.redisConfig.port,
    },
});
const configureRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.redisClient.connect();
        console.log('Connected to Redis successfully');
    }
    catch (error) {
        console.error('Error connecting to Redis:', error);
        process.exit(1);
    }
});
exports.configureRedis = configureRedis;
