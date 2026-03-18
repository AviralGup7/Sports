# Supabase setup

1. Run `supabase/schema.sql` in the Supabase SQL editor.
2. Run `supabase/seed.sql` after the schema succeeds.
3. Create organizer users in Supabase Auth with email/password.
4. Insert matching rows into `public.profiles` for those auth user IDs.
5. Insert `public.admin_sports` rows for any `sport_admin` accounts.
