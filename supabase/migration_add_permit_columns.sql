-- Migration: add permit columns to an existing `applications` table and
-- backfill the seed rows. Run this in the Supabase SQL editor if you set up the
-- database before permit details existed.

alter table applications
  add column if not exists permit_number text;
alter table applications
  add column if not exists valid_until date;

-- Backfill the demo rows.
update applications set permit_number = 'PRM-2026-0001', valid_until = '2027-05-12'
  where passport = 'P12345' and vfs_ref = 'VFS001';
update applications set permit_number = 'PRM-2026-0002', valid_until = '2028-04-28'
  where passport = 'P99999' and vfs_ref = 'VFS002';
update applications set permit_number = null, valid_until = null
  where passport = 'P55555' and vfs_ref = 'VFS003';
