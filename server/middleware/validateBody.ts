import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

export const validateBody = (schema: ZodType): RequestHandler => {
  return (request, response, next) => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      return response.status(400).json({
        error: 'Invalid request data',
        details: result.error.flatten(),
      });
    }

    request.body = result.data;
    next();
  };
};