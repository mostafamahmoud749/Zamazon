import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

export const validateParams = (schema: ZodType): RequestHandler => {
  return (request, response, next) => {
    const result = schema.safeParse(request.params);

    if (!result.success) {
      return response.status(400).json({
        error: 'Invalid request data',
        details: result.error.flatten(),
      });
    }

    response.locals.params = result.data;
    next();
  };
};
