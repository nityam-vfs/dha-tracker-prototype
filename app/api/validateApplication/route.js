import { NextResponse } from "next/server";
import { applications } from "@/lib/mockData";
import { getSupabaseClient } from "@/lib/supabaseClient";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { valid: false, message: "Invalid request payload." },
      { status: 400 }
    );
  }

  const passport = (body?.passport || "").toString().trim();
  const vfs_ref = (body?.vfs_ref || "").toString().trim();

  if (!passport || !vfs_ref) {
    return NextResponse.json(
      {
        valid: false,
        message: "Passport number and VFS reference are required.",
      },
      { status: 400 }
    );
  }

  // Prefer Supabase when configured; otherwise use mock data.
  const supabase = getSupabaseClient();

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .ilike("passport", passport)
        .ilike("vfs_ref", vfs_ref)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return NextResponse.json(
          { valid: false, message: "No matching application found." },
          { status: 404 }
        );
      }

      return NextResponse.json({ valid: true, application: data });
    }

    // Mock data path (case-insensitive match).
    const match = applications.find(
      (a) =>
        a.passport.toLowerCase() === passport.toLowerCase() &&
        a.vfs_ref.toLowerCase() === vfs_ref.toLowerCase()
    );

    if (!match) {
      return NextResponse.json(
        { valid: false, message: "No matching application found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ valid: true, application: match });
  } catch (err) {
    return NextResponse.json(
      { valid: false, message: "Server error while validating application." },
      { status: 500 }
    );
  }
}
