// Unit test for overall aggregator 
// src/analytics/aggregators/overallAggregator.ts
import { Analytics } from '../../models/Analytics';
import { IOverallAnalytics, IOSStats, IDeviceStats } from '../../models/interfaces';

export class OverallAggregator {
  async aggregate(userId: string): Promise<IOverallAnalytics> {
    const analytics = await Analytics.find({ userId });

    const totalUrls = await this.calculateTotalUrls(userId);
    const totalClicks = analytics.length;
    const uniqueClicks = new Set(analytics.map(a => a.ipAddress)).size;

    const clicksByDate = this.calculateClicksByDate(analytics);
    const osStats = await this.calculateOSStats(analytics);
    const deviceStats = await this.calculateDeviceStats(analytics);

    return {
      totalUrls,
      totalClicks,
      uniqueClicks,
      clicksByDate,
      osType: osStats,
      deviceType: deviceStats
    };
  }

  private async calculateTotalUrls(userId: string): Promise<number> {
    const urls = await Analytics.distinct('urlId', { userId });
    return urls.length;
  }

  private calculateClicksByDate(analytics: any[]) {
    const clickMap = new Map<string, number>();
    
    analytics.forEach(analytic => {
      const date = analytic.accessTime.toISOString().split('T')[0];
      clickMap.set(date, (clickMap.get(date) || 0) + 1);
    });

    return Array.from(clickMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7); // Last 7 days
  }

  private async calculateOSStats(analytics: any[]): Promise<IOSStats[]> {
    const osMap = new Map<string, Set<string>>();

    analytics.forEach(analytic => {
      const os = analytic.device?.os || 'unknown';
      if (!osMap.has(os)) {
        osMap.set(os, new Set());
      }
      osMap.get(os)?.add(analytic.ipAddress);
    });

    return Array.from(osMap.entries()).map(([osName, ips]) => ({
      osName,
      uniqueClicks: ips.size,
      uniqueUsers: ips.size // In this case, unique users = unique IPs
    }));
  }

  private async calculateDeviceStats(analytics: any[]): Promise<IDeviceStats[]> {
    const deviceMap = new Map<string, Set<string>>();

    analytics.forEach(analytic => {
      const deviceType = analytic.device?.type || 'unknown';
      if (!deviceMap.has(deviceType)) {
        deviceMap.set(deviceType, new Set());
      }
      deviceMap.get(deviceType)?.add(analytic.ipAddress);
    });

    return Array.from(deviceMap.entries()).map(([deviceName, ips]) => ({
      deviceName,
      uniqueClicks: ips.size,
      uniqueUsers: ips.size
    }));
  }
}