import { IUrlDocument, ITopicAnalytics, IClickInfo, IDeviceInfo, IAnalytics } from '../../models/interfaces';
import Analytics from '../../models/Analytics';
import { Url } from '@/models/Url';
// import { Click } from '../../models/Click';

interface DeviceInfo {
  deviceName: string;
}

interface ClickData {
  deviceInfo: DeviceInfo;
  ipAddress: string;
  timestamp: Date;
}

interface AggregatedData {
  topicName: string;
  timeframe: {
    start: Date;
    end: Date;
  };
  totalClicks: number;
  uniqueVisitors: number;
  deviceStats: Record<string, number>;
  osStats: Record<string, number>;
  clicks: ClickData[];
}

export class TopicAggregator {
  static async aggregate(topic: string, startDate: Date, endDate: Date): Promise<AggregatedData> {
    const urls = await Url.find({ topics: topic });
    const urlIds = urls.map(url => url._id);

    const analytics = (await Analytics.find({
      urlId: { $in: urlIds },
      accessTime: { $gte: startDate, $lte: endDate }
    }).populate('userId')) as IAnalytics[];
    

    const clicks: ClickData[] = analytics.map(record => ({
      timestamp: record.accessTime,
      ipAddress: record.ipAddress,
      deviceInfo: {
        deviceName: record.device?.deviceName || 'unknown',
      }
    }));

    const totalClicks = clicks.length;
    const uniqueVisitors = new Set(clicks.map(click => click.ipAddress)).size;

    const deviceStats = clicks.reduce((acc: Record<string, number>, click) => {
      const deviceName = click.deviceInfo.deviceName;
      acc[deviceName] = (acc[deviceName] || 0) + 1;
      return acc;
    }, {});

    const osStats = clicks.reduce((acc: Record<string, number>, click) => {
      const osName = click.deviceInfo.deviceName;
      acc[osName] = (acc[osName] || 0) + 1;
      return acc;
    }, {});

    return {
      topicName: topic,
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