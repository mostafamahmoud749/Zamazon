import express from 'express';
import { createApp } from './server/app.js';

const app = express();
app.use(createApp());

const port = Number(process.env.PORT);

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});

export default app;
