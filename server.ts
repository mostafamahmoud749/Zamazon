import express from 'express';
import { createApp } from './server/app.js';

const app = express();
app.use(createApp());

const port = Number(process.env.PORT);

app.listen(port, (error?: Error) => {
  if (error) {
    console.error(`Failed to start backend on port ${port}:`, error);
    process.exitCode = 1;
    return;
  }

  console.log(`Backend listening on http://localhost:${port}`);
});

export default app;
