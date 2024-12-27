// src/controllers/urlController.ts
import { Response, NextFunction } from 'express';
import { UrlService } from '../services/urlService';
import { AnalyticsService } from '../services/analyticsService';
import { IRequestWithUser, IUrlCreate } from '../models/interfaces';
import { AppError } from '../utils/errorHandler';

export class UrlController {
  private urlService: UrlService;
  private analyticsService: AnalyticsService;

  constructor() {
    this.urlService = new UrlService();
    this.analyticsService = new AnalyticsService();
  }

  createShortUrl = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    try {
      const urlData: IUrlCreate = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const url = await this.urlService.createShortUrl(urlData, userId);

      res.status(201).json({
        success: true,
        data: {
          shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
          createdAt: url.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  };

  redirectToUrl = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { shortCode } = req.params;
      const originalUrl = await this.urlService.getOriginalUrl(shortCode);

      // Log analytics data
      await this.analyticsService.logAccess(shortCode, req.user?.id || 'anonymous', {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || '',
        referrer: req.headers.referer || ''
      });

      res.redirect(originalUrl);
    } catch (error) {
      next(error);
    }
  };
}
