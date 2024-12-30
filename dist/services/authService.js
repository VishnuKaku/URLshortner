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
exports.AuthService = void 0;
// src/services/authService.ts
const google_auth_library_1 = require("google-auth-library");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const auth_config_1 = __importDefault(require("../config/auth.config"));
const errorHandler_1 = require("../utils/errorHandler");
class AuthService {
    constructor() {
        this.googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }
    authenticateWithGoogle(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = yield this.googleClient.verifyIdToken({
                    idToken: token,
                    audience: process.env.GOOGLE_CLIENT_ID
                });
                const payload = ticket.getPayload();
                if (!payload || !payload.email) {
                    throw new errorHandler_1.AppError('Invalid Google token', 401);
                }
                let user = yield User_1.User.findOne({ email: payload.email });
                if (!user) {
                    user = yield User_1.User.create({
                        email: payload.email,
                        googleId: payload.sub,
                        createdAt: new Date()
                    });
                }
                // Type assertion since we know the structure matches IUserDocument
                const userDoc = user;
                const accessToken = this.generateToken(userDoc);
                return { user: userDoc, accessToken };
            }
            catch (error) {
                throw new errorHandler_1.AppError('Authentication failed', 401);
            }
        });
    }
    generateToken(user) {
        const payload = {
            id: user._id.toString(),
            email: user.email
        };
        return jsonwebtoken_1.default.sign(payload, auth_config_1.default.jwtSecret, {
            expiresIn: auth_config_1.default.jwtExpiry
        });
    }
}
exports.AuthService = AuthService;
