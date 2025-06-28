import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const createError = (
  message: string,
  statusCode: number = 500,
  isOperational: boolean = true
): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = isOperational;
  return error;
};

export const errorHandler = (
  error: AppError,
  req: Request,
  _res: Response,
  _next: NextFunction
): void => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Log error for debugging
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Don't leak error details in production
  const errorResponse = {
    success: false,
    error: process.env['NODE_ENV'] === 'production' ? 'Internal Server Error' : message,
    ...(process.env['NODE_ENV'] !== 'production' && { stack: error.stack }),
  };

  _res.status(statusCode).json(errorResponse);
};

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const error = createError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, _res, next)).catch(next);
  };
};

export const handleValidationErrors = (err: any, _req: Request, next: NextFunction) => {
  if (err && err.errors) {
    const validationErrors = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
    return next({
      statusCode: 400,
      message: 'Validation failed',
      validationErrors,
    });
  }
  next(err);
}; 