# Zamazon

[Live site](https://zamazon-chi.vercel.app/) · [Backend API](https://zamazon-backend-bry3una61-mostafamahmoud749s-projects.vercel.app/)

## About the project

Zamazon is an Amazon clone I built to practice web development. You can browse products, search and filter them, add items to your cart, and leave reviews. The backend also supports creating product listings and placing orders.

I started this as a frontend project, then learned backend development so I could build my own API and add login.

## Main features

- Responsive layouts for desktop and mobile.
- Product search, category and rating filters, and infinite scrolling.
- Registration, email and password login, and GitHub login.
- A saved shopping cart with quantity controls.
- Product ratings and reviews.
- Saved addresses, a default address, and profile photo uploads.
- Product creation, editing, and deactivation through the API.
- Order creation and cancellation through the API, with stock checks and protection against duplicate orders.

Order history has a frontend page. Checkout currently runs through the API, and payment processing is not connected to a payment provider.

## Screenshots

### Home

![Zamazon homepage on desktop](docs/images/home-desktop.png)

<details>
<summary>Product browsing on desktop and mobile</summary>

### Desktop

![Product browsing with category and rating filters](docs/images/products-desktop.png)

### Mobile

<img src="docs/images/products-mobile.png" alt="Zamazon product browsing on mobile" width="320" />

</details>

## Technologies used

### Frontend

- **Next.js and React** — pages, routing, and UI components.
- **TypeScript** — types for components and API data.
- **Tailwind CSS** — styling and responsive layouts.
- **React Context** — shared user and cart state.
- **Lucide React and React Icons** — icons.

### Backend

- **Node.js, Express, and TypeScript** — the API server.
- **PostgreSQL and Prisma** — database, queries, and migrations.
- **Passport.js** — local login and GitHub OAuth.
- **express-session and connect-pg-simple** — sessions stored in PostgreSQL.
- **bcrypt** — password hashing.
- **Zod** — request validation.
- **Cloudinary** — image uploads and storage.
- **csrf-sync, Helmet, CORS, and express-rate-limit** — request protection and limits.

### Testing and tools

- **Vitest and Supertest** — API integration tests.
- **k6** — API load tests.
- **ESLint and Prettier** — linting and formatting.

## What I learned

- Building an Express API and connecting it to a Next.js frontend.
- Designing database relationships between users, products, carts, orders, and reviews.
- Adding login with hashed passwords, sessions, and GitHub OAuth.
- Validating requests and checking that users can only change their own data.
- Using database transactions to keep orders, stock, and cart updates together.
- Handling repeated checkout requests without creating duplicate orders.
- Writing API tests for successful requests, errors, and access checks.

## Challenges and how I solved them

I started this project as a frontend developer. I had trouble finding an API that supported what I wanted to build, especially login. That limited what I could add to the project, so I learned backend development and built my own API with Express, PostgreSQL, and Prisma.

## API endpoints

For local development, the backend runs at `http://localhost:9000`. The frontend forwards `/api` requests to it. The deployed backend is linked above; append an endpoint such as `/api/products` to its URL.

Routes marked **Yes** require login. Product, review, address, and order changes are limited to the current user's records.

For `POST`, `PATCH`, and `DELETE` requests, first get a token from `GET /api/auth/csrf-token`, then send it in the `X-CSRF-Token` header with the session cookie. Get a fresh token after login.

<details>
<summary>View all endpoints</summary>

### Authentication

| Method | Endpoint                    | Description                      | Login required |
| ------ | --------------------------- | -------------------------------- | -------------- |
| GET    | `/api/auth/csrf-token`      | Get a CSRF token                 | No             |
| POST   | `/api/auth/register`        | Create an account                | No             |
| POST   | `/api/auth/login`           | Log in with email and password   | No             |
| POST   | `/api/auth/logout`          | Log out and clear the session    | No             |
| GET    | `/api/auth/github`          | Start GitHub login               | No             |
| GET    | `/api/auth/github/callback` | Handle the GitHub login callback | No             |

### Products and categories

| Method | Endpoint                        | Description                                 | Login required |
| ------ | ------------------------------- | ------------------------------------------- | -------------- |
| GET    | `/api/products`                 | List, search, and filter products           | No             |
| GET    | `/api/products/:id`             | Get a product and its rating                | No             |
| POST   | `/api/products`                 | Create a product listing                    | Yes            |
| PATCH  | `/api/products/:id`             | Update your product                         | Yes            |
| DELETE | `/api/products/:id`             | Deactivate your product                     | Yes            |
| GET    | `/api/categories`               | List categories, optionally filtered by IDs | No             |
| GET    | `/api/categories/ancestors`     | List top-level categories                   | No             |
| GET    | `/api/categories/:id/childrens` | List a category's direct children           | No             |

Product queries support `search`, `rating`, `filters` (a JSON array of category IDs), `page`, and `cumulative`. The `childrens` spelling matches the current route.

### Reviews

| Method | Endpoint                              | Description              | Login required |
| ------ | ------------------------------------- | ------------------------ | -------------- |
| GET    | `/api/products/:id/reviews`           | List a product's reviews | No             |
| POST   | `/api/products/:id/reviews`           | Add a review             | Yes            |
| PATCH  | `/api/products/:id/reviews/:reviewId` | Update your review       | Yes            |
| DELETE | `/api/products/:id/reviews/:reviewId` | Delete your review       | Yes            |

### Cart and orders

| Method | Endpoint                 | Description                                 | Login required |
| ------ | ------------------------ | ------------------------------------------- | -------------- |
| GET    | `/api/cart/items`        | Get your cart                               | Yes            |
| POST   | `/api/cart/items`        | Add a product to your cart                  | Yes            |
| PATCH  | `/api/cart/items/:id`    | Change a cart item's quantity               | Yes            |
| DELETE | `/api/cart/items/:id`    | Remove a cart item                          | Yes            |
| GET    | `/api/orders`            | List your orders, with pagination           | Yes            |
| GET    | `/api/orders/:id`        | Get your order details                      | Yes            |
| POST   | `/api/orders`            | Create an order from your cart              | Yes            |
| PATCH  | `/api/orders/:id/cancel` | Cancel your pending order and restore stock | Yes            |

Creating an order requires an `Idempotency-Key` header. Reusing the same key with the same checkout details returns the existing order.

### Profile, addresses, and images

| Method | Endpoint                        | Description                                    | Login required |
| ------ | ------------------------------- | ---------------------------------------------- | -------------- |
| GET    | `/api/users/me`                 | Get your profile                               | Yes            |
| PATCH  | `/api/users/me/default-address` | Set your default address                       | Yes            |
| PATCH  | `/api/users/me/image`           | Update your profile image URL                  | Yes            |
| GET    | `/api/addresses`                | List your saved addresses                      | Yes            |
| POST   | `/api/addresses`                | Add an address                                 | Yes            |
| PATCH  | `/api/addresses/:id`            | Update your address                            | Yes            |
| DELETE | `/api/addresses/:id`            | Delete your address if no order uses it        | Yes            |
| POST   | `/api/images/upload-signature`  | Get a signature for a direct Cloudinary upload | Yes            |

</details>

## Run locally

You need Node.js 24.x, npm, a PostgreSQL database, and GitHub OAuth app credentials. The backend currently requires GitHub credentials to start, even when using email and password login.

1. Create a `.env` file in the project root:

   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/zamazon
   SESSION_SECRET=replace-with-a-long-random-string
   PORT=9000
   FRONTEND_ORIGIN=http://localhost:3000
   API_URL=http://localhost:9000

   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback

   CLOUDINARY_CLOUD_NAME=dywssqmm
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   ```

   Set your GitHub OAuth app's homepage to `http://localhost:3000` and its callback URL to the value above. The Cloudinary cloud name matches the included demo images. For uploads, use your own Cloudinary cloud name, API key, and secret; update the image URLs in `prisma/seed-images.json` if you move the demo images to your cloud.

2. Install dependencies and apply the database migrations:

   ```bash
   npm install
   npx prisma migrate deploy --config prisma7.config.ts
   ```

3. Optionally add sample products:

   ```bash
   npm run seed:products
   ```

4. Start the backend:

   ```bash
   npm run backend
   ```

5. In another terminal, start the frontend:

   ```bash
   npm run dev
   ```

Open `http://localhost:3000` and register an account.

To run integration tests, set `DATABASE_URL_TEST` to a separate PostgreSQL test database, apply the migrations to that database, and run `npm test`. For load testing, see [tests/load/README.md](tests/load/README.md).
