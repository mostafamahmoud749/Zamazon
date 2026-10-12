import { ErrorRequestHandler } from 'express';
import { handlePrismaError } from '../utils/handlePrismaError.js';

export const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  if (response.headersSent) {
    return next(error);
  }

  if (handlePrismaError(error, response)) return;
  response.status(500).json({ error: 'Internal Server Error' });
};
