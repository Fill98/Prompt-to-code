# AGENTS.md — opencode instruction file

This file instructs AI coding agents working on this codebase. Read it fully before making any changes.

---

## Project Overview

A full-stack control panel system:
- **Frontend:** Next.js 14 (App Router), React, plain CSS (`globals.css`)
- **Backend:** Node.js + Express
- **Database:** SQLite via `better-sqlite3`
- **Ports:** Frontend `:3000`, Backend `:3001`

---

## Directory Structure

```
project/
├── frontend/
│   ├── app/
│   │   ├── layout.jsx          # Root layout: GlobalProvider + Nav + fonts
│   │   ├── globals.css         # All styles; uses CSS variables (design tokens)
│   │   ├── page.jsx            # Dashboard: global toggles + error log viewer
│   │   ├── page1/page.jsx      # Subpage 1
│   │   ├── page2/page.jsx      # Subpage 2
│   │   └── page3/page.jsx      # Subpage 3
│   ├── components/
│   │   ├── Nav.jsx             # Sidebar navigation
│   │   └── SubPage.jsx         # Shared subpage UI (buttons, inputs, table)
│   ├── lib/
│   │   └── GlobalContext.jsx   # React Context for global settings + log API
│   └── package.json
├── backend/
│   ├── index.js                # Express app entry
│   ├── db/database.js          # SQLite init + getDB()
│   ├── routes/logs.js          # /api/logs CRUD
│   ├── routes/global.js        # /api/global GET + PATCH
│   └── package.json
└── docs/
    ├── AGENTS.md               # This file
    └── riesenie.md             # Solution notes (Slovak)
```

---

## Setup Instructions

### Backend
```bash
cd backend
npm install
npm run dev       # uses nodemon; or: npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Set env var if backend is not on localhost:3001:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

---

## Core Business Rules (do NOT break these)

### 1. Global Settings
- Stored in `global_settings` table (always row `id=1`)
- Three boolean fields: `buttons_disabled`, `inputs_disabled`, `tables_hidden`
- Frontend polls `/api/global` every 5 seconds to stay in sync across tabs
- PATCH endpoint does a partial update; always fetch current row before updating

### 2. ERROR Detection
- If **any** text input on a subpage has value exactly `"ERROR"` (case-insensitive trim):
  - All 3 buttons on that page get class `btn-error` (red + pulse animation)
  - A POST to `/api/logs` is sent with `{ page, field_name, message }`
  - Log is sent **only once per field per ERROR entry** — see `errorSentRef` in `SubPage.jsx`
  - Log is sent **even if buttons are globally disabled**

### 3. Log Storage
- Table: `error_logs(id, page, field_name, message, timestamp)`
- Visible on Dashboard, auto-refreshes every 6 seconds
- Can be cleared via DELETE `/api/logs`

### 4. Animations (preserve these)
- Page transitions: `fadeIn` on `.main-content`
- Button click feedback: `scale(0.96)` + temporary ✓ icon
- ERROR button color change: `errorPulse` keyframe (red glow)
- Input ERROR: `inputShake` keyframe
- Table reveal: `tableReveal` scaleY animation
- DO NOT remove these; they are part of the UX requirements

---

## Coding Conventions

### Frontend
- **Client components** that use hooks/context must have `'use client'` at top
- **Server components** (just rendering) should NOT have `'use client'` — e.g. page1/page.jsx
- CSS: add new styles to `globals.css` using existing CSS variables; no inline styles for layout
- New button variants: add CSS class to `globals.css`, apply via `className` in JSX
- Never use `<form>` elements — use `onClick`/`onChange` handlers directly
- Context: use `useGlobal()` hook; never fetch `/api/global` directly from a subpage

### Backend
- All DB operations must use **prepared statements** via `better-sqlite3` (synchronous API)
- Never use string interpolation in SQL queries
- Validate required fields before DB operations; return 400 on missing data
- Use `console.log` for operation confirmations, `console.error` for failures

### Shared
- Backend URL in frontend: always via `process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'`
- Do not hardcode ports anywhere else

---

## Common Tasks

### Add a 4th subpage
1. Create `frontend/app/page4/page.jsx` — copy from page1, change `pageName` and `accent`
2. Add nav entry in `components/Nav.jsx` links array

### Add a new global toggle
1. Add column to `global_settings` table in `db/database.js` (with `ALTER TABLE` or recreate)
2. Add PATCH handling in `routes/global.js`
3. Add toggle row in `app/page.jsx` Dashboard
4. Consume in `GlobalContext.jsx` state + `SubPage.jsx`

### Change table data
- Edit `SAMPLE_DATA` array in `components/SubPage.jsx`
- For dynamic data: add a GET endpoint in backend, fetch in SubPage via `useEffect`

### Change design tokens (colors, fonts)
- Edit CSS variables in `:root` block at the top of `app/globals.css`
- Font changes also require updating the `<link>` tag in `app/layout.jsx`

---

## What NOT to do

- Do NOT add `localStorage` or `sessionStorage` usage
- Do NOT bypass `GlobalContext` by fetching settings directly in subpages
- Do NOT use raw SQL strings — always prepared statements
- Do NOT add a build step, ORM, or migration tool without discussion
- Do NOT change `better-sqlite3` to an async SQLite library (the sync API is intentional)
- Do NOT remove the `errorSentRef` deduplication logic in `SubPage.jsx`
