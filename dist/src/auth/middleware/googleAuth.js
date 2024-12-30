import { User } from '../../models/User';
import { AppError } from '../../utils/errorHandler';
export async function googleAuthMiddleware(req, res, next) {
    try {
        const profile = req.user;
        if (!profile || !profile.emails?.[0]?.value) {
            throw new AppError('Invalid Google profile data', 401);
        }
        // Find or create user based on Google profile
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
            user = await User.create({
                email: profile.emails[0].value,
                googleId: profile.id,
                isVerified: true
            });
        }
        // Attach user to request
        req.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
}
