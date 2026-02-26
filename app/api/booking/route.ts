import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendTelegramNotification } from "@/lib/telegram";
import { getProductById } from "@/lib/products";
import { isRateLimited } from "@/lib/rateLimiter";

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
    const product = getProductById(body.productId);
    if (!product) {
      return NextResponse.json({ error: "Invalid product selected" }, { status: 400 });
    }

    const quantity = Math.max(1, parseInt(body.quantity) || 1);
    const totalPrice = product.price * quantity;

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
      total_price: totalPrice,
      room_number: body.roomNumber.trim(),
      notes: body.notes?.trim() || null,
      quantity: quantity,
      status: "confirmed",
    };

    // ── Save to Supabase ──────────────────────────────────────────
    if (supabase) {
      const { error: dbError } = await supabase
        .from("bookings")
        .insert([bookingData]);

      if (dbError) {
        console.error("Database error:", dbError);
        // Don't block the booking if DB fails — still send Telegram
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
