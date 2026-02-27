import { NextRequest, NextResponse } from "next/server";
import { sendTelegramNotification } from "@/lib/telegram";
import { getProductById, getPrice10ml } from "@/lib/products";
import { isRateLimited } from "@/lib/rateLimiter";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Try to find a product by ID — checks Supabase first, then hardcoded list */
async function resolveProduct(productId: string) {
  // 1. Try Supabase products table
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(productId)}&active=eq.true&limit=1`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      );
      if (res.ok) {
        const rows = await res.json();
        if (rows.length > 0) {
          const p = rows[0];
          return { id: p.id, name: p.name, house: p.house, price5ml: Number(p.price5ml) };
        }
      }
    } catch { /* fall through */ }
  }
  // 2. Fallback: hardcoded list
  const p = getProductById(productId);
  if (p) return { id: p.id, name: p.name, house: p.house, price5ml: p.price5ml };
  return null;
}

/**
 * Generate a unique booking ID: BK-YYYY-XXX
 */
function generateBookingId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900) + 100; // 100-999
  const timestamp = Date.now().toString(36).slice(-3).toUpperCase();
  return `BK-${year}-${random}${timestamp}`;
}

/**
 * Validate booking data
 */
function validateBooking(data: any): string | null {
  if (!data.name || typeof data.name !== "string" || data.name.trim().length < 2) {
    return "Full name is required (minimum 2 characters)";
  }
  if (!data.phone || typeof data.phone !== "string" || data.phone.trim().length < 8) {
    return "Valid phone number is required (minimum 8 digits)";
  }
  if (!data.productId || typeof data.productId !== "string") {
    return "Please select a product";
  }
  if (!data.size || !["5ml", "10ml"].includes(data.size)) {
    return "Please select a decant size (5ml or 10ml)";
  }
  if (!data.roomNumber || typeof data.roomNumber !== "string" || data.roomNumber.trim().length < 1) {
    return "Room number / address is required";
  }
  // Basic phone validation — digits, spaces, dashes, plus
  const phoneClean = data.phone.replace(/[\s\-\+\(\)]/g, "");
  if (!/^\d{8,15}$/.test(phoneClean)) {
    return "Phone number must contain 8-15 digits";
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    // ── Rate Limiting ─────────────────────────────────────────────
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    // ── Parse & Validate ──────────────────────────────────────────
    const body = await request.json();
    const validationError = validateBooking(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // ── Lookup Product & Price ─────────────────────────────────────
    const product = await resolveProduct(body.productId);
    if (!product) {
      return NextResponse.json({ error: "Invalid product selected" }, { status: 400 });
    }

    const size: string = body.size; // "5ml" | "10ml"
    const unitPrice = size === "10ml" ? getPrice10ml(product.price5ml) : product.price5ml;
    const quantity = Math.max(1, parseInt(body.quantity) || 1);
    const totalPrice = unitPrice * quantity;

    // ── Generate Booking ──────────────────────────────────────────
    const bookingId = generateBookingId();
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-MY", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const bookingData = {
      booking_id: bookingId,
      name: body.name.trim(),
      phone: body.phone.trim(),
      product: product.name,
      size,
      total_price: totalPrice,
      room_number: body.roomNumber.trim(),
      notes: body.notes?.trim() || null,
      quantity: quantity,
      status: "confirmed",
    };

    // ── Save to Supabase (direct REST — bypasses JS client schema cache) ──
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const dbRes = await fetch(`${supabaseUrl}/rest/v1/bookings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": supabaseKey,
            "Authorization": `Bearer ${supabaseKey}`,
            "Prefer": "return=minimal",
          },
          body: JSON.stringify(bookingData),
        });

        if (!dbRes.ok) {
          const errText = await dbRes.text();
          console.error("Supabase REST insert error:", dbRes.status, errText);
        } else {
          console.log("✅ Booking saved to Supabase.");
        }
      } catch (fetchErr) {
        console.error("Supabase fetch error:", fetchErr);
      }
    } else {
      console.warn("Supabase not configured — skipping DB save");
    }

    // ── Send Telegram Notification ────────────────────────────────
    const telegramSent = await sendTelegramNotification({
      bookingId,
      name: bookingData.name,
      phone: bookingData.phone,
      product: bookingData.product,
      size,
      totalPrice,
      roomNumber: bookingData.room_number,
      notes: bookingData.notes || undefined,
      date: dateStr,
    });

    // ── Return Response ───────────────────────────────────────────
    return NextResponse.json({
      success: true,
      booking: {
        id: bookingId,
        name: bookingData.name,
        product: bookingData.product,
        size,
        totalPrice,
        roomNumber: bookingData.room_number,
        date: dateStr,
        quantity,
      },
      telegramSent,
      message: "Booking confirmed! You will receive a confirmation shortly.",
    });
  } catch (err) {
    console.error("Booking API error:", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
