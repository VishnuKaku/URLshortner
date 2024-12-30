import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
export class AuthUtils {
    static generateToken(user) {
        return jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    }
    static verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET || 'secret');
        }
        catch (error) {
            throw new AppError('Invalid or expired token', 401);
        }
    }
    static extractTokenFromHeader(req) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.split(' ')[1];
    }
}
