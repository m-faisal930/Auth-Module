# Auth-Module

A compact authentication module built with Next.js (App Router) and MongoDB. It provides signup/login/logout, password reset (email via Resend), change-password, and a protected profile page. The project is intended as a drop-in auth example or a lightweight starting point for apps.

Deployed: https://auth-module-theta.vercel.app/

Key points
- Next.js (App Router) with Route Handlers for API endpoints.
- MongoDB using Mongoose (`lib/mongoose.ts`).
- Emails are sent using Resend (`resend` package) via `app/api/auth/send-email/route.ts`.
- JWT stored in a secure HttpOnly cookie for session handling.

Contents
- `app/` — pages and API route handlers (`app/api/auth/*/route.ts`).
- `lib/` — `mongoose.ts` connection helper.
- `models/` — `User.ts` Mongoose model.
- `context/` — `AuthContext.tsx` client-side auth state and helpers.
- `utils/` and `schemas/` — helpers and validation used by routes.

Quick start (dev)

1. Install dependencies

```bash
npm install
```

2. Set environment variables (example `.env.local`)

```
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
JWT_EXPIRY=7d             # optional, used for token expiry
RESEND_API_KEY=your-resend-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
MODE_ENV=development
```

Notes:
- The codebase uses `NEXT_PUBLIC_APP_URL` when generating password reset links (see `app/api/auth/send-email/route.ts`).
- Do not commit `.env.local` or any secrets to source control.

Scripts
- `npm run dev` — start development server
- `npm run build` — production build
- `npm run start` — start production server after build

Environment variables required by the app

- `MONGODB_URI` — MongoDB connection string used by `lib/mongoose.ts`.
- `JWT_SECRET` — secret used to sign JWT tokens and reset tokens.
- `JWT_EXPIRY` — (optional) token expiry like `7d`.
- `RESEND_API_KEY` — API key for Resend (email sending).
- `NEXT_PUBLIC_APP_URL` — base URL used to build links in emails (e.g. reset link).

API endpoints (app/api/auth)

- POST /api/auth/signup — create a new user (email, username, password)
- POST /api/auth/login — authenticate and set HttpOnly JWT cookie
- POST /api/auth/logout — clear auth cookie
- GET  /api/auth/me — return the currently authenticated user (reads cookie)
- POST /api/auth/send-email — send password reset email (generates JWT token and uses Resend)
- POST /api/auth/reset-password — verify token and set a new password
- POST /api/auth/change-password — change password for an authenticated user

How email reset works

- `POST /api/auth/send-email` looks up the user, signs a short-lived JWT (using `JWT_SECRET`), and sends a reset link built from `NEXT_PUBLIC_APP_URL` (e.g. `${NEXT_PUBLIC_APP_URL}/reset-password?token=...`) using Resend. The Resend client is created with `RESEND_API_KEY` in `app/api/auth/send-email/route.ts`.

Security notes

- JWTs are stored in HttpOnly cookies (see `app/api/auth/login/route.ts`).
- Passwords are hashed (bcrypt) before storing in the database.
- Never store secrets in the repository. Use environment variables in Vercel's dashboard for production.

Developer notes & next steps

- `lib/mongoose.ts` reuses the Mongoose connection during development to avoid reconnect warnings.
- Consider adding rate limiting (e.g. on login and send-email) and CAPTCHA to reduce abuse.
- Add tests for the API routes (signup/login/reset flows) and a smoke script to verify env + DB connectivity.

Troubleshooting

- Mongo connection errors: verify `MONGODB_URI` and network access to your cluster.
- Reset emails not sent: verify `RESEND_API_KEY` and check Resend dashboard for delivery errors; also ensure `NEXT_PUBLIC_APP_URL` is correct for links.

