-- Migration: add user categories to an existing `users` table.
-- Run this in the Supabase SQL editor if you set up the database BEFORE the
-- premium/standard rework (fixes "column users.type does not exist" on login).

alter table users
  add column if not exists type text not null default 'standard';

-- Optional: enforce allowed values.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'users_type_check'
  ) then
    alter table users
      add constraint users_type_check check (type in ('premium', 'standard'));
  end if;
end $$;

-- Seed a premium user for testing (premium users are created out of band).
insert into users (email, type) values ('premium@vfs.com', 'premium')
on conflict (email) do update set type = 'premium';
