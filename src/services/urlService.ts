// URL service 
// src/services/urlService.ts
import { customAlphabet } from 'nanoid';
import { Url } from '../models/Url';
import { redisClient } from '../config/redis';
import { IUrlDocument, IUrlCreate } from '../models/interfaces';
import { ApiError } from '../utils/errorHandler';

export class UrlService {
  private nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

  async createShortUrl(urlData: IUrlCreate, userId: string): Promise<IUrlDocument> {
    const { longUrl, customAlias, topic } = urlData;

    // Validate URL
    if (!this.isValidUrl(longUrl)) {
      throw new ApiError('Invalid URL provided', 400);
    }

    // Check if custom alias is available if provided
    if (customAlias) {
      const existingUrl = await Url.findOne({ shortCode: customAlias });
      if (existingUrl) {
        throw new ApiError('Custom alias already in use', 400);
      }
    }

    // Generate short code if no custom alias
    const shortCode = customAlias || this.nanoid();

    // Create new URL document
    const url = await Url.create({
      originalUrl: longUrl,
      shortCode,
      userId,
      topic,
      isCustom: !!customAlias,
    });

    // Cache the URL mapping
    await this.cacheUrl(shortCode, longUrl);

    return url;
  }

  async getOriginalUrl(shortCode: string): Promise<string> {
    // Try to get from cache first
    const cachedUrl = await redisClient.get(`url:${shortCode}`);
    if (cachedUrl) {
      return cachedUrl;
    }

    // If not in cache, get from database
    const url = await Url.findOne({ shortCode });
    if (!url) {
      throw new ApiError('URL not found', 404);
    }

    // Cache for future use
    await this.cacheUrl(shortCode, url.originalUrl);

    return url.originalUrl;
  }

  async getUrlsByTopic(topic: string, userId: string): Promise<IUrlDocument[]> {
    return Url.find({ topic, userId });
  }

  async getAllUserUrls(userId: string): Promise<IUrlDocument[]> {
    return Url.find({ userId });
  }

  private async cacheUrl(shortCode: string, originalUrl: string): Promise<void> {
    await redisClient.set(`url:${shortCode}`, originalUrl, {
      EX: 86400 // Cache for 24 hours
    });
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}