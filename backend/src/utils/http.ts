import type { NextFunction, Request, RequestHandler, Response } from 'express';

export class HttpError extends Error {
  readonly statusCode: number;
  readonly code: string;

  constructor(statusCode: number, message: string, code = 'HTTP_ERROR') {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const asyncHandler = (handler: AsyncRouteHandler): RequestHandler => {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
};

export const errorMiddleware = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      errorCode: err.code,
    });
    return;
  }

  const message = err instanceof Error ? err.message : 'Internal server error';
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: message,
    errorCode: 'INTERNAL_SERVER_ERROR',
  });
};
