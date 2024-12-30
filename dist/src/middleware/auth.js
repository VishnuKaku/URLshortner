import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.config';
export const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new Error('No token provided');
        }
        const decoded = jwt.verify(token, authConfig.jwtSecret);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
