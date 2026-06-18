import { NextResponse } from "next/server";
import { mockUsers } from "@/lib/mockData";
import { getSupabaseClient } from "@/lib/supabaseClient";

// Get-or-create a user and return their category ("premium" | "standard").
// New self-service users always default to "standard". Premium users are
// created out of band by an admin, so they already exist when they log in.
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
      const { data: existing, error: selectError } = await supabase
        .from("users")
        .select("email, type")
        .eq("email", email)
        .maybeSingle();

      if (selectError) throw selectError;

      if (existing) {
        return NextResponse.json({ ok: true, email, type: existing.type });
      }

      const { data: created, error: insertError } = await supabase
        .from("users")
        .insert({ email, type: "standard" })
        .select("email, type")
        .single();

      if (insertError) throw insertError;
      return NextResponse.json({ ok: true, email, type: created.type });
    }

    // Mock fallback.
    let user = mockUsers.find((u) => u.email === email);
    if (!user) {
      user = { email, type: "standard" };
      mockUsers.push(user);
    }
    return NextResponse.json({ ok: true, email, type: user.type });
  } catch (err) {
    console.error("[api/user] failed to resolve user:", err?.message || err);
    return NextResponse.json(
      { ok: false, message: "Could not resolve user account." },
      { status: 500 }
    );
  }
}
