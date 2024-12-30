import AnalyticsModel from '../../models/Analytics';
export class OverallAggregator {
    async aggregate(userId, startDate, endDate) {
        const analytics = await AnalyticsModel.find({
            userId,
            accessTime: { $gte: startDate, $lte: endDate }
        }).populate('urlId');
        // Calculate total clicks and unique visitors
        const totalClicks = analytics.length;
        const uniqueClicks = new Set(analytics.map(record => record.ipAddress)).size;
        // Calculate total URLs
        const totalUrls = new Set(analytics.map(record => record.urlId.toString())).size;
        // Calculate clicks by date
        const clicksByDate = analytics.reduce((acc, record) => {
            const date = record.accessTime.toISOString().split('T')[0];
            const existingEntry = acc.find(entry => entry.date === date);
            if (existingEntry) {
                existingEntry.count += 1;
            }
            else {
                acc.push({ date, count: 1 });
            }
            return acc;
        }, []);
        // Calculate OS stats
        const osStats = analytics.reduce((acc, record) => {
            const os = record.device?.os || 'unknown';
            const existingEntry = acc.find(entry => entry.osName === os);
            if (existingEntry) {
                existingEntry.uniqueClicks += 1;
                existingEntry.uniqueUsers = new Set([
                    ...Array.from(new Set([record.ipAddress])),
                ]).size;
            }
            else {
                acc.push({
                    osName: os,
                    uniqueClicks: 1,
                    uniqueUsers: 1
                });
            }
            return acc;
        }, []);
        // Calculate device stats
        const deviceStats = analytics.reduce((acc, record) => {
            const deviceType = record.device?.type || 'unknown';
            const existingEntry = acc.find(entry => entry.deviceName === deviceType);
            if (existingEntry) {
                existingEntry.uniqueClicks += 1;
                existingEntry.uniqueUsers = new Set([
                    ...Array.from(new Set([record.ipAddress])),
                ]).size;
            }
            else {
                acc.push({
                    deviceName: deviceType,
                    uniqueClicks: 1,
                    uniqueUsers: 1
                });
            }
            return acc;
        }, []);
        // Calculate URL performance
        const urlPerformance = analytics.reduce((acc, record) => {
            const urlId = record.urlId.toString();
            acc[urlId] = (acc[urlId] || 0) + 1;
            return acc;
        }, {});
        const topUrls = Object.entries(urlPerformance)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10);
        // Calculate geographical distribution using location instead of geoInfo
        const geoDistribution = analytics.reduce((acc, record) => {
            if (record.location?.country) {
                const country = record.location.country;
                acc[country] = (acc[country] || 0) + 1;
            }
            return acc;
        }, {});
        // Calculate hourly distribution
        const hourlyDistribution = analytics.reduce((acc, record) => {
            const hour = record.accessTime.getHours();
            acc[hour] = (acc[hour] || 0) + 1;
            return acc;
        }, {});
        return {
            timeframe: {
                start: startDate,
                end: endDate
            },
            totalUrls,
            totalClicks,
            uniqueClicks,
            clicksByDate,
            osType: osStats,
            deviceType: deviceStats,
            topUrls,
            geoDistribution,
            hourlyDistribution
        };
    }
}
