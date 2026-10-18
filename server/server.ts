import 'dotenv/config';
import { prisma } from '../prisma/lib/prisma.js';
import { createApp } from './app.js';

const app = createApp();

const PORT = process.env.PORT || 9000;

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
