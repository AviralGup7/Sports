# Architecture

## Goals

- Keep `app/` thin and route-focused.
- Keep business rules framework-free inside `domain/`.
- Keep Supabase, auth, queries, and mutations in `server/`.
- Keep feature-owned UI inside `features/`.
- Keep reusable building blocks inside `shared/`.

## Folder Map

- [`app`](/D:/sports%20plan/app)
  Route entrypoints, layouts, and route handlers only.
- [`features/public`](/D:/sports%20plan/features/public)
  Public screens and public-only subcomponents.
- [`features/admin`](/D:/sports%20plan/features/admin)
  Admin screens, subcomponents, and route-owned control-room UI.
- [`shared/ui`](/D:/sports%20plan/shared/ui)
  Reusable presentational primitives.
- [`shared/layout`](/D:/sports%20plan/shared/layout)
  Shared shells and layout helpers.
- [`shared/navigation`](/D:/sports%20plan/shared/navigation)
  Cross-route navigation and global chrome.
- [`shared/feedback`](/D:/sports%20plan/shared/feedback)
  Notices, empty states, and other feedback surfaces.
- [`shared/motion`](/D:/sports%20plan/shared/motion)
  Animation wrappers and motion helpers.
- [`domain`](/D:/sports%20plan/domain)
  Entities, types, standings, progression, structure generation, and integrity checks.
- [`server/auth`](/D:/sports%20plan/server/auth)
  Auth/session guards and role helpers.
- [`server/supabase`](/D:/sports%20plan/server/supabase)
  Supabase client creation and env utilities.
- [`server/data/snapshot`](/D:/sports%20plan/server/data/snapshot)
  Snapshot loading and normalization.
- [`server/data/public`](/D:/sports%20plan/server/data/public)
  Public route-facing queries and public view-model types.
- [`server/data/admin`](/D:/sports%20plan/server/data/admin)
  Admin route-facing queries and admin view-model types.
- [`server/actions/admin`](/D:/sports%20plan/server/actions/admin)
  Admin server actions split by domain.
- [`server/mock`](/D:/sports%20plan/server/mock)
  Local fallback tournament snapshot data.
- [`styles`](/D:/sports%20plan/styles)
  Tokens, foundations, shared style layers, and feature styling.
- [`tests/unit`](/D:/sports%20plan/tests/unit)
  Pure unit coverage.
- [`tests/e2e`](/D:/sports%20plan/tests/e2e)
  Browser smoke coverage.

## Boundary Rules

- `app/` should not import `domain/` directly.
- `features/` should depend on `shared/`, `server/data/*` types, and route-facing data, not unrelated features.
- `shared/` should not depend on `features/`.
- `domain/` must remain framework-free and must not depend on `next`, `react`, `server`, or `shared`.
- `server/` is the only layer that should talk to Supabase or own route-facing data composition.

## Route Pattern

Each route file should do only four things:

1. Parse params and search params.
2. Run the auth gate if needed.
3. Call one route-facing query.
4. Render one top-level feature screen.

## Match Engine Split

- [`domain/matches/standings.ts`](/D:/sports%20plan/domain/matches/standings.ts) computes public standings summaries from current match results.
- [`domain/matches/progression.ts`](/D:/sports%20plan/domain/matches/progression.ts) handles winner and loser advancement.
- [`domain/matches/structure-generator.ts`](/D:/sports%20plan/domain/matches/structure-generator.ts) builds stage structures.
- [`domain/matches/integrity.ts`](/D:/sports%20plan/domain/matches/integrity.ts) reports bracket integrity issues.

## Review Hygiene

- Ignore generated output such as `.next/`, `.next-e2e/`, `coverage/`, and `test-results/` during repo audits unless you are debugging build/test artifacts.
- Use [`scripts/clean-workspace.mjs`](/D:/sports%20plan/scripts/clean-workspace.mjs) to remove cached build artifacts, screenshots, and local logs before a fresh verification pass.

## SQL Run Order

1. [`001_v4_schema.sql`](/D:/sports%20plan/supabase/migrations/001_v4_schema.sql)
2. [`001_demo_tournament.sql`](/D:/sports%20plan/supabase/seeds/001_demo_tournament.sql)
