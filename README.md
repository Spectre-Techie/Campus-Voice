# CampusVoice

**Anonymous Feedback & Accountability Platform**

> Submit anonymously. Track publicly. See real action.

---

## Quick Start

```bash
# Install all dependencies
pnpm install

# Start both client and server
pnpm dev

# Or run individually
pnpm dev:client    # Next.js on http://localhost:3000
pnpm dev:server    # Express on http://localhost:5000
```

## Project Structure

```
campusvoice/
├── client/          # Next.js 14 frontend (TypeScript + Tailwind + shadcn/ui)
├── server/          # Express.js backend (TypeScript + Prisma)
├── shared/          # Shared types & constants
├── pnpm-workspace.yaml
└── package.json
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js + TypeScript + Tailwind CSS + shadcn/ui |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Images | Cloudinary |
| Auth | JWT |

## Environment Variables

Copy the example files and fill in your values:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env.local
```

## Useful Commands

```bash
pnpm -F server prisma studio       # Open visual DB editor
pnpm -F server prisma migrate dev  # Create & run migration
pnpm -F server prisma db seed      # Run seed script
pnpm -F client build               # Build frontend
pnpm -F server build               # Build backend
```

---

Built with transparency in mind.
