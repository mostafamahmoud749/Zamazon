This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Express backend security

Run the API with `npm run backend`. Helmet adds security response headers.
CORS allows credentialed requests from `http://localhost:3000` by default.
Set `FRONTEND_ORIGIN` in `.env` to your frontend's exact origin when deploying
(for example, `https://zamazon.example`, without a trailing slash).
Frontend requests using session cookies also need `credentials: 'include'`.

All `/api` routes share a limit of 300 requests per IP per 15 minutes. CORS
preflight requests are handled before the limiter and do not consume the quota.
This is a starting limit to adjust based on normal application traffic.
Login requests also have a stricter limit of 10 unsuccessful attempts per IP per 15 minutes;
successful responses do not count toward the limit. Excess requests receive 429.
The limiter stores counts in memory, so restarting the API resets them. Multiple
API instances need a shared store. When deploying behind a proxy, configure
Express `trust proxy` for that hosting setup so client IPs are identified correctly.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
