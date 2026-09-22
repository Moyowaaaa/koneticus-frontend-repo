# Kollabs Frontend

Web app for **Kollabs** (also branded as Koneticus) — a collaboration platform for creators. Users sign up, post ideas, search people and projects, send collaboration requests, chat, and receive realtime notifications.

The UI is Next.js (App Router) + React 19 + TypeScript. It talks to the [Kollabs backend](https://github.com/Moyowaaaa/Kollabs-backend-repo) over REST (`/v1/api`) and Socket.IO.

Longer architecture notes live in [`DOCUMENTATION.md`](./DOCUMENTATION.md). That file is a historical snapshot; prefer this README and the `api/` + `app/` trees for current behavior.

---

## Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, Radix / shadcn, Vaul |
| Language | TypeScript |
| Server state | TanStack React Query |
| Client state | Zustand |
| HTTP | Axios (`withCredentials`, cookie + Bearer) |
| Realtime | `socket.io-client` |
| Forms | React Hook Form + Zod |
| Theming | `next-themes` (light / dark) |
| Quality | ESLint, Husky, lint-staged, Vitest |

---

## Local setup

```bash
git clone https://github.com/Moyowaaaa/Kollabs-frontend-repo.git
cd Kollabs-frontend-repo
pnpm install   # or npm install
```

Create `.env.local` in the repo root (see [Environment](#environment)). Then:

```bash
pnpm dev       # http://localhost:3000
pnpm build
pnpm start
pnpm lint
pnpm test
```

Run the backend locally on port **4000** (see the backend README). In development the frontend hard-codes that origin when `NEXT_PUBLIC_NODE_ENV=development`.

---

## Environment

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_NODE_ENV` | Yes for local | Set to `development` to use `http://localhost:4000` |
| `NEXT_PUBLIC_API_BASE_URL` | Yes in non-dev | Axios base URL, including `/v1/api` |
| `NEXT_PUBLIC_SOCKET_URL` | Yes in non-dev | Socket.IO origin (same host as the API, no `/v1/api`) |
| `NEXT_PUBLIC_SITE_URL` | Yes in prod | Public origin for canonical URLs, Open Graph, sitemap, and robots. Falls back to `VERCEL_URL` or `http://localhost:3000` |

Example `.env.local` for local API:

```env
NEXT_PUBLIC_NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/v1/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000/
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Auth uses the `authToken` cookie and a stored Bearer token as fallback (needed when the UI and API are on different origins).

---

## App routes

| Path | Purpose |
| --- | --- |
| `/` | Landing |
| `/auth/log-in`, `/auth/sign-up` | Auth |
| `/auth/forgot-password`, `/auth/reset-password/[token]` | Password reset |
| `/auth/verify-email`, `/auth/verify-email/[token]` | Email verification |
| `/create-account/onboarding` | Post-signup profile onboarding |
| `/dashboard` | Idea feed + getting-started checklist |
| `/dashboard/ideas` | Authored ideas |
| `/dashboard/projects`, `/dashboard/projects/ongoing/[id]` | Project list and detail |
| `/dashboard/requests` | Collaboration request inbox |
| `/dashboard/messages` | DMs, groups, Kollaborations |
| `/dashboard/settings` | Profile and account |

---

## Product surface

- **Auth** — sign up/in, email verify, password reset
- **Feed** — chronological ideas, trending spotlight, recent messages
- **Projects** — create/edit/delete, status pipeline (`draft` → `seeking_collaborators` → `ongoing` → `completed`), collaborators
- **Collaboration** — show interest, owner review, request inbox
- **Search** — federated people + projects (modal)
- **Chat** — DMs and groups, attachments, polls, proposal messages, Socket.IO live updates
- **Notifications** — popover inbox, unread count, realtime `notification:new`
- **Getting started** — dashboard checklist (photo, roles, bio/portfolio, first idea, first request, first conversation). Dismissed per user in `localStorage`
- **Avatars** — `SafeImage` (`components/ui-components/safe-image.tsx`) uses `/images/generic-avatar.svg` when a URL is missing or fails to load

API modules live under `api/`: `auth`, `user`, `projects`, `feed`, `collaboration`, `chat`, `search`, `notifications`.

---

## Realtime

`lib/socket.ts` connects to the same origin as the HTTP API (`/socket.io`). Handshake auth is cookie `authToken` or `auth.token`.

| Event | Direction | Purpose |
| --- | --- | --- |
| `conversation:join` / `leave` | client → server | Room `conversation:{id}` |
| `chat:message` | server → room | New persisted message |
| `notification:new` | server → `user:{userId}` | New notification |

---

## Layout

```
api/            React Query hooks, Axios models
app/            App Router pages and layouts
components/     Feature UI (dashboard, messages, auth, settings)
hooks/          Shared hooks
lib/            Socket client and helpers
store/          Zustand (auth, chat, modals, search, onboarding)
schemas/        Zod schemas
public/         Static assets (including generic-avatar.svg)
```

---

## License

See `package.json` (private app, version `0.1.0`).
