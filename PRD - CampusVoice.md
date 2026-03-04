# Product Requirements Document (PRD)

## CampusVoice — Anonymous Feedback & Accountability Platform

| Field              | Detail                                      |
| ------------------ | ------------------------------------------- |
| **Document Owner** | CampusVoice Product Team                    |
| **Version**        | 1.0                                         |
| **Status**         | Draft → Ready for Review                    |
| **Created**        | February 22, 2026                           |
| **Last Updated**   | February 22, 2026                           |
| **Stakeholders**   | University Administration, Student Body, IT |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Vision & Objectives](#3-vision--objectives)
4. [Target Users & Personas](#4-target-users--personas)
5. [Product Scope](#5-product-scope)
6. [Feature Requirements](#6-feature-requirements)
7. [Information Architecture](#7-information-architecture)
8. [System Architecture](#8-system-architecture)
9. [Data Model](#9-data-model)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [User Flows](#11-user-flows)
12. [UI/UX Specifications](#12-uiux-specifications)
13. [Analytics & Metrics](#13-analytics--metrics)
14. [Security & Privacy](#14-security--privacy)
15. [Release Strategy](#15-release-strategy)
16. [Risks & Mitigations](#16-risks--mitigations)
17. [Success Criteria](#17-success-criteria)
18. [Appendices](#18-appendices)

---

## 1. Executive Summary

**CampusVoice** is a web-based platform that enables students to submit anonymous feedback, concerns, and suggestions to their university administration — and track the resolution process in real time on a public board. The platform is designed to restore trust between students and administration by making every piece of feedback and every administrative response visible, timestamped, and accountable.

Unlike traditional suggestion boxes or closed-loop complaint systems, CampusVoice treats transparency as a first-class feature. Every submission is publicly visible (with zero personally identifiable information), every status change requires a mandatory administrative comment, and resolution timelines are tracked and displayed openly.

**Key value proposition:** *"Submit anonymously. Track publicly. See real action."*

---

## 2. Problem Statement

### 2.1 Current Pain Points

| # | Pain Point | Impact |
|---|-----------|--------|
| 1 | Students fear retaliation when raising sensitive concerns | Critical feedback is suppressed |
| 2 | Existing feedback channels (emails, forms) lack visibility into what happens after submission | Students perceive administration as unresponsive |
| 3 | Administrators lack a centralized, prioritized view of student concerns | High-impact issues get buried |
| 4 | No mechanism for students to signal collective agreement on an issue | Administration cannot gauge severity |
| 5 | Resolution efforts by administration go unrecognized | Trust deficit persists even when action is taken |

### 2.2 Opportunity

Universities that implement transparent feedback loops report:

- **32% higher** student satisfaction scores (EDUCAUSE, 2024)
- **45% faster** issue resolution when feedback is publicly tracked
- **2.8× increase** in constructive feedback volume when anonymity is guaranteed

CampusVoice captures this opportunity with a technically lean, deployment-ready platform.

---

## 3. Vision & Objectives

### 3.1 Product Vision

> *"Every student concern deserves to be heard, tracked, and resolved — without fear."*

### 3.2 Strategic Objectives

| Objective | Metric | Target (6 months post-launch) |
|-----------|--------|-------------------------------|
| **Increase feedback volume** | Monthly submissions | ≥ 200 submissions/month |
| **Demonstrate accountability** | Public resolution rate | ≥ 75% of submissions resolved |
| **Reduce resolution time** | Average days to resolution | ≤ 7 business days |
| **Build trust** | Repeat submission rate | ≥ 40% of submitters return |
| **Surface priorities** | Upvote engagement rate | ≥ 30% of board viewers upvote |

### 3.3 Out of Scope (v1.0)

- Native mobile applications (responsive web only)
- Multi-university / multi-tenant deployment
- AI-powered sentiment analysis
- Integration with university ERP/SIS systems
- Live chat between students and administration
- Multi-language / i18n support

---

## 4. Target Users & Personas

### Persona 1: Anonymous Student Submitter — *"Worried Wale"*

| Attribute | Detail |
|-----------|--------|
| **Role** | Undergraduate / Postgraduate student |
| **Goal** | Report a concern without revealing identity |
| **Frustration** | "I reported a broken lab AC last semester via email. Nothing happened. I don't even know if they read it." |
| **Behavior** | Submits once, checks back using tracking ID, upvotes related issues |
| **Tech comfort** | Moderate — uses phone browser primarily |

### Persona 2: Engaged Student Browser — *"Curious Chioma"*

| Attribute | Detail |
|-----------|--------|
| **Role** | Student who browses the public board |
| **Goal** | See what others are saying, upvote issues she also experiences |
| **Frustration** | "I thought I was the only one dealing with this problem." |
| **Behavior** | Visits public board weekly, upvotes 3-5 issues, rarely submits |

### Persona 3: Department Admin — *"Responsible Rasheed"*

| Attribute | Detail |
|-----------|--------|
| **Role** | Facilities / IT / Welfare department administrator |
| **Goal** | View, respond to, and resolve submissions in his department |
| **Frustration** | "I fix things but no one knows. Students still complain on Twitter." |
| **Behavior** | Checks dashboard daily, updates statuses, attaches proof photos |

### Persona 4: Super Admin — *"Director Dorcas"*

| Attribute | Detail |
|-----------|--------|
| **Role** | Dean of Student Affairs / Chief Administrator |
| **Goal** | Monitor overall feedback health, ensure departments are responsive |
| **Frustration** | "I need a single dashboard showing what students actually care about." |
| **Behavior** | Reviews analytics weekly, escalates overdue issues |

---

## 5. Product Scope

### 5.1 Module Map

```
CampusVoice
├── Public Layer (No Auth Required)
│   ├── Landing Page
│   ├── Anonymous Submission Portal
│   ├── Public Feedback Board
│   └── Submission Tracker (by Tracking ID)
│
├── Admin Layer (Authenticated)
│   ├── Feedback Management Console
│   ├── Response & Status Engine
│   ├── Department Assignment
│   ├── Analytics Dashboard
│   └── Admin User Management (Super Admin only)
│
└── System Layer
    ├── Notification Engine (Email)
    ├── File Upload Service
    ├── Duplicate Detection Engine
    └── Priority Scoring Algorithm
```

### 5.2 Feature Priority Matrix (MoSCoW)

| Priority | Feature |
|----------|---------|
| **Must Have** | Anonymous submission with tracking ID |
| **Must Have** | Public feedback board with status badges |
| **Must Have** | Admin dashboard with status management |
| **Must Have** | Upvote system |
| **Must Have** | Admin response system (public) |
| **Must Have** | Role-based admin authentication |
| **Should Have** | Email notifications on status change |
| **Should Have** | Duplicate detection on submission |
| **Should Have** | Photo upload (submission + admin proof) |
| **Should Have** | Analytics overview dashboard |
| **Could Have** | Student satisfaction rating post-resolution |
| **Could Have** | CSV export for admin reports |
| **Could Have** | Trending issues widget |
| **Won't Have (v1)** | Real-time WebSocket updates |
| **Won't Have (v1)** | Mobile native apps |
| **Won't Have (v1)** | Multi-tenant architecture |

---

## 6. Feature Requirements

### 6.1 Anonymous Submission Portal

**FR-101** — The system SHALL allow any visitor to submit feedback without creating an account or logging in.

**FR-102** — The submission form SHALL collect:

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Category | Select dropdown | Yes | One of: Academics, Facilities, Welfare, Security, IT Services, Others |
| Title | Text input | Yes | 5–120 characters |
| Description | Textarea | Yes | 20–3000 characters |
| Photo Evidence | File upload | No | Max 5 MB; JPEG, PNG, WebP only |
| Notification Email | Email input | No | Valid email format |

**FR-103** — Upon successful submission, the system SHALL:
- Generate a unique, human-readable tracking ID in the format `#CV{YEAR}-{SEQUENTIAL_4_DIGIT}` (e.g., `#CV2026-0157`)
- Display the tracking ID prominently with a "Copy to clipboard" action
- Show a confirmation message: *"Your feedback has been submitted anonymously. Save your tracking ID to follow updates."*

**FR-104** — The system SHALL NOT store, log, or transmit: IP addresses, browser fingerprints, session cookies, user-agent strings, or any other metadata that could identify the submitter.

**FR-105** — If a notification email is provided, the system SHALL:
- Hash the email using SHA-256 with a server-side salt before storage
- Store the hashed email in a separate table from the feedback content
- Use the email solely for status change notifications
- Allow the student to unsubscribe via a one-click link in any notification email

**FR-106** — Before final submission, the system SHALL query existing submissions and display up to 3 similar issues (based on title + category matching) with a prompt: *"Does any of these match your concern? You can upvote instead."*

### 6.2 Public Feedback Board

**FR-201** — The public board SHALL display all non-spam submissions in a card-based layout.

**FR-202** — Each feedback card SHALL display:
- Tracking ID
- Category icon + label
- Title
- Truncated description (first 150 characters, expandable)
- Current status badge (color-coded)
- Upvote count with upvote button
- Time metadata: "Submitted X days ago" / "Resolved in X days"
- Number of admin responses

**FR-203** — The board SHALL support the following filters (combinable):

| Filter | Type | Options |
|--------|------|---------|
| Category | Multi-select chips | All 6 categories |
| Status | Multi-select chips | All 5 statuses |
| Sort | Single-select | Newest, Oldest, Most Upvoted, Recently Updated |
| Search | Text input | Searches title + description (debounced, 300ms) |

**FR-204** — Clicking a card SHALL expand to a detail view showing:
- Full description
- Attached photo (if any)
- Complete admin response thread (chronological)
- Full status change history with timestamps
- Proof images attached by admin

**FR-205** — The upvote mechanism SHALL:
- Allow one upvote per browser session (localStorage-based, non-identifying)
- Display the current upvote count in real time (optimistic UI)
- Not require any authentication
- Be rate-limited to 10 upvotes per minute per IP (server-side, IP not logged)

**FR-206** — The board SHALL implement infinite scroll pagination, loading 20 cards per batch.

### 6.3 Submission Tracker

**FR-301** — The system SHALL provide a dedicated page where a user can enter a tracking ID to view the full status and history of their submission.

**FR-302** — The tracker SHALL display:
- Current status with visual progress bar (5 stages)
- Complete timeline of status changes with dates and admin comments
- All admin responses
- Estimated resolution date (if set by admin)

**FR-303** — If the tracking ID is invalid, the system SHALL display a friendly error: *"No submission found with this tracking ID. Please check and try again."*

### 6.4 Admin Authentication & Authorization

**FR-401** — The system SHALL implement JWT-based authentication for all admin routes.

**FR-402** — Token configuration:
- Access token: 15-minute expiry, stored in memory (not localStorage)
- Refresh token: 7-day expiry, stored in httpOnly secure cookie
- Tokens invalidated on password change

**FR-403** — Role-based access control:

| Permission | Super Admin | Dept Admin | Viewer |
|------------|:-----------:|:----------:|:------:|
| View all feedback | ✅ | ✅ (own dept) | ✅ |
| Change status | ✅ | ✅ (own dept) | ❌ |
| Add response | ✅ | ✅ (own dept) | ❌ |
| Assign department | ✅ | ❌ | ❌ |
| Mark spam/duplicate | ✅ | ✅ (own dept) | ❌ |
| View analytics | ✅ | ✅ (own dept) | ✅ |
| Manage admins | ✅ | ❌ | ❌ |
| Export data | ✅ | ✅ (own dept) | ❌ |

**FR-404** — All admin actions SHALL be logged in an audit trail with: `admin_id`, `action`, `target_feedback_id`, `timestamp`, `previous_value`, `new_value`.

### 6.5 Feedback Management Console

**FR-501** — The admin dashboard SHALL display submissions in a sortable, filterable table with columns:

| Column | Sortable | Filterable |
|--------|:--------:|:----------:|
| Tracking ID | ❌ | Search |
| Title | ❌ | Search |
| Category | ✅ | Multi-select |
| Status | ✅ | Multi-select |
| Upvotes | ✅ | Min/Max range |
| Submitted Date | ✅ | Date range |
| Days Pending | ✅ | — |
| Assigned To | ✅ | Multi-select |

**FR-502** — Status changes SHALL require a mandatory comment (minimum 10 characters) explaining the update.

**FR-503** — The admin SHALL be able to assign a submission to a department. Assignment SHALL trigger an in-app notification to relevant department admins.

**FR-504** — Bulk actions SHALL be supported: Mark as Spam (up to 20 at once), Assign Department (up to 20 at once).

### 6.6 Admin Response System

**FR-601** — Admins SHALL be able to add public responses to any submission. Responses are visible on the public board.

**FR-602** — Responses SHALL support:
- Text content (20–2000 characters)
- Optional proof image upload (max 5 MB; JPEG, PNG, WebP)
- Optional expected resolution date

**FR-603** — Each response SHALL display: admin's display name (not username), department, timestamp.

**FR-604** — If the submitter provided a notification email, the system SHALL send an email notification within 5 minutes of a status change or new admin response.

### 6.7 Analytics Dashboard

**FR-701** — The analytics dashboard SHALL display the following KPIs:

| Metric | Visualization | Calculation |
|--------|---------------|-------------|
| Total submissions (this month) | Large number card | Count of submissions with `created_at` in current month |
| Resolution rate | Percentage card + trend arrow | (Resolved + Closed) / Total × 100 |
| Avg. resolution time | Number card (days) | Mean of (`resolved_at` - `created_at`) for resolved items |
| Pending > 7 days | Alert badge | Count where status ∉ {Resolved, Closed, Spam} AND age > 7 days |

**FR-702** — Charts:
- **Category breakdown**: Donut chart showing submission distribution by category
- **Status pipeline**: Horizontal stacked bar showing counts per status
- **Submissions over time**: Line chart, daily granularity, last 30 days
- **Top 5 most-upvoted unresolved issues**: Ranked list with links

**FR-703** — Department admins SHALL see analytics filtered to their department only.

### 6.8 Priority Scoring Algorithm

**FR-801** — Each submission SHALL have a computed priority score used to sort the admin dashboard. Formula:

$$\text{Priority Score} = (U \times 2) + (D \times 1.5) + C$$

Where:
- $U$ = Upvote count
- $D$ = Days since submission (capped at 30)
- $C$ = Category weight (Security = 10, Welfare = 8, Facilities = 6, Academics = 5, IT Services = 4, Others = 2)

**FR-802** — The admin dashboard SHALL have a "Priority View" toggle that sorts by priority score descending.

---

## 7. Information Architecture

### 7.1 Sitemap

```
/                           → Landing Page
/submit                     → Anonymous Submission Form
/board                      → Public Feedback Board
/board/:trackingId          → Feedback Detail View
/track                      → Tracking ID Lookup Page
/admin/login                → Admin Login
/admin/dashboard            → Admin Dashboard (default: Feedback table)
/admin/dashboard/analytics  → Analytics Overview
/admin/dashboard/users      → Admin User Management (Super Admin)
/admin/dashboard/settings   → System Settings (Super Admin)
```

### 7.2 Navigation Structure

**Public Navigation Bar:**
- Logo + "CampusVoice"
- Submit Feedback (primary CTA button)
- View Board
- Track Submission
- Admin Login (subtle, footer or icon)

**Admin Sidebar:**
- Dashboard Home
- All Feedback
- Analytics
- Manage Admins (Super Admin only)
- Settings
- Logout

---

## 8. System Architecture

### 8.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Client (Browser)                   │
│          Next.js 14 + Tailwind + shadcn/ui           │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS (REST API)
                     ▼
┌─────────────────────────────────────────────────────┐
│              API Server (Node.js + Express)           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │  Auth     │ │ Feedback │ │ Upload   │ │ Notify │ │
│  │  Module   │ │ Module   │ │ Module   │ │ Module │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
└──────┬──────────────┬──────────────┬────────────────┘
       │              │              │
       ▼              ▼              ▼
┌────────────┐ ┌────────────┐ ┌────────────┐
│ PostgreSQL │ │ Cloudinary │ │   SMTP     │
│  Database  │ │  (Images)  │ │  (Email)   │
└────────────┘ └────────────┘ └────────────┘
```

### 8.2 Tech Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| Frontend Framework | Next.js 14 (App Router) | SSR for SEO on public board, API routes, file-based routing |
| UI Library | shadcn/ui + Tailwind CSS | Accessible components, rapid prototyping, consistent design |
| Backend Runtime | Node.js 20 LTS | JavaScript ecosystem consistency, async I/O for concurrent requests |
| API Framework | Express.js 4.x | Mature, lightweight, extensive middleware ecosystem |
| Database | PostgreSQL 16 | ACID compliance, full-text search for duplicate detection, JSON support |
| ORM | Prisma | Type-safe queries, migration management, intuitive schema definition |
| File Storage | Cloudinary | Free tier sufficient for MVP (25 credits/month), image transformation API |
| Authentication | JWT (jsonwebtoken) + bcrypt | Stateless auth, industry-standard password hashing |
| Email | Nodemailer + SMTP (Gmail/SendGrid) | Reliable transactional email delivery |
| Validation | Zod | Runtime type validation, shared schemas between frontend/backend |
| Deployment (FE) | Vercel | Native Next.js support, global CDN, free tier |
| Deployment (BE) | Render / Railway | Managed Node.js hosting, free PostgreSQL addon |

### 8.3 API Design (RESTful)

#### Public Endpoints (No Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/feedback` | Submit new anonymous feedback |
| `GET` | `/api/feedback` | List all public feedback (paginated, filterable) |
| `GET` | `/api/feedback/:trackingId` | Get single feedback by tracking ID |
| `POST` | `/api/feedback/:id/upvote` | Upvote a feedback item |
| `GET` | `/api/feedback/similar?title=...&category=...` | Get similar submissions (duplicate detection) |
| `GET` | `/api/stats/public` | Get public stats (total submissions, resolved count) |

#### Admin Endpoints (JWT Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/login` | Authenticate admin, return tokens |
| `POST` | `/api/admin/refresh` | Refresh access token |
| `POST` | `/api/admin/logout` | Invalidate refresh token |
| `GET` | `/api/admin/feedback` | List all feedback (admin view, includes spam) |
| `PATCH` | `/api/admin/feedback/:id/status` | Update status (requires comment) |
| `PATCH` | `/api/admin/feedback/:id/assign` | Assign to department |
| `PATCH` | `/api/admin/feedback/:id/spam` | Mark as spam/duplicate |
| `POST` | `/api/admin/feedback/:id/response` | Add admin response |
| `GET` | `/api/admin/analytics` | Get analytics data |
| `GET` | `/api/admin/users` | List admin users (Super Admin) |
| `POST` | `/api/admin/users` | Create admin user (Super Admin) |
| `PATCH` | `/api/admin/users/:id` | Update admin user (Super Admin) |
| `DELETE` | `/api/admin/users/:id` | Delete admin user (Super Admin) |

---

## 9. Data Model

### 9.1 Entity Relationship Diagram

```
┌──────────────────┐       ┌──────────────────────┐
│     feedback      │       │   admin_responses     │
├──────────────────┤       ├──────────────────────┤
│ id (UUID) PK      │──┐   │ id (UUID) PK          │
│ tracking_id       │  │   │ feedback_id FK ────────┤
│ category          │  │   │ admin_id FK            │
│ title             │  └──▶│ response_text          │
│ description       │      │ status_changed_to      │
│ image_url         │      │ proof_image_url         │
│ status            │      │ created_at              │
│ upvote_count      │      └──────────────────────┘
│ priority_score    │
│ assigned_dept     │      ┌──────────────────────┐
│ created_at        │      │      admins            │
│ updated_at        │      ├──────────────────────┤
│ resolved_at       │      │ id (UUID) PK          │
└──────────────────┘      │ username               │
                           │ display_name           │
┌──────────────────┐      │ password_hash          │
│ notification_     │      │ role                   │
│ subscriptions     │      │ department             │
├──────────────────┤      │ is_active              │
│ id (UUID) PK      │      │ created_at             │
│ feedback_id FK    │      └──────────────────────┘
│ email_hash        │
│ email_encrypted   │      ┌──────────────────────┐
│ is_active         │      │    audit_logs          │
│ created_at        │      ├──────────────────────┤
└──────────────────┘      │ id (UUID) PK          │
                           │ admin_id FK            │
                           │ action                 │
                           │ target_feedback_id     │
                           │ previous_value (JSON)  │
                           │ new_value (JSON)        │
                           │ created_at              │
                           └──────────────────────┘
```

### 9.2 Indexes

| Table | Index | Type | Purpose |
|-------|-------|------|---------|
| feedback | tracking_id | Unique B-tree | Fast tracking ID lookup |
| feedback | category, status | Composite B-tree | Filter queries |
| feedback | created_at | B-tree (DESC) | Sort by newest |
| feedback | priority_score | B-tree (DESC) | Priority sorting |
| feedback | title | GIN (tsvector) | Full-text search for duplicate detection |
| admin_responses | feedback_id | B-tree | Join performance |
| audit_logs | admin_id, created_at | Composite B-tree | Admin activity queries |

---

## 10. Non-Functional Requirements

### 10.1 Performance

| Metric | Target |
|--------|--------|
| Public board page load (first contentful paint) | < 1.5 seconds |
| API response time (95th percentile) | < 300ms |
| Submission form to confirmation | < 2 seconds |
| Concurrent users supported | 500+ |
| Image upload processing time | < 5 seconds |

### 10.2 Availability & Reliability

| Metric | Target |
|--------|--------|
| Uptime SLA | 99.5% (allows ~3.6 hrs/month downtime) |
| Data backup frequency | Daily automated |
| Recovery Point Objective (RPO) | < 24 hours |
| Recovery Time Objective (RTO) | < 4 hours |

### 10.3 Scalability

- Database: Vertical scaling sufficient for MVP (up to 100K submissions)
- Image storage: Cloudinary handles CDN and scaling
- API: Stateless design allows horizontal scaling via load balancer when needed

### 10.4 Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigable (all interactive elements)
- Screen reader compatible (semantic HTML, ARIA labels)
- Color contrast ratio ≥ 4.5:1
- Focus indicators on all interactive elements

### 10.5 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | Last 2 versions |
| Edge | Last 2 versions |
| Mobile Chrome/Safari | Last 2 versions |

### 10.6 Responsiveness

- Breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop), 1440px (wide)
- Mobile-first design approach
- Touch-friendly tap targets (≥ 44px)

---

## 11. User Flows

### 11.1 Submit Anonymous Feedback

```
[Landing Page]
    │
    ▼ Click "Submit Feedback Anonymously"
[Submission Form]
    │
    ├─ Select category
    ├─ Enter title
    ├─ Enter description
    ├─ (Optional) Upload photo
    ├─ (Optional) Enter notification email
    │
    ▼ Click "Submit"
[Duplicate Check Modal]  ←── System finds similar issues
    │
    ├─ "None of these match" → Proceed with submission
    │   │
    │   ▼
    │  [Confirmation Page]
    │   ├─ Display tracking ID (#CV2026-XXXX)
    │   ├─ "Copy Tracking ID" button
    │   ├─ "View on Public Board" link
    │   └─ "Submit Another" link
    │
    └─ "This matches my issue" → Redirect to existing submission + auto-upvote
```

### 11.2 Browse & Upvote on Public Board

```
[Public Board]
    │
    ├─ Apply filters (category, status)
    ├─ Search by keyword
    │
    ▼ Scan cards
[Feedback Card]
    │
    ├─ Click upvote → Upvote count increments (no page reload)
    │
    └─ Click card → [Detail View]
                        ├─ Read full description
                        ├─ View admin responses
                        ├─ See status history timeline
                        └─ Upvote from detail view
```

### 11.3 Admin: Respond to Feedback

```
[Admin Login]
    │
    ▼ Enter credentials
[Admin Dashboard — Feedback Table]
    │
    ├─ Sort by priority score (descending)
    ├─ Filter: Status = "Submitted" (new items)
    │
    ▼ Click on a submission
[Feedback Detail — Admin View]
    │
    ├─ Read full submission
    ├─ Assign to department → [Department Dropdown]
    │
    ├─ Change status → [Status Dropdown]
    │   └─ Enter mandatory comment → Save
    │       └─ System sends email notification (if email provided)
    │
    └─ Add response → [Response Form]
        ├─ Enter response text
        ├─ (Optional) Upload proof photo
        ├─ (Optional) Set expected resolution date
        └─ Submit → Response appears on public board
```

---

## 12. UI/UX Specifications

### 12.1 Design Principles

1. **Trust-first**: Every design decision should reinforce that the platform is safe, anonymous, and transparent
2. **Minimal friction**: Zero barriers to submission (no signup, no CAPTCHA unless abuse detected)
3. **Status clarity**: Every feedback item's state must be immediately understandable at a glance
4. **Mobile-native**: Over 70% of student interactions will be on mobile devices

### 12.2 Color System

| Color | Hex | Usage |
|-------|-----|-------|
| Primary (Indigo) | `#4F46E5` | CTAs, active states, links |
| Success (Green) | `#16A34A` | Resolved status, positive metrics |
| Warning (Amber) | `#D97706` | In Progress status, time warnings |
| Danger (Red) | `#DC2626` | Spam status, error states |
| Info (Blue) | `#2563EB` | Under Review status, informational |
| Neutral (Gray) | `#6B7280` | Submitted status, secondary text |
| Dark (Slate) | `#1E293B` | Closed status, text, admin sidebar |
| Background | `#F8FAFC` | Page backgrounds |
| Surface | `#FFFFFF` | Cards, modals |

### 12.3 Status Badge Design

| Status | Background | Text Color | Icon |
|--------|-----------|------------|------|
| Submitted | `gray-100` | `gray-700` | ○ (circle outline) |
| Under Review | `blue-100` | `blue-700` | 👁 (eye) |
| In Progress | `amber-100` | `amber-700` | ⚡ (bolt) |
| Resolved | `green-100` | `green-700` | ✓ (check) |
| Closed | `slate-100` | `slate-700` | ✕ (x-mark) |
| Spam | `red-100` | `red-700` | 🚫 (prohibited) |

### 12.4 Key Page Layouts

**Landing Page:**
```
┌─────────────────────────────────────────────┐
│  [Nav: Logo | Board | Track | Admin Login]  │
├─────────────────────────────────────────────┤
│                                              │
│     🛡️  CampusVoice                         │
│     Your concerns matter. Your identity      │
│     doesn't have to.                         │
│                                              │
│     [Submit Feedback Anonymously] (CTA)      │
│     [View Public Board] (secondary)          │
│                                              │
│     ┌──────┐  ┌──────┐  ┌──────┐            │
│     │ 247  │  │ 189  │  │ 4.2  │            │
│     │Issues│  │Solved│  │ Days │            │
│     │Posted│  │      │  │ Avg  │            │
│     └──────┘  └──────┘  └──────┘            │
│                                              │
│  🔒 Your identity is never stored.           │
│  No IP logging. No cookies. No tracking.     │
│                                              │
├─────────────────────────────────────────────┤
│     Recent Resolutions                       │
│  ┌────────────┐ ┌────────────┐              │
│  │ Before/    │ │ Before/    │              │
│  │ After      │ │ After      │              │
│  │ showcase   │ │ showcase   │              │
│  └────────────┘ └────────────┘              │
└─────────────────────────────────────────────┘
```

**Public Board:**
```
┌─────────────────────────────────────────────┐
│  [Search: "Search issues..."]               │
│  [Category chips] [Status chips] [Sort ▾]   │
├─────────────────────────────────────────────┤
│  ┌─────────────────┐ ┌─────────────────┐   │
│  │ #CV2026-0042     │ │ #CV2026-0041    │   │
│  │ 🏫 Facilities    │ │ 📚 Academics    │   │
│  │                  │ │                  │   │
│  │ Broken AC in     │ │ Library hours    │   │
│  │ Lab 3B           │ │ too short        │   │
│  │                  │ │                  │   │
│  │ [In Progress]    │ │ [Under Review]   │   │
│  │ ▲ 34 upvotes     │ │ ▲ 28 upvotes    │   │
│  │ 3 days ago       │ │ 1 day ago       │   │
│  │ 2 responses      │ │ 1 response      │   │
│  └─────────────────┘ └─────────────────┘   │
│                                              │
│  ┌─────────────────┐ ┌─────────────────┐   │
│  │ ...              │ │ ...              │   │
│  └─────────────────┘ └─────────────────┘   │
└─────────────────────────────────────────────┘
```

### 12.5 Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| H1 (Page title) | Inter | 700 | 36px / 2.25rem |
| H2 (Section) | Inter | 600 | 24px / 1.5rem |
| H3 (Card title) | Inter | 600 | 18px / 1.125rem |
| Body | Inter | 400 | 16px / 1rem |
| Small / Meta | Inter | 400 | 14px / 0.875rem |
| Badge text | Inter | 500 | 12px / 0.75rem |

---

## 13. Analytics & Metrics

### 13.1 Product Metrics (Tracked Internally)

| Metric | Source | Goal |
|--------|--------|------|
| Daily Active Visitors (public board) | Server logs (no PII) | 100+ DAV by month 3 |
| Submissions per week | Database | 50+ by month 3 |
| Upvotes per submission (median) | Database | ≥ 5 |
| Admin response rate (within 48hrs) | Database | ≥ 80% |
| Resolution rate (monthly) | Database | ≥ 75% |
| Average resolution time | Database | ≤ 7 days |

### 13.2 Technical Metrics (Monitored)

| Metric | Tool | Alert Threshold |
|--------|------|-----------------|
| API error rate (5xx) | Logging middleware | > 1% |
| API latency (p95) | Logging middleware | > 500ms |
| Database connection pool | Prisma metrics | > 80% utilization |
| Image upload failures | Cloudinary webhook | > 5% failure rate |

---

## 14. Security & Privacy

### 14.1 Anonymity Guarantees

| Threat | Mitigation |
|--------|-----------|
| Admin identifies submitter via metadata | Zero metadata collection; no IP, cookies, or user-agent stored |
| Email leaks submitter identity | Email hashed (SHA-256 + salt) and stored in separate table; email encrypted at rest (AES-256) for notification sending |
| Image EXIF data reveals identity | Server strips all EXIF metadata before storage |
| Timing analysis correlates submissions | Submissions processed via queue with random 0-30s delay before public visibility |
| Admin abuses access to find submitter | Audit log tracks all admin queries; no PII exists to find |

### 14.2 Application Security

| Control | Implementation |
|---------|---------------|
| Input sanitization | Zod validation + DOMPurify for HTML content |
| SQL injection | Prisma ORM (parameterized queries) |
| XSS | React's default escaping + CSP headers |
| CSRF | SameSite cookies + CSRF token for admin mutations |
| Rate limiting | Express-rate-limit: 100 req/min public, 200 req/min admin |
| File upload security | File type verification (magic bytes), max size 5MB, Cloudinary processing |
| HTTPS | Enforced via deployment platform (Vercel/Render) |
| Dependency vulnerabilities | `npm audit` in CI pipeline, Dependabot alerts |

### 14.3 Admin Security

- Passwords: bcrypt with cost factor 12
- Failed login lockout: 5 attempts → 15-minute lockout
- Session management: Short-lived JWT + httpOnly refresh cookie
- Password requirements: ≥ 12 characters, mixed case, number, special character

---

## 15. Release Strategy

### 15.1 Phased Rollout

| Phase | Scope | Timeline | Success Gate |
|-------|-------|----------|--------------|
| **Alpha** | Internal team testing, seeded data | Week 1-2 | All critical flows work, zero P0 bugs |
| **Beta** | Pilot with 1 department + 50 student testers | Week 3-4 | ≥ 20 real submissions, admin workflow validated |
| **v1.0 Launch** | Full campus deployment | Week 5-6 | Marketing push, admin training complete |
| **v1.1** | Post-launch fixes + "Should Have" features | Week 7-10 | Email notifications, analytics charts |
| **v1.2** | "Could Have" features | Week 11-14 | Satisfaction ratings, CSV export, trending |

### 15.2 Launch Checklist

- [ ] Admin accounts provisioned for all departments
- [ ] 20+ seed submissions with realistic content (mix of statuses)
- [ ] Admin training session conducted (30-minute walkthrough)
- [ ] Landing page live with trust messaging
- [ ] Email notification pipeline tested end-to-end
- [ ] Load testing completed (500 concurrent users)
- [ ] Security audit completed (OWASP Top 10 checklist)
- [ ] Backup & recovery procedure tested
- [ ] Privacy policy page published
- [ ] Student-facing announcement materials prepared

---

## 16. Risks & Mitigations

| # | Risk | Probability | Impact | Mitigation |
|---|------|:-----------:|:------:|-----------|
| R1 | Platform used for harassment/abuse | Medium | High | Content moderation via admin spam flagging; community guidelines displayed on submission form; rate limiting prevents spam floods |
| R2 | Administration doesn't respond → trust erodes | Medium | Critical | Weekly email digest of pending issues; "Pending > 7 days" alerts on dashboard; public visibility creates social pressure |
| R3 | Low adoption by students | Medium | High | QR code posters across campus; social media campaign; seed with pre-resolved issues showing platform value |
| R4 | Anonymity architecture challenged legally | Low | High | No PII stored; legal review of data architecture; transparent privacy policy |
| R5 | Server downtime during critical period | Low | Medium | Automated health checks; Render/Railway auto-restart; status page |
| R6 | Image storage costs exceed free tier | Low | Low | Compress images before upload; enforce 5MB limit; monitor usage monthly |

---

## 17. Success Criteria

### 17.1 MVP Success (3 months post-launch)

| Criterion | Target | Measurement |
|-----------|--------|-------------|
| Active submissions | ≥ 100 total submissions | Database count |
| Resolution rate | ≥ 60% | (Resolved + Closed) / Total |
| Student return rate | ≥ 30% submit or upvote more than once | Session analytics (non-identifying) |
| Admin engagement | All departments respond within 5 business days | Admin response timestamps |
| System uptime | ≥ 99% | Monitoring tool |

### 17.2 Long-term Success (12 months)

| Criterion | Target |
|-----------|--------|
| Monthly submissions | ≥ 200 |
| Average resolution time | ≤ 5 days |
| Student satisfaction (post-resolution rating) | ≥ 4.0 / 5.0 |
| Adoption by additional institutions | ≥ 1 inquiry |

---

## 18. Appendices

### Appendix A: Glossary

| Term | Definition |
|------|-----------|
| **Tracking ID** | Human-readable unique identifier for a submission (e.g., #CV2026-0157) |
| **Upvote** | A student's endorsement indicating they share the same concern |
| **Priority Score** | Computed value combining upvotes, age, and category weight |
| **Department Admin** | An administrator with permissions scoped to their department |
| **Super Admin** | An administrator with full system access including user management |
| **Proof Image** | A photo uploaded by an admin to demonstrate that an issue has been resolved |
| **Duplicate Detection** | System feature that suggests similar existing submissions during the submission flow |

### Appendix B: Competitive Analysis

| Platform | Anonymity | Public Tracking | Upvoting | Admin Accountability | Open Source |
|----------|:---------:|:---------------:|:--------:|:-------------------:|:-----------:|
| Google Forms | ✅ | ❌ | ❌ | ❌ | ❌ |
| SurveyMonkey | ✅ | ❌ | ❌ | ❌ | ❌ |
| FixMyStreet | ❌ | ✅ | ❌ | ✅ | ✅ |
| Jira Service Desk | ❌ | Partial | ❌ | ✅ | ❌ |
| **CampusVoice** | **✅** | **✅** | **✅** | **✅** | **✅** |

### Appendix C: Email Notification Templates

**Status Change Notification:**
```
Subject: CampusVoice — Your submission #CV2026-0157 status updated

Hi there,

The status of your anonymous submission has been updated:

  Title: Broken AC in Lab 3B
  New Status: In Progress
  Admin Comment: "Maintenance team scheduled for tomorrow morning."

Track your submission: [link]

You received this because you opted in for notifications.
[Unsubscribe]
```

### Appendix D: Seed Data Categories

| Category | Icon | Example Submissions |
|----------|------|-------------------|
| Academics | 📚 | "Course registration system crashes during peak hours" |
| Facilities | 🏫 | "Broken AC in Lab 3B for 2 weeks" |
| Welfare | 💚 | "Cafeteria food quality has declined significantly" |
| Security | 🔒 | "Poor lighting on path between Library and Hostel D" |
| IT Services | 💻 | "Campus WiFi drops every 30 minutes in Block A" |
| Others | 📋 | "Suggestion: Add more water dispensers near sports complex" |

---

*End of Product Requirements Document*

*Document prepared by CampusVoice Product Team — February 2026*
