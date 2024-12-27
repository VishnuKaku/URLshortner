// Error handler utility 
// src/utils/errorHandler.ts
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true;
  
      // Capture stack trace
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export const handleError = (err: Error): AppError => {
    if (err instanceof AppError) {
      return err;
    }
  
    // MongoDB duplicate key error
    if ((err as any).code === 11000) {
      return new AppError('Duplicate value found', 400);
    }
  
    // JWT verification error
    if (err.name === 'JsonWebTokenError') {
      return new AppError('Invalid token', 401);
    }
  
    // Default error
    return new AppError('Internal server error', 500);
  };