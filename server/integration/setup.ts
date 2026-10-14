import 'dotenv/config';

const testDatabaseUrl = process.env.DATABASE_URL_TEST;

if (!testDatabaseUrl) {
  throw new Error('Missing DATABASE_URL_TEST in .env');
}

process.env.DATABASE_URL = testDatabaseUrl;
