import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.user.createMany({
    data: [
      {
        email: 'alice@example.com',
        password: 'MockPassword123!',
        name: 'Alice Johnson',
      },
      {
        email: 'bob@example.com',
        password: 'MockPassword123!',
        name: 'Bob Smith',
      },
      {
        email: 'carol@example.com',
        password: 'MockPassword123!',
        name: 'Carol Williams',
      },
      {
        email: 'david@example.com',
        password: 'MockPassword123!',
        name: 'David Brown',
      },
      {
        email: 'emma@example.com',
        password: 'MockPassword123!',
        name: 'Emma Davis',
      },
      {
        email: 'frank@example.com',
        password: 'MockPassword123!',
        name: 'Frank Miller',
      },
      {
        email: 'grace@example.com',
        password: 'MockPassword123!',
        name: 'Grace Wilson',
      },
      {
        email: 'henry@example.com',
        password: 'MockPassword123!',
        name: 'Henry Moore',
      },
      {
        email: 'isabella@example.com',
        password: 'MockPassword123!',
        name: 'Isabella Taylor',
      },
      {
        email: 'jack@example.com',
        password: 'MockPassword123!',
        name: 'Jack Anderson',
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
