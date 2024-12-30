import Analytics from '../../models/Analytics';
import { Url } from '@/models/Url';
export class TopicAggregator {
    static async aggregate(topic, startDate, endDate) {
        const urls = await Url.find({ topics: topic });
        const urlIds = urls.map(url => url._id);
        const analytics = (await Analytics.find({
            urlId: { $in: urlIds },
            accessTime: { $gte: startDate, $lte: endDate }
        }).populate('userId'));
        const clicks = analytics.map(record => ({
            timestamp: record.accessTime,
            ipAddress: record.ipAddress,
            deviceInfo: {
                deviceName: record.device?.deviceName || 'unknown',
            }
        }));
        const totalClicks = clicks.length;
        const uniqueVisitors = new Set(clicks.map(click => click.ipAddress)).size;
        const deviceStats = clicks.reduce((acc, click) => {
            const deviceName = click.deviceInfo.deviceName;
            acc[deviceName] = (acc[deviceName] || 0) + 1;
            return acc;
        }, {});
        const osStats = clicks.reduce((acc, click) => {
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
