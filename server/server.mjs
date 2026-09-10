import express from 'express';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import './stratiges/local-stratigy.mjs';
import authRouter from './routes/auth.mjs';
import "dotenv/config";

const app = express();
mongoose
  .connect('mongodb://localhost/zamazon')
  .then(() => console.log('Connected to the database!'))
  .catch((err) => console.log(`Error: ${err}`));

const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use(cookieParser(process.env.SESSION_SECRET || ""));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use(authRouter);

app.listen(PORT, (request, response) => {
  console.log(`the server started on port ${PORT}!`);
});
