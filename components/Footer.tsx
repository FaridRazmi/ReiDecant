"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

const FOOTER_LINKS = [
  {
    title: "Browse",
    links: ["Niche Originals", "Fresh Aquatics", "Warm Oud & Spices", "Designer Favorites"],
  },
  {
    title: "Company",
    links: ["Our Story", "Sustainability", "Authenticity Guarantee", "Careers"],
  },
  {
    title: "Support",
    links: ["FAQ", "Shipping & Returns", "Contact Us", "Track My Order"],
  },
];

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/privtfrid_" },
  { label: "TikTok",    href: "https://tiktok.com/ridhidup" },
  { label: "Shopee",    href: "https://shopee.com.my/YOUR_SHOP" },
  { label: "WhatsApp",  href: "https://wa.me/60132013905" },
];

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <footer
      id="footer"
      ref={ref}
      className="curtain-section relative overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* Top border glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--gold) 50%, transparent 100%)",
          opacity: 0.3,
        }}
      />

      {/* ── Big Text Banner ──────────────────────────────────────────────── */}
      <div className="pt-24 md:pt-32 pb-16 px-6 md:px-[8vw] border-b border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="max-w-7xl mx-auto"
        >
          <h2
            className="font-bebas leading-[0.85] text-white/[0.04] select-none"
            style={{
              fontSize: "clamp(60px, 14vw, 220px)",
              letterSpacing: "0.08em",
            }}
          >
            LUXURY,{" "}
            <span
              style={{
                WebkitTextStroke: "1px rgba(197,160,89,0.15)",
                WebkitTextFillColor: "transparent",
              }}
            >
              UNBOTTLED
            </span>
          </h2>
        </motion.div>
      </div>

      {/* ── Columns ──────────────────────────────────────────────────────── */}
      <div className="px-6 md:px-[8vw] py-16 md:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-6">
          {/* Brand col */}
          <motion.div
            className="col-span-2"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <a href="/" className="inline-block mb-6">
              <span
                className="font-bebas text-4xl tracking-widest text-white"
                style={{ letterSpacing: "0.25em" }}
              >
                REI<span style={{ color: "var(--gold)" }}>DECANT</span>
              </span>
            </a>
            <p className="font-manrope text-sm text-white/40 leading-relaxed max-w-xs mb-8">
              Premium perfume decants crafted with care. Experience the world's
              finest fragrances without buying the full bottle.
            </p>

            {/* Social */}
            <div className="flex gap-4 flex-wrap">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-manrope text-[10px] tracking-[0.2em] uppercase px-4 py-2 rounded-full border border-white/10 text-white/40 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all duration-300"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col, ci) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 + ci * 0.1 }}
            >
              <h4
                className="font-bebas text-white text-lg tracking-widest mb-5"
                style={{ letterSpacing: "0.1em" }}
              >
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-manrope text-sm text-white/35 hover:text-[var(--gold)] transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Bottom Bar ───────────────────────────────────────────────────── */}
      <div
        className="px-6 md:px-[8vw] py-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <p className="font-manrope text-xs text-white/25 tracking-widest">
          © 2026 ReiDecant. All Rights Reserved.
        </p>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Service"].map((t) => (
            <a
              key={t}
              href="#"
              className="font-manrope text-xs text-white/25 hover:text-white/50 tracking-widest transition-colors"
            >
              {t}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
