import { NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/products";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * GET /api/products
 *
 * Priority:
 *  1. Supabase `products` table (active=true) — admin manages this
 *  2. Hardcoded lib/products.ts — only used if Supabase is empty/unreachable
 *
 * NOTE: We do NOT merge. If Supabase has any products, those are the
 * source of truth. Deleting in admin removes from Supabase → removed here.
 */
export async function GET() {
  // Hardcoded baseline (for when DB isn't set up yet)
  const hardcoded = PRODUCTS.map((p) => ({
    id: p.id,
    name: p.name,
    house: p.house,
    category: p.category,
    price5ml: p.price5ml,
    description: p.description,
    notes: p.notes,
    image: p.image,
    image_url: p.image,
  }));

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ products: hardcoded, source: "fallback" });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s max

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?active=eq.true&order=created_at.asc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        cache: "no-store",
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const dbProducts = await res.json();

      // ── Supabase has rows → use it as sole source of truth ──────────
      // Deletions in admin are reflected here automatically.
      if (Array.isArray(dbProducts) && dbProducts.length > 0) {
        const normalised = dbProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          house: p.house,
          category: p.category,
          price5ml: Number(p.price5ml),
          description: p.description,
          notes: Array.isArray(p.notes) ? p.notes : [],
          image: p.image_url,
          image_url: p.image_url,
        }));
        return NextResponse.json({ products: normalised, source: "supabase" });
      }
    }
  } catch {
    // Timeout or network error — silently fall through to hardcoded
  }

  // ── Supabase empty or unreachable → use hardcoded fallback ─────────
  return NextResponse.json({ products: hardcoded, source: "fallback" });
}
