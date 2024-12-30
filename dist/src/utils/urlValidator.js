// URL validator utility 
// src/utils/urlValidator.ts
import { URL } from 'url';
export class UrlValidator {
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        }
        catch {
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
