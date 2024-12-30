"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlValidator = void 0;
// URL validator utility 
// src/utils/urlValidator.ts
const url_1 = require("url");
class UrlValidator {
    static isValidUrl(url) {
        try {
            new url_1.URL(url);
            return true;
        }
        catch (_a) {
            return false;
        }
    }
    static isValidAlias(alias) {
        const aliasRegex = /^[a-zA-Z0-9-_]{4,15}$/;
        return aliasRegex.test(alias);
    }
    static isValidTopic(topic) {
        const validTopics = ['acquisition', 'activation', 'retention'];
        return validTopics.includes(topic.toLowerCase());
    }
    static sanitizeUrl(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return `https://${url}`;
        }
        return url;
    }
}
exports.UrlValidator = UrlValidator;
