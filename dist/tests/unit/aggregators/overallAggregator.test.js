// tests/unit/aggregators/overallAggregator.test.ts
import { OverallAggregator } from '../../../src/analytics/aggregators/overallAggregator';
import Analytics from '../../../src/models/Analytics';
jest.mock('../../../src/models/Analytics');
jest.mock('../../../src/models/Url');
describe('OverallAggregator', () => {
    it('should aggregate overall analytics data', async () => {
        const mockAnalytics = [
            {
                _id: 'analyticId1',
                urlId: 'urlId1',
                accessTime: new Date(),
                ipAddress: '127.0.0.1',
                device: {
                    os: 'windows',
                    type: 'desktop',
                },
                location: {
                    country: 'US',
                },
            },
            {
                _id: 'analyticId2',
                urlId: 'urlId2',
                accessTime: new Date(),
                ipAddress: '192.168.1.1',
                device: {
                    os: 'macos',
                    type: 'mobile',
                },
                location: {
                    country: 'CA',
                },
            },
        ];
        const mockUrls = [
            {
                _id: 'urlId1',
                shortCode: 'short1',
            },
            {
                _id: 'urlId2',
                shortCode: 'short2',
            },
        ];
        Analytics.find.mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockAnalytics)
        });
        Analytics.distinct.mockResolvedValue(['urlId1', 'urlId2']);
        const overallAggregator = new OverallAggregator();
        const startDate = new Date();
        const endDate = new Date();
        const result = await overallAggregator.aggregate('test-user', startDate, endDate);
        expect(result).toBeDefined();
        expect(result.totalClicks).toBe(mockAnalytics.length);
        expect(result.uniqueClicks).toBe(2);
        expect(result.deviceType).toEqual([
            { deviceName: 'desktop', uniqueClicks: 1, uniqueUsers: 1 },
            { deviceName: 'mobile', uniqueClicks: 1, uniqueUsers: 1 },
        ]);
        expect(result.osType).toEqual([
            { osName: 'windows', uniqueClicks: 1, uniqueUsers: 1 },
            { osName: 'macos', uniqueClicks: 1, uniqueUsers: 1 },
        ]);
        expect(result.totalUrls).toEqual(2);
    });
});
