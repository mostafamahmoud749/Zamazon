import express from 'express';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import 'dotenv/config';
import './stratiges/local-stratigy.js';
import './stratiges/github-stratigy.js';
import authRouter from './routes/auth.js';
import connectPgSimple from 'connect-pg-simple';

const app = express();
mongoose
  .connect('mongodb://localhost/zamazon')
  .then(() => console.log('Connected to the database!'))
  .catch((err) => console.log(`Error: ${err}`));

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

app.listen(PORT, () => {
  console.log(`the server started on port ${PORT}!`);
});
