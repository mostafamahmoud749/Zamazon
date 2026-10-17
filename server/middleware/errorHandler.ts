import { ErrorRequestHandler } from 'express';
import { handlePrismaError } from '../utils/handlePrismaError.js';
import { invalidCsrfTokenError } from './csrf.js';

export const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  if (response.headersSent) {
    return next(error);
  }

  if (error === invalidCsrfTokenError) {
    return response.status(403).json({
      error: 'Invalid or missing CSRF token',
      code: 'EBADCSRFTOKEN',
    });
  }

  if (handlePrismaError(error, response)) return;
  response.status(500).json({ error: 'Internal Server Error' });
};
