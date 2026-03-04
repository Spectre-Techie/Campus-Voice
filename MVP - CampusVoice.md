# Minimum Viable Product (MVP) Specification

## CampusVoice — Anonymous Feedback & Accountability Platform

| Field              | Detail                                |
| ------------------ | ------------------------------------- |
| **Document Owner** | CampusVoice Product Team              |
| **Version**        | 1.0                                   |
| **Status**         | Approved for Development              |
| **Created**        | February 22, 2026                     |
| **Sprint Duration**| 6 weeks (3 × 2-week sprints)         |
| **Related PRD**    | PRD - CampusVoice v1.0               |

---

## Table of Contents

1. [MVP Philosophy](#1-mvp-philosophy)
2. [MVP Scope Definition](#2-mvp-scope-definition)
3. [Feature Breakdown by Sprint](#3-feature-breakdown-by-sprint)
4. [User Stories](#4-user-stories)
5. [Technical Specifications](#5-technical-specifications)
6. [API Contract](#6-api-contract)
7. [Database Schema (SQL)](#7-database-schema-sql)
8. [Frontend Page Specifications](#8-frontend-page-specifications)
9. [Development Environment Setup](#9-development-environment-setup)
10. [Testing Strategy](#10-testing-strategy)
11. [Deployment Plan](#11-deployment-plan)
12. [Cost Estimation](#12-cost-estimation)
13. [Post-MVP Roadmap](#13-post-mvp-roadmap)
14. [Acceptance Criteria Checklist](#14-acceptance-criteria-checklist)

---

## 1. MVP Philosophy

### 1.1 Guiding Principles

> **"Ship what proves the concept. Nothing more, nothing less."**

The CampusVoice MVP is designed to validate one core hypothesis:

> *"If students can submit feedback anonymously and see public administrative responses with status tracking, engagement and trust in institutional processes will measurably increase."*

Every feature included in this MVP directly supports that hypothesis. Features that enhance but don't prove it are deferred to v1.1+.

### 1.2 What MVP Is

| Included | Purpose |
|----------|---------|
| Anonymous submission (zero PII) | Proves students will share honest concerns |
| Public feedback board with statuses | Proves transparency drives engagement |
| Upvote system | Proves collective priority signaling works |
| Admin dashboard with response system | Proves administration will adopt the workflow |
| Tracking ID lookup | Proves submitters return to check progress |

### 1.3 What MVP Is NOT

| Excluded | Reason | Deferred To |
|----------|--------|-------------|
| Email notifications | Adds complexity without validating core hypothesis | v1.1 |
| Duplicate detection | Nice-to-have; manual moderation sufficient at launch scale | v1.1 |
| Analytics charts | Admin can query database; dashboards come later | v1.1 |
| Student satisfaction ratings | Requires resolved issues to exist first | v1.2 |
| CSV export | Low priority for validation | v1.2 |
| Dark mode | Cosmetic | v1.2 |
| Trending issues widget | Requires volume to be meaningful | v1.2 |

---

## 2. MVP Scope Definition

### 2.1 Feature Matrix

```
MVP Feature Map
═══════════════════════════════════════════════════

STUDENT-FACING (No Authentication)
┌─────────────────────────────────────────────────┐
│                                                  │
│  ▸ Landing Page                        Sprint 1 │
│    - Hero section with CTA                       │
│    - Live stats counter                          │
│    - Trust messaging                             │
│                                                  │
│  ▸ Anonymous Submission Form           Sprint 1 │
│    - Category selection (6 categories)           │
│    - Title + description fields                  │
│    - Photo upload (optional)                     │
│    - Tracking ID generation + display            │
│    - Zero PII collection                         │
│                                                  │
│  ▸ Public Feedback Board               Sprint 1 │
│    - Card-based layout                           │
│    - Filter by category & status                 │
│    - Sort: newest, most upvoted                  │
│    - Search by keyword                           │
│    - Infinite scroll pagination                  │
│                                                  │
│  ▸ Feedback Detail View                Sprint 1 │
│    - Full submission content                     │
│    - Admin response thread                       │
│    - Status history timeline                     │
│                                                  │
│  ▸ Upvote System                       Sprint 2 │
│    - One upvote per browser session              │
│    - Optimistic UI update                        │
│    - Rate limiting (server-side)                 │
│                                                  │
│  ▸ Tracking ID Lookup                  Sprint 2 │
│    - Enter ID → view your submission             │
│    - Status progress visualization               │
│                                                  │
└─────────────────────────────────────────────────┘

ADMIN-FACING (JWT Authentication)
┌─────────────────────────────────────────────────┐
│                                                  │
│  ▸ Admin Login                         Sprint 2 │
│    - Username/password authentication            │
│    - JWT access + refresh tokens                 │
│    - Login attempt rate limiting                 │
│                                                  │
│  ▸ Feedback Management Table           Sprint 2 │
│    - All submissions in sortable table           │
│    - Filter: status, category, date              │
│    - Sort: newest, priority, upvotes             │
│    - Search                                      │
│                                                  │
│  ▸ Status Management                   Sprint 2 │
│    - Change status (5 states + spam)             │
│    - Mandatory comment on status change          │
│    - Department assignment                       │
│                                                  │
│  ▸ Response System                     Sprint 3 │
│    - Add public text responses                   │
│    - Upload proof images                         │
│    - Set expected resolution date                │
│                                                  │
│  ▸ Admin User Management               Sprint 3 │
│    - Super Admin: create/edit/delete admins      │
│    - Role assignment (3 roles)                   │
│    - Department assignment                       │
│                                                  │
│  ▸ Analytics Summary (Basic)           Sprint 3 │
│    - Total submissions count                     │
│    - Resolution rate percentage                  │
│    - Average resolution time                     │
│    - Top 5 upvoted unresolved issues             │
│    - Category breakdown (numbers, no chart)      │
│                                                  │
└─────────────────────────────────────────────────┘
```

### 2.2 Sprint Timeline

```
Week 1-2: Sprint 1 — Foundation & Public Layer
Week 3-4: Sprint 2 — Interaction Layer & Admin Core
Week 5-6: Sprint 3 — Admin Features & Polish
```

---

## 3. Feature Breakdown by Sprint

### Sprint 1: Foundation & Public Layer (Weeks 1-2)

**Goal:** A student can submit feedback and see it on the public board.

| # | Task | Estimate | Priority |
|---|------|----------|----------|
| S1-01 | Project scaffolding (Next.js + Express + PostgreSQL + Prisma) | 4h | P0 |
| S1-02 | Database schema design & Prisma migration | 3h | P0 |
| S1-03 | API: `POST /api/feedback` — create submission | 4h | P0 |
| S1-04 | API: `GET /api/feedback` — list with pagination, filters, search | 6h | P0 |
| S1-05 | API: `GET /api/feedback/:trackingId` — single feedback detail | 2h | P0 |
| S1-06 | API: `GET /api/stats/public` — total/resolved counts | 2h | P1 |
| S1-07 | Cloudinary integration for image upload | 3h | P1 |
| S1-08 | Frontend: Landing page | 4h | P0 |
| S1-09 | Frontend: Submission form with validation | 6h | P0 |
| S1-10 | Frontend: Submission confirmation with tracking ID | 2h | P0 |
| S1-11 | Frontend: Public board (card layout, filters, search) | 8h | P0 |
| S1-12 | Frontend: Feedback detail page | 4h | P0 |
| S1-13 | Responsive design pass (mobile + desktop) | 4h | P0 |
| S1-14 | Seed database with 20 realistic submissions | 2h | P1 |
| | **Sprint 1 Total** | **54h** | |

**Sprint 1 Definition of Done:**
- [ ] Student can fill out and submit feedback form
- [ ] Tracking ID is generated and displayed
- [ ] Submission appears on public board within 30 seconds
- [ ] Board can be filtered by category and status
- [ ] Board can be searched by keyword
- [ ] Board shows paginated results (20 per page)
- [ ] Clicking a card shows full detail view
- [ ] Landing page displays live stats
- [ ] All pages are responsive (320px–1440px)
- [ ] No PII is stored in the database

---

### Sprint 2: Interaction Layer & Admin Core (Weeks 3-4)

**Goal:** Students can upvote and track; admins can log in and manage feedback.

| # | Task | Estimate | Priority |
|---|------|----------|----------|
| S2-01 | API: `POST /api/feedback/:id/upvote` with rate limiting | 3h | P0 |
| S2-02 | Frontend: Upvote button with optimistic UI | 3h | P0 |
| S2-03 | API: Admin authentication (login, refresh, logout) | 6h | P0 |
| S2-04 | JWT middleware + role-based access control | 4h | P0 |
| S2-05 | API: `GET /api/admin/feedback` — admin list view | 3h | P0 |
| S2-06 | API: `PATCH /api/admin/feedback/:id/status` — status change | 3h | P0 |
| S2-07 | API: `PATCH /api/admin/feedback/:id/assign` — dept assignment | 2h | P1 |
| S2-08 | API: `PATCH /api/admin/feedback/:id/spam` — spam flagging | 2h | P1 |
| S2-09 | Frontend: Tracking ID lookup page | 3h | P0 |
| S2-10 | Frontend: Admin login page | 3h | P0 |
| S2-11 | Frontend: Admin dashboard — feedback table | 8h | P0 |
| S2-12 | Frontend: Status change modal with mandatory comment | 3h | P0 |
| S2-13 | Frontend: Admin sidebar navigation | 2h | P0 |
| S2-14 | Priority score computation (background job or trigger) | 3h | P1 |
| S2-15 | Audit logging for admin actions | 3h | P1 |
| | **Sprint 2 Total** | **51h** | |

**Sprint 2 Definition of Done:**
- [ ] Students can upvote (1 per session, rate-limited)
- [ ] Upvote count updates instantly (optimistic)
- [ ] Student can enter tracking ID and see their submission's status
- [ ] Admin can log in with valid credentials
- [ ] Invalid login is rejected with proper error
- [ ] Admin sees all submissions in a sortable, filterable table
- [ ] Admin can change submission status with mandatory comment
- [ ] Status change is reflected on public board immediately
- [ ] Admin can assign submission to a department
- [ ] Admin can mark submission as spam (hidden from public)
- [ ] All admin actions are logged

---

### Sprint 3: Admin Responses, User Management & Polish (Weeks 5-6)

**Goal:** Admins can respond publicly; super admin manages users; platform is demo-ready.

| # | Task | Estimate | Priority |
|---|------|----------|----------|
| S3-01 | API: `POST /api/admin/feedback/:id/response` | 3h | P0 |
| S3-02 | API: Admin user CRUD (super admin only) | 4h | P0 |
| S3-03 | API: `GET /api/admin/analytics` — summary stats | 3h | P1 |
| S3-04 | Frontend: Admin response form (text + proof image) | 4h | P0 |
| S3-05 | Frontend: Response thread on public detail page | 3h | P0 |
| S3-06 | Frontend: Status history timeline on detail page | 3h | P0 |
| S3-07 | Frontend: Admin user management page | 5h | P0 |
| S3-08 | Frontend: Analytics summary cards (numbers, not charts) | 4h | P1 |
| S3-09 | Frontend: Top 5 upvoted unresolved list | 2h | P1 |
| S3-10 | EXIF metadata stripping on image upload | 2h | P1 |
| S3-11 | Error handling & loading states (all pages) | 4h | P0 |
| S3-12 | SEO meta tags + Open Graph for public pages | 2h | P2 |
| S3-13 | 404 page + error boundary | 1h | P1 |
| S3-14 | Seed data enhancement (varied statuses, responses, proofs) | 3h | P1 |
| S3-15 | End-to-end testing of all critical flows | 6h | P0 |
| S3-16 | Performance optimization (lazy loading, image optimization) | 3h | P1 |
| S3-17 | Deployment to production (Vercel + Render/Railway) | 4h | P0 |
| | **Sprint 3 Total** | **56h** | |

**Sprint 3 Definition of Done:**
- [ ] Admin can write and publish a response to any submission
- [ ] Response appears on public board detail view immediately
- [ ] Admin can attach proof images to responses
- [ ] Public detail page shows full status change timeline
- [ ] Super admin can create, edit, and delete admin accounts
- [ ] Super admin can assign roles and departments to admins
- [ ] Analytics page shows: total, resolution rate, avg time, top issues
- [ ] All error states are handled gracefully (no blank screens)
- [ ] Platform is deployed and accessible via public URL
- [ ] Demo seed data shows realistic before/after scenario

---

## 4. User Stories

### 4.1 Student User Stories

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| US-01 | As a student, I want to submit feedback without creating an account, so that I feel safe sharing honest concerns. | Form submits successfully; tracking ID displayed; no login/signup visible on submission page; database record has zero PII fields. |
| US-02 | As a student, I want to choose a category for my feedback, so that it reaches the right department. | Dropdown shows 6 categories; selection is required; category appears on the submission card on the board. |
| US-03 | As a student, I want to attach a photo to my submission, so that I can provide visual evidence. | File picker accepts JPEG/PNG/WebP up to 5MB; preview shown before submission; image visible on detail page. |
| US-04 | As a student, I want to receive a unique tracking ID after submission, so that I can check for updates later. | Tracking ID follows format `#CV{YEAR}-{XXXX}`; "Copy" button works; ID is unique across all submissions. |
| US-05 | As a student, I want to browse all submitted feedback on a public board, so that I can see what others are reporting. | Board loads with card layout; shows title, category, status, upvotes, time; scrollable with pagination. |
| US-06 | As a student, I want to filter the board by category and status, so that I find relevant issues quickly. | Filters are combinable; results update without page reload; "clear filters" resets all. |
| US-07 | As a student, I want to search the board by keyword, so that I can find specific issues. | Search input with debounce (300ms); searches title + description; "no results" state shown when empty. |
| US-08 | As a student, I want to upvote feedback that I also experience, so that popular issues get prioritized. | Upvote button increments count; button state changes to "upvoted"; only 1 upvote per session; persists across page reload (localStorage). |
| US-09 | As a student, I want to enter my tracking ID on a dedicated page, so that I can see the current status and admin responses for my submission. | Input field accepts tracking ID; shows full detail view; shows status progress bar; shows admin responses; shows timeline. |
| US-10 | As a student, I want to see admin responses on the public board, so that I trust the administration is taking action. | Each admin response shows: text, admin name, department, timestamp; responses are chronologically ordered. |

### 4.2 Admin User Stories

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| US-11 | As an admin, I want to log in securely, so that I can access the management dashboard. | Login form with username + password; JWT issued on success; redirected to dashboard; invalid creds show error. |
| US-12 | As an admin, I want to see all submissions in a table, so that I can quickly scan and prioritize. | Table columns: tracking ID, title, category, status, upvotes, date, assigned dept; all columns sortable. |
| US-13 | As an admin, I want to change the status of a submission, so that students see progress. | Status dropdown with 5 options + spam; mandatory comment field (min 10 chars); change is immediate on save. |
| US-14 | As an admin, I want to write a public response to a submission, so that students see what action is being taken. | Response textarea (20-2000 chars); optional proof image; response visible on public board after save. |
| US-15 | As an admin, I want to assign a submission to a department, so that the right team handles it. | Department dropdown; assignment visible in admin table; department admin sees it in their filtered view. |
| US-16 | As an admin, I want to mark a submission as spam, so that irrelevant content is hidden. | Spam button with confirmation; item removed from public board; visible in admin view with "Spam" badge. |
| US-17 | As a super admin, I want to create and manage admin accounts, so that I can onboard department admins. | Create form: username, display name, password, role, department; edit existing; delete with confirmation. |
| US-18 | As an admin, I want to see basic analytics, so that I can report on feedback trends. | Summary cards: total submissions, resolution rate, avg resolution time; top 5 unresolved by upvotes. |
| US-19 | As a department admin, I want to see only my department's feedback, so that I can focus on relevant issues. | Table auto-filters to assigned department; analytics scoped to department; cannot see other dept assignments. |

---

## 5. Technical Specifications

### 5.1 Project Structure

```
campusvoice/
├── client/                          # Next.js 14 frontend
│   ├── app/
│   │   ├── (public)/                # Public route group
│   │   │   ├── page.tsx             # Landing page
│   │   │   ├── submit/
│   │   │   │   └── page.tsx         # Submission form
│   │   │   ├── board/
│   │   │   │   ├── page.tsx         # Public board
│   │   │   │   └── [trackingId]/
│   │   │   │       └── page.tsx     # Feedback detail
│   │   │   └── track/
│   │   │       └── page.tsx         # Tracking lookup
│   │   ├── admin/                   # Admin route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── dashboard/
│   │   │       ├── page.tsx         # Feedback table (default)
│   │   │       ├── analytics/
│   │   │       │   └── page.tsx
│   │   │       └── users/
│   │   │           └── page.tsx     # Admin management
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components
│   │   ├── public/                  # Public-facing components
│   │   │   ├── FeedbackCard.tsx
│   │   │   ├── FeedbackBoard.tsx
│   │   │   ├── SubmissionForm.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── UpvoteButton.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FilterChips.tsx
│   │   │   └── StatusTimeline.tsx
│   │   └── admin/                   # Admin components
│   │       ├── FeedbackTable.tsx
│   │       ├── StatusChangeModal.tsx
│   │       ├── ResponseForm.tsx
│   │       ├── AdminSidebar.tsx
│   │       ├── AnalyticsSummary.tsx
│   │       └── UserManagement.tsx
│   ├── lib/
│   │   ├── api.ts                   # API client functions
│   │   ├── auth.ts                  # Auth context & helpers
│   │   ├── constants.ts             # Categories, statuses, etc.
│   │   └── utils.ts                 # Utility functions
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useFeedback.ts
│   │   └── useUpvote.ts
│   ├── public/
│   │   └── images/
│   ├── tailwind.config.ts
│   ├── next.config.js
│   └── package.json
│
├── server/                          # Express.js backend
│   ├── src/
│   │   ├── index.ts                 # Express app entry
│   │   ├── config/
│   │   │   ├── database.ts          # Prisma client
│   │   │   ├── cloudinary.ts        # Cloudinary config
│   │   │   └── env.ts               # Environment variables
│   │   ├── routes/
│   │   │   ├── feedback.routes.ts   # Public feedback routes
│   │   │   ├── admin.routes.ts      # Admin routes
│   │   │   └── upload.routes.ts     # File upload routes
│   │   ├── controllers/
│   │   │   ├── feedback.controller.ts
│   │   │   ├── admin.controller.ts
│   │   │   └── upload.controller.ts
│   │   ├── services/
│   │   │   ├── feedback.service.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── analytics.service.ts
│   │   │   └── upload.service.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts    # JWT verification
│   │   │   ├── rbac.middleware.ts    # Role-based access
│   │   │   ├── rateLimiter.ts       # Rate limiting
│   │   │   ├── validate.ts          # Zod validation
│   │   │   └── errorHandler.ts      # Global error handler
│   │   ├── validators/
│   │   │   ├── feedback.schema.ts   # Zod schemas
│   │   │   └── admin.schema.ts
│   │   ├── utils/
│   │   │   ├── trackingId.ts        # ID generation logic
│   │   │   ├── priorityScore.ts     # Priority calculation
│   │   │   └── logger.ts            # Structured logging
│   │   └── types/
│   │       └── index.ts             # TypeScript interfaces
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema
│   │   ├── migrations/
│   │   └── seed.ts                  # Seed data script
│   ├── tsconfig.json
│   └── package.json
│
├── shared/                          # Shared types & constants
│   ├── types.ts
│   └── constants.ts
│
├── .env.example
├── .gitignore
├── docker-compose.yml               # Local PostgreSQL
└── README.md
```

### 5.2 Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/campusvoice
JWT_SECRET=<random-64-char-hex>
JWT_REFRESH_SECRET=<random-64-char-hex>
CORS_ORIGIN=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Client
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 5.3 Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Monorepo vs Multirepo | Monorepo (single Git repository) | Simpler for MVP; shared types between frontend/backend |
| Database ID strategy | UUID v4 (internal) + human-readable tracking ID (external) | UUIDs prevent enumeration; tracking IDs are user-friendly |
| Image upload flow | Client → Server → Cloudinary (server-side upload) | Keeps Cloudinary credentials server-side; allows EXIF stripping |
| Pagination strategy | Cursor-based (for board), offset-based (for admin table) | Cursor prevents duplicate items on infinite scroll; offset simpler for admin sorting |
| State management (FE) | React Server Components + SWR for client data fetching | Minimal client-side state; SWR handles caching, revalidation |
| Upvote deduplication | localStorage key per feedback ID | No auth required; acceptable trade-off for anonymity |
| Tracking ID generation | Year prefix + auto-incrementing sequence (database-managed) | Human-readable; year scoping prevents overflow |

### 5.4 Tracking ID Generation Logic

```typescript
// server/src/utils/trackingId.ts

async function generateTrackingId(prisma: PrismaClient): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `CV${year}`;

  // Get the last tracking ID for this year
  const lastFeedback = await prisma.feedback.findFirst({
    where: {
      tracking_id: { startsWith: `#${prefix}` }
    },
    orderBy: { created_at: 'desc' },
    select: { tracking_id: true }
  });

  let nextNumber = 1;
  if (lastFeedback) {
    const lastNumber = parseInt(lastFeedback.tracking_id.split('-')[1]);
    nextNumber = lastNumber + 1;
  }

  return `#${prefix}-${nextNumber.toString().padStart(4, '0')}`;
}
```

### 5.5 Priority Score Implementation

```typescript
// server/src/utils/priorityScore.ts

const CATEGORY_WEIGHTS: Record<string, number> = {
  'Security': 10,
  'Welfare': 8,
  'Facilities': 6,
  'Academics': 5,
  'IT Services': 4,
  'Others': 2,
};

function calculatePriorityScore(
  upvoteCount: number,
  createdAt: Date,
  category: string
): number {
  const daysPending = Math.min(
    30,
    Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
  );

  const categoryWeight = CATEGORY_WEIGHTS[category] || 2;

  return (upvoteCount * 2) + (daysPending * 1.5) + categoryWeight;
}
```

---

## 6. API Contract

### 6.1 Public Endpoints

#### `POST /api/feedback`

Create a new anonymous feedback submission.

**Request:**
```json
{
  "category": "Facilities",
  "title": "Broken AC in Lab 3B",
  "description": "The air conditioning unit in Lab 3B, Block A has been non-functional for over 2 weeks. The room temperature during afternoon sessions is unbearable, affecting student concentration and comfort.",
  "image_url": "https://res.cloudinary.com/xxx/image/upload/v123/campusvoice/abc123.jpg"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "tracking_id": "#CV2026-0042",
    "message": "Your feedback has been submitted anonymously. Save your tracking ID to follow updates."
  }
}
```

**Validation Rules:**
- `category`: Required. One of: `Academics`, `Facilities`, `Welfare`, `Security`, `IT Services`, `Others`
- `title`: Required. 5-120 characters.
- `description`: Required. 20-3000 characters.
- `image_url`: Optional. Valid URL.

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "title", "message": "Title must be between 5 and 120 characters" }
    ]
  }
}
```

---

#### `GET /api/feedback`

List public feedback with pagination, filtering, and search.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number (cursor-based internally) |
| `limit` | number | 20 | Items per page (max 50) |
| `category` | string | — | Filter by category (comma-separated for multi) |
| `status` | string | — | Filter by status (comma-separated for multi) |
| `sort` | string | `newest` | Sort order: `newest`, `oldest`, `most_upvoted`, `recently_updated` |
| `search` | string | — | Keyword search (title + description) |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "feedback": [
      {
        "id": "uuid-here",
        "tracking_id": "#CV2026-0042",
        "category": "Facilities",
        "title": "Broken AC in Lab 3B",
        "description": "The air conditioning unit in Lab 3B...",
        "image_url": "https://res.cloudinary.com/...",
        "status": "in_progress",
        "upvote_count": 34,
        "response_count": 2,
        "created_at": "2026-02-18T10:30:00Z",
        "updated_at": "2026-02-20T14:00:00Z",
        "resolved_at": null
      }
    ],
    "pagination": {
      "total": 247,
      "page": 1,
      "limit": 20,
      "total_pages": 13,
      "has_next": true
    }
  }
}
```

---

#### `GET /api/feedback/:trackingId`

Get full details of a single feedback item including admin responses and status history.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "tracking_id": "#CV2026-0042",
    "category": "Facilities",
    "title": "Broken AC in Lab 3B",
    "description": "Full description here...",
    "image_url": "https://res.cloudinary.com/...",
    "status": "in_progress",
    "upvote_count": 34,
    "assigned_department": "Facilities Management",
    "created_at": "2026-02-18T10:30:00Z",
    "updated_at": "2026-02-20T14:00:00Z",
    "resolved_at": null,
    "responses": [
      {
        "id": "response-uuid",
        "admin_name": "Engr. Adebayo",
        "admin_department": "Facilities Management",
        "response_text": "We have dispatched a technician to assess the AC unit. Expected fix within 48 hours.",
        "status_changed_to": "in_progress",
        "proof_image_url": null,
        "created_at": "2026-02-19T09:00:00Z"
      }
    ],
    "status_history": [
      {
        "status": "submitted",
        "comment": null,
        "changed_at": "2026-02-18T10:30:00Z"
      },
      {
        "status": "under_review",
        "comment": "Assigned to Facilities Management team.",
        "changed_at": "2026-02-18T16:00:00Z"
      },
      {
        "status": "in_progress",
        "comment": "Technician dispatched.",
        "changed_at": "2026-02-19T09:00:00Z"
      }
    ]
  }
}
```

---

#### `POST /api/feedback/:id/upvote`

Upvote a feedback item.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "upvote_count": 35
  }
}
```

**Rate Limit:** 10 requests per minute per IP. IP is used only for rate limiting and is NOT logged.

---

#### `GET /api/stats/public`

Get public statistics for the landing page.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_submissions": 247,
    "total_resolved": 189,
    "average_resolution_days": 4.2
  }
}
```

---

### 6.2 Admin Endpoints

#### `POST /api/admin/login`

**Request:**
```json
{
  "username": "admin_rasheed",
  "password": "SecureP@ssw0rd123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "admin": {
      "id": "admin-uuid",
      "username": "admin_rasheed",
      "display_name": "Engr. Rasheed",
      "role": "department_admin",
      "department": "Facilities Management"
    }
  }
}
```
*Refresh token is set as httpOnly cookie.*

---

#### `PATCH /api/admin/feedback/:id/status`

**Request:**
```json
{
  "status": "in_progress",
  "comment": "Maintenance team has been dispatched. Expected resolution within 48 hours."
}
```

**Validation:**
- `status`: Required. One of: `submitted`, `under_review`, `in_progress`, `resolved`, `closed`
- `comment`: Required. Minimum 10 characters.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "in_progress",
    "updated_at": "2026-02-20T14:00:00Z"
  }
}
```

---

#### `POST /api/admin/feedback/:id/response`

**Request:**
```json
{
  "response_text": "The AC unit has been repaired. Please verify and let us know via a new submission if the issue persists.",
  "proof_image_url": "https://res.cloudinary.com/xxx/image/upload/v123/campusvoice/proof_abc.jpg",
  "expected_resolution_date": "2026-02-25"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "response-uuid",
    "response_text": "The AC unit has been repaired...",
    "admin_name": "Engr. Adebayo",
    "admin_department": "Facilities Management",
    "proof_image_url": "https://res.cloudinary.com/...",
    "created_at": "2026-02-22T11:30:00Z"
  }
}
```

---

#### `GET /api/admin/analytics`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_submissions": 247,
    "total_this_month": 42,
    "resolution_rate": 76.5,
    "average_resolution_days": 4.2,
    "pending_over_7_days": 8,
    "category_breakdown": {
      "Academics": 45,
      "Facilities": 67,
      "Welfare": 38,
      "Security": 22,
      "IT Services": 51,
      "Others": 24
    },
    "top_unresolved": [
      {
        "tracking_id": "#CV2026-0033",
        "title": "WiFi constantly drops in Block A",
        "category": "IT Services",
        "upvote_count": 89,
        "days_pending": 12
      }
    ]
  }
}
```

---

## 7. Database Schema (SQL)

```sql
-- PostgreSQL Schema for CampusVoice MVP

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- FEEDBACK TABLE
-- Core table storing anonymous submissions
-- ============================================
CREATE TABLE feedback (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_id     VARCHAR(20) NOT NULL UNIQUE,
    category        VARCHAR(20) NOT NULL CHECK (category IN (
                        'Academics', 'Facilities', 'Welfare',
                        'Security', 'IT Services', 'Others'
                    )),
    title           VARCHAR(120) NOT NULL,
    description     TEXT NOT NULL,
    image_url       TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'submitted' CHECK (status IN (
                        'submitted', 'under_review', 'in_progress',
                        'resolved', 'closed', 'spam'
                    )),
    upvote_count    INTEGER NOT NULL DEFAULT 0,
    priority_score  DECIMAL(10,2) NOT NULL DEFAULT 0,
    assigned_dept   VARCHAR(50),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    resolved_at     TIMESTAMP WITH TIME ZONE
);

-- Indexes for common query patterns
CREATE INDEX idx_feedback_category_status ON feedback(category, status);
CREATE INDEX idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX idx_feedback_priority ON feedback(priority_score DESC);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_feedback_upvotes ON feedback(upvote_count DESC);

-- Full-text search index for duplicate detection & search
ALTER TABLE feedback ADD COLUMN search_vector TSVECTOR;
CREATE INDEX idx_feedback_search ON feedback USING GIN(search_vector);

-- Trigger to auto-update search_vector
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.description, ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_feedback_search_vector
    BEFORE INSERT OR UPDATE OF title, description ON feedback
    FOR EACH ROW EXECUTE FUNCTION update_search_vector();


-- ============================================
-- ADMINS TABLE
-- Stores admin accounts with role-based access
-- ============================================
CREATE TABLE admins (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username        VARCHAR(50) NOT NULL UNIQUE,
    display_name    VARCHAR(100) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    role            VARCHAR(20) NOT NULL DEFAULT 'viewer' CHECK (role IN (
                        'super_admin', 'department_admin', 'viewer'
                    )),
    department      VARCHAR(50),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at   TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admins_username ON admins(username);
CREATE INDEX idx_admins_department ON admins(department);


-- ============================================
-- ADMIN RESPONSES TABLE
-- Public responses from admins to feedback
-- ============================================
CREATE TABLE admin_responses (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feedback_id         UUID NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
    admin_id            UUID NOT NULL REFERENCES admins(id),
    response_text       TEXT NOT NULL,
    status_changed_to   VARCHAR(20) CHECK (status_changed_to IN (
                            'submitted', 'under_review', 'in_progress',
                            'resolved', 'closed', 'spam', NULL
                        )),
    proof_image_url     TEXT,
    expected_resolution TIMESTAMP WITH TIME ZONE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_responses_feedback ON admin_responses(feedback_id);
CREATE INDEX idx_responses_admin ON admin_responses(admin_id);


-- ============================================
-- STATUS HISTORY TABLE
-- Tracks all status changes for timeline view
-- ============================================
CREATE TABLE status_history (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feedback_id     UUID NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
    admin_id        UUID REFERENCES admins(id),
    previous_status VARCHAR(20),
    new_status      VARCHAR(20) NOT NULL,
    comment         TEXT,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_status_history_feedback ON status_history(feedback_id);


-- ============================================
-- AUDIT LOGS TABLE
-- Immutable log of all admin actions
-- ============================================
CREATE TABLE audit_logs (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id            UUID NOT NULL REFERENCES admins(id),
    action              VARCHAR(50) NOT NULL,
    target_feedback_id  UUID REFERENCES feedback(id),
    previous_value      JSONB,
    new_value           JSONB,
    ip_address          INET,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_admin ON audit_logs(admin_id, created_at DESC);


-- ============================================
-- NOTIFICATION SUBSCRIPTIONS TABLE
-- (Deferred to v1.1 — schema included for reference)
-- ============================================
-- CREATE TABLE notification_subscriptions (
--     id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     feedback_id     UUID NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
--     email_hash      VARCHAR(64) NOT NULL,
--     email_encrypted TEXT NOT NULL,
--     is_active       BOOLEAN NOT NULL DEFAULT TRUE,
--     created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
-- );


-- ============================================
-- SEED: Default Super Admin
-- Password: CampusVoice@2026 (bcrypt hash)
-- ============================================
INSERT INTO admins (username, display_name, password_hash, role, department)
VALUES (
    'superadmin',
    'System Administrator',
    '$2b$12$placeholder_hash_replace_in_seed_script',
    'super_admin',
    NULL
);
```

---

## 8. Frontend Page Specifications

### 8.1 Landing Page (`/`)

| Element | Specification |
|---------|--------------|
| **Hero Section** | "Your concerns matter. Your identity doesn't have to." — H1 with Inter Bold 36px |
| **Primary CTA** | "Submit Feedback Anonymously" — Indigo filled button, full-width on mobile |
| **Secondary CTA** | "View Public Board" — Ghost button |
| **Stats Counter** | 3 cards in a row: Total Issues (count), Issues Resolved (count), Avg Resolution (days) — fetched from `/api/stats/public` |
| **Trust Badges** | Shield icon + "Your identity is never stored" / "No IP logging, no cookies, no tracking" |
| **Recent Resolutions** | Carousel of 3-5 most recently resolved issues with before/after photos (if available) |
| **Footer** | "Built for students. Powered by transparency." + Admin Login link |

### 8.2 Submission Form (`/submit`)

| Element | Specification |
|---------|--------------|
| **Category Select** | 6 options with icons, styled as clickable cards or radio group |
| **Title Input** | Text input, placeholder: "Brief title for your concern", char counter showing X/120 |
| **Description Textarea** | Textarea, placeholder: "Describe your concern in detail...", char counter showing X/3000, min height 150px |
| **Photo Upload** | Drag-and-drop zone + click to browse, preview thumbnail, "Remove" button, accepted types badge |
| **Submit Button** | "Submit Anonymously" — full-width, indigo, disabled until required fields valid |
| **Confirmation** | Full-page confirmation showing tracking ID in large text, copy button, link to board, "Submit another" link |

### 8.3 Public Board (`/board`)

| Element | Specification |
|---------|--------------|
| **Search Bar** | Text input pinned to top, icon, debounced 300ms |
| **Filter Row** | Horizontal scrollable chip group: 6 category chips + 5 status chips (toggle select) |
| **Sort Dropdown** | "Sort by:" — Newest, Oldest, Most Upvoted, Recently Updated |
| **Card Grid** | 2 columns on desktop, 1 column on mobile; cards with: tracking ID, category icon + label, title, description snippet (150 chars), status badge, upvote count + button, time metadata, response count |
| **Infinite Scroll** | Loading spinner at bottom; loads 20 more cards on scroll |
| **Empty State** | Illustration + "No feedback matches your filters. Try adjusting your search." |

### 8.4 Feedback Detail (`/board/:trackingId`)

| Element | Specification |
|---------|--------------|
| **Header** | Tracking ID + category + status badge |
| **Content** | Full title (H2) + full description (body text) + image (if present, clickable to zoom) |
| **Upvote** | Upvote button + count (same behavior as board) |
| **Status Timeline** | Vertical timeline: each node shows status icon + label + date + admin comment |
| **Admin Responses** | Chronological thread: admin name + department + response text + proof image + timestamp |
| **Time Info** | "Submitted X days ago" / "Resolved in X days" |
| **Back Link** | "← Back to Board" |

### 8.5 Tracking Lookup (`/track`)

| Element | Specification |
|---------|--------------|
| **Input** | Large text input, placeholder: "#CV2026-0000", centered on page |
| **Submit Button** | "Track My Submission" |
| **Result** | Same detail view as `/board/:trackingId` but accessed directly |
| **Error** | "No submission found with this tracking ID. Please check and try again." |

### 8.6 Admin Login (`/admin/login`)

| Element | Specification |
|---------|--------------|
| **Form** | Username + Password inputs, "Sign In" button |
| **Error State** | Red alert: "Invalid username or password" |
| **Lockout State** | "Too many failed attempts. Please try again in 15 minutes." |
| **Branding** | CampusVoice logo + "Admin Portal" subtitle |

### 8.7 Admin Dashboard (`/admin/dashboard`)

| Element | Specification |
|---------|--------------|
| **Sidebar** | Fixed left: Dashboard, All Feedback, Analytics, Manage Admins (super admin), Logout |
| **Header Bar** | "Welcome, {display_name}" + role badge + notification indicator (future) |
| **Table** | Columns: Tracking ID, Title, Category, Status (dropdown), Upvotes, Date, Dept, Actions |
| **Filters** | Above table: status chips, category dropdown, date range picker, search |
| **Row Actions** | Click row → slide-out panel OR modal with: full details, status change, response form, assign dept |
| **Bulk Actions** | Checkbox select + "Mark as Spam" / "Assign to..." buttons |

### 8.8 Admin Analytics (`/admin/dashboard/analytics`)

| Element | Specification |
|---------|--------------|
| **Summary Cards** | 4 cards: Total This Month, Resolution Rate (%), Avg Resolution Time (days), Pending > 7 Days (count with red bg) |
| **Category Breakdown** | Simple bar display showing count per category (no charting library needed for MVP) |
| **Top Unresolved** | Table: Rank, Tracking ID, Title, Category, Upvotes, Days Pending — top 5 |

### 8.9 Admin User Management (`/admin/dashboard/users`) *(Super Admin only)*

| Element | Specification |
|---------|--------------|
| **User Table** | Columns: Username, Display Name, Role, Department, Status (Active/Inactive), Created, Actions |
| **Create Button** | "Add Admin" → modal form: username, display name, password, role dropdown, department dropdown |
| **Edit** | Click edit icon → modal with pre-filled form (password field optional) |
| **Delete** | Click delete → confirmation dialog: "Are you sure? This action cannot be undone." |

---

## 9. Development Environment Setup

### 9.1 Prerequisites

| Dependency | Version | Purpose |
|-----------|---------|---------|
| Node.js | ≥ 20 LTS | Runtime |
| npm or pnpm | Latest | Package manager |
| PostgreSQL | ≥ 16 | Database |
| Docker (optional) | Latest | Local PostgreSQL via docker-compose |
| Git | Latest | Version control |

### 9.2 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-org/campusvoice.git
cd campusvoice

# 2. Start PostgreSQL (via Docker)
docker compose up -d postgres

# 3. Set up the server
cd server
cp .env.example .env         # Fill in your values
npm install
npx prisma migrate dev       # Run migrations
npx prisma db seed            # Seed with sample data
npm run dev                   # Starts on http://localhost:5000

# 4. Set up the client (new terminal)
cd client
cp .env.example .env.local   # Fill in API URL
npm install
npm run dev                   # Starts on http://localhost:3000
```

### 9.3 Docker Compose (Local Development)

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: campusvoice-db
    environment:
      POSTGRES_DB: campusvoice
      POSTGRES_USER: campusvoice_user
      POSTGRES_PASSWORD: campusvoice_dev_pass
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### 9.4 Code Quality Tools

| Tool | Configuration | Purpose |
|------|--------------|---------|
| ESLint | extends: next/core-web-vitals (client), @typescript-eslint (server) | Linting |
| Prettier | semi: true, singleQuote: true, printWidth: 100 | Formatting |
| Husky + lint-staged | pre-commit: lint + format | Pre-commit hooks |
| TypeScript | strict: true | Type safety |

---

## 10. Testing Strategy

### 10.1 Testing Pyramid

```
         ╱╲
        ╱  ╲          E2E Tests (5-10)
       ╱    ╲         Critical user flows
      ╱──────╲
     ╱        ╲       Integration Tests (20-30)
    ╱          ╲      API endpoints, DB queries
   ╱────────────╲
  ╱              ╲    Unit Tests (40-60)
 ╱                ╲   Utilities, services, validation
╱──────────────────╲
```

### 10.2 Test Coverage Targets

| Layer | Tool | Coverage Target |
|-------|------|:---------------:|
| Unit | Jest | ≥ 80% |
| Integration (API) | Supertest + Jest | All endpoints |
| Component | React Testing Library | Critical components |
| E2E | Playwright | 5-10 critical flows |

### 10.3 Critical E2E Test Scenarios

| # | Scenario | Steps |
|---|---------|-------|
| E2E-01 | Submit feedback and verify on board | Fill form → submit → visit board → find new card |
| E2E-02 | Upvote and verify count | Visit board → upvote card → verify count incremented |
| E2E-03 | Track submission by ID | Submit → copy ID → visit /track → enter ID → see details |
| E2E-04 | Admin login and status change | Login → find submission → change status → verify public board |
| E2E-05 | Admin add response | Login → select submission → write response → verify on public detail |
| E2E-06 | Super admin create user | Login as super admin → create department admin → new admin can login |

### 10.4 Test Data Management

- Seed script creates 20 diverse submissions across all categories and statuses
- 3 admin accounts: 1 super admin, 2 department admins
- 10 sample admin responses with proof images
- Test database (`campusvoice_test`) is migrated and seeded before each test run, torn down after

---

## 11. Deployment Plan

### 11.1 Infrastructure

```
┌──────────────────────────────────────────────┐
│                 PRODUCTION                    │
│                                              │
│  ┌────────────┐     ┌─────────────────────┐ │
│  │   Vercel    │     │  Render / Railway   │ │
│  │  (Frontend) │────▶│    (Backend API)    │ │
│  │  Next.js    │     │  Node.js + Express  │ │
│  │  CDN + Edge │     │  Auto-scaling       │ │
│  └────────────┘     └──────────┬──────────┘ │
│                                 │            │
│                     ┌──────────▼──────────┐ │
│                     │   PostgreSQL        │ │
│                     │   (Managed DB)      │ │
│                     │   Render / Railway  │ │
│                     └─────────────────────┘ │
│                                              │
│  ┌────────────┐                              │
│  │ Cloudinary │  ← Image storage + CDN      │
│  └────────────┘                              │
└──────────────────────────────────────────────┘
```

### 11.2 Deployment Checklist

**Pre-deployment:**
- [ ] All environment variables set in hosting platform
- [ ] Database migrations run in production
- [ ] Seed data loaded (super admin account + demo data)
- [ ] CORS configured for production frontend domain
- [ ] HTTPS enforced on all endpoints
- [ ] Rate limiting configured
- [ ] Error logging configured (stdout → platform logs)

**Verification:**
- [ ] Landing page loads under 2 seconds
- [ ] Submission form works end-to-end
- [ ] Public board displays submissions
- [ ] Admin login works
- [ ] Admin can change status and respond
- [ ] Images upload successfully
- [ ] No console errors in browser

### 11.3 CI/CD Pipeline

```
Push to main
    │
    ▼
[GitHub Actions]
    │
    ├─ Lint + Type Check
    ├─ Unit Tests
    ├─ Integration Tests
    │
    ▼ (All pass)
[Auto-deploy]
    ├─ Vercel (frontend) — automatic on push
    └─ Render/Railway (backend) — automatic on push
```

### 11.4 Monitoring

| What | How | Alert |
|------|-----|-------|
| Uptime | Render/Railway built-in | Auto-restart on crash |
| API errors | Console logging + platform logs | Manual review daily |
| Database | Platform monitoring | Connection pool alerts |
| Image uploads | Cloudinary dashboard | Usage limit warnings |

---

## 12. Cost Estimation

### 12.1 MVP Development Cost: **$0** (Self-hosted services, free tiers)

| Service | Plan | Monthly Cost | Limits |
|---------|------|:------------:|--------|
| **Vercel** | Hobby (Free) | $0 | 100GB bandwidth, 100 deployments |
| **Render** (Backend) | Free | $0 | 750 hours/month, sleeps after 15min inactivity |
| **Render** (PostgreSQL) | Free | $0 | 256 MB storage, 90-day retention |
| **Cloudinary** | Free | $0 | 25 credits/month (~25K transformations or ~10GB storage) |
| **GitHub** | Free | $0 | Unlimited private repos |
| **Domain** (optional) | — | ~$12/year | Custom domain |
| | | **Total: $0–$1/mo** | |

### 12.2 Scale-up Cost (If Needed Post-MVP)

| Service | Upgraded Plan | Monthly Cost | When Needed |
|---------|--------------|:------------:|-------------|
| Render (Backend) | Starter | $7 | > 100 concurrent users (no cold starts) |
| Render (PostgreSQL) | Starter | $7 | > 256 MB data or need persistent DB |
| Vercel | Pro | $20 | > 100GB bandwidth or need team features |
| Cloudinary | Plus | $89 | > 25 credits/month |
| **Total (scaled)** | | **$34–$123/mo** | |

### 12.3 Development Time Estimate

| Phase | Estimated Hours | Developer(s) |
|-------|:--------------:|:------------:|
| Sprint 1 | 54 hours | 1-2 |
| Sprint 2 | 51 hours | 1-2 |
| Sprint 3 | 56 hours | 1-2 |
| **Total** | **161 hours** | |

At a solo developer pace of ~25 productive hours/week, the MVP is achievable in **~6.5 weeks**.

---

## 13. Post-MVP Roadmap

### Version 1.1 — Engagement & Notifications (Weeks 7-10)

| Feature | Description |
|---------|-------------|
| Email notifications | Status change + new response notifications to opted-in submitters |
| Duplicate detection | Show similar existing issues during submission flow |
| Analytics charts | Donut chart (categories), line chart (submissions over time), stacked bar (status pipeline) |
| Weekly admin digest | Automated email to admins summarizing high-priority pending issues |

### Version 1.2 — Trust & Accountability (Weeks 11-14)

| Feature | Description |
|---------|-------------|
| Student satisfaction rating | After resolution, students rate if the issue was actually fixed (1-5 stars via tracking ID) |
| Trending issues | "Most upvoted this week" section on landing page |
| CSV export | Admins can export filtered feedback data as CSV |
| Dark mode | System-preference-aware dark theme |

### Version 2.0 — Scale & Intelligence (Future)

| Feature | Description |
|---------|-------------|
| Multi-tenant architecture | Support multiple universities with isolated data |
| AI-powered categorization | Auto-categorize submissions using NLP |
| Sentiment analysis | Detect urgency/emotion in submissions |
| Mobile app (PWA) | Installable Progressive Web App |
| University ERP integration | Sync departments and staff from existing systems |
| Multilingual support | i18n for diverse campus populations |

---

## 14. Acceptance Criteria Checklist

### 14.1 MVP Go/No-Go Checklist

**Core Functionality:**
- [ ] Student can submit feedback anonymously (no account required)
- [ ] Tracking ID is generated and displayed on confirmation
- [ ] Zero PII is stored in the feedback table
- [ ] Submitted feedback appears on the public board
- [ ] Public board supports filtering by category and status
- [ ] Public board supports keyword search
- [ ] Board cards display: title, category, status, upvotes, time
- [ ] Clicking a card shows full details + admin responses + timeline
- [ ] Students can upvote (1 per session, persists in localStorage)
- [ ] Students can look up their submission by tracking ID

**Admin Functionality:**
- [ ] Admin can log in with valid credentials
- [ ] Invalid credentials are rejected
- [ ] Admin sees all submissions in a sortable table
- [ ] Admin can change status with mandatory comment
- [ ] Admin can add a public response (text + optional proof image)
- [ ] Admin can assign a submission to a department
- [ ] Admin can mark a submission as spam (hidden from public board)
- [ ] Super admin can create, edit, and delete admin users
- [ ] Department admin view is scoped to their department
- [ ] Basic analytics are displayed: total, resolution rate, avg time, top unresolved

**Technical Quality:**
- [ ] All API endpoints return proper error codes and messages
- [ ] Form validation is implemented on both client and server
- [ ] Rate limiting is active on upvote and login endpoints
- [ ] Images upload to Cloudinary successfully
- [ ] EXIF metadata is stripped from uploaded images
- [ ] JWT authentication is implemented with access + refresh tokens
- [ ] All admin actions are logged in the audit table
- [ ] Application is responsive (320px–1440px)
- [ ] Application is accessible (keyboard navigable, screen reader compatible)
- [ ] No console errors in production

**Deployment:**
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Render/Railway
- [ ] PostgreSQL database provisioned and migrated
- [ ] Cloudinary account configured
- [ ] CORS is correctly configured
- [ ] HTTPS is enforced
- [ ] Seed data loaded (20+ submissions, 3+ admin accounts)
- [ ] Super admin account credentials documented securely

---

*End of MVP Specification Document*

*Document prepared by CampusVoice Product Team — February 2026*
