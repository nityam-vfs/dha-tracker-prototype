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
    submitted: "2026-05-12",
  },
  {
    id: 2,
    passport: "P99999",
    vfs_ref: "VFS002",
    status: "Approved",
    applicant: "Jane Smith",
    type: "Visa Application",
    submitted: "2026-04-28",
  },
  {
    id: 3,
    passport: "P55555",
    vfs_ref: "VFS003",
    status: "Rejected",
    applicant: "Michael Brown",
    type: "Visa Application",
    submitted: "2026-05-01",
  },
];

// In-memory list of "signed up" users (mock fallback for sign-up).
export const mockUsers = [];
