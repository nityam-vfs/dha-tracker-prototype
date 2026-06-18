// Mock application database used when Supabase is not configured.
// This keeps the prototype fully runnable locally with zero setup.
//
// Supabase table equivalent:
//   table: applications
//   columns: id, passport, vfs_ref, status

export const applications = [
  {
    id: 1,
    passport: "P12345",
    vfs_ref: "VFS001",
    status: "Under Process",
    applicant: "John Doe",
    type: "Visa Application",
    permit_number: "PRM-2026-0001",
    valid_until: "2027-05-12",
    submitted: "2026-05-12",
  },
  {
    id: 2,
    passport: "P99999",
    vfs_ref: "VFS002",
    status: "Approved",
    applicant: "Jane Smith",
    type: "Visa Application",
    permit_number: "PRM-2026-0002",
    valid_until: "2028-04-28",
    submitted: "2026-04-28",
  },
  {
    id: 3,
    passport: "P55555",
    vfs_ref: "VFS003",
    status: "Rejected",
    applicant: "Michael Brown",
    type: "Visa Application",
    permit_number: "—",
    valid_until: "—",
    submitted: "2026-05-01",
  },
];

// In-memory user list (mock fallback when Supabase is not configured).
// `type` is for backend categorization only and is never shown in the UI.
//   - "premium":  created offline by an admin; tracks/views status for free.
//   - "standard": default for self sign-ups; pays per record searched.
//
// Premium users are seeded here for local testing. In production they are
// inserted directly into the Supabase `users` table out of band.
export const mockUsers = [{ email: "premium@vfs.com", type: "premium" }];

// Price charged to standard users per application record searched (USD).
export const PRICE_PER_RECORD = 5;
