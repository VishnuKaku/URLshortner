// Unit test for topic aggregator 
// src/analytics/aggregators/topicAggregator.ts
import { Analytics } from '../../models/Analytics';
import { Url } from '../../models/Url';
import { ITopicAnalytics, IClicksByDate } from '../../models/interfaces';

export class TopicAggregator {
  async aggregate(topic: string, userId: string): Promise<ITopicAnalytics> {
    // Get all URLs for this topic
    const urls = await Url.find({ userId, topic });
    const urlIds = urls.map(url => url._id);

    // Get all analytics for these URLs
    const analytics = await Analytics.find({ urlId: { $in: urlIds } });

    // Calculate total and unique clicks
    const totalClicks = analytics.length;
    const uniqueClicks = new Set(analytics.map(a => a.ipAddress)).size;

    // Calculate clicks by date
    const clicksByDate = this.calculateClicksByDate(analytics);

    // Calculate per-URL statistics
    const urlStats = await this.calculateUrlStats(urls, analytics);

    return {
      totalClicks,
      uniqueClicks,
      clicksByDate,
      urls: urlStats
    };
  }

  private calculateClicksByDate(analytics: any[]): IClicksByDate[] {
    const clickMap = new Map<string, number>();
    
    analytics.forEach(analytic => {
      const date = analytic.accessTime.toISOString().split('T')[0];
      clickMap.set(date, (clickMap.get(date) || 0) + 1);
    });

    return Array.from(clickMap.entries()).map(([date, count]) => ({
      date,
      count
    }));
  }

  private async calculateUrlStats(urls: any[], analytics: any[]) {
    return urls.map(url => {
      const urlAnalytics = analytics.filter(a => a.urlId.equals(url._id));
      return {
        shortUrl: url.shortCode,
        totalClicks: urlAnalytics.length,
        uniqueClicks: new Set(urlAnalytics.map(a => a.ipAddress)).size
      };
    });
  }
}