# Daily Routine Tracker 🌅

A modern weekly routine tracker built as part of therapist-assigned homework. Track your daily habits, visualize progress, and build consistency.

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **shadcn/ui** + Tailwind CSS
- **Supabase** (Auth + PostgreSQL)

## Getting Started

### 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL from [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) in the SQL Editor
3. Copy `.env.local.example` to `.env.local` and add your credentials:

```bash
cp .env.local.example .env.local
```

### 2. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- ✅ Email/password authentication
- ✅ Weekly routine grid (Sunday–Saturday)
- ✅ 9 daily activities with time labels
- ✅ Toggle completion with animated checkmarks
- ✅ Daily completion percentages
- ✅ Week navigation (prev/next/today)
- ✅ Today column highlighting
- ✅ Therapist homework acknowledgment
- ✅ Dark mode by default
- ✅ Responsive design

## Built By

[Rakib](https://github.com/Rakib404H) 💜
