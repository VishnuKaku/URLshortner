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
exports.googleAuthMiddleware = googleAuthMiddleware;
const User_1 = require("../../models/User");
const errorHandler_1 = require("../../utils/errorHandler");
function googleAuthMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const profile = req.user;
            if (!profile || !((_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value)) {
                throw new errorHandler_1.AppError('Invalid Google profile data', 401);
            }
            // Find or create user based on Google profile
            let user = yield User_1.User.findOne({ email: profile.emails[0].value });
            if (!user) {
                user = yield User_1.User.create({
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    isVerified: true
                });
            }
            // Attach user to request
            req.user = user;
            next();
        }
        catch (error) {
            next(error);
        }
    });
}
