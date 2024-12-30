import { AuthService } from '../services/authService';
import { AppError } from '../utils/errorHandler';
export class AuthController {
    authService;
    constructor() {
        this.authService = new AuthService();
    }
    googleAuth = async (req, res, next) => {
        try {
            const { token } = req.body;
            if (!token) {
                throw new AppError('Google token is required', 400);
            }
            const { user, accessToken } = await this.authService.authenticateWithGoogle(token);
            res.json({
                success: true,
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.name
                    },
                    accessToken
                }
            });
        }
        catch (error) {
            next(error);
        }
    };
}
