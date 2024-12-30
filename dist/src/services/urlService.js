// URL service
// src/services/urlService.ts
import { nanoid } from 'nanoid';
import { redisClient } from '../config/redis';
import { Url } from '../models/Url';
export class UrlService {
    async createShortUrl(urlData, userId) {
        const { longUrl, customAlias, topic } = urlData;
        // Validate if the provided url is valid.
        try {
            new URL(longUrl);
        }
        catch (error) {
            throw new Error('Invalid URL provided');
        }
        let shortCode;
        if (customAlias) {
            shortCode = customAlias;
            const url = await Url.findOne({ shortCode });
            if (url) {
                throw new Error("Custom alias already exists");
            }
        }
        else {
            shortCode = nanoid(7);
        }
        const newUrl = await Url.create({
            longUrl,
            shortCode,
            userId,
            topic
        });
        await redisClient.setEx(`url:${shortCode}`, 3600, longUrl);
        return newUrl;
    }
    async getOriginalUrl(shortCode) {
        const cachedUrl = await redisClient.get(`url:${shortCode}`);
        if (cachedUrl) {
            return cachedUrl;
        }
        const url = await Url.findOne({ shortCode });
        if (!url) {
            return null;
        }
        await redisClient.setEx(`url:${shortCode}`, 3600, url.get('longUrl'));
        return url.get('longUrl');
    }
}
