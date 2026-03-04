# Implementation Plan

## CampusVoice — Step-by-Step Build Guide

| Field             | Detail                                          |
| ----------------- | ----------------------------------------------- |
| **Document Type** | Implementation Plan (Collaborative)             |
| **Created**       | February 24, 2026                               |
| **Package Manager**| pnpm                                           |
| **Approach**      | Chunk-by-chunk, iterative, working together     |
| **Related Docs**  | PRD - CampusVoice.md, MVP - CampusVoice.md     |

---

## How We Work

> We build this **one chunk at a time**. Each chunk is a self-contained piece that we can test and verify before moving on. No chunk depends on something we haven't built yet. Every chunk ends with a working state.

**Rules:**
1. Finish one chunk before starting the next
2. Test each chunk before moving on
3. If something breaks, we fix it before continuing
4. Keep commits small and meaningful

---

## Tech Stack (Confirmed)

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL 16 (hosted on **Supabase**) |
| ORM | Prisma |
| Images | Cloudinary |
| Auth | JWT (access + refresh tokens) |
| Validation | Zod |
| Package Manager | **pnpm** |
| Deployment | Vercel (frontend) + Render (backend) + Supabase (DB) |

---

## Project Structure Overview

```
campusvoice/
├── client/          → Next.js 14 frontend
├── server/          → Express.js backend
├── shared/          → Shared types & constants
├── .gitignore
├── pnpm-workspace.yaml
└── README.md
```

---

## Implementation Chunks

### Phase 1: Foundation (Chunks 1–3)

Everything we need before writing any feature code.

---

### Chunk 1 — Project Scaffolding & Monorepo Setup

**What we do:** Set up the monorepo, install core dependencies, configure TypeScript, Tailwind, and ESLint for both client and server.

**Tasks:**

| # | Task | Details |
|---|------|---------|
| 1.1 | Initialize monorepo | `pnpm init` at root, create `pnpm-workspace.yaml` |
| 1.2 | Scaffold Next.js client | `pnpm create next-app client` with TypeScript, Tailwind, App Router |
| 1.3 | Scaffold Express server | Manual setup: `server/` with TypeScript, ts-node-dev |
| 1.4 | Install shared dev tools | ESLint, Prettier config at root |
| 1.5 | Create shared package | `shared/` with types and constants used by both sides |
| 1.6 | Set up .gitignore | node_modules, .env, dist, .next, etc. |
| 1.7 | Create .env.example | All required environment variables with placeholder values |
| 1.8 | Verify both apps start | `pnpm dev` runs client on :3000 and server on :5000 |

**Dependencies to install:**

```bash
# Root
pnpm add -Dw typescript prettier eslint

# Client (client/)
# (created by create-next-app, then add:)
pnpm add -F client axios zod
pnpm add -DF client @types/node

# Server (server/)
pnpm add -F server express cors helmet dotenv jsonwebtoken bcryptjs zod
pnpm add -F server @prisma/client cloudinary multer nodemailer
pnpm add -DF server typescript ts-node-dev @types/express @types/cors
pnpm add -DF server @types/jsonwebtoken @types/bcryptjs @types/multer @types/nodemailer
pnpm add -DF server prisma
```

**Done when:** `pnpm dev` starts both apps, no errors, TypeScript compiles cleanly.

---

### Chunk 2 — Database Setup & Prisma Schema

**What we do:** Set up PostgreSQL on Supabase (free tier), connect Prisma, define the full schema, run the first migration, create the seed script.

**Tasks:**

| # | Task | Details |
|---|------|--------|
| 2.1 | Set up Supabase project | Create project at supabase.com, get connection strings (see setup guide below) |
| 2.2 | Initialize Prisma | `pnpm -F server prisma init` → generates `schema.prisma` |
| 2.3 | Define schema | All 5 tables: `feedback`, `admins`, `admin_responses`, `status_history`, `audit_logs` |
| 2.4 | Run first migration | `pnpm -F server prisma migrate dev --name init` |
| 2.5 | Create Prisma client singleton | `server/src/config/database.ts` |
| 2.6 | Write seed script | 20 realistic submissions, 3 admin accounts, sample responses |
| 2.7 | Run seed | `pnpm -F server prisma db seed` — verify data in Prisma Studio |

**Prisma Models (summary):**

```
feedback          → id, tracking_id, category, title, description, image_url, status, upvote_count, priority_score, assigned_dept, timestamps
admins            → id, username, display_name, password_hash, role, department, is_active, timestamps
admin_responses   → id, feedback_id, admin_id, response_text, status_changed_to, proof_image_url, expected_resolution, created_at
status_history    → id, feedback_id, admin_id, previous_status, new_status, comment, created_at
audit_logs        → id, admin_id, action, target_feedback_id, previous_value (Json), new_value (Json), created_at
```

**Supabase Setup Guide (Step-by-Step):**

```
Step 1: Go to https://supabase.com and sign up (use GitHub login — fastest)

Step 2: Click "New Project"
         → Organization: select your default org (or create one)
         → Project name: campusvoice
         → Database password: generate a strong one → SAVE THIS PASSWORD
         → Region: pick the closest to your users
         → Click "Create new project" → wait ~2 minutes

Step 3: Once ready, go to Project Settings → Database
         → Scroll to "Connection string" section
         → Select "URI" tab
         → You'll see two connection strings:

         Connection string (direct):
         postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres

         Connection pooler (Transaction mode):
         postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true

Step 4: Put them in your server/.env file:
         DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
         DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

         (Replace [password] with the password you saved in Step 2)

Step 5: In your schema.prisma, use both URLs:
         datasource db {
           provider  = "postgresql"
           url       = env("DATABASE_URL")
           directUrl = env("DIRECT_URL")
         }

Step 6: Run migrations:
         pnpm -F server prisma migrate dev --name init

Step 7: Verify in Supabase Dashboard → Table Editor → you should see your tables
```

**Why two URLs?**
- `DATABASE_URL` (port 6543) → goes through Supabase's connection pooler → used at runtime
- `DIRECT_URL` (port 5432) → direct connection → used by Prisma for migrations only

**Done when:** `prisma studio` opens and shows all tables with seed data. Tables also visible in Supabase Dashboard.

---

### Chunk 3 — Server Foundation (Express Base + Middleware)

**What we do:** Set up the Express server structure with all middleware, error handling, and a health check endpoint.

**Tasks:**

| # | Task | Details |
|---|------|---------|
| 3.1 | Create server entry | `server/src/index.ts` — Express app with CORS, helmet, JSON parsing |
| 3.2 | Environment config | `server/src/config/env.ts` — Zod-validated env variables |
| 3.3 | Error handler | `server/src/middleware/errorHandler.ts` — global error middleware |
| 3.4 | Rate limiter | `server/src/middleware/rateLimiter.ts` — express-rate-limit setup |
| 3.5 | Validation middleware | `server/src/middleware/validate.ts` — Zod schema validator |
| 3.6 | Logger utility | `server/src/utils/logger.ts` — structured console logging |
| 3.7 | Health check route | `GET /api/health` → `{ status: "ok", timestamp: "..." }` |
| 3.8 | Route structure | Create empty route files for feedback, admin, upload |

**Done when:** `GET http://localhost:5000/api/health` returns 200 with status "ok".

---

### Phase 2: Public Features (Chunks 4–8)

Everything students interact with — no auth required.

---

### Chunk 4 — Submit Feedback (Backend)

**What we do:** Build the submission API endpoint with validation, tracking ID generation, and zero PII storage.

**Tasks:**

| # | Task | Details |
|---|------|---------|
| 4.1 | Tracking ID generator | `server/src/utils/trackingId.ts` — format: `#CV2026-0001` |
| 4.2 | Feedback Zod schema | `server/src/validators/feedback.schema.ts` — validate category, title (5-120), description (20-3000) |
| 4.3 | Feedback service | `server/src/services/feedback.service.ts` — `createFeedback()` |
| 4.4 | Feedback controller | `server/src/controllers/feedback.controller.ts` — handles request/response |
| 4.5 | Feedback routes | `POST /api/feedback` wired up with validation middleware |
| 4.6 | Priority score util | `server/src/utils/priorityScore.ts` — compute initial score on create |
| 4.7 | Test with Postman/curl | Submit a feedback, verify it appears in DB with correct tracking ID |

**API:**
```
POST /api/feedback
Body: { category, title, description, image_url? }
Returns: { success: true, data: { tracking_id: "#CV2026-0001", message: "..." } }
```

**Done when:** We can submit feedback via API and see it in the database with a tracking ID.

---

### Chunk 5 — List & View Feedback (Backend)

**What we do:** Build the public listing endpoint with pagination, filtering, search, and the single-feedback detail endpoint.

**Tasks:**

| # | Task | Details |
|---|------|---------|
| 5.1 | List endpoint | `GET /api/feedback` — paginated, filtered, searchable |
| 5.2 | Query builder | Build dynamic Prisma query from query params (category, status, sort, search) |
| 5.3 | Pagination logic | Offset-based: `page`, `limit` (default 20, max 50) |
| 5.4 | Search implementation | Prisma `contains` on title + description (case-insensitive) |
| 5.5 | Detail endpoint | `GET /api/feedback/:trackingId` — includes responses + status history |
| 5.6 | Public stats endpoint | `GET /api/stats/public` — total submissions, resolved count, avg resolution time |
| 5.7 | Exclude spam | All public queries filter out `status: 'spam'` |

**Done when:** We can list, filter, search, and view individual feedback items via API.

---

### Chunk 6 — Upvote System (Backend)

**What we do:** Build the upvote endpoint with rate limiting.

**Tasks:**

| # | Task | Details |
|---|------|---------|
| 6.1 | Upvote endpoint | `POST /api/feedback/:id/upvote` |
| 6.2 | Increment logic | Atomic `upvote_count` increment in Prisma |
| 6.3 | Recalculate priority | Update `priority_score` after upvote |
| 6.4 | Rate limiting | 10 upvotes per minute per IP (IP used for rate limit only, not stored) |

**Done when:** Upvoting increments the count, priority score updates, rate limit enforced.

---

### Chunk 7 — Landing Page & Submission Form (Frontend)

**What we do:** Build the first frontend pages — landing page and submission form with confirmation.

**Tasks:**

| # | Task | Details |
|---|------|---------|
| 7.1 | Install shadcn/ui | `pnpm dlx shadcn-ui@latest init` in client, add needed components |
| 7.2 | API client | `client/lib/api.ts` — axios instance pointed at backend |
| 7.3 | Constants file | `client/lib/constants.ts` — categories, statuses, colors |
| 7.4 | Public layout | `client/app/(public)/layout.tsx` — nav bar with logo, links |
| 7.5 | Landing page | Hero section, CTA buttons, live stats counter, trust badges |
| 7.6 | Submission form page | Category cards, title input, description textarea, image upload zone |
| 7.7 | Form validation | Client-side Zod validation matching server schemas |
| 7.8 | Confirmation view | Show tracking ID with copy button after successful submission |
| 7.9 | Responsive pass | Test on 320px, 768px, 1024px, 1440px |

**shadcn components needed:** Button, Input, Textarea, Select, Card, Badge, Toast

**Done when:** Student can fill out the form, submit, and see their tracking ID. Landing page shows live stats.

---

### Chunk 8 — Public Board & Detail Page (Frontend)

**What we do:** Build the public feedback board with cards, filters, search, upvoting, and the detail page.

**Tasks:**

| # | Task | Details |
|---|------|---------|
| 8.1 | FeedbackCard component | Card showing: tracking ID, category icon, title, snippet, status badge, upvotes, time |
| 8.2 | StatusBadge component | Color-coded badge for each status |
| 8.3 | FilterChips component | Category + status filter chips (toggle select) |
| 8.4 | SearchBar component | Debounced search input (300ms) |
| 8.5 | Board page | Grid layout (2 col desktop, 1 col mobile), infinite scroll or "Load More" |
| 8.6 | UpvoteButton component | Optimistic UI, localStorage to track voted items |
| 8.7 | Detail page | Full submission view, admin response thread, status timeline |
| 8.8 | StatusTimeline component | Vertical timeline showing all status changes with dates/comments |
| 8.9 | Tracking lookup page | Input field to enter tracking ID, redirects to detail view |

**Done when:** Board displays all feedback, filters/search work, upvoting works, detail page shows full info, tracking lookup works.

---

### Phase 3: Admin Features (Chunks 9–13)

Everything behind the admin login.

---

### Chunk 9 — Admin Authentication (Backend)

**What we do:** Build login, JWT issuance, refresh token flow, and auth middleware.

**Tasks:**

| # | Task | Details |
|---|------|---------|
| 9.1 | Auth service | `server/src/services/auth.service.ts` — login, verify, refresh |
| 9.2 | Password hashing | bcryptjs with cost factor 12 |
| 9.3 | JWT generation | Access token (15min) + refresh token (7 days, httpOnly cookie) |
| 9.4 | Auth middleware | `server/src/middleware/auth.middleware.ts` — verify access token |
| 9.5 | RBAC middleware | `server/src/middleware/rbac.middleware.ts` — check role permissions |
| 9.6 | Login endpoint | `POST /api/admin/login` — returns access token + sets refresh cookie |
| 9.7 | Refresh endpoint | `POST /api/admin/refresh` — issue new access token |
| 9.8 | Logout endpoint | `POST /api/admin/logout` — clear refresh cookie |
| 9.9 | Login rate limiting | 5 attempts per 15 minutes per IP |

**Done when:** Admin can login, get tokens, refresh, and logout. Protected routes reject unauthenticated requests.

---

### Chunk 10 — Admin Feedback Management (Backend)

**What we do:** Build admin endpoints for viewing, updating status, assigning departments, and marking spam.

**Tasks:**

| # | Task | Details |
|---|------|---------|
| 10.1 | Admin feedback list | `GET /api/admin/feedback` — includes spam, sortable by priority |
| 10.2 | Status update | `PATCH /api/admin/feedback/:id/status` — mandatory comment, updates `status_history` |
| 10.3 | Department assignment | `PATCH /api/admin/feedback/:id/assign` — super admin only |
| 10.4 | Spam flagging | `PATCH /api/admin/feedback/:id/spam` — hides from public board |
| 10.5 | Audit logging | Log every admin action to `audit_logs` table |
| 10.6 | Department scoping | Department admins only see feedback assigned to their department |

**Done when:** All admin feedback management endpoints work with proper auth, RBAC, and audit logging.

---

### Chunk 11 — Admin Response System & Analytics (Backend)

**What we do:** Build the response endpoint and basic analytics.

**Tasks:**

| # | Task | Details |
|---|------|---------|
| 11.1 | Add response endpoint | `POST /api/admin/feedback/:id/response` — text + optional proof image |
| 11.2 | Response validation | Zod schema: response_text (20-2000), proof_image_url (optional), expected_resolution (optional date) |
| 11.3 | Analytics endpoint | `GET /api/admin/analytics` — total, resolution rate, avg time, pending >7 days, category breakdown, top 5 unresolved |
| 11.4 | Analytics service | `server/src/services/analytics.service.ts` — query functions |
| 11.5 | Department-scoped analytics | Filter analytics by department for department admins |

**Done when:** Admin can respond to feedback and view analytics data via API.

---

### Chunk 12 — Admin User Management (Backend)

**What we do:** Super admin CRUD for admin accounts.

**Tasks:**

| # | Task | Details |
|---|------|---------|
| 12.1 | List admins | `GET /api/admin/users` — super admin only |
| 12.2 | Create admin | `POST /api/admin/users` — username, display_name, password, role, department |
| 12.3 | Update admin | `PATCH /api/admin/users/:id` — edit details, optional password reset |
| 12.4 | Delete admin | `DELETE /api/admin/users/:id` — soft delete (set `is_active: false`) |
| 12.5 | Validation schemas | Zod schemas for create/update admin |

**Done when:** Super admin can create, view, edit, and deactivate admin accounts via API.

---

### Chunk 13 — Admin Dashboard (Frontend)

**What we do:** Build all admin frontend pages — login, dashboard, feedback management, responses, analytics, user management.

**Tasks:**

| # | Task | Details |
|---|------|---------|
| 13.1 | Auth context | `client/hooks/useAuth.ts` — login state, token management, auto-refresh |
| 13.2 | Admin login page | Username/password form, error states, redirect to dashboard |
| 13.3 | Admin layout | Sidebar navigation, header with user info, protected route wrapper |
| 13.4 | Feedback table | Sortable/filterable table with all columns, click to expand |
| 13.5 | Status change modal | Status dropdown + mandatory comment textarea |
| 13.6 | Response form | Text input + proof image upload + expected resolution date |
| 13.7 | Department assign UI | Dropdown to assign department (super admin) |
| 13.8 | Spam/bulk actions | Checkbox select + action buttons |
| 13.9 | Analytics page | Summary cards (total, rate, avg time, overdue) + top 5 unresolved list + category breakdown |
| 13.10 | User management page | Admin table + create/edit modal + delete confirmation (super admin only) |

**shadcn components needed:** Table, Dialog, DropdownMenu, Tabs, Avatar, Separator, AlertDialog

**Done when:** Full admin dashboard is functional — login, manage feedback, respond, view analytics, manage users.

---

### Phase 4: Polish & Deploy (Chunks 14–16)

Make it production-ready.

---

### Chunk 14 — Image Upload Pipeline

**What we do:** Set up Cloudinary integration for submission evidence photos and admin proof images.

**Tasks:**

| # | Task | Details |
|---|------|---------|
| 14.1 | Cloudinary config | `server/src/config/cloudinary.ts` — initialize with env vars |
| 14.2 | Upload endpoint | `POST /api/upload` — multer for file handling, cloudinary upload |
| 14.3 | EXIF stripping | Strip metadata before upload (sharp or cloudinary transformation) |
| 14.4 | File validation | Magic bytes check (not just extension), max 5MB, JPEG/PNG/WebP only |
| 14.5 | Frontend upload component | Drag-and-drop zone with preview, progress indicator, remove button |
| 14.6 | Wire into forms | Connect upload component to submission form and admin response form |

**Done when:** Images upload to Cloudinary, EXIF is stripped, previews work in both forms.

---

### Chunk 15 — Error Handling, Loading States & Edge Cases

**What we do:** Handle every error state, loading state, and edge case across the entire app.

**Tasks:**

| # | Task | Details |
|---|------|---------|
| 15.1 | API error responses | Consistent error format everywhere: `{ success: false, error: { code, message, details? } }` |
| 15.2 | Frontend error boundaries | React error boundary wrapping main sections |
| 15.3 | Loading skeletons | Skeleton cards on board, skeleton rows on admin table |
| 15.4 | Empty states | "No results" illustrations for board, admin table, analytics |
| 15.5 | Toast notifications | Success/error toasts for all actions (submit, upvote, status change, response) |
| 15.6 | 404 page | Custom not-found page |
| 15.7 | Form error states | Field-level validation errors displayed inline |
| 15.8 | Network error handling | Retry logic for failed API calls, offline indicator |
| 15.9 | Token expiry handling | Auto-refresh, redirect to login if refresh fails |

**Done when:** No blank screens, no unhandled errors, every state has appropriate UI.

---

### Chunk 16 — Deployment & Go-Live

**What we do:** Deploy the full application to production, configure domains, verify everything works.

**Tasks:**

| # | Task | Details |
|---|------|---------|
| 16.1 | Supabase: Already set up | Same Supabase project works for production (free tier) |
| 16.2 | Render: Deploy backend | Connect GitHub repo, set env vars (including Supabase URLs), configure build command |
| 16.3 | Vercel: Deploy frontend | Connect GitHub repo, set `NEXT_PUBLIC_API_URL` |
| 16.4 | Run migrations in prod | `prisma migrate deploy` (Supabase DB already connected) |
| 16.5 | Seed production data | Run seed for super admin + demo data |
| 16.6 | Configure CORS | Set allowed origin to Vercel domain |
| 16.7 | Verify all flows | Submit, board, track, admin login, status change, response |
| 16.8 | Custom domain (optional) | Point domain to Vercel, update CORS |
| 16.9 | SEO meta tags | Open Graph tags for public pages |
| 16.10 | README | Setup instructions, env vars, architecture overview |

**Build commands:**
```bash
# Backend (Render)
Build:  pnpm install && pnpm -F server prisma generate && pnpm -F server build
Start:  pnpm -F server start

# Frontend (Vercel)
Build:  pnpm install && pnpm -F client build
```

**Done when:** App is live on public URL, all flows work, super admin can log in.

---

## Chunk Dependency Graph

```
Chunk 1 (Scaffolding)
  └── Chunk 2 (Database)
       └── Chunk 3 (Server Foundation)
            ├── Chunk 4 (Submit API) ──────┐
            │    └── Chunk 5 (List API)    │
            │         └── Chunk 6 (Upvote) │
            │                              │
            │   Chunk 7 (Landing + Form) ◄─┘
            │    └── Chunk 8 (Board + Detail)
            │
            ├── Chunk 9 (Admin Auth)
            │    └── Chunk 10 (Admin Feedback API)
            │         └── Chunk 11 (Response + Analytics API)
            │              └── Chunk 12 (User Mgmt API)
            │                   └── Chunk 13 (Admin Frontend)
            │
            └── Chunk 14 (Image Upload)
                 └── Chunk 15 (Polish)
                      └── Chunk 16 (Deploy)
```

---

## Estimated Timeline

| Chunk | Description | Estimated Time | Cumulative |
|:-----:|-------------|:--------------:|:----------:|
| 1 | Scaffolding & Monorepo | 3-4 hours | Day 1 |
| 2 | Database & Prisma | 3-4 hours | Day 1-2 |
| 3 | Server Foundation | 2-3 hours | Day 2 |
| 4 | Submit API | 3-4 hours | Day 3 |
| 5 | List & View API | 3-4 hours | Day 3-4 |
| 6 | Upvote API | 1-2 hours | Day 4 |
| 7 | Landing + Form (FE) | 5-6 hours | Day 5-6 |
| 8 | Board + Detail (FE) | 6-7 hours | Day 7-8 |
| 9 | Admin Auth | 4-5 hours | Day 9 |
| 10 | Admin Feedback Mgmt | 3-4 hours | Day 10 |
| 11 | Response + Analytics | 3-4 hours | Day 10-11 |
| 12 | User Management | 2-3 hours | Day 11 |
| 13 | Admin Frontend | 8-10 hours | Day 12-14 |
| 14 | Image Upload | 3-4 hours | Day 15 |
| 15 | Polish & Edge Cases | 4-5 hours | Day 16 |
| 16 | Deployment | 3-4 hours | Day 17 |
| | **Total** | **~55-70 hours** | **~17 working days** |

---

## Key Commands Reference

```bash
# Start both apps (from root)
pnpm dev

# Run only client
pnpm -F client dev

# Run only server
pnpm -F server dev

# Database operations
pnpm -F server prisma studio          # Open visual DB editor
pnpm -F server prisma migrate dev     # Create & run migration
pnpm -F server prisma db seed         # Run seed script
pnpm -F server prisma generate        # Regenerate client after schema change

# Add a dependency
pnpm add -F client <package>          # Add to client
pnpm add -F server <package>          # Add to server
pnpm add -Dw <package>                # Add dev dep to root

# shadcn/ui (run from client/)
pnpm dlx shadcn-ui@latest add button  # Add a component

# Build for production
pnpm -F client build
pnpm -F server build
```

---

## Ready to Start

**Next step:** Chunk 1 — Project Scaffolding & Monorepo Setup.

When you're ready, we start building. One chunk at a time.

---

*Implementation Plan — CampusVoice — February 2026*
