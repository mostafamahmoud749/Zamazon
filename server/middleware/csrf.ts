import { csrfSync } from 'csrf-sync';

export const { generateToken, csrfSynchronisedProtection, invalidCsrfTokenError } = csrfSync();
