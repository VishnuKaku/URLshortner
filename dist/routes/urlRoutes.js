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
// src/routes/urlRoutes.ts
const express_1 = require("express");
const urlController_1 = require("../controllers/urlController");
const auth_1 = require("../middleware/auth");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
const urlController = new urlController_1.UrlController();
// Type-safe middleware wrapper
const withUser = (handler) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield handler(req, res, next);
        }
        catch (error) {
            next(error);
        }
    });
};
// Create short URL - Protected & Rate Limited
router.post('/shorten', auth_1.authenticate, rateLimiter_1.rateLimiter, withUser(urlController.createShortUrl));
// Redirect to original URL - Public
router.get('/:shortCode', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield urlController.redirectToUrl(req, res, next);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
