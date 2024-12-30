// tests/unit/services/analyticsService.test.ts
import { AnalyticsService } from '../../../src/services/analyticsService';
import Analytics from '../../../src/models/Analytics';
import { UrlService } from '../../../src/services/urlService';
import { DeviceCollector } from '../../../src/analytics/collectors/deviceCollector';
import { GeoCollector } from '../../../src/analytics/collectors/geoCollector';
jest.mock('../../../src/models/Analytics');
jest.mock('../../../src/services/urlService');
jest.mock('../../../src/analytics/collectors/deviceCollector');
jest.mock('../../../src/analytics/collectors/geoCollector');
describe('AnalyticsService', () => {
    let analyticsService;
    beforeEach(() => {
        jest.clearAllMocks();
        analyticsService = new AnalyticsService();
    });
    describe('logAccess', () => {
        it('should create new analytics entry', async () => {
            const mockData = {
                urlId: 'test-url-id',
                userId: 'test-user-id',
                ipAddress: '127.0.0.1',
                userAgent: 'test-agent',
            };
            const mockAnalyticsEntry = {
                ...mockData,
                device: {
                    type: 'unknown',
                    browser: 'unknown',
                    os: 'unknown',
                },
                location: {}
            };
            Analytics.create.mockResolvedValue(mockAnalyticsEntry);
            DeviceCollector.prototype.collect.mockReturnValue({
                type: 'unknown',
                browser: 'unknown',
                os: 'unknown',
            });
            GeoCollector.prototype.collect.mockResolvedValue({});
            await analyticsService.logAccess(mockData.urlId, mockData.userId, {
                ipAddress: mockData.ipAddress,
                userAgent: mockData.userAgent,
            });
            expect(Analytics.create).toHaveBeenCalledWith(expect.objectContaining(mockData));
        });
    });
    describe('getUrlAnalytics', () => {
        it('should return processed analytics for a URL', async () => {
            const mockAnalytics = [
                { ipAddress: '1.1.1.1', accessTime: new Date() },
                { ipAddress: '1.1.1.1', accessTime: new Date() },
            ];
            UrlService.prototype.getOriginalUrl.mockResolvedValue('original-url');
            Analytics.find.mockResolvedValue(mockAnalytics);
            const result = await analyticsService.getUrlAnalytics('short-code', 'user-id');
            expect(result).toBeDefined();
            expect(UrlService.prototype.getOriginalUrl).toHaveBeenCalledWith('short-code');
        });
        it('should return null if no url', async () => {
            UrlService.prototype.getOriginalUrl.mockResolvedValue(null);
            Analytics.find.mockResolvedValue([]);
            const result = await analyticsService.getUrlAnalytics('short-code', 'user-id');
            expect(result).toBeNull();
            expect(UrlService.prototype.getOriginalUrl).toHaveBeenCalledWith('short-code');
        });
    });
});
