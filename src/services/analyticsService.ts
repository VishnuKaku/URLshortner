// Analytics service 
// src/services/analyticsService.ts
import { Analytics } from '../models/Analytics';
import { 
  IAnalyticsDocument, 
  IUrlAnalytics, 
  ITopicAnalytics, 
  IOverallAnalytics 
} from '../models/interfaces';
import { UrlService } from './urlService';

export class AnalyticsService {
  private urlService: UrlService;

  constructor() {
    this.urlService = new UrlService();
  }

  async logAccess(urlId: string, userId: string, data: Partial<IAnalyticsDocument>): Promise<void> {
    await Analytics.create({
      urlId,
      userId,
      ...data
    });
  }

  async getUrlAnalytics(shortCode: string, userId: string): Promise<IUrlAnalytics> {
    const url = await this.urlService.getOriginalUrl(shortCode);
    const analytics = await Analytics.find({ urlId: url });

    return this.processAnalytics(analytics);
  }

  async getTopicAnalytics(topic: string, userId: string): Promise<ITopicAnalytics> {
    const urls = await this.urlService.getUrlsByTopic(topic, userId);
    const urlIds = urls.map(url => url.id);
    const analytics = await Analytics.find({ urlId: { $in: urlIds } });

    return this.processTopicAnalytics(urls, analytics);
  }

  async getOverallAnalytics(userId: string): Promise<IOverallAnalytics> {
    const urls = await this.urlService.getAllUserUrls(userId);
    const urlIds = urls.map(url => url.id);
    const analytics = await Analytics.find({ urlId: { $in: urlIds } });

    return this.processOverallAnalytics(urls, analytics);
  }

  private processAnalytics(analytics: IAnalyticsDocument[]): IUrlAnalytics {
    // Implementation of analytics processing logic
    // This would include calculating unique clicks, grouping by date, OS, device type, etc.
    // Implementation details omitted for brevity
    return {} as IUrlAnalytics;
  }

  private processTopicAnalytics(urls: any[], analytics: IAnalyticsDocument[]): ITopicAnalytics {
    // Implementation of topic analytics processing logic
    return {} as ITopicAnalytics;
  }

  private processOverallAnalytics(urls: any[], analytics: IAnalyticsDocument[]): IOverallAnalytics {
    // Implementation of overall analytics processing logic
    return {} as IOverallAnalytics;
  }
}