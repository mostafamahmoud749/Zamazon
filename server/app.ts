import 'dotenv/config';
import './stratiges/local-stratigy.js';
import './stratiges/github-stratigy.js';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import productsRouter from './routes/products.js';
import productRouter from './routes/product.js';
import ordersRouter from './routes/orders.js';
import userRouter from './routes/user.js';
import cartRouter from './routes/cart.js';
import addressesRouter from './routes/addresses.js';
import reviewsRouter from './routes/reviews.js';
import categoriesRouter from './routes/category.js';
import imagesRouter from './routes/images.js';
import connectPgSimple from 'connect-pg-simple';
import { errorHandler } from './middleware/errorHandler.js';
import { csrfSynchronisedProtection, generateToken } from './middleware/csrf.js';

export const createApp = () => {
  const app = express();

  const PgStore = connectPgSimple(session);

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
      credentials: true,
    }),
  );
  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: { error: 'Too many requests. Please try again later.' },
    }),
  );
  app.use(express.json());
  app.use(cookieParser(process.env.SESSION_SECRET || ''));
  app.use(
    session({
      secret: process.env.SESSION_SECRET || '',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: false,
      },
      store: new PgStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
      }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/api/auth/csrf-token', (request, response, next) => {
    response.set('Cache-Control', 'no-store');
    const csrfToken = generateToken(request);

    request.session.save((error) => {
      if (error) return next(error);
      response.json({ csrfToken });
    });
  });
  app.use('/api', csrfSynchronisedProtection);

  app.use(authRouter);
  app.use(productsRouter);
  app.use(productRouter);
  app.use(userRouter);
  app.use(cartRouter);
  app.use(ordersRouter);
  app.use(addressesRouter);
  app.use(reviewsRouter);
  app.use(categoriesRouter);
  app.use(imagesRouter);
  app.use(errorHandler);

  return app;
};
