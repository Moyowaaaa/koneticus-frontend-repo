# Kollabs Frontend — Comprehensive Documentation

> **Last Updated:** April 2026
> **Version:** 0.1.0
> **Repository:** `Kollabs-frontend-repo`

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture & Directory Structure](#3-architecture--directory-structure)
4. [Environment & Configuration](#4-environment--configuration)
5. [Routing & Page Structure](#5-routing--page-structure)
6. [Authentication Flow](#6-authentication-flow)
7. [API Integration Layer](#7-api-integration-layer)
8. [State Management](#8-state-management)
9. [Component Architecture](#9-component-architecture)
10. [Form Handling & Validation](#10-form-handling--validation)
11. [Type System](#11-type-system)
12. [Styling & Theming](#12-styling--theming)
13. [Data Constants & Mock Data](#13-data-constants--mock-data)
14. [Route Protection](#14-route-protection)
15. [Coding Conventions](#15-coding-conventions)
16. [Integration with Backend](#16-integration-with-backend)
17. [Known Gaps & Future Work](#17-known-gaps--future-work)

---

## 1. Project Overview

The **Kollabs Frontend** is a modern single-page application that serves as the user interface for the Kollabs collaborative platform. It provides:

- A multi-step onboarding/signup experience
- A social-media-style feed of project ideas
- Project management (create, edit, delete)
- A messaging/chat interface (currently client-side only)
- User settings and profile management
- Dark/light theme support

The frontend communicates with the Kollabs Backend API (`Express.js`) for all data persistence, authentication, and business logic.

---

## 2. Technology Stack

| Layer                | Technology                    | Version    | Purpose                                    |
|----------------------|-------------------------------|------------|--------------------------------------------|
| **Framework**        | Next.js (App Router)          | 16.0.10    | React framework with SSR/RSC               |
| **UI Library**       | React                         | 19.2.0     | Component library                          |
| **Language**         | TypeScript                    | ^5         | Type-safe development                      |
| **Styling**          | TailwindCSS                   | ^4         | Utility-first CSS                          |
| **UI Components**    | Radix UI + shadcn/ui          | Various    | Accessible, composable primitives          |
| **State Management** | Zustand                       | ^5.0.8     | Lightweight global state                   |
| **Server State**     | TanStack React Query          | ^5.90.17   | Data fetching, caching, synchronization    |
| **HTTP Client**      | Axios                         | ^1.13.2    | API requests with interceptors             |
| **Forms**            | React Hook Form               | ^7.66.0    | Performant form management                 |
| **Validation**       | Zod                           | ^4.3.5     | Schema-based validation                    |
| **Form Integration** | @hookform/resolvers           | ^5.2.2     | Connects Zod schemas to React Hook Form    |
| **Animations**       | GSAP                          | ^3.13.0    | High-performance animations                |
| **Icons**            | Lucide React + Iconsax        | Various    | Icon libraries                             |
| **Date Utils**       | date-fns                      | ^4.1.0     | Date formatting and manipulation           |
| **Toasts**           | Sonner                        | ^2.0.7     | Toast notifications                        |
| **Themes**           | next-themes                   | ^0.4.6     | Dark/light mode                            |
| **Drawers**          | Vaul                          | ^1.1.2     | Mobile-friendly drawer component           |
| **Cookies**          | Nookies                       | ^2.5.2     | Cookie management for SSR                  |
| **Dev Tooling**      | ESLint, Husky, lint-staged    | Various    | Code quality and git hooks                 |

---

## 3. Architecture & Directory Structure

The frontend uses **Next.js App Router** with a clear separation of concerns across directories.

```
Kollabs-frontend-repo/
├── .husky/                       # Git hooks
├── .vscode/                      # VS Code settings
├── animations/                   # GSAP animation configs
├── api/                          # ★ API integration layer
│   ├── appConfig/
│   │   └── index.ts              # Axios instance, response types
│   ├── auth/
│   │   ├── auth.model.ts         # Auth request/response types
│   │   └── auth.mutations.ts     # Auth mutations (login, signup, etc.)
│   ├── feed/
│   │   ├── feed.model.ts         # Feed item types
│   │   └── feed.queries.ts       # Feed queries (infinite scroll, trending)
│   └── projects/
│       ├── projects.model.ts     # Project request/response types
│       ├── projects.queries.ts   # Project queries (user, single, infinite)
│       └── project.mutations.ts  # Project mutations (create, delete)
├── app/                          # ★ Next.js App Router pages
│   ├── layout.tsx                # Root layout (providers, globals)
│   ├── page.tsx                  # Landing page (/)
│   ├── globals.css               # Global styles + Tailwind
│   ├── auth/                     # Authentication pages
│   │   ├── layout.tsx            # Auth layout (split-screen)
│   │   ├── log-in/
│   │   ├── sign-up/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   └── verify-email/
│   ├── create-account/           # Account creation flow
│   └── dashboard/                # Authenticated dashboard
│       ├── layout.tsx            # Dashboard layout (sidebar + topbar)
│       ├── page.tsx              # Feed page (default dashboard view)
│       ├── ideas/                # Ideas management
│       ├── projects/             # Projects management
│       │   ├── page.tsx          # Projects listing
│       │   └── ongoing/          # Ongoing projects view
│       ├── messages/             # Messaging interface
│       └── settings/             # User settings
├── components/                   # ★ Reusable components
│   ├── auth/                     # Auth form components (5 items)
│   ├── chat/                     # Chat interface components (3 items)
│   ├── dashboard/                # Dashboard components
│   │   ├── feed/                 # Feed cards, lists, empty states (9 items)
│   │   ├── ideas/                # Ideas management components (2 items)
│   │   ├── modals/               # Modal dialogs (5 items)
│   │   ├── ongoing-projects/     # Ongoing project views (1 item)
│   │   ├── pending-projects/     # Pending project views
│   │   └── projects/             # Project cards, lists (3 items)
│   ├── layer/                    # Provider wrappers
│   │   └── QueryProvider.tsx     # TanStack Query provider
│   ├── messages/                 # Message components (9 items)
│   ├── navigation/               # Nav components
│   │   ├── sidebar.tsx           # Dashboard sidebar
│   │   └── topbar.tsx            # Top navigation bar
│   ├── onboarding/               # Signup onboarding steps (4 items)
│   ├── settings/                 # Settings page components (6 items)
│   ├── ui/                       # shadcn/ui primitives (18 items)
│   └── ui-components/            # Custom shared UI (10 items)
├── hooks/                        # Custom React hooks
├── lib/                          # Utility libraries
├── public/                       # Static assets (36 items)
├── schemas/                      # Zod validation schemas
│   └── auth.ts                   # Auth form validation schemas
├── store/                        # ★ Zustand state stores
│   ├── useAuthStore.ts           # Auth state (user, token)
│   ├── useChatStore.ts           # Chat/messaging state
│   ├── useDummyStore.ts          # Dummy data helpers
│   ├── useEditIdeaModalStore.ts  # Edit idea modal state
│   ├── useFeedStore.ts           # Feed items state (with dummy data)
│   ├── useGeneralStateStore.ts   # Global modal toggles
│   ├── useIdeaStore.ts           # Ideas CRUD state (with dummy data)
│   ├── useOnBoardingStore.ts     # Onboarding form state
│   ├── useProfileModalStore.ts   # Profile modal state
│   ├── useSearchStore.ts         # Search state
│   └── useThemeStore.ts          # Theme preference
├── types/                        # TypeScript type definitions
│   ├── index.ts                  # Core types (User, Project, Collaborator)
│   ├── data.ts                   # Constants, mock data, role suggestions
│   └── chat.ts                   # Chat message types
├── utils/                        # Utility functions
├── proxy.ts                      # Route protection middleware
├── package.json                  # Dependencies and scripts
├── next.config.ts                # Next.js configuration
├── tailwind.config.js            # TailwindCSS configuration
├── tsconfig.json                 # TypeScript configuration
└── components.json               # shadcn/ui configuration
```

---

## 4. Environment & Configuration

### Next.js Config (`next.config.ts`)

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "res.cloudinary.com",  // Allows Cloudinary images
    }],
  },
};
```

### API Base URL

Currently **hardcoded** in `api/appConfig/index.ts`:

```typescript
const apiHttp = axios.create({
  baseURL: "http://localhost:4000/v1/api",  // ⚠️ Should use env variable
  withCredentials: true,  // Sends cookies with every request
});
```

**Should be:** `process.env.NEXT_PUBLIC_API_BASE_URL`

### shadcn/ui Config (`components.json`)

Configures component generation paths, Tailwind CSS variables, and import aliases.

### Scripts

| Command         | Description                           |
|-----------------|---------------------------------------|
| `npm run dev`   | Start Next.js development server      |
| `npm run build` | Production build                      |
| `npm run start` | Start production server               |
| `npm run lint`  | Run ESLint                            |

---

## 5. Routing & Page Structure

### Route Map

```
/                           → Landing page
/auth/
  ├── log-in/               → Login page
  ├── sign-up/              → Multi-step signup (with onboarding)
  ├── forgot-password/      → Forgot password form
  ├── reset-password/[token]→ Reset password with token
  └── verify-email/[token]  → Email verification
/create-account/            → Account creation (separate from signup)
/dashboard/                 → Main feed (default view)
  ├── ideas/                → Ideas management
  ├── projects/             → User's projects
  │   └── ongoing/          → Ongoing projects detail
  ├── messages/             → Chat/messaging interface
  └── settings/             → User settings
```

### Layout Hierarchy

```
RootLayout (app/layout.tsx)
├── QueryProvider (TanStack React Query)
│   └── ThemeProvider (next-themes)
│       ├── Toaster (Sonner — top-center, max 1)
│       ├── NavigationProgressBar
│       ├── NewIdeaModal (global)
│       ├── ShowInterestModal (global)
│       └── {children}
│
├── AuthLayout (app/auth/layout.tsx)
│   └── Split-screen layout (form + branding)
│
└── DashboardLayout (app/dashboard/layout.tsx)
    ├── TopNavBar (fixed top)
    ├── Sidebar (fixed left, 16rem, hidden on mobile)
    ├── Main content (flex-1)
    └── DashboardRightSidebar (right rail)
```

### Key Layout Details

**Root Layout** mounts global providers and modals that are accessible from any page:
- `QueryProvider` — wraps entire app with TanStack Query
- `ThemeProvider` — dark/light mode support
- `NewIdeaModal` and `ShowInterestModal` — global modals triggered from anywhere

**Dashboard Layout** provides the authenticated shell:
- Fixed sidebar (16rem width, hidden on mobile)
- Fixed top navigation bar
- Right sidebar for additional content
- Main content area occupies remaining space

---

## 6. Authentication Flow

### Signup (Multi-Step Onboarding)

The signup process is a **4-step wizard** managed by `useOnBoardingStore`:

```
Step 0: Email Capture
  ├── Email input
  ├── Email availability check (POST /auth/check-email)
  └── Social login buttons (Google, GitHub, Microsoft — UI only)

Step 1: Information
  ├── First name
  ├── Last name
  └── Password (8+ chars, uppercase, lowercase, special char)

Step 2: Roles
  └── Multi-select roles (suggestions: UI/UX Designer, Writer, Print Designer, 3D Artist, Illustrator)

Step 3: Profile
  ├── Bio (150 words max)
  ├── Profile picture upload (with preview)
  └── Portfolio links (GitHub, Behance, LinkedIn, Website)
```

**Step Titles:** Defined in `types/data.ts` as `STEP_TITLES = ["Information", "Roles", "Profile"]`

**On Submit:**
1. Collects all data from `useOnBoardingStore`
2. Calls `useRegisterUser()` mutation
3. Sends `multipart/form-data` with files
4. Redirects to email verification page

### Login

1. User enters email + password
2. `useLoginUser()` mutation fires `POST /auth/sign-in`
3. Backend returns user data + JWT token + sets httpOnly cookie
4. Frontend stores user + token in `useAuthStore` (persisted to localStorage)
5. Redirects to dashboard

### Auth State (`useAuthStore`)

```typescript
interface AuthState {
  user: ILoginUserData | null;    // { _id, email, firstname, lastname, roles, profilePicture, ... }
  token: string | null;            // JWT token (also in httpOnly cookie)
  isAuthenticated: boolean;
  setAuth: (user, token) => void;
  clearAuth: () => void;
}
```

- **Persisted** to `localStorage` via Zustand `persist` middleware
- Key: `"auth-storage"`

### Password Reset Flow

```
Forgot Password → POST /auth/forgot-password → Email with reset link
                                                    ↓
Reset Password Page → /auth/reset-password/[token]
                   → POST /auth/reset-password/:token
                   → { newPassword, confirmPassword }
```

### Email Verification Flow

```
After Signup → Verification email sent
           → /auth/verify-email/[token]
           → GET /auth/verify-email/:token
           → Success → Redirect to login
```

---

## 7. API Integration Layer

### Axios Instance (`api/appConfig/index.ts`)

```typescript
const apiHttp = axios.create({
  baseURL: "http://localhost:4000/v1/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,  // ← Sends httpOnly cookies automatically
});
```

**Response Interceptor:**
- Catches 401 errors (currently commented out redirect)
- All errors are re-thrown via `Promise.reject(error)`

### Shared Response Types

```typescript
// Paginated cursor-based responses (used by feed)
interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
    limit: number;
  };
  fromCache?: boolean;
}

// Standard page-based pagination (used by projects)
interface ProjectsPagination {
  totalProjects: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}
```

### Query/Mutation Pattern

The API layer follows a consistent pattern using **TanStack React Query**:

```
api/<domain>/
├── <domain>.model.ts       # TypeScript interfaces for request/response shapes
├── <domain>.queries.ts     # useQuery / useInfiniteQuery hooks
└── <domain>.mutations.ts   # useMutation hooks
```

### Auth Mutations (`api/auth/auth.mutations.ts`)

| Hook                          | HTTP Method | Endpoint                        | Notes                         |
|-------------------------------|-------------|----------------------------------|-------------------------------|
| `useLoginUser()`              | POST        | `/auth/sign-in`                 | Returns user + token          |
| `useLogoutUser()`             | POST        | `/auth/logout`                  | Clears cookie                 |
| `useCheckEmail()`             | POST        | `/auth/check-email`             | Email availability check      |
| `useRegisterUser()`           | POST        | `/auth/sign-up`                 | Multipart form-data           |
| `useResendVerificationEmail()`| POST        | `/auth/resend-verification`     | Resend verify email           |
| `useVerifyEmail()`            | GET         | `/auth/verify-email/:token`     | Verify email token            |
| `useForgotPassword()`         | POST        | `/auth/forgot-password`         | Request reset link            |
| `useResetPassword()`          | POST        | `/auth/reset-password/:token`   | Reset with new password       |

### Project Queries (`api/projects/projects.queries.ts`)

| Hook                           | Type           | Endpoint                     | Notes                    |
|--------------------------------|----------------|------------------------------|--------------------------|
| `useGetUserProjects(page, limit)` | `useQuery`  | `/projects?page=&limit=`     | User's own projects      |
| `useGetInfiniteUserProjects(limit)` | `useInfiniteQuery` | `/projects?page=&limit=` | Infinite scroll      |
| `useGetProjectById(id)`       | `useQuery`     | `/projects/:id`              | Single project           |

**Query Keys:**
```typescript
projectsKeys = {
  all: ["projects"],
  userProjects: () => ["projects", "user"],
  singleProject: (id) => ["projects", id],
};
```

### Project Mutations (`api/projects/project.mutations.ts`)

| Hook                   | HTTP Method | Endpoint            | Notes                              |
|------------------------|-------------|---------------------|------------------------------------|
| `useCreateProject()`   | POST        | `/projects`         | Multipart form-data, invalidates feed + projects cache |
| `useDeleteProject(id)` | DELETE      | `/projects/:id`     | Invalidates all related caches     |

**Cache Invalidation on Success:**
Both mutations invalidate: `projectsKeys.all`, `feedKeys.all`, `feedKeys.list()`, `feedKeys.trending()`

### Feed Queries (`api/feed/feed.queries.ts`)

| Hook                       | Type             | Endpoint          | Notes                    |
|----------------------------|------------------|-------------------|--------------------------|
| `useGetFeed(limit)`        | `useQuery`       | `/feed`           | First page only          |
| `useGetInfiniteFeed(limit)`| `useInfiniteQuery` | `/feed?cursor=&limit=` | Cursor-based infinite scroll |
| `useGetTrendingFeed()`     | `useQuery`       | `/feed/trending`  | Trending projects        |

**Query Keys:**
```typescript
feedKeys = {
  all: ["feed"],
  list: () => ["feed", "list"],
  trending: () => ["feed", "trending"],
};
```

---

## 8. State Management

The frontend uses **Zustand** for client-side state. Each store is a separate file in `store/`.

### Store Overview

| Store                     | Persistence    | Purpose                                      |
|---------------------------|----------------|----------------------------------------------|
| `useAuthStore`            | localStorage   | User auth state (user, token, isAuthenticated) |
| `useFeedStore`            | localStorage   | Feed items (currently uses dummy data)         |
| `useIdeaStore`            | localStorage   | Ideas CRUD (currently uses dummy data)         |
| `useChatStore`            | localStorage   | Full messaging system (dummy data)             |
| `useOnBoardingStore`      | None (memory)  | Multi-step signup form state                   |
| `useGeneralStateStore`    | None (memory)  | Global modal visibility toggles                |
| `useThemeStore`           | localStorage   | Theme preference (dark/light)                  |
| `useSearchStore`          | None (memory)  | Search query and state                         |
| `useEditIdeaModalStore`   | None (memory)  | Edit idea modal state                          |
| `useProfileModalStore`    | None (memory)  | Profile modal state                            |
| `useDummyStore`           | None (memory)  | Dummy data helpers                             |

### Store Deep Dive

#### `useAuthStore` — Authentication State

```typescript
{
  user: ILoginUserData | null,
  token: string | null,
  isAuthenticated: boolean,
  setAuth(user, token),    // Called after login
  clearAuth(),             // Called on logout
}
```

- Persisted to `localStorage` with key `"auth-storage"`
- Token stored both here AND in httpOnly cookie

#### `useOnBoardingStore` — Signup Wizard State

```typescript
{
  user: {
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    role: string[],
    profileImageFile: File | null,
    profileImagePreview: string,
    bio: string,
    portfolio: { linkedin, github, behance, website },
  },
  // Individual setters for each field
  setEmail(), setPassword(), setFirstname(), setLastname(),
  setRole(), setProfileImage(), setBio(), setPortfolio(),
  setUser(),    // Bulk update
  resetUser(),  // Reset to initial state
}
```

- **Not persisted** — resets on page refresh (by design)
- Used across signup wizard steps to accumulate form data

#### `useGeneralStateStore` — Global Modal Toggles

```typescript
{
  showNewIdeaModal: boolean,
  setShowNewIdeaModal(), toggleNewIdeaModal(), resetNewIdeaModal(),

  showInterestModal: boolean,
  setShowShowInterestModal(), toggleShowInterestModal(), resetShowInterestModal(),
}
```

Controls the two global modals mounted in the root layout.

#### `useChatStore` — Messaging System

The most complex store (742 lines). Manages:

```typescript
{
  // Core data
  conversations: Conversation[],
  users: Record<string, ChatUser>,
  messages: Record<string, ChatMessage[]>,
  currentUserId: string,

  // UI state
  currentConversationId: string | null,
  otherParticipant: ChatUser | null,
  isMobileChatBoxOpened: boolean,

  // Search within chat
  isSearchActive: boolean,
  searchQuery: string,
  searchMatchIndex: number,
  searchMatchCount: number,

  // Actions
  setCurrentConversation(),
  markAsRead(),
  createConversation(),
  addMessage(),
  archiveConversation(),
  blockConversation(),
  deleteConversation(),
  acceptMessageRequest(),
  rejectMessageRequest(),
  // ... search actions
}
```

**Current State:** Entirely client-side with **dummy data**. No backend integration exists. Features message requests, archiving, blocking, search within conversations.

**Message Types:** `"text" | "post" | "attachment" | "proposal" | "system"`

#### `useFeedStore` — Feed State

```typescript
{
  feedItems: FeedItem[],    // Initialized with dummy data
  isLoading: boolean,
  setFeedItems(),
  setLoading(),
  addNewIdea(title, description, tags?, teamSize?, image?),
}
```

**Note:** This store contains **hardcoded dummy feed data** alongside the real TanStack Query-based `api/feed/feed.queries.ts`. The actual feed components should use the React Query hooks, not this store.

#### `useIdeaStore` — Ideas CRUD

```typescript
{
  ideas: ExtendedProject[],   // Initialized with dummy data
  isLoading: boolean,
  error: string | null,
  fetchIdeas(),               // Returns dummy data
  getIdeaById(id),
  addIdea(ideaPayload),
  updateIdea(id, updates),
  deleteIdea(id),
}
```

**Note:** Like `useFeedStore`, this uses **dummy data** and client-side CRUD. Should eventually be replaced with or backed by React Query hooks.

---

## 9. Component Architecture

### Component Categories

```
components/
├── auth/           → Login forms, signup steps, password reset forms
├── chat/           → Chat message bubbles, input, conversation list
├── dashboard/      → All dashboard-specific components
│   ├── feed/       → Feed card, feed list, empty state, loading
│   ├── ideas/      → Ideas listing, idea card
│   ├── modals/     → New post, show interest, edit, delete confirmation
│   ├── projects/   → Project cards, project list
│   ├── ongoing-projects/
│   └── pending-projects/
├── layer/          → Provider wrappers (QueryProvider)
├── messages/       → Full messaging interface (conversation list, chat view, etc.)
├── navigation/     → Sidebar, topbar
├── onboarding/     → Signup wizard step components
├── settings/       → Settings page sections
├── ui/             → shadcn/ui primitives (18 components)
└── ui-components/  → Custom shared UI components (10 items)
```

### UI Primitives (`components/ui/`)

These are **shadcn/ui** components — pre-styled Radix UI primitives:

| Component          | Radix Dependency                    |
|--------------------|-------------------------------------|
| Accordion          | `@radix-ui/react-accordion`         |
| Alert Dialog       | `@radix-ui/react-alert-dialog`      |
| Avatar             | `@radix-ui/react-avatar`            |
| Dialog             | `@radix-ui/react-dialog`            |
| Label              | `@radix-ui/react-label`             |
| Popover            | `@radix-ui/react-popover`           |
| Scroll Area        | `@radix-ui/react-scroll-area`       |
| Separator          | `@radix-ui/react-separator`         |
| Tabs               | `@radix-ui/react-tabs`              |
| Slot               | `@radix-ui/react-slot`              |

### Global Modals

Two modals are rendered globally in the root layout:

1. **`NewIdeaModal`** — Create a new project/idea
   - Triggered via `useGeneralStateStore.showNewIdeaModal`
   - Contains form for title, description, roles, team size, media

2. **`ShowInterestModal`** — Express interest in a project
   - Triggered via `useGeneralStateStore.showInterestModal`
   - For sending collaboration requests

### Dashboard Components

**Feed (`components/dashboard/feed/`):**
- Feed client (main container, uses React Query)
- Feed card (individual project/idea cards)
- Feed empty state
- Feed loading skeleton

**Projects (`components/dashboard/projects/`):**
- Project card
- Project list

**Modals (`components/dashboard/modals/`):**
- New post modal
- Show interest modal
- Edit modal
- Delete confirmation

---

## 10. Form Handling & Validation

### Stack

- **React Hook Form** — Form state management, field registration, submission
- **Zod** — Schema-based validation
- **@hookform/resolvers** — Bridges Zod schemas to React Hook Form

### Validation Schemas (`schemas/auth.ts`)

| Schema                   | Fields                          | Rules                                          |
|--------------------------|---------------------------------|------------------------------------------------|
| `loginSchema`            | email, password                 | Valid email, min 2 chars password               |
| `signupEmailSchema`      | email                           | Valid email                                    |
| `informationStepSchema`  | firstName, lastName, password   | Required names, strong password rules          |
| `roleStepSchema`         | roles                           | Array with min 1 role                          |
| `bioStepSchema`          | bio, profileImage, portfolio    | Bio ≤ 150 words, valid URLs for portfolio      |
| `fullOnboardingSchema`   | All signup fields combined      | Complete validation for final submission        |
| `newPasswordSchema`      | oldPassword, newPassword, confirmPassword | Strong password, passwords must match |

### Password Rules

```typescript
z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain uppercase letter")
  .regex(/[a-z]/, "Must contain lowercase letter")
  .regex(/[^A-Za-z0-9]/, "Must contain special character")
```

### Usage Pattern

```typescript
const form = useForm<loginSchemaType>({
  resolver: zodResolver(loginSchema),
  defaultValues: { email: "", password: "" },
});
```

---

## 11. Type System

### Core Types (`types/index.ts`)

```typescript
type user = {
  firstName: string;
  lastName: string;
  profile_photo: string;
  email: string;
  links: PortfolioLinks;
  bio?: string;
};

type PortfolioLinks = Record<"github" | "behance" | "linkedin" | "website", string>;

type SignUpFormData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roles: string[];
  bio: string;
  portfolio: PortfolioLinks;
  profileImageFile: File | null;
  profileImagePreview: string;
};

type ProjectStatus = "pending" | "ongoing";

type Project = {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  image: string;
  collaborators?: (string | Collaborator)[];
  createdAt: string;
  updatedAt: string;
};

type Collaborator = {
  firstName: string;
  lastName: string;
  email: string;
  role: "Creator" | "Collaborator";
  portfolio: PortfolioLinks;
};

type sideBarRoute = {
  title: string;
  icon: React.ElementType;
  route: string;
  comingSoon?: boolean;
};
```

### API Response Types

**Auth (`api/auth/auth.model.ts`):**
```typescript
interface ILoginUserData {
  _id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  roles?: string[];
  profilePicture?: string;
  isVerified?: boolean;
  isEmailVerified?: boolean;
}

interface IAuthResponse {
  message: string;
  data: { user: ILoginUserData };
  token: string;
}

interface ISignupPayload {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  roles: string[];
  bio?: string;
  links?: PortfolioLinks;
  image?: File | null;
  cv?: File | null;
  cvLinkedUrl?: string;
}
```

**Feed (`api/feed/feed.model.ts`):**
```typescript
interface FeedItem {
  _id: string;
  title: string;
  description: string;
  collaborators: FeedCollaborator[];
  media: FeedMedia[];
  status: string;
  teamSize: number;
  conversationId: string | null;
  author: FeedAuthor;           // Populated from backend
  requiredRoles?: string[];
  createdAt: string;
  updatedAt: string;
}

interface FeedAuthor {
  _id: string;
  email: string;
  userProfile: {
    _id: string;
    firstname: string;
    lastname: string;
    profilePicture?: FeedMedia;
    roles?: string[];
    bio?: string;
  };
}
```

**Projects (`api/projects/projects.model.ts`):**
```typescript
interface Project {
  _id: string;
  title: string;
  description: string;
  requiredRoles: string[];
  collaborators: string[];
  media: ProjectMedia[];
  status: "draft" | "pending" | "ongoing" | "completed" | "deleted" | "archived";
  teamSize: number;
  conversationId: string | null;
  author: string;
  createdAt: string;
  updatedAt: string;
}

interface ICreateProjectPayload {
  title: string;
  description: string;
  requiredRoles: string[];
  teamSize: number;
  media?: File[];
}
```

### Chat Types (`types/chat.ts`)

```typescript
interface ChatMessage {
  id: string | number;
  conversationId?: string;
  senderId: string | number;
  content?: string;       // HTML content
  text?: string;          // Plain text version
  timestamp: Date | string;
  type: "text" | "post" | "attachment" | "call" | "system";
  isRead?: boolean;
  isPinned?: boolean;
  isForwarded?: boolean;
  reactions?: Array<{ userId, emoji, type? }>;
}
```

---

## 12. Styling & Theming

### TailwindCSS v4

- Configuration in `tailwind.config.js`
- PostCSS via `@tailwindcss/postcss`
- Animation utilities via `tw-animate-css`
- Global styles in `app/globals.css`

### Design Tokens

CSS variables are used for theming (defined in `globals.css`):
- `--background`, `--foreground`
- `--primary`, `--secondary`, `--accent`
- `--muted`, `--destructive`
- `--border`, `--ring`
- `--sidebar-*` variants

### Theme Support

- **next-themes** provides system/dark/light toggle
- `ThemeProvider` wraps the entire app
- `useThemeStore` persists preference to localStorage

### Component Styling

- **shadcn/ui** components use `class-variance-authority` (CVA) for variant styles
- `clsx` + `tailwind-merge` for conditional class merging
- Utility: `cn()` function (likely in `lib/utils.ts`)

---

## 13. Data Constants & Mock Data

### Constants (`types/data.ts`)

```typescript
// Signup step titles
STEP_TITLES = ["Information", "Roles", "Profile"];
TOTAL_STEPS = 4;  // includes initial email step

// Social login providers (UI only — not functional)
SOCIAL_PROVIDERS = [
  { label: "Continue with Google", icon: "/images/google.svg" },
  { label: "Continue with Github", icon: "/images/github.svg" },
  { label: "Continue with Microsoft", icon: "/images/microsoft.svg" },
];

// Role suggestions for the role picker
ROLE_SUGGESTIONS = [
  "UI/UX Designer", "Writer", "Print Designer", "3D Artist", "Illustrator"
];

// Portfolio link fields
PORTFOLIO_FIELDS = [
  { key: "github", logo: "/images/github.svg" },
  { key: "behance", logo: "/images/behance.svg" },
  { key: "linkedin", logo: "/images/linkedin.svg" },
  { key: "website", logo: "/images/web.svg" },
];
```

### Mock/Dummy Data

Several stores contain embedded dummy data for development:

- **`useFeedStore`** — 3 dummy feed items + 3 dummy message feed items
- **`useIdeaStore`** — 3 dummy project ideas
- **`useChatStore`** — 6 dummy users, 5 conversations, multiple messages
- **`types/data.ts`** — `mockProjects[]`, `dummyUsers[]`

---

## 14. Route Protection

### Middleware (`proxy.ts`)

```typescript
export function proxy(req: NextRequest) {
  const authToken = req.cookies.get("authToken");
  const protectedRoutes = ["/dashboard", "/profile", "/settings"];

  if (!authToken && protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/auth/log-in", req.url));
  }

  return NextResponse.next();
}
```

**Note:** This file exists as `proxy.ts` but should be `middleware.ts` to work with Next.js middleware convention. It needs to be renamed and exported correctly for automatic route protection.

### Client-Side Auth Check

- `useAuthStore.isAuthenticated` used in components to conditionally render
- Axios interceptor catches 401 responses (redirect currently commented out)

---

## 15. Coding Conventions

### File Naming

- **Pages:** `page.tsx` (Next.js App Router convention)
- **Layouts:** `layout.tsx`
- **Components:** `kebab-case.tsx` (e.g., `feed-empty-state.tsx`, `dashboard-right-sidebar.tsx`)
- **Stores:** `camelCase` with `use` prefix (e.g., `useAuthStore.ts`)
- **API files:** `<domain>.queries.ts`, `<domain>.mutations.ts`, `<domain>.model.ts`
- **Types:** `index.ts` for core types, descriptive names for domain types

### Component Patterns

- **Functional components** only (no class components)
- **"use client"** directive for client components (stores, interactive UI)
- Server components by default (Next.js App Router)
- Props interfaces defined inline or in separate type files

### State Management Rules

- **Server state** (data from API) → TanStack React Query
- **Client state** (UI state, modals, form wizards) → Zustand
- **Form state** → React Hook Form
- **Persistent state** (auth, theme) → Zustand with `persist` middleware

### API Layer Rules

- **Queries** (GET) → `useQuery` / `useInfiniteQuery` in `*.queries.ts`
- **Mutations** (POST/PUT/DELETE) → `useMutation` in `*.mutations.ts`
- **Types** → `*.model.ts` (matching backend response shapes)
- **Cache invalidation** → On mutation success, invalidate related query keys

### Import Organization

```typescript
// 1. External packages
import { useQuery } from "@tanstack/react-query";
// 2. Internal API/lib
import apiHttp from "../appConfig";
// 3. Types
import { Project } from "./projects.model";
// 4. Components (in component files)
import FeedCard from "@/components/dashboard/feed/feed-card";
```

### Path Aliases

```typescript
// tsconfig.json paths
"@/*" → "./*"  // e.g., @/components/..., @/store/..., @/api/...
```

---

## 16. Integration with Backend

### Working Integrations

| Feature                     | Frontend Hook              | Backend Endpoint               | Status      |
|-----------------------------|----------------------------|---------------------------------|-------------|
| Login                       | `useLoginUser()`           | `POST /auth/sign-in`           | ✅ Working  |
| Logout                      | `useLogoutUser()`          | `POST /auth/sign-out`          | ✅ Working  |
| Signup                      | `useRegisterUser()`        | `POST /auth/sign-up`           | ✅ Working  |
| Check Email                 | `useCheckEmail()`          | `POST /auth/check-email`       | ✅ Working  |
| Verify Email                | `useVerifyEmail()`         | `GET /auth/verify-email/:token`| ✅ Working  |
| Resend Verification         | `useResendVerificationEmail()` | `POST /auth/resend-verification` | ✅ Working |
| Forgot Password             | `useForgotPassword()`      | `POST /auth/forgot-password`   | ✅ Working  |
| Reset Password              | `useResetPassword()`       | `POST /auth/reset-password/:token` | ✅ Working |
| Get User Projects           | `useGetUserProjects()`     | `GET /projects`                | ✅ Working  |
| Get Single Project          | `useGetProjectById()`      | `GET /projects/:id`            | ✅ Working  |
| Create Project              | `useCreateProject()`       | `POST /projects`               | ✅ Working  |
| Delete Project              | `useDeleteProject()`       | `DELETE /projects/:id`         | ✅ Working  |
| Get Feed                    | `useGetInfiniteFeed()`     | `GET /feed`                    | ✅ Working  |
| Get Trending Feed           | `useGetTrendingFeed()`     | `GET /feed/trending`           | ✅ Working  |

### Missing Frontend Integrations

| Feature                     | Backend Exists? | Frontend Hook Exists? | Notes                          |
|-----------------------------|-----------------|----------------------|--------------------------------|
| Get current user (me)       | ✅ `GET /user/me` | ❌ Not created      | No user query hook             |
| Update profile              | ✅ `PATCH /user/me` | ❌ Not created    | No profile update mutation     |
| Get user by ID              | ✅ `GET /user/:id` | ❌ Not created     | No public profile query        |
| Update project              | ✅ `PUT /PATCH /projects/:id` | ❌ Not created | No update mutation      |
| Update project status       | ✅ `PATCH /projects/:id/status` | ❌ Not created | No status mutation     |
| Archive project             | ✅ `PATCH /projects/:id/archive` | ❌ Not created | No archive mutation   |
| Search projects             | ✅ `GET /projects/search` | ❌ Not created   | No search query hook           |
| Submit collab request       | ✅ `POST .../requests` | ❌ Not created      | Show interest modal not connected |
| Get project requests        | ✅ `GET .../requests` | ❌ Not created       | No request inbox               |
| Get my sent requests        | ✅ `GET /my-requests` | ❌ Not created       | No sent requests view          |
| Accept/reject request       | ✅ `PATCH /:id/accept\|reject` | ❌ Not created | No request management UI |
| Messaging/Chat              | ❌ No backend   | ✅ Full UI (dummy)   | Chat store is client-only      |
| Notifications               | ❌ No backend   | ❌ No frontend       | Not started                    |

---

## 17. Known Gaps & Future Work

### Critical Gaps

| Category              | Issue                                                        | Priority |
|-----------------------|--------------------------------------------------------------|----------|
| **Environment**       | API base URL hardcoded to `localhost:4000`                    | 🔴 High |
| **Route Protection**  | `proxy.ts` should be `middleware.ts` for Next.js              | 🔴 High |
| **Dual State**        | `useFeedStore` and `useIdeaStore` have dummy data conflicting with React Query hooks | 🟡 Medium |
| **User Profile**      | No API hooks for `GET /user/me` or `PATCH /user/me`          | 🔴 High |
| **Collaboration**     | Show Interest modal not connected to backend                  | 🔴 High |
| **Project Updates**   | No mutation hooks for update/patch/archive/status             | 🟡 Medium |
| **Search**            | No query hook for `GET /projects/search`                      | 🟡 Medium |
| **Chat**              | Full UI exists but no backend — purely client-side dummy data | 🟡 Medium |
| **SEO**               | Metadata still says "Create Next App"                         | 🟢 Low  |
| **401 Handling**      | Axios interceptor redirect is commented out                   | 🟡 Medium |

### Recommendations

1. **Create `.env.local`** with `NEXT_PUBLIC_API_BASE_URL` and update `apiHttp`
2. **Rename `proxy.ts`** to `middleware.ts` for automatic Next.js route protection
3. **Remove or deprecate** `useFeedStore` and `useIdeaStore` dummy stores — use React Query hooks exclusively
4. **Create missing API hooks:**
   - `api/user/user.queries.ts` — `useGetMe()`, `useGetUserById()`
   - `api/user/user.mutations.ts` — `useUpdateProfile()`
   - `api/collaboration-requests/` — queries and mutations
   - `api/projects/` — update, archive, status mutations
5. **Connect ShowInterestModal** to collaboration request backend
6. **Build Request Inbox** component for project owners
7. **Add Error Boundaries** and 404 pages
8. **Update metadata** in root layout for proper SEO
9. **Add loading skeletons** consistently across pages
10. **Implement proper SSR** auth checks using server components where possible
