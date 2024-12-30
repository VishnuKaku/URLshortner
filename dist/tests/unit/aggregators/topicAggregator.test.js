// tests/unit/aggregators/topicAggregator.test.ts
import { TopicAggregator } from '../../../src/analytics/aggregators/topicAggregator';
import Analytics from '../../../src/models/Analytics';
import { Url } from '../../../src/models/Url';
jest.mock('../../../src/models/Analytics');
jest.mock('../../../src/models/Url');
describe('TopicAggregator', () => {
    it('should aggregate topic analytics data', async () => {
        const mockAnalytics = [
            {
                accessTime: new Date(),
                ipAddress: '127.0.0.1',
                device: {
                    deviceName: 'desktop',
                },
            },
            {
                accessTime: new Date(),
                ipAddress: '192.168.1.1',
                device: {
                    deviceName: 'mobile',
                },
            },
        ];
        const mockUrls = [{
                _id: 'urlId1',
                shortCode: 'short1'
            }];
        Url.find.mockResolvedValue(mockUrls);
        Analytics.find.mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockAnalytics)
        });
        const startDate = new Date();
        const endDate = new Date();
        const result = await TopicAggregator.aggregate('test-topic', startDate, endDate);
        expect(result).toBeDefined();
        expect(result.totalClicks).toBe(mockAnalytics.length);
        expect(result.uniqueVisitors).toBe(2);
        expect(result.deviceStats).toEqual({ desktop: 1, mobile: 1 });
        expect(result.osStats).toEqual({ desktop: 1, mobile: 1 });
    });
});
