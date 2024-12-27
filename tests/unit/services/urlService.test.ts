// Unit test for URL service 
// tests/unit/services/urlService.test.ts
import { UrlService } from '../../../src/services/urlService';
import { Url } from '../../../src/models/Url';
import { redisClient } from '../../../src/config/redis';

jest.mock('../../../src/models/Url');
jest.mock('../../../src/config/redis');

describe('UrlService', () => {
  let urlService: UrlService;

  beforeEach(() => {
    jest.clearAllMocks();
    urlService = new UrlService();
  });

  describe('createShortUrl', () => {
    it('should create a new shortened URL', async () => {
      const mockUrlData = {
        longUrl: 'https://example.com',
        customAlias: 'custom',
        topic: 'test'
      };

      const mockCreatedUrl = {
        originalUrl: mockUrlData.longUrl,
        shortCode: mockUrlData.customAlias,
        userId: 'test-user',
        topic: mockUrlData.topic
      };

      (Url.create as jest.Mock).mockResolvedValue(mockCreatedUrl);
      (Url.findOne as jest.Mock).mockResolvedValue(null);

      const result = await urlService.createShortUrl(mockUrlData, 'test-user');

      expect(result).toEqual(mockCreatedUrl);
      expect(Url.create).toHaveBeenCalled();
      expect(redisClient.set).toHaveBeenCalled();
    });

    it('should throw error for invalid URL', async () => {
      const mockUrlData = {
        longUrl: 'invalid-url',
        customAlias: 'custom'
      };

      await expect(urlService.createShortUrl(mockUrlData, 'test-user'))
        .rejects.toThrow('Invalid URL provided');
    });
  });

  describe('getOriginalUrl', () => {
    it('should return cached URL if available', async () => {
      const mockUrl = 'https://example.com';
      (redisClient.get as jest.Mock).mockResolvedValue(mockUrl);

      const result = await urlService.getOriginalUrl('short-code');

      expect(result).toBe(mockUrl);
      expect(redisClient.get).toHaveBeenCalledWith('url:short-code');
      expect(Url.findOne).not.toHaveBeenCalled();
    });
  });
});