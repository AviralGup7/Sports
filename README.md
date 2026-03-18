# Tournament Portal

A Next.js tournament portal for public viewing and organizer control, backed by Supabase and styled with the Arena Broadcast design system.

## Stack

- `Next.js 15` app router
- `Supabase` for auth and persistence
- `Framer Motion` for lightweight motion
- `Vitest` for unit tests
- `Playwright` for end-to-end smoke coverage

## V3 Match Engine

- Team sports now use a staged competition model with `competition_stages` and `competition_groups`.
- Matches support stage-aware winner and loser routing through `winner_to_match_id`, `winner_to_slot`, `loser_to_match_id`, and `loser_to_slot`.
- Structured results now include `team_a_score`, `team_b_score`, and `decision_type`.
- Public sport pages expose standings, bracket tree, fixtures, and lineage-aware match views.
- Admin match operations are split into `Builder`, `Live Desk`, and `Bracket Manager` modes.
- Athletics remains on a separate results-card workflow rather than the bracket engine.

## Architecture

- Domain types live in [`lib/types-domain.ts`](/D:/sports%20plan/lib/types-domain.ts).
- UI/view-model types live in [`lib/types-view.ts`](/D:/sports%20plan/lib/types-view.ts).
- [`lib/data.ts`](/D:/sports%20plan/lib/data.ts) is the public barrel for formatting and selectors.
- Snapshot loading stays in [`lib/repository-snapshot.ts`](/D:/sports%20plan/lib/repository-snapshot.ts).
- Derived page/view assembly lives in [`lib/data-views.ts`](/D:/sports%20plan/lib/data-views.ts).
- Progression logic, standings, and structure generation live in [`lib/progression.ts`](/D:/sports%20plan/lib/progression.ts).
- Admin mutations are split by domain under [`lib/admin-actions`](/D:/sports%20plan/lib/admin-actions).

## Design System

- [`app/globals.css`](/D:/sports%20plan/app/globals.css) imports the style system entrypoints.
- [`styles/tokens.css`](/D:/sports%20plan/styles/tokens.css) defines design tokens.
- [`styles/base.css`](/D:/sports%20plan/styles/base.css) holds reset, focus, and accessibility primitives.
- [`styles/layout.css`](/D:/sports%20plan/styles/layout.css) contains shared shell and backdrop layout rules.
- [`styles/public/broadcast.css`](/D:/sports%20plan/styles/public/broadcast.css) contains public broadcast surfaces and winner-tree styling.
- [`styles/admin/control-room.css`](/D:/sports%20plan/styles/admin/control-room.css) contains admin control-room styling.
- [`styles/responsive.css`](/D:/sports%20plan/styles/responsive.css) contains motion reduction and breakpoint rules.

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

3. Run the checked-in SQL in Supabase:

- [`supabase/schema.sql`](/D:/sports%20plan/supabase/schema.sql)
- [`supabase/seed.sql`](/D:/sports%20plan/supabase/seed.sql)

4. Start development:

```bash
npm run dev
```

## Admin Workflow

- Create organizer accounts in Supabase Auth.
- Add matching rows in `public.profiles`.
- For `sport_admin` users, add allowed sport mappings in `public.admin_sports`.
- Use `/admin/matches?mode=builder` to generate tournament structures.
- Use `/admin/matches?mode=live` for fixture and result entry.
- Use `/admin/matches?mode=tree` to inspect bracket integrity and winner-tree routing.
- Admin routes are protected under `/admin` and rely on the Supabase session cookie flow.

## Tests

- Build:

```bash
npm run build
```

- Lint:

```bash
npm run lint
```

- Unit tests:

```bash
npm run test:unit
```

- End-to-end smoke tests:

```bash
npm run test:e2e
```

To exercise authenticated admin flows in Playwright, set:

```bash
E2E_ADMIN_EMAIL=organizer@example.com
E2E_ADMIN_PASSWORD=your_password
```

## Deployment Notes

- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in Vercel.
- Keep the database password and service-role credentials out of the repo.
- Run the V3 schema and seed before expecting the public and admin boards to use live staged data.
- Re-run [`supabase/seed.sql`](/D:/sports%20plan/supabase/seed.sql) if you want the hosted project reset to the staged demo tournament.