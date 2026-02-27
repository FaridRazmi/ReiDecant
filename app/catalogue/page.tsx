"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "motion/react";
import { getPrice10ml } from "@/lib/products";

/* Product type that works for both Supabase and hardcoded products */
type Product = {
  id: string;
  name: string;
  house: string;
  category: string;
  price5ml: number;
  description: string;
  notes: string[];
  image: string;
  image_url?: string;
};

const CATEGORIES = [
  { key: "all",    label: "All" },
  { key: "fresh", label: "Fresh" },
  { key: "sweet", label: "Sweet" },
];

/* ── Single Product Card ───────────────────────────────────────────────────── */
function ProductCard({ product, index }: { product: Product; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.76, 0, 0.24, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col rounded-3xl overflow-hidden"
      style={{
        background: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
        border: hovered ? "1px solid rgba(197,160,89,0.4)" : "1px solid rgba(255,255,255,0.06)",
        transition: "border-color 0.4s ease",
      }}
    >
      {/* Category badge */}
      <div className="absolute top-4 left-4 z-10">
        <span
          className="font-manrope text-[9px] tracking-[0.35em] uppercase px-3 py-1.5 rounded-full"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(197,160,89,0.3)",
            color: "var(--gold)",
          }}
        >
          {product.category === "fresh" ? "🌿 Fresh" : "🍯 Sweet"}
        </span>
      </div>

      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{ height: "320px", background: "rgba(255,255,255,0.02)" }}
      >
        <motion.div
          className="absolute inset-0"
          animate={hovered ? { scale: 1.06 } : { scale: 1 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-6"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>

        {/* Hover gradient overlay */}
        <motion.div
          className="absolute inset-0"
          animate={hovered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3 p-6 flex-1">
        {/* House */}
        <p className="font-manrope text-[10px] tracking-[0.35em] uppercase text-white/35">
          {product.house}
        </p>

        {/* Name */}
        <h3
          className="font-bebas text-white leading-[0.95]"
          style={{ fontSize: "clamp(28px, 3vw, 38px)", letterSpacing: "0.04em" }}
        >
          {product.name}
        </h3>

        {/* Notes pills */}
        <div className="flex flex-wrap gap-1.5">
          {product.notes.map((note) => (
            <span
              key={note}
              className="font-manrope text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              {note}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="font-manrope text-sm text-white/40 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <p className="font-manrope text-[9px] tracking-[0.3em] uppercase text-white/25 mb-1">
              From
            </p>
            <div className="flex items-baseline gap-2">
              <p
                className="font-bebas gradient-gold"
                style={{ fontSize: "32px", letterSpacing: "0.04em", lineHeight: 1 }}
              >
                RM {product.price5ml}
              </p>
              <span className="font-manrope text-[10px] text-white/30">5ml</span>
            </div>
            <p className="font-manrope text-[11px] text-white/40 mt-0.5">
              RM {getPrice10ml(product.price5ml)}{" "}
              <span className="text-white/25">/ 10ml</span>
            </p>
          </div>

          <motion.a
            href={`/booking?product=${product.id}`}
            className="relative overflow-hidden font-manrope text-[11px] tracking-[0.2em] uppercase px-6 py-3 rounded-full"
            style={{
              background: hovered
                ? "var(--gold)"
                : "transparent",
              border: "1px solid var(--gold)",
              color: hovered ? "#000" : "var(--gold)",
              transition: "background 0.35s ease, color 0.35s ease",
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Book Now →
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Catalogue Page ───────────────────────────────────────────────────── */
export default function CataloguePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts]             = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch products from API (Supabase → fallback to hardcoded)
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => { setProducts(data.products || []); })
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
  }, []);

  const filtered = activeCategory === "all"
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <main className="relative bg-black min-h-screen overflow-x-hidden">

      {/* ── Fixed ambient glow ──────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 10%, rgba(197,160,89,0.05) 0%, transparent 45%), " +
            "radial-gradient(ellipse at 80% 90%, rgba(61,90,128,0.05) 0%, transparent 45%)",
        }}
      />

      {/* ── Navigation Bar ──────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <motion.a
          href="/"
          className="font-bebas text-3xl tracking-widest text-white"
          style={{ letterSpacing: "0.25em" }}
          whileHover={{ color: "#C5A059" }}
        >
          REI<span style={{ color: "var(--gold)" }}>DECANT</span>
        </motion.a>

        <div className="flex items-center gap-5">
          <a
            href="/"
            className="hidden md:block font-manrope text-xs tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors"
          >
            ← Home
          </a>
        </div>
      </header>

      {/* ── Page Content ────────────────────────────────────────── */}
      <div className="relative z-10 pt-36 pb-28 px-6 md:px-[8vw]">

        {/* ── Hero Header ─────────────────────────────────────────── */}
        <motion.div
          className="mb-16 md:mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px" style={{ background: "var(--gold)" }} />
            <span className="font-manrope text-[10px] tracking-[0.45em] uppercase text-white/35">
              The Collection
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h1
              className="font-bebas text-white leading-[0.85]"
              style={{ fontSize: "clamp(56px, 10vw, 150px)", letterSpacing: "0.04em" }}
            >
              OUR
              <br />
              <span
                style={{
                  WebkitTextStroke: "1px rgba(197,160,89,0.6)",
                  WebkitTextFillColor: "transparent",
                }}
              >
                SCENTS
              </span>
            </h1>

            <p className="font-manrope text-white/40 max-w-sm text-sm leading-relaxed md:pb-4">
              Handpicked fragrances, carefully decanted into portable vials.
              Each one authenticated, sealed, and shipped with love.
            </p>
          </div>
        </motion.div>

        {/* ── Category Filter ──────────────────────────────────────── */}
        <motion.div
          className="flex flex-wrap gap-2 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className="font-manrope text-[11px] tracking-[0.25em] uppercase px-5 py-2.5 rounded-full transition-all duration-300"
              style={{
                background: activeCategory === cat.key ? "var(--gold)" : "transparent",
                border: activeCategory === cat.key
                  ? "1px solid var(--gold)"
                  : "1px solid rgba(255,255,255,0.12)",
                color: activeCategory === cat.key ? "#000" : "rgba(255,255,255,0.45)",
              }}
            >
              {cat.label}
            </button>
          ))}

          {/* Count */}
          <span className="ml-auto self-center font-manrope text-[10px] tracking-widest text-white/25 uppercase">
            {filtered.length} {filtered.length === 1 ? "Item" : "Items"}
          </span>
        </motion.div>

        {/* ── Product Grid ─────────────────────────────────────────── */}
        {loadingProducts ? (
          /* Skeleton loader */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden border border-white/5 animate-pulse"
                style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="h-[320px] bg-white/[0.04]" />
                <div className="p-6 space-y-3">
                  <div className="h-2.5 bg-white/[0.06] rounded-full w-1/3" />
                  <div className="h-7 bg-white/[0.08] rounded-full w-3/4" />
                  <div className="flex gap-2">
                    <div className="h-5 bg-white/[0.04] rounded-full w-16" />
                    <div className="h-5 bg-white/[0.04] rounded-full w-20" />
                  </div>
                  <div className="h-3 bg-white/[0.04] rounded-full w-full mt-2" />
                  <div className="h-3 bg-white/[0.04] rounded-full w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── Empty state ──────────────────────────────────────────── */}
        {!loadingProducts && filtered.length === 0 && (
          <motion.div
            className="text-center py-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="font-bebas text-white/20 text-4xl tracking-widest">
              No products found
            </p>
          </motion.div>
        )}


        {/* ── CTA Banner ───────────────────────────────────────────── */}
        <motion.div
          className="mt-24 rounded-3xl overflow-hidden relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          style={{
            background: "linear-gradient(135deg, rgba(197,160,89,0.12) 0%, rgba(197,160,89,0.04) 50%, rgba(0,0,0,0) 100%)",
            border: "1px solid rgba(197,160,89,0.2)",
          }}
        >
          <div className="px-8 md:px-16 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="font-manrope text-[10px] tracking-[0.4em] uppercase text-[var(--gold)] mb-3">
                Can't decide?
              </p>
              <h2
                className="font-bebas text-white leading-[0.9]"
                style={{ fontSize: "clamp(36px, 5vw, 72px)", letterSpacing: "0.04em" }}
              >
                LET US HELP YOU
                <br />
                <span className="gradient-gold">FIND YOUR SCENT</span>
              </h2>
            </div>

            <div className="flex flex-col gap-3 items-center md:items-end">
              <a
                href="https://wa.me/60132013905"
                target="_blank"
                rel="noopener noreferrer"
                className="font-manrope text-[11px] tracking-[0.2em] uppercase px-8 py-3.5 rounded-full bg-[var(--gold)] text-black hover:opacity-90 transition-all duration-300 whitespace-nowrap"
              >
                WhatsApp Us →
              </a>
              <p className="font-manrope text-[10px] text-white/25 tracking-widest">
                Free consultation · No commitment
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-6 px-6 text-center">
        <p className="font-manrope text-xs text-white/20 tracking-widest">
          © 2026 ReiDecant. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
