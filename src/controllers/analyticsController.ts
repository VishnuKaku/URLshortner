// Analytics controller 
// src/controllers/analyticsController.ts
import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analyticsService';
import { IRequestWithUser } from '../models/interfaces';
import { AppError } from '../utils/errorHandler';

export class AnalyticsController {
  private analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  getUrlAnalytics = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { alias } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const analytics = await this.analyticsService.getUrlAnalytics(alias, userId);

      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      next(error);
    }
  };

  getTopicAnalytics = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { topic } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const analytics = await this.analyticsService.getTopicAnalytics(topic, userId);

      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      next(error);
    }
  };

  getOverallAnalytics = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const analytics = await this.analyticsService.getOverallAnalytics(userId);

      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      next(error);
    }
  };
}