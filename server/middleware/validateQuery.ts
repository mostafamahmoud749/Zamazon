import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

export const validateQuery = (schema: ZodType): RequestHandler => {
  return (request, response, next) => {
    const result = schema.safeParse(request.query);

    if (!result.success) {
      return response.status(400).json({
        error: 'Invalid request data',
        details: result.error.flatten(),
      });
    }

    response.locals.query = result.data;
    next();
  };
};
