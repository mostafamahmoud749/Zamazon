import express from 'express';
import { createApp } from './server/app.js';

const app = express();
app.use(createApp());

export default app;