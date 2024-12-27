// Unit test for analytics service 
// tests/unit/services/analyticsService.test.ts
import { AnalyticsService } from '../../../src/services/analyticsService';
import { Analytics } from '../../../src/models/Analytics';
import { UrlService } from '../../../src/services/urlService';

jest.mock('../../../src/models/Analytics');
jest.mock('../../../src/services/urlService');

describe('AnalyticsService', () => {
  let analyticsService: AnalyticsService;
  
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
        userAgent: 'test-agent'
      };

      (Analytics.create as jest.Mock).mockResolvedValue(mockData);

      await analyticsService.logAccess(mockData.urlId, mockData.userId, {
        ipAddress: mockData.ipAddress,
        userAgent: mockData.userAgent
      });

      expect(Analytics.create).toHaveBeenCalledWith(mockData);
    });
  });

  describe('getUrlAnalytics', () => {
    it('should return processed analytics for a URL', async () => {
      const mockAnalytics = [
        { ipAddress: '1.1.1.1', accessTime: new Date() },
        { ipAddress: '1.1.1.1', accessTime: new Date() }
      ];

      (UrlService.prototype.getOriginalUrl as jest.Mock).mockResolvedValue('original-url');
      (Analytics.find as jest.Mock).mockResolvedValue(mockAnalytics);

      const result = await analyticsService.getUrlAnalytics('short-code', 'user-id');

      expect(result).toBeDefined();
      expect(UrlService.prototype.getOriginalUrl).toHaveBeenCalledWith('short-code');
    });
  });
});