# OnlineStocktacking
Full-stack e-commerce platform built with React + Tailwind on the frontend and Node.js + Express + PostgreSQL on the backend. Includes admin analytics, PayPal checkout, image uploads, JWT auth, social login, and automated tests.

## Tech Stack
- Frontend: React, Tailwind CSS, React Router, Context API, Chart.js
- Backend: Node.js, Express, Prisma ORM
- Database: PostgreSQL
- Auth: JWT, bcrypt, Passport (Google/Facebook/Twitter)
- Payments: PayPal

## Project Structure
```
backend/          Express API + Prisma
frontend/         React app (Vite)
```

## Setup
### 1) Backend
```
cd backend
cp .env.example .env
npm install
```

Update `.env` values for PostgreSQL, JWT secret, PayPal credentials, and social login keys.

Create the database and run Prisma:
```
npx prisma generate
npx prisma migrate dev --name init
```

Run API:
```
npm run dev
```

The API runs at `http://localhost:5000`.

### 2) Frontend
```
cd frontend
cp .env.example .env
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## API Endpoints
- `/api/auth` register/login/logout, social login callbacks
- `/api/users` CRUD + profile + addresses
- `/api/products` CRUD + search + reviews
- `/api/categories` CRUD
- `/api/orders` create + manage orders
- `/api/payments` PayPal create/capture
- `/api/admin/analytics` sales analytics

## Database Schema
- Prisma schema: `backend/prisma/schema.prisma`
- SQL script: `backend/sql/schema.sql`

## Payments
PayPal requires:
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_ENV` (sandbox or live)

Frontend PayPal JS uses `VITE_PAYPAL_CLIENT_ID`.

## Email Notifications
Set SMTP values in `.env` to enable order confirmation emails. If SMTP is not set, email sends are skipped.

## Social Login
Set OAuth keys in `.env` for Google/Facebook/Twitter. The frontend uses:
- `GET /api/auth/google`
- `GET /api/auth/facebook`
- `GET /api/auth/twitter`

## Image Uploads
Product images are uploaded via `multipart/form-data` and stored locally in `backend/uploads/`. In production, switch to S3 or another object store.

## Tests
Backend:
```
cd backend
npm test
```

Frontend:
```
cd frontend
npm test
```

## Deployment (Vercel + PostgreSQL)
- Deploy frontend to Vercel, set `VITE_API_URL` and `VITE_PAYPAL_CLIENT_ID`.
- Deploy backend to a Node hosting provider Render and set environment variables.
- Point frontend to backend URL.
- Ensure PostgreSQL is reachable from backend.

## Notes
- Update CORS settings in `backend/src/app.js` if frontend URL changes.
- Update JWT secret before production.
- For production, add HTTPS, rate limits, and object storage for images.
- Initialize Git with `git init` and com
