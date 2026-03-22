# Vision Achiever

Vision Achiever is a productivity web app for planning goals, managing daily tasks, and tracking long-term progress.

The app is built with Next.js (App Router) and follows a Clean Architecture style, where business logic is separated from infrastructure details such as database, email, and auth providers.

## What The Website Does

Users can create an account, sign in with email/password or Google OAuth, organize goals by time horizon, and monitor progress through dashboard views and charts.

Core functionality:

- Authentication with Credentials and Google OAuth 2.0
- Email verification workflow for new accounts
- Goal and task management across multiple levels:
	- Long Term Goals
	- Mid Term Goals
	- Upcoming Responsibilities
	- Daily Tasks
- Dashboard with grouped task lists (today, upcoming, past)
- Task completion toggles that persist status updates
- Progress analytics (tasks completed and productivity charts)
- User settings for password changes, theme, language, and preferences
- Multi-language support (English, Vietnamese, Spanish, Chinese)

## Main User Flows

### 1. Register And Verify Email

1. User registers with email and password.
2. The system creates a verification token and sends a verification link.
3. User clicks the verification link and account is confirmed.
4. User can then sign in normally.

### 2. Sign In

- Credentials login checks email/password via server-side use cases.
- Google login uses NextAuth Google provider and redirects to dashboard.

### 3. Create And Organize Work

- Users create items under long-term goals, mid-term goals, upcoming responsibilities, and daily tasks.
- Users can filter and inspect tasks by category, completion status, and date rules.

### 4. Track Progress

- Progress page renders chart-based metrics.
- Dashboard shows actionable task lists and supports completion updates.

### 5. Manage Preferences

- Account email display
- Change password
- Theme toggle
- Language selection

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- NextAuth v5 beta (Credentials + Google)
- MongoDB + Mongoose
- Resend (email delivery)
- Recharts (analytics charts)
- Tailwind CSS + shadcn/ui style components

## Project Structure (High Level)

- `app/` route handlers, pages, and server actions
- `components/` UI and page composition
- `core/` entities, ports, and use cases (business logic)
- `infrastructure/` db, auth, email, repository implementations
- `composition/` use case factories and wiring
- `lib/` shared helpers and auth/email config

## Environment Variables

Create a `.env.local` file with required values:

```env
MONGO_URI=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# One of these base URL options must be set in production.
APP_URL=
# or NEXTAUTH_URL=
# or AUTH_URL=

OPENAI_API_KEY=
```

Notes:

- For Google OAuth, add redirect URI:
	- `https://your-domain.com/api/auth/callback/google`
	- `http://localhost:3000/api/auth/callback/google` (local)
- For Resend, verify your sending domain before sending to non-test recipients.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` start local development server
- `npm run build` production build
- `npm run start` run production build
- `npm run lint` run ESLint
- `npm run seed` seed development data
