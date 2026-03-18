# Tournament Portal App Plan

## Summary
- Build **one responsive web app with two areas**:
  - **Public side** for students, teams, and viewers
  - **Protected admin side** for 1-3 organizers
- Recommended stack:
  - **Next.js** for the web app
  - **Supabase** for database, auth, and live updates
  - **Vercel** for hosting
- Why this is the best fit:
  - One codebase is easier to build, cheaper to host, and simpler to maintain
  - Public and admin can share the same data instantly
  - Works well on both **mobile browser and PC browser**
  - Easy to grow later without rebuilding from scratch

## Main Product Decision
- **Recommended:** `1 app, 2 areas`
  - Public routes like `/`, `/sports/cricket`, `/schedule`, `/announcements`
  - Admin routes like `/admin`, `/admin/matches`, `/admin/teams`
  - Admin is protected by login and role checks
- Choice 2: `1 app with only a hidden /admin route`
  - Slightly faster to build
  - Fine if only one organizer manages everything
  - Less clean for long-term growth
- Choice 3: `2 separate apps`
  - Better separation and security boundaries
  - More work, more deployment setup, more maintenance
  - Not recommended for your first college tournament version

## App Features
- **Public side**
  - Tournament home page with branding, dates, sports, and quick stats
  - Match schedule by day and by sport
  - Brackets and knockout progression
  - Match detail pages with winner, score, status, venue, and notes
  - Announcements / notices board
  - Champions board and summary dashboard
  - Mobile-friendly navigation and touch-sized controls
- **Admin side**
  - Secure login
  - Dashboard with today’s matches and quick-edit actions
  - Team management
  - Fixture and bracket management
  - Result entry with winner + basic score + match status
  - Announcement management
  - Sport filtering so admins can work faster during the event
- **Not in v1**
  - Team/player self-registration
  - Full sport-specific scorecards
  - Gallery/media portal
  - Payments or advanced reporting

## Important Interfaces And Data Model
- **Routes**
  - `/`
  - `/schedule`
  - `/sports/[sport]`
  - `/matches/[matchId]`
  - `/announcements`
  - `/admin`
  - `/admin/teams`
  - `/admin/matches`
  - `/admin/announcements`
  - `/admin/settings`
- **Core entities**
  - `User`: id, name, email, role
  - `Role`: `super_admin`, `sport_admin`
  - `Sport`: id, name, color, rules summary
  - `Team`: id, name, association, sportIds, seed
  - `Tournament`: id, name, startDate, endDate, venue
  - `Match`: id, sportId, round, day, startTime, venue, teamAId, teamBId, status
  - `MatchResult`: matchId, winnerTeamId, scoreSummary, note, updatedBy, updatedAt
  - `Announcement`: id, title, body, visibility, pinned, publishedAt
- **Admin actions**
  - Create/edit teams
  - Create/edit fixtures
  - Publish result
  - Update bracket progression automatically after result save
  - Publish announcement
- **Public data behavior**
  - Public users do not log in
  - Public pages are read-only
  - Updates should appear live or after fast refresh from the server, not from browser local storage

## Implementation Changes
- Replace the current single HTML file and `localStorage` state with a real backend-backed app
- Convert hardcoded schedule and team names into database-driven records
- Keep the current useful ideas from the prototype:
  - Sport tabs
  - Day-wise schedule
  - Bracket/champions overview
  - Winner declaration flow
- Redesign the UI as responsive-first:
  - Mobile bottom nav or drawer
  - Desktop sidebar/top nav
  - Larger tap targets for result entry
  - Cleaner card layout for matches
- Add auth and permissions:
  - `super_admin` can manage everything
  - `sport_admin` can manage only assigned sports if needed later
- Add deployment and operations:
  - Public domain
  - Environment variables for database/auth
  - Basic backup/export for teams, matches, and results

## Build Phases
- **Phase 1: Foundation**
  - Set up app, auth, database, hosting, and responsive layout
- **Phase 2: Public experience**
  - Home, schedule, sport pages, brackets, announcements
- **Phase 3: Admin experience**
  - Login, team CRUD, match CRUD, result entry, bracket auto-advance
- **Phase 4: Tournament readiness**
  - Validation, loading/error states, mobile QA, data export, final polish

## Choice Matrix
- **Frontend**
  - Recommended: `Next.js`
  - Faster simple option: `Vite + React`
  - Bigger enterprise option: `Next.js + separate API server`
- **Backend**
  - Recommended: `Supabase`
  - Simpler alternative: `Firebase`
  - More custom option: `Node/Express + PostgreSQL`
- **Hosting**
  - Recommended: `Vercel + Supabase`
  - Alternative: `Netlify + Supabase`
  - Cheapest DIY: `shared VPS`, but more maintenance
- **App install feel**
  - Recommended: normal website first
  - Optional later: add `PWA` so it can be “installed” on phones/home screens
- **Admin separation**
  - Recommended now: same app, protected admin area
  - Split into 2 apps later only if the event grows a lot

## Test Plan
- Public pages load correctly on Android, iPhone, laptop, and desktop browsers
- Admin login blocks unauthorized users from `/admin`
- Team edits and match edits save correctly
- Result entry updates bracket progression correctly
- Public side shows updated winners and scores quickly after admin save
- Schedule filtering by sport/day works on small screens
- Announcements publish/unpublish correctly
- Empty states, loading states, and bad-network behavior are usable during the event

## Assumptions And Defaults
- Hosting will be **online on the internet**
- Version 1 is for **college tournament operations**, not a full event ecosystem
- Admin team is **1-3 trusted organizers**
- Match detail in v1 is **winner + basic score + note**
- Public users are **read-only**, with no login required
- Build should prioritize **reliability and simplicity** over advanced features
