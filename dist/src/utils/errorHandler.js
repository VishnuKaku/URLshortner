// Error handler utility 
// src/utils/errorHandler.ts
export class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        // Capture stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}
export const handleError = (err) => {
    if (err instanceof AppError) {
        return err;
    }
    // MongoDB duplicate key error
    if (err.code === 11000) {
        return new AppError('Duplicate value found', 400);
    }
    // JWT verification error
    if (err.name === 'JsonWebTokenError') {
        return new AppError('Invalid token', 401);
    }
    // Default error
    return new AppError('Internal server error', 500);
};
