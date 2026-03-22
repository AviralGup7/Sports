# Tournament Portal

A Next.js tournament portal for public viewers and tournament organizers, backed by Supabase and organized with a feature-sliced V4 architecture.

## Stack

- `Next.js 15` app router
- `Supabase` for auth and persistence
- `Framer Motion` for motion and UI transitions
- `Vitest` for unit tests
- `Playwright` for end-to-end smoke coverage
- `ESLint` flat config with architectural boundary rules

## V4 Structure

- [`app`](/D:/sports%20plan/app) contains routes, layouts, and route handlers only.
- [`features/public`](/D:/sports%20plan/features/public) contains public screens and route-owned UI.
- [`features/admin`](/D:/sports%20plan/features/admin) contains admin screens and admin-only UI.
- [`shared`](/D:/sports%20plan/shared) contains reusable UI primitives, layout shells, feedback, navigation, and motion helpers.
- [`domain`](/D:/sports%20plan/domain) contains framework-free tournament entities and match-engine logic.
- [`server`](/D:/sports%20plan/server) contains Supabase access, auth, snapshot loading, route-facing queries, and admin actions.
- [`styles`](/D:/sports%20plan/styles) is split into tokens, foundations, shared layers, and feature styling.
- [`tests/unit`](/D:/sports%20plan/tests/unit) contains unit tests and [`tests/e2e`](/D:/sports%20plan/tests/e2e) contains Playwright smoke coverage.
- [`supabase/migrations`](/D:/sports%20plan/supabase/migrations) and [`supabase/seeds`](/D:/sports%20plan/supabase/seeds) are the SQL source of truth.

See [`ARCHITECTURE.md`](/D:/sports%20plan/ARCHITECTURE.md) for the boundary rules and folder map.

## Match Engine

- Team sports use stage-aware competition data with `competition_stages` and `competition_groups`.
- Matches support winner and loser routing through `winner_to_match_id`, `winner_to_slot`, `loser_to_match_id`, and `loser_to_slot`.
- Public sport pages expose standings, bracket trees, fixtures, and lineage-aware match views.
- Admin match operations are split into `Builder`, `Live Desk`, and `Bracket Manager` modes.
- Athletics remains on a separate results-card workflow instead of the winner-tree engine.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create or update `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://injuzpqculpfimvmdvvr.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

3. Run the checked-in SQL in Supabase, in this order:

- [`001_v4_schema.sql`](/D:/sports%20plan/supabase/migrations/001_v4_schema.sql)
- [`002_tournament_settings.sql`](/D:/sports%20plan/supabase/migrations/002_tournament_settings.sql)
- [`001_demo_tournament.sql`](/D:/sports%20plan/supabase/seeds/001_demo_tournament.sql)

4. Start development:

```bash
npm run dev
```

## Organizer Workflow

- Create organizer accounts in Supabase Auth.
- Add matching rows in `public.profiles`.
- For `sport_admin` users, add allowed sport mappings in `public.admin_sports`.
- Use `/admin/matches?mode=builder` to generate tournament structures.
- Use `/admin/matches?mode=live` for fixture and result entry.
- Use `/admin/matches?mode=tree` to inspect bracket integrity and winner-tree routing.

## Scripts

- `npm run clean`
- `npm run build`
- `npm run lint`
- `npm run test:unit`
- `npm run test:e2e`

End-to-end runs now use an isolated `.next-e2e` build on port `3100`, so they do not reuse a local `next dev` server or its build artifacts.

Run `npm run clean` before a fresh build or debugging pass if local logs, screenshots, Playwright output, or Next build folders have piled up.

To exercise authenticated admin flows in Playwright, set:

```bash
E2E_ADMIN_EMAIL=organizer@example.com
E2E_ADMIN_PASSWORD=your_password
```

## Deployment Notes

- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in Vercel.
- Keep database passwords and service-role credentials out of the repo.
- Run the V4 migration and seed before expecting hosted public/admin boards to use live staged data.
