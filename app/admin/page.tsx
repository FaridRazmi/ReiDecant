"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

/* ── Types ──────────────────────────────────────────────────────────────── */
interface Booking {
  id: number;
  booking_id: string;
  name: string;
  phone: string;
  product: string;
  size?: string;
  total_price: number;
  room_number: string;
  notes: string | null;
  quantity: number;
  status: string;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  house: string;
  category: string;
  price5ml: number;
  description: string;
  notes: string[];
  image_url: string;
  active: boolean;
  created_at: string;
}

const CATEGORIES = ["fresh", "sweet"];

/* ═══════════════════════════════════════════════════════════════════════════
   Main page
═══════════════════════════════════════════════════════════════════════════ */
export default function AdminPage() {
  const [secret, setSecret]           = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [tab, setTab]                 = useState<"bookings" | "products">("bookings");
  const [bookings, setBookings]       = useState<Booking[]>([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [stats, setStats]             = useState({ total: 0, revenue: 0, today: 0 });

  /* ── Auth & Bookings ─────────────────────────────────────────────────── */
  const fetchBookings = async () => {
    setLoading(true); setError("");
    try {
      const res  = await fetch(`/api/bookings?secret=${encodeURIComponent(secret)}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to fetch"); setAuthenticated(false); return; }
      setBookings(data.bookings);
      setAuthenticated(true);
      const today    = new Date().toDateString();
      const todayB   = data.bookings.filter((b: Booking) => new Date(b.created_at).toDateString() === today);
      const revenue  = data.bookings.reduce((s: number, b: Booking) => s + (b.total_price || 0), 0);
      setStats({ total: data.bookings.length, revenue, today: todayB.length });
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  };

  const handleLogin = (e: React.FormEvent) => { e.preventDefault(); fetchBookings(); };
  const handleLogout = () => { setAuthenticated(false); setSecret(""); setBookings([]); };

  return (
    <main className="bg-black min-h-screen text-white">
      {/* ── Topbar ───────────────────────────────────────────────────── */}
      <header className="border-b border-white/5 px-6 md:px-10 py-5 flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur-xl z-40">
        <a href="/" className="font-bebas text-2xl tracking-widest">
          REI<span style={{ color: "var(--gold)" }}>DECANT</span>
          <span className="font-manrope text-[10px] ml-3 tracking-[0.3em] text-white/30 uppercase">Admin</span>
        </a>
        {authenticated && (
          <div className="flex items-center gap-6">
            {/* Tab switcher */}
            <div className="hidden md:flex items-center gap-1 p-1 rounded-full border border-white/10 bg-white/[0.02]">
              {(["bookings", "products"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="font-manrope text-[11px] tracking-widest uppercase px-5 py-2 rounded-full transition-all duration-300"
                  style={{
                    background: tab === t ? "var(--gold)" : "transparent",
                    color: tab === t ? "#000" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            <button onClick={handleLogout} className="font-manrope text-xs tracking-widest text-white/40 hover:text-white transition-colors uppercase">
              Logout
            </button>
          </div>
        )}
      </header>

      <div className="px-6 md:px-10 py-10 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!authenticated ? (
            /* ── Login ───────────────────────────────────────────────── */
            <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-sm mx-auto mt-20">
              <h1 className="font-bebas text-center mb-10" style={{ fontSize: "clamp(36px, 6vw, 56px)" }}>
                ADMIN <span className="gradient-gold">ACCESS</span>
              </h1>
              <form onSubmit={handleLogin} className="space-y-4">
                <input type="password" value={secret} onChange={(e) => setSecret(e.target.value)}
                  placeholder="Enter admin secret..." className="form-input text-center" required />
                {error && <p className="text-red-400 text-sm text-center font-manrope">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full font-manrope text-xs tracking-[0.2em] uppercase py-3 rounded-full border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-all disabled:opacity-50">
                  {loading ? "Verifying..." : "Login →"}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* ── Mobile tab switcher ─────────────────────────────── */}
              <div className="flex md:hidden items-center gap-2 mb-8">
                {(["bookings", "products"] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)}
                    className="font-manrope text-[11px] tracking-widest uppercase px-5 py-2.5 rounded-full border transition-all"
                    style={{
                      background: tab === t ? "var(--gold)" : "transparent",
                      borderColor: tab === t ? "var(--gold)" : "rgba(255,255,255,0.15)",
                      color: tab === t ? "#000" : "rgba(255,255,255,0.4)",
                    }}>
                    {t}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {tab === "bookings" ? (
                  <motion.div key="bookings-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <BookingsTab bookings={bookings} stats={stats} onRefresh={fetchBookings} />
                  </motion.div>
                ) : (
                  <motion.div key="products-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ProductsTab secret={secret} />
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Bookings Tab
═══════════════════════════════════════════════════════════════════════════ */
function BookingsTab({ bookings, stats, onRefresh }: { bookings: Booking[]; stats: { total: number; revenue: number; today: number }; onRefresh: () => void }) {
  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Total Bookings" value={String(stats.total)} delay={0} />
        <StatCard label="Total Revenue"  value={`RM${stats.revenue.toFixed(0)}`} delay={0.1} />
        <StatCard label="Today"          value={String(stats.today)} delay={0.2} />
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bebas text-2xl tracking-wide">
          RECENT <span className="gradient-gold">BOOKINGS</span>
        </h2>
        <button onClick={onRefresh} className="font-manrope text-[11px] tracking-widest uppercase text-white/40 hover:text-[var(--gold)] transition-colors">
          ↻ Refresh
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-manrope text-white/30 text-sm">No bookings yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {["Booking ID","Name","Phone","Product","Size","Room","Total","Status","Date"].map((h) => (
                  <th key={h} className="font-manrope text-[10px] tracking-[0.2em] uppercase text-white/30 py-3 px-3 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <motion.tr key={b.booking_id || i}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-mono text-xs text-[var(--gold)]">{b.booking_id}</td>
                  <td className="py-3 px-3 font-manrope text-sm text-white/80">{b.name}</td>
                  <td className="py-3 px-3 font-manrope text-xs text-white/50">{b.phone}</td>
                  <td className="py-3 px-3 font-manrope text-xs text-white/60 max-w-[150px] truncate">{b.product}</td>
                  <td className="py-3 px-3 font-manrope text-xs text-white/50">{b.size || "—"}</td>
                  <td className="py-3 px-3 font-manrope text-xs text-white/50">{b.room_number}</td>
                  <td className="py-3 px-3 font-bebas text-lg text-white">RM{b.total_price}</td>
                  <td className="py-3 px-3">
                    <span className="font-manrope text-[10px] tracking-widest uppercase px-3 py-1 rounded-full"
                      style={{
                        background: b.status === "confirmed" ? "rgba(72,187,120,0.15)" : "rgba(197,160,89,0.15)",
                        color: b.status === "confirmed" ? "#48BB78" : "var(--gold)",
                        border: `1px solid ${b.status === "confirmed" ? "rgba(72,187,120,0.3)" : "rgba(197,160,89,0.3)"}`,
                      }}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-manrope text-[11px] text-white/40 whitespace-nowrap">
                    {new Date(b.created_at).toLocaleDateString("en-MY", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" })}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Products Tab
═══════════════════════════════════════════════════════════════════════════ */
function ProductsTab({ secret }: { secret: string }) {
  const [products, setProducts]       = useState<Product[]>([]);
  const [loading, setLoading]         = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId]       = useState<string | null>(null);
  const [msg, setMsg]                 = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [dbReady, setDbReady]         = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/products", {
        headers: { "x-admin-secret": secret },
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.detail?.includes("does not exist")) setDbReady(false);
        setMsg({ type: "error", text: data.error || "Failed to fetch products" });
      } else {
        setProducts(data.products || []);
        setDbReady(true);
      }
    } catch {
      setMsg({ type: "error", text: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/products?id=${id}`, {
      method: "DELETE",
      headers: { "x-admin-secret": secret },
    });
    if (res.ok) {
      setProducts((p) => p.filter((x) => x.id !== id));
      setMsg({ type: "success", text: "Product deleted." });
      setDeleteId(null);
    } else {
      const d = await res.json();
      setMsg({ type: "error", text: d.error || "Delete failed" });
    }
  };

  const handleToggleActive = async (p: Product) => {
    const res = await fetch(`/api/admin/products?id=${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ active: !p.active }),
    });
    if (res.ok) {
      setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, active: !p.active } : x));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-bebas text-2xl tracking-wide">
            MANAGE <span className="gradient-gold">PRODUCTS</span>
          </h2>
          <p className="font-manrope text-xs text-white/30 mt-1">
            {products.length} product{products.length !== 1 ? "s" : ""} in catalogue
          </p>
        </div>
        <button
          onClick={() => { setShowAddForm(true); setEditProduct(null); }}
          className="font-manrope text-[11px] tracking-widest uppercase px-6 py-3 rounded-full border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-all duration-300"
        >
          + Add Product
        </button>
      </div>

      {/* DB not ready banner */}
      {!dbReady && (
        <div className="mb-6 p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10">
          <p className="font-manrope text-sm text-amber-400 font-semibold mb-1">⚠️ Products table not found</p>
          <p className="font-manrope text-xs text-amber-300/70 mb-3">
            You need to create the <code className="bg-amber-500/20 px-1 rounded">products</code> table in Supabase first.
          </p>
          <p className="font-manrope text-xs text-white/40">
            Go to Supabase dashboard → SQL Editor → paste and run the SQL from the migration file.
          </p>
        </div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {msg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-6 p-4 rounded-xl border text-sm font-manrope"
            style={{
              background: msg.type === "success" ? "rgba(72,187,120,0.1)" : "rgba(245,101,101,0.1)",
              borderColor: msg.type === "success" ? "rgba(72,187,120,0.3)" : "rgba(245,101,101,0.3)",
              color: msg.type === "success" ? "#68D391" : "#FC8181",
            }}
            onAnimationComplete={() => setTimeout(() => setMsg(null), 3000)}
          >
            {msg.type === "success" ? "✅ " : "⚠️ "}{msg.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-20">
          <p className="font-manrope text-white/30 text-sm animate-pulse">Loading products...</p>
        </div>
      ) : products.length === 0 && dbReady ? (
        <div className="text-center py-20 border border-white/5 rounded-3xl">
          <p className="font-bebas text-white/20 text-3xl tracking-widest mb-3">NO PRODUCTS YET</p>
          <p className="font-manrope text-white/30 text-sm">Click "+ Add Product" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="relative rounded-2xl overflow-hidden border"
              style={{
                background: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.5) 100%)",
                borderColor: p.active ? "rgba(255,255,255,0.08)" : "rgba(255,80,80,0.2)",
              }}>

              {/* Image */}
              <div className="relative h-48 bg-white/[0.02]">
                {p.image_url ? (
                  <Image src={p.image_url} alt={p.name} fill className="object-contain p-4"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                ) : (
                  <div className="flex items-center justify-center h-full text-white/10 text-4xl">📦</div>
                )}
                {/* Status badge */}
                <div className="absolute top-3 right-3">
                  <span className="font-manrope text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full"
                    style={{
                      background: p.active ? "rgba(72,187,120,0.15)" : "rgba(245,101,101,0.15)",
                      color: p.active ? "#68D391" : "#FC8181",
                      border: `1px solid ${p.active ? "rgba(72,187,120,0.3)" : "rgba(245,101,101,0.3)"}`,
                    }}>
                    {p.active ? "Active" : "Hidden"}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="font-manrope text-[9px] tracking-widest uppercase text-white/30 mb-1">{p.house}</p>
                <h3 className="font-bebas text-white text-xl mb-1" style={{ letterSpacing: "0.04em" }}>{p.name}</h3>
                <p className="font-manrope text-[10px] text-white/30 capitalize mb-2">{p.category}</p>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-bebas gradient-gold text-2xl">RM {p.price5ml}</span>
                  <span className="font-manrope text-[10px] text-white/25">5ml</span>
                  <span className="font-manrope text-[10px] text-white/40 ml-1">
                    · RM {p.price5ml * 2 - 1} <span className="text-white/25">10ml</span>
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button onClick={() => { setEditProduct(p); setShowAddForm(true); }}
                    className="flex-1 font-manrope text-[10px] tracking-widest uppercase py-2 rounded-full border border-white/15 text-white/50 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all">
                    Edit
                  </button>
                  <button onClick={() => handleToggleActive(p)}
                    className="flex-1 font-manrope text-[10px] tracking-widest uppercase py-2 rounded-full border border-white/15 text-white/50 hover:border-white/30 hover:text-white transition-all">
                    {p.active ? "Hide" : "Show"}
                  </button>
                  <button onClick={() => setDeleteId(p.id)}
                    className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-white/30 hover:border-red-500/40 hover:text-red-400 transition-all text-sm">
                    ✕
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Form Modal ──────────────────────────────────── */}
      <AnimatePresence>
        {showAddForm && (
          <ProductFormModal
            secret={secret}
            product={editProduct}
            onClose={() => { setShowAddForm(false); setEditProduct(null); }}
            onSaved={(savedProduct) => {
              if (editProduct) {
                setProducts((prev) => prev.map((x) => x.id === savedProduct.id ? savedProduct : x));
                setMsg({ type: "success", text: "Product updated!" });
              } else {
                setProducts((prev) => [savedProduct, ...prev]);
                setMsg({ type: "success", text: "Product added to catalogue!" });
              }
              setShowAddForm(false);
              setEditProduct(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Delete Confirm ─────────────────────────────────────────── */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-6"
            onClick={() => setDeleteId(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0d0d0d] border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center">
              <p className="font-bebas text-3xl text-white mb-3">DELETE PRODUCT?</p>
              <p className="font-manrope text-sm text-white/40 mb-8">This will permanently remove the product from the catalogue. This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 font-manrope text-xs tracking-widest uppercase py-3 rounded-full border border-white/15 text-white/50 hover:border-white/30 hover:text-white transition-all">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteId)}
                  className="flex-1 font-manrope text-xs tracking-widest uppercase py-3 rounded-full border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Product Add / Edit Modal
═══════════════════════════════════════════════════════════════════════════ */
function ProductFormModal({
  secret,
  product,
  onClose,
  onSaved,
}: {
  secret: string;
  product: Product | null;
  onClose: () => void;
  onSaved: (p: Product) => void;
}) {
  const isEdit = !!product;
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName]               = useState(product?.name || "");
  const [house, setHouse]             = useState(product?.house || "");
  const [category, setCategory]       = useState(product?.category || "aquatic");
  const [price5ml, setPrice5ml]       = useState(String(product?.price5ml || ""));
  const [description, setDescription] = useState(product?.description || "");
  const [notesRaw, setNotesRaw]       = useState((product?.notes || []).join(", "));
  const [imageUrl, setImageUrl]       = useState(product?.image_url || "");
  const [uploading, setUploading]     = useState(false);
  const [saving, setSaving]           = useState(false);
  const [formError, setFormError]     = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res  = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-secret": secret },
        body: fd,
      });
      const data = await res.json();
      if (res.ok) { setImageUrl(data.url); }
      else { setFormError(data.error || "Upload failed"); }
    } catch { setFormError("Upload failed"); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    const notes = notesRaw.split(",").map((n) => n.trim()).filter(Boolean);
    const body  = { name, house, category, price5ml: Number(price5ml), description, notes, image_url: imageUrl };

    try {
      const url    = isEdit ? `/api/admin/products?id=${product!.id}` : "/api/admin/products";
      const method = isEdit ? "PATCH" : "POST";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) { onSaved(data.product); }
      else { setFormError(data.error || "Failed to save"); }
    } catch { setFormError("Network error"); }
    finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm overflow-y-auto py-10 px-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#0d0d0d] overflow-hidden">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
          <h3 className="font-bebas text-2xl tracking-wide text-white">
            {isEdit ? "EDIT" : "ADD"} <span className="gradient-gold">PRODUCT</span>
          </h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all text-sm">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Image upload */}
          <div>
            <label className="form-label">Product Image</label>
            <div className="flex gap-3 items-start">
              {/* Preview */}
              <div className="w-20 h-20 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center overflow-hidden flex-shrink-0">
                {imageUrl ? (
                  <Image src={imageUrl} alt="preview" width={80} height={80} className="object-contain p-1"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                ) : (
                  <span className="text-white/20 text-2xl">📦</span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image URL or upload below..."
                  className="form-input text-sm" />
                <div className="flex gap-2">
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="font-manrope text-[11px] tracking-widest uppercase px-4 py-2 rounded-full border border-[var(--gold)]/50 text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all"
                    disabled={uploading}>
                    {uploading ? "Uploading..." : "📁 Upload File"}
                  </button>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                <p className="font-manrope text-[10px] text-white/25">JPG, PNG, WebP · Max 5MB</p>
              </div>
            </div>
          </div>

          {/* Name + House */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Product Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Hawas Ice" className="form-input" required />
            </div>
            <div>
              <label className="form-label">House / Brand *</label>
              <input type="text" value={house} onChange={(e) => setHouse(e.target.value)}
                placeholder="e.g. Rasasi" className="form-input" required />
            </div>
          </div>

          {/* Category + Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-input form-select">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Price 5ml (RM) *</label>
              <input type="number" value={price5ml} onChange={(e) => setPrice5ml(e.target.value)}
                placeholder="e.g. 12" className="form-input" min="1" step="0.5" required />
              {price5ml && (
                <p className="font-manrope text-[10px] text-white/30 mt-1">
                  10ml will be RM {(Number(price5ml) * 2 - 1).toFixed(1)}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="form-label">Description *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. A refreshing icy aquatic — clean, cool, and effortlessly magnetic."
              className="form-input resize-none" rows={3} required />
          </div>

          {/* Notes */}
          <div>
            <label className="form-label">Scent Notes <span className="text-white/25">(comma separated)</span></label>
            <input type="text" value={notesRaw} onChange={(e) => setNotesRaw(e.target.value)}
              placeholder="e.g. Bergamot, Cardamom, Sea Water, Musk" className="form-input" />
          </div>

          {formError && (
            <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10">
              <p className="font-manrope text-sm text-red-400">⚠️ {formError}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 font-manrope text-xs tracking-[0.2em] uppercase py-3 rounded-full border border-white/15 text-white/40 hover:border-white/30 hover:text-white transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving || uploading}
              className="flex-1 font-manrope text-xs tracking-[0.2em] uppercase py-3 rounded-full border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-all disabled:opacity-50">
              {saving ? "Saving..." : isEdit ? "Update Product" : "Add to Catalogue →"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Shared: StatCard
═══════════════════════════════════════════════════════════════════════════ */
function StatCard({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="p-6 rounded-2xl border border-white/5"
      style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(197,160,89,0.03) 100%)" }}>
      <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-white/30 mb-2">{label}</p>
      <p className="font-bebas text-4xl gradient-gold">{value}</p>
    </motion.div>
  );
}
