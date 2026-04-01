# Supabase setup

Run the SQL in this order:

1. [`001_v4_schema.sql`](/D:/sports%20plan/supabase/migrations/001_v4_schema.sql)
2. [`001_demo_tournament.sql`](/D:/sports%20plan/supabase/seeds/001_demo_tournament.sql)
3. [`002_registration_cleanup.sql`](/D:/sports%20plan/supabase/seeds/002_registration_cleanup.sql) (one-time cleanup for latest registration batch)

Then:

4. Create organizer users in Supabase Auth with email/password.
5. Insert matching rows into `public.profiles` for those auth user IDs.
6. Insert `public.admin_sports` rows for any `sport_admin` accounts.
