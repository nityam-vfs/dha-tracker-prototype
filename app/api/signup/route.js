import { NextResponse } from "next/server";
import { mockUsers } from "@/lib/mockData";
import { getSupabaseClient } from "@/lib/supabaseClient";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request payload." },
      { status: 400 }
    );
  }

  const email = (body?.email || "").toString().trim().toLowerCase();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!valid) {
    return NextResponse.json(
      { ok: false, message: "A valid email is required." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseClient();

  try {
    if (supabase) {
      // Upsert keeps sign-up idempotent. Requires a "users" table (email text).
      const { error } = await supabase
        .from("users")
        .upsert({ email }, { onConflict: "email" });

      if (error) throw error;
      return NextResponse.json({ ok: true, email });
    }

    // Mock fallback: store in-memory (resets on server restart).
    if (!mockUsers.includes(email)) {
      mockUsers.push(email);
    }
    return NextResponse.json({ ok: true, email });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Could not complete sign up." },
      { status: 500 }
    );
  }
}
