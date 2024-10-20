import type { Request, Response, NextFunction } from 'express';

export const notFoundHandler = (req: Request, _: Response, next: NextFunction) => {
  const error = new Error(`path ${req.originalUrl} not found`);
  error['status'] = 404;
  next(error);
};

export const globalErrorHandler = (error: Error, _: Request, res: Response) => {
  console.log(error.message);
  res.status(error['status'] || 500);
  res.json({ error: error.message });
};
