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

- ✅ **Weekly Routine Grid**: Sunday–Saturday tracking with real-time updates
- ✅ **Customizable Schedule**: 12 daily activities with inline time labels (Wake Up, DevOps Pr, Sleep, etc.)
- ✅ **Status Tracking**: Mark activities as On Time (✅), Delayed (⏳), or Unable (❌)
- ✅ **Auto-Fill Logic**: Automatically marks past, unfilled activities as "Unable" for accurate daily scoring
- ✅ **Daily Breakdown**: Visual progression bar spanning the routine score every day
- ✅ **Mobile-Responsive**: Accessible on phone browsers with a dedicated dropdown-based user menu for easy reading 
- ✅ **Authentication**: Secure Email/Password login powered by Supabase with persistent sessions
- ✅ **Theme Customization**: Beautiful light and dark themes using next-themes
- ✅ **Therapist-Assigned**: Built with love and specifically meant for tracking therapy homework 🖥️✨

## Additional Notes
- To update or re-initialize the baseline schedule (the 12 custom columns), you can run the SQL query inside [`update_activities.sql`](./update_activities.sql) in your Supabase SQL editor.

## Built By

[Rakib](https://github.com/Rakib404H) 💜
