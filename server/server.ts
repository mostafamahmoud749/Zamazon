import express from 'express';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import './stratiges/local-stratigy.js';
import './stratiges/github-stratigy.js';
import authRouter from './routes/auth.js';
import productsRouter from './routes/products.js';
import productRouter from './routes/product.js';
import ordersRouter from './routes/orders.js';
import userRouter from './routes/user.js';
import cartRouter from './routes/cart.js';
import addressesRouter from './routes/addresses.js';
import reviewsRouter from './routes/reviews.js';
import connectPgSimple from 'connect-pg-simple';
import { prisma } from '../prisma/lib/prisma.js';

const app = express();

const PORT = process.env.PORT || 9000;
const PgStore = connectPgSimple(session);

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

app.use(authRouter);
app.use(productsRouter);
app.use(productRouter);
app.use(userRouter);
app.use(cartRouter);
app.use(ordersRouter);
app.use(addressesRouter);
app.use(reviewsRouter);

const server = app.listen(PORT, () => {
  console.log(`the server started on port ${PORT}!`);
});

async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
