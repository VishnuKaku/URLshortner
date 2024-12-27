// Topic aggregator logic 
// src/analytics/aggregators/TopicAggregator.ts
import { IUrlDocument, ITopicAnalytics, IClickInfo } from '../../interfaces';
import { AnalyticsModel } from '../../models/Analytics';
import { UrlModel } from '../../models/Url';

export class TopicAggregator {
  public async aggregate(topic: string, startDate: Date, endDate: Date): Promise<ITopicAnalytics> {
    // Get all URLs for the topic
    const urls = await UrlModel.find({ topics: topic });
    const urlIds = urls.map(url => url._id);

    // Get analytics for these URLs
    const analytics = await AnalyticsModel.find({
      urlId: { $in: urlIds },
      accessTime: { $gte: startDate, $lte: endDate }
    });

    // Aggregate click data
    const clicks: IClickInfo[] = analytics.map(record => ({
      timestamp: record.accessTime,
      country: record.geoInfo.country,
      device: record.deviceInfo.type,
      os: record.osInfo.name,
      referrer: record.referrer
    }));

    // Calculate statistics
    const totalClicks = clicks.length;
    const uniqueVisitors = new Set(analytics.map(record => record.ipAddress)).size;

    // Calculate device distribution
    const deviceStats = clicks.reduce((acc, click) => {
      acc[click.device] = (acc[click.device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate OS distribution
    const osStats = clicks.reduce((acc, click) => {
      acc[click.os] = (acc[click.os] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      topic,
      timeframe: {
        start: startDate,
        end: endDate
      },
      totalClicks,
      uniqueVisitors,
      deviceStats,
      osStats,
      clicks
    };
  }
}