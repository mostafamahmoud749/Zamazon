import type { RequestHandler } from 'express';

export const requireAuth: RequestHandler = (request, response, next) => {
  if (!request.isAuthenticated()) {
    return response.sendStatus(401);
  }

  next();
};
