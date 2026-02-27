import { NextRequest, NextResponse } from "next/server";

const CATEGORIES = ["fresh", "sweet"];


const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const ADMIN_SECRET = process.env.ADMIN_SECRET!;

function isAuthorized(request: NextRequest): boolean {
  const secret =
    request.headers.get("x-admin-secret") ||
    request.nextUrl.searchParams.get("secret");
  return secret?.trim() === ADMIN_SECRET?.trim();
}

/** GET /api/admin/products — list all products */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?order=created_at.desc`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: "Failed to fetch products", detail: text },
      { status: 500 }
    );
  }

  const products = await res.json();
  return NextResponse.json({ products });
}

/** POST /api/admin/products — create a product */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    name, house, category, price5ml,
    description, notes, image_url, active,
  } = body;

  if (!name || !house || !category || !price5ml || !description || !image_url) {
    return NextResponse.json(
      { error: "Missing required fields: name, house, category, price5ml, description, image_url" },
      { status: 400 }
    );
  }

  const slug = String(name).trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const uniqueId = `${slug}-${Date.now().toString(36).slice(-4)}`;

  const product = {
    id: uniqueId,
    name: String(name).trim(),
    house: String(house).trim(),
    category: String(category).trim(),
    price5ml: Number(price5ml),
    description: String(description).trim(),
    notes: Array.isArray(notes) ? notes : [],
    image_url: String(image_url).trim(),
    active: active !== false,
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify(product),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: "Failed to create product", detail: text },
      { status: 500 }
    );
  }

  const data = await res.json();
  return NextResponse.json({ success: true, product: data[0] });
}

/** DELETE /api/admin/products?id=xxx — remove a product */
export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Product id required" }, { status: 400 });
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?id=eq.${id}`,
    {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "return=minimal",
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: "Failed to delete product", detail: text },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

/** PATCH /api/admin/products?id=xxx — update a product */
export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Product id required" }, { status: 400 });
  }

  const body = await request.json();

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?id=eq.${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: "Failed to update product", detail: text },
      { status: 500 }
    );
  }

  const data = await res.json();
  return NextResponse.json({ success: true, product: data[0] });
}
