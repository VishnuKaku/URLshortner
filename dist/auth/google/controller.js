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
exports.GoogleAuthController = void 0;
const auth_1 = require("../../utils/auth");
const errorHandler_1 = require("../../utils/errorHandler");
class GoogleAuthController {
    static handleCallback(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    throw new errorHandler_1.AppError('Authentication failed', 401);
                }
                const token = auth_1.AuthUtils.generateToken(req.user);
                res.redirect(`/auth-success?token=${token}`);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.GoogleAuthController = GoogleAuthController;
