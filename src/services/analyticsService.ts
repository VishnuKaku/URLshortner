// src/services/analyticsService.ts
import Analytics, { IAnalyticsDocument } from '../models/Analytics';
import { UrlService } from './urlService';
import { DeviceCollector } from '../analytics/collectors/deviceCollector';
import { GeoCollector } from '../analytics/collectors/geoCollector';
import { ILocation, IDevice, IAnalytics } from '../models/interfaces';

export class AnalyticsService {
  getOverallAnalytics(userId: string) {
    throw new Error('Method not implemented.');
  }
  getTopicAnalytics(topic: string, userId: string) {
    throw new Error('Method not implemented.');
  }
    async logAccess(urlId: string, userId: string, accessData: any): Promise<IAnalyticsDocument> {
        const { ipAddress, userAgent } = accessData;

      const deviceCollector = new DeviceCollector();
      const device = deviceCollector.collect(userAgent);
       const geoCollector = new GeoCollector();
       const location = await geoCollector.collect(ipAddress)
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


     async getUrlAnalytics(shortCode: string, userId: string): Promise<{ originalUrl: string, analytics: IAnalyticsDocument[] } | null> {
        const urlService = new UrlService();
        const originalUrl = await urlService.getOriginalUrl(shortCode);
         if(!originalUrl) {
           return null;
         }
        const analytics = await Analytics.find({ userId });
        
        return {
             originalUrl,
             analytics
         }
    }
}