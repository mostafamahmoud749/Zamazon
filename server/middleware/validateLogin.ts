import { LoginSchema } from '../schemas/Auth.schema.js';
import type { RequestHandler } from 'express';

export const validateLogin: RequestHandler = (request, response, next) => {
  const bodyResult = LoginSchema.safeParse(request.body);

  if (!bodyResult.success) {
    return response.status(400).json({
      error: 'Invalid login data',
      details: bodyResult.error.flatten(),
    });
  }

  next();
};
