// src/services/analyticsService.ts
import Analytics from '../models/Analytics';
import { UrlService } from './urlService';
import { DeviceCollector } from '../analytics/collectors/deviceCollector';
import { GeoCollector } from '../analytics/collectors/geoCollector';
export class AnalyticsService {
    getOverallAnalytics(userId) {
        throw new Error('Method not implemented.');
    }
    getTopicAnalytics(topic, userId) {
        throw new Error('Method not implemented.');
    }
    async logAccess(urlId, userId, accessData) {
        const { ipAddress, userAgent } = accessData;
        const deviceCollector = new DeviceCollector();
        const device = deviceCollector.collect(userAgent);
        const geoCollector = new GeoCollector();
        const location = await geoCollector.collect(ipAddress);
        const analyticsEntry = await Analytics.create({
            urlId,
            userId,
            ipAddress,
            userAgent,
            device,
            location
        });
        return analyticsEntry;
    }
    async getUrlAnalytics(shortCode, userId) {
        const urlService = new UrlService();
        const originalUrl = await urlService.getOriginalUrl(shortCode);
        if (!originalUrl) {
            return null;
        }
        const analytics = await Analytics.find({ userId });
        return {
            originalUrl,
            analytics
        };
    }
}
