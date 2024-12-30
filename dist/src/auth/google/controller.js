import { AuthUtils } from '../../utils/auth';
import { AppError } from '../../utils/errorHandler';
export class GoogleAuthController {
    static async handleCallback(req, res, next) {
        try {
            if (!req.user) {
                throw new AppError('Authentication failed', 401);
            }
            const token = AuthUtils.generateToken(req.user);
            res.redirect(`/auth-success?token=${token}`);
        }
        catch (error) {
            next(error);
        }
    }
}
