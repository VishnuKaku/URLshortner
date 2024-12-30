import { AnalyticsService } from '../services/analyticsService';
import { AppError } from '../utils/errorHandler';
export class AnalyticsController {
    analyticsService;
    constructor() {
        this.analyticsService = new AnalyticsService();
    }
    getUrlAnalytics = async (req, res, next) => {
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
        }
        catch (error) {
            next(error);
        }
    };
    getTopicAnalytics = async (req, res, next) => {
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
        }
        catch (error) {
            next(error);
        }
    };
    getOverallAnalytics = async (req, res, next) => {
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
        }
        catch (error) {
            next(error);
        }
    };
}
