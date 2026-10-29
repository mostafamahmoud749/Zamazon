This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

For the catalog, run `npm run backend` and `npm run dev` in separate terminals.
For API load testing, see [tests/load/README.md](tests/load/README.md).
Run `npm run seed:products` to add 120 sample products for testing scroll loading.
This additive script preserves existing records and skips products already added.
It also replaces the old placeholder image on existing scroll-demo products.

### Seed product images

Both seed scripts use the verified Cloudinary URLs in `prisma/seed-images.json`.
The 20 named products have individual images; the 120 scroll-demo items cycle
through matching images for their category. The manifest records the source,
photographer, license, Cloudinary public ID, dimensions, and stored file size.
The current images are AI-generated studio product shots in
`public/products/studio/`, with the source cutouts and generation prompts saved
alongside them. Every image has a 1024 x 1024 canvas, consistent product padding,
and a solid `#f3f4f6` background matching the product cards.

- `npm run seed:images` uploads missing assets, optimizes them within
  1600 x 1600, and saves their actual returned URLs and formats in the manifest. It requires
  the three Cloudinary environment variables. Stable public IDs and
  `overwrite: false` prevent duplicate or replacement uploads when rerunning it.
- `npm run seed:images:prepare` rebuilds the studio WebP images from their
  transparent PNG sources and resets their manifest URLs for uploading. It
  centers the full product without cropping it and preserves the exact background
  color using lossless WebP. Studio images are stored without a second lossy
  Cloudinary transformation so their background continues to match the cards.
- `npm run seed:images:apply` updates only the image field of existing named
  seed products and `scroll-demo-product-NNN` records. It does not create or
  delete records, so it can repair the existing catalog without running the
  main database seed.

Regular database seeding uses the saved URLs and does not upload images again.
The seed scripts validate the manifest before writing database records.

### Cloudinary images

Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in
the backend environment. Restart the API and Next.js after changing them.
The API secret stays on the backend; no upload preset is needed.

Use `uploadImage(file)` from `lib/uploadImage.ts` in browser code:

```ts
import { uploadImage } from '@/lib/uploadImage';

const image = await uploadImage(file); // file is a browser File
// image.url is the HTTPS URL to save in a product's existing image field.
// Also returns id, publicId, width, height, format, and bytes.
```

The function checks for a nonempty JPEG, PNG, or WebP up to 5 MB, gets a CSRF
token, and calls `POST /api/images/upload-signature` using the existing login
session. Express signs a new user-specific public ID and fixed upload settings.
The browser then sends the file and signed parameters directly to Cloudinary
as multipart `FormData`. File bytes never pass through Express.

Cloudinary applies a signed incoming transformation before storing new uploads:
fit within 1600 x 1600 while preserving aspect ratio and never enlarging smaller
images, convert to WebP, and apply automatic quality compression. The returned
URL, dimensions, format, and byte count describe the optimized stored image.
The transformation is signed so the browser cannot remove or change it.
Existing uploaded images are unaffected.

Cloudinary enforces the signed format restriction, `overwrite: false`, and an
`eval` rule that rejects files over 5,242,880 bytes (5 MiB) before storing them.
The browser also checks the size for immediate feedback. The size rule is part
of the signature, so removing or changing it invalidates the upload signature.
The signature and API key may be sent to the browser; the API secret must stay
in the backend environment. Cloudinary accepts signatures for one hour.

Signature requests are limited to 30 per user per hour, in addition to the
general API limit. These limiters are in memory. The signing endpoint returns
401 for missing login, 403 for invalid CSRF, 429 for rate limits, and 503 for
missing Cloudinary configuration. The browser function throws on upload failure.

Use `image.url` directly to display/download the public image from Cloudinary's
CDN. The existing Next.js Image configuration allows your Cloudinary cloud.
There are no image listing or metadata endpoints. Uploading does not create or
modify a product or save a database record.

Reference: [Cloudinary signed browser uploads](https://cloudinary.com/documentation/client_side_uploading).
The signed size rule uses [Cloudinary upload evaluation](https://cloudinary.com/documentation/upload_parameters#eval_modify_upload_options_before_upload).
Optimization uses [Cloudinary incoming transformations](https://cloudinary.com/documentation/eager_and_incoming_transformations#incoming_transformations).

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

### Category lookup

`GET /api/categories?ids=3,8,12` returns the matching category objects. Supply
up to 100 comma-separated positive integer IDs. Duplicate IDs are deduplicated;
missing categories are omitted, and no matches returns `[]`. Invalid input
returns 400. Without `ids`, the endpoint returns all categories.

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
