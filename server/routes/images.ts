import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { requireAuth } from '../middleware/requireAuth.js';
import { createImageUploadSignature } from '../services/images.js';

const router = Router();

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  keyGenerator: (request) => String(request.user!.id),
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many image uploads. Please try again later.' },
});

router.post('/api/images/upload-signature', requireAuth, uploadLimiter, (request, response) => {
  response.set('Cache-Control', 'no-store');
  const upload = createImageUploadSignature(request.user!.id);
  if (!upload) return response.status(503).json({ error: 'Image storage is not configured' });
  response.json(upload);
});

export default router;
