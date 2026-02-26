"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const NAV_LINKS = [
  { label: "The Collection", href: "#vault" },
  { label: "Our Story", href: "#notes" },
  { label: "Scent Awards", href: "#awards" },
  { label: "Book Now", href: "/booking" },
  { label: "Contact", href: "#footer" },
];

const SCENT_NEWS = [
  { name: "Khamrah", house: "Lattafa", note: "Warm Oud · Vanilla · Caramel", color: "#C5A059" },
  { name: "Rare Reef", house: "RAVE", note: "Aquatic · Sea Salt · Musk", color: "#3D5A80" },
  { name: "Tobacco Vanille", house: "Tom Ford", note: "Tobacco · Vanilla · Spice", color: "#8B5E3C" },
  { name: "Baccarat Rouge", house: "Maison FK", note: "Jasmine · Saffron · Cedar", color: "#C5A059" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [newsIndex, setNewsIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const interval = setInterval(
      () => setNewsIndex((i) => (i + 1) % SCENT_NEWS.length),
      3000
    );
    return () => clearInterval(interval);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      {/* ── Top Bar ───────────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-[990] flex items-center justify-between px-6 md:px-10 py-5 transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(0,0,0,0.85)"
            : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(197,160,89,0.15)" : "none",
        }}
      >
        {/* Logo */}
        <motion.a
          href="/"
          className="font-bebas text-3xl tracking-widest text-white"
          style={{ letterSpacing: "0.25em" }}
          whileHover={{ color: "#C5A059" }}
          transition={{ duration: 0.3 }}
        >
          REI<span style={{ color: "var(--gold)" }}>DECANT</span>
        </motion.a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-link font-manrope text-xs tracking-[0.2em] text-white/70 uppercase hover:text-white transition-colors"
            >
              <span className="nav-link-inner">{link.label}</span>
              <span className="nav-link-hover">{link.label}</span>
            </a>
          ))}
        </nav>

        {/* CTA + Hamburger */}
        <div className="flex items-center gap-5">
          <a
            href="/booking"
            className="hidden md:inline-flex font-manrope text-xs tracking-[0.15em] uppercase px-5 py-2.5 rounded-full border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-all duration-300 pulse-gold"
          >
            Book Now
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative w-10 h-10 flex flex-col justify-center items-end gap-1.5 z-[999]"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <motion.span
              className="block h-px bg-white origin-center"
              animate={menuOpen ? { rotate: 45, y: 5, width: "100%" } : { rotate: 0, y: 0, width: "100%" }}
              transition={{ duration: 0.35 }}
              style={{ width: "28px" }}
            />
            <motion.span
              className="block h-px bg-white"
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.25 }}
              style={{ width: "20px" }}
            />
            <motion.span
              className="block h-px bg-white origin-center"
              animate={menuOpen ? { rotate: -45, y: -5, width: "100%" } : { rotate: 0, y: 0, width: "100%" }}
              transition={{ duration: 0.35 }}
              style={{ width: "28px" }}
            />
          </button>
        </div>
      </header>

      {/* ── Fullscreen Menu Overlay ─────────────────────────────────────── */}
      <div className={`menu-overlay ${menuOpen ? "open" : ""}`}>
        {/* Left — Navigation Links */}
        <div className="menu-left">
          <div className="mb-10">
            <span className="font-manrope text-[10px] tracking-[0.4em] text-white/30 uppercase">
              Navigation
            </span>
          </div>
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="group font-bebas text-white overflow-hidden block"
                style={{ fontSize: "clamp(36px, 5vw, 72px)", letterSpacing: "0.03em" }}
                initial={{ opacity: 0, x: -40 }}
                animate={menuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                transition={{ delay: menuOpen ? 0.25 + i * 0.08 : 0, duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                whileHover={{ x: 12, color: "#C5A059" }}
              >
                <span className="inline-flex items-center gap-4">
                  <span className="font-manrope text-xs text-white/30 tracking-widest" style={{ fontSize: "10px" }}>
                    0{i + 1}
                  </span>
                  {link.label}
                </span>
              </motion.a>
            ))}
          </nav>

          {/* Footer links */}
          <motion.div
            className="mt-auto pt-16 flex gap-6"
            initial={{ opacity: 0 }}
            animate={menuOpen ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.65 }}
          >
            {["Instagram", "TikTok", "Shopee"].map((s) => (
              <a
                key={s}
                href="#"
                className="font-manrope text-xs text-white/40 tracking-widest uppercase hover:text-[var(--gold)] transition-colors"
              >
                {s}
              </a>
            ))}
          </motion.div>
        </div>

        {/* Right — Scent News Slider */}
        <div className="menu-right">
          <motion.p
            className="font-manrope text-[10px] tracking-[0.4em] text-white/30 uppercase mb-8"
            initial={{ opacity: 0 }}
            animate={menuOpen ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4 }}
          >
            Latest Arrivals
          </motion.p>
          <div className="relative overflow-hidden h-[320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={newsIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                className="absolute w-full"
              >
                <div
                  className="rounded-2xl p-8 border"
                  style={{
                    background: `linear-gradient(135deg, rgba(0,0,0,0.6), ${SCENT_NEWS[newsIndex].color}18)`,
                    borderColor: `${SCENT_NEWS[newsIndex].color}40`,
                  }}
                >
                  <div
                    className="w-12 h-1 rounded-full mb-6"
                    style={{ background: SCENT_NEWS[newsIndex].color }}
                  />
                  <p className="font-manrope text-xs tracking-widest text-white/40 uppercase mb-2">
                    {SCENT_NEWS[newsIndex].house}
                  </p>
                  <h3
                    className="font-bebas text-white mb-3"
                    style={{ fontSize: "52px", letterSpacing: "0.05em" }}
                  >
                    {SCENT_NEWS[newsIndex].name}
                  </h3>
                  <p className="font-manrope text-sm text-white/60">
                    {SCENT_NEWS[newsIndex].note}
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <span
                      className="font-manrope text-xs tracking-widest uppercase"
                      style={{ color: SCENT_NEWS[newsIndex].color }}
                    >
                      View Decant →
                    </span>
                  </div>
                </div>

                {/* Dots */}
                <div className="flex gap-2 mt-6">
                  {SCENT_NEWS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setNewsIndex(i)}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: i === newsIndex ? "24px" : "6px",
                        height: "6px",
                        background: i === newsIndex ? SCENT_NEWS[newsIndex].color : "rgba(255,255,255,0.2)",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
