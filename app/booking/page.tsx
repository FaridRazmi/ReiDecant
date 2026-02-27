"use client";

import { useEffect, useRef, Suspense } from "react";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import BookingForm from "@/components/BookingForm";

function BookingContent() {
  const searchParams = useSearchParams();
  const defaultProductId = searchParams.get("product") ?? "";
  return <BookingForm defaultProductId={defaultProductId} />;
}

export default function BookingPage() {
  const lenisRef = useRef<any>(null);

  /* ── Lenis Smooth Scroll ─────────────────────────────────────── */
  useEffect(() => {
    let lenis: any;
    let raf: number;

    const init = async () => {
      try {
        const Lenis = (await import("@studio-freight/lenis")).default;
        lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        });
        lenisRef.current = lenis;

        const animate = (time: number) => {
          lenis.raf(time);
          raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);
      } catch {}
    };
    init();
    return () => {
      lenis?.destroy();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main className="relative bg-black min-h-screen overflow-x-hidden">
      {/* ── Background effects ──────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(197,160,89,0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(61,90,128,0.04) 0%, transparent 50%)",
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

        <div className="flex items-center gap-4">
          <a
            href="/catalogue"
            className="font-manrope text-xs tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors"
          >
            ← Catalogue
          </a>
        </div>
      </header>

      {/* ── Page Content ────────────────────────────────────────── */}
      <div className="relative z-10 pt-32 pb-24 px-6 md:px-[8vw]">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div
              className="w-10 h-px"
              style={{ background: "var(--gold)" }}
            />
            <span className="font-manrope text-xs tracking-[0.4em] uppercase text-white/40">
              Book Your Decant
            </span>
            <div
              className="w-10 h-px"
              style={{ background: "var(--gold)" }}
            />
          </div>

          <h1
            className="font-bebas text-white leading-[0.9] mb-6"
            style={{
              fontSize: "clamp(48px, 9vw, 130px)",
              letterSpacing: "0.04em",
            }}
          >
            PLACE YOUR{" "}
            <span className="gradient-gold">ORDER</span>
          </h1>

          <p
            className="font-manrope text-white/50 max-w-xl mx-auto"
            style={{ fontSize: "clamp(14px, 1.4vw, 17px)" }}
          >
            Select your favorite scent, fill in your details, and we&apos;ll prepare
            your premium decant with care
          </p>
        </motion.div>

        {/* ── Booking Form ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Suspense fallback={<div className="text-white/30 text-center font-manrope text-sm">Loading form…</div>}>
            <BookingContent />
          </Suspense>
        </motion.div>

        {/* ── Trust Badges ──────────────────────────────────────── */}
        <motion.div
          className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { icon: "🔒", text: "Secure Payment" },
            { icon: "✅", text: "100% Authentic" },
            { icon: "🚀", text: "24h Shipping" },
            { icon: "💬", text: "Telegram Updates" },
          ].map((badge) => (
            <div key={badge.text} className="flex items-center gap-2">
              <span className="text-lg">{badge.icon}</span>
              <span className="font-manrope text-xs tracking-widest text-white/30 uppercase">
                {badge.text}
              </span>
            </div>
          ))}
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
