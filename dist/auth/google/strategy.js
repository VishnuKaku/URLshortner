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
// src/auth/google/strategy.ts
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_1 = __importDefault(require("passport"));
const User_1 = require("../../models/User");
const auth_config_1 = __importDefault(require("../../config/auth.config"));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: auth_config_1.default.google.clientId,
    clientSecret: auth_config_1.default.google.clientSecret,
    callbackURL: auth_config_1.default.google.callbackUrl
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let user = yield User_1.User.findOne({ googleId: profile.id });
        if (!user) {
            user = yield User_1.User.create({
                googleId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                picture: (_a = profile.photos[0]) === null || _a === void 0 ? void 0 : _a.value
            });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error, null);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
}));
exports.default = passport_1.default;
