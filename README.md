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

All API methods except GET, HEAD, and OPTIONS require a session-bound CSRF token
in the `X-CSRF-Token` header, including login and registration. Obtain it with
`GET /api/auth/csrf-token` using `credentials: 'include'`. The response is
`{ "csrfToken": "..." }` and must not be cached. Keep the token in frontend memory.

```ts
const api = 'http://localhost:9000';
const response = await fetch(`${api}/api/auth/csrf-token`, {
  credentials: 'include',
  cache: 'no-store',
});
const { csrfToken } = await response.json();
// Retain this value for retries of this purchase.
const checkoutKey = crypto.randomUUID();

await fetch(`${api}/api/orders`, {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken,
    'Idempotency-Key': checkoutKey,
  },
  body: JSON.stringify({ addressId: 1, paymentMethod: 'credit_card' }),
});
```

Fetch a fresh token after successful login (including GitHub login), because
Passport regenerates the session. Missing, incorrect, or stale tokens return
403 with `code: 'EBADCSRFTOKEN'` before route handlers run. If the frontend loses
its token, fetch it again using the same session cookie. GitHub OAuth GET routes
use OAuth `state` verification rather than an API CSRF header.

### Checkout retries

Before using this schema change, apply migrations with
`npx prisma migrate deploy --config prisma7.config.ts` and regenerate the client
with `npx prisma generate --config prisma7.config.ts`.

Create `const checkoutKey = crypto.randomUUID()` once per intended purchase,
before the order request above. `POST /api/orders` requires this key in the
`Idempotency-Key` header (1-128 letters, digits, hyphens, or underscores).
Keep the same key and request details for retries after timeouts or connection
failures. Generate a new key only for a new purchase, not for each HTTP attempt.

A new checkout returns 201. A successful retry returns 200 with the existing
order and does not consume the current cart or stock again. Reusing a key with
a different address ID or payment method returns 409. Keys are scoped to the
authenticated user and recorded atomically with successful orders. Failed
transactions do not consume a key. A replay returns the existing order's current
status, including if it was canceled. Keys are retained for the life of the order.
Serialization conflicts are retried up to three total attempts; after that,
409 asks the client to retry with the same key.

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
