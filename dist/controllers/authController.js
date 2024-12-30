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
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const errorHandler_1 = require("../utils/errorHandler");
class AuthController {
    constructor() {
        this.googleAuth = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.body;
                if (!token) {
                    throw new errorHandler_1.AppError('Google token is required', 400);
                }
                const { user, accessToken } = yield this.authService.authenticateWithGoogle(token);
                res.json({
                    success: true,
                    data: {
                        user: {
                            id: user._id,
                            email: user.email,
                            name: user.name
                        },
                        accessToken
                    }
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.authService = new authService_1.AuthService();
    }
}
exports.AuthController = AuthController;
