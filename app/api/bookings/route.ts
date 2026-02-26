import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/bookings — Admin endpoint to list all bookings
 * Protected by ADMIN_SECRET query param or header
 */
export async function GET(request: NextRequest) {
  // ── Auth Check ─────────────────────────────────────────────
  const secret =
    request.nextUrl.searchParams.get("secret") ||
    request.headers.get("x-admin-secret");

  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured. Please add NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local" },
        { status: 503 }
      );
    }

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("DB fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch bookings" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      bookings: data || [],
      count: data?.length || 0,
    });
  } catch (err) {
    console.error("Bookings API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
