import { isPrismaError } from './isPrismaError.js';
import type { Response } from 'express';

export function handlePrismaError(error: unknown, response: Response): boolean {
  if (isPrismaError(error, 'P2002')) {
    response.status(409).json({ error: 'A record with these values already exists' });
    return true;
  }

  if (isPrismaError(error, 'P2003')) {
    response.status(400).json({ error: 'A related record does not exist' });
    return true;
  }

  if (isPrismaError(error, 'P2025')) {
    response.status(404).json({ error: 'Record not found' });
    return true;
  }

  if (isPrismaError(error, 'P2034')) {
    response.status(409).json({ error: 'The operation conflicted; please try again' });
    return true;
  }

  return false;
}
