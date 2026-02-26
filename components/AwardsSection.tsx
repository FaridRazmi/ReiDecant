"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";

const AWARDS = [
  {
    id: 1,
    month: "February 2026",
    name: "Khamrah",
    house: "Lattafa",
    category: "Warm Oriental",
    notes: "Caramel · Oud · Vanilla · Tobacco",
    score: "9.8",
    color: "#C5A059",
    img: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80",
  },
  {
    id: 2,
    month: "January 2026",
    name: "Rare Reef",
    house: "RAVE",
    category: "Fresh Aquatic",
    notes: "Sea Air · Driftwood · Blue Musk",
    score: "9.5",
    color: "#3D5A80",
    img: "https://images.unsplash.com/photo-1556760544-74068565f05c?w=600&q=80",
  },
  {
    id: 3,
    month: "December 2025",
    name: "Grand Soir",
    house: "Maison Margiela",
    category: "Amber Floral",
    notes: "Benzoin · Vanilla · Amber · Musk",
    score: "9.6",
    color: "#C97435",
    img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80",
  },
  {
    id: 4,
    month: "November 2025",
    name: "Tobacco Vanille",
    house: "Tom Ford",
    category: "Warm Spicy",
    notes: "Tobacco Leaf · Tonka · Cacao",
    score: "9.7",
    color: "#8B5E3C",
    img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80",
  },
  {
    id: 5,
    month: "October 2025",
    name: "Silver Mountain Water",
    house: "Creed",
    category: "Fresh Green",
    notes: "Green Tea · Neroli · Musk",
    score: "9.3",
    color: "#4A7C59",
    img: "https://images.unsplash.com/photo-1481553914717-d0b2d7b05df8?w=600&q=80",
  },
];

export default function AwardsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i - 1 + AWARDS.length) % AWARDS.length);
  const next = () => setActive((i) => (i + 1) % AWARDS.length);

  const award = AWARDS[active];

  return (
    <section id="awards" ref={ref} className="curtain-section py-32 md:py-44 px-6 md:px-[8vw] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-10 h-px" style={{ background: "var(--gold)" }} />
          <span className="font-manrope text-xs tracking-[0.4em] uppercase text-white/40">
            Scent of the Month
          </span>
        </motion.div>

        <motion.h2
          className="font-bebas leading-[0.9] mb-16"
          style={{ fontSize: "clamp(48px, 8vw, 120px)", letterSpacing: "0.04em" }}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
        >
          DECANT <span className="gradient-gold">AWARDS</span>
        </motion.h2>

        {/* Main showcase */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
          {/* Large card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={award.id}
              className="glass-card w-full md:w-[420px] flex-shrink-0 overflow-hidden"
              initial={{ opacity: 0, x: -40, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.94 }}
              transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            >
              {/* Image */}
              <div className="relative h-[280px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={award.img}
                  alt={award.name}
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.7)" }}
                />
                {/* Color overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(to bottom, transparent 40%, ${award.color}30 100%)` }}
                />
                {/* Score badge */}
                <div
                  className="absolute top-4 right-4 font-bebas text-white px-3 py-1 rounded-full text-lg tracking-wide"
                  style={{ background: `${award.color}cc`, fontSize: "16px" }}
                >
                  ★ {award.score}
                </div>
                {/* Month badge */}
                <div className="absolute bottom-4 left-4 font-manrope text-xs tracking-widest uppercase text-white/70">
                  {award.month}
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <p
                  className="font-manrope text-xs tracking-[0.3em] uppercase mb-1"
                  style={{ color: award.color }}
                >
                  {award.house} · {award.category}
                </p>
                <h3
                  className="font-bebas text-white mb-3"
                  style={{ fontSize: "40px", letterSpacing: "0.04em" }}
                >
                  {award.name}
                </h3>
                <p className="font-manrope text-sm text-white/50">{award.notes}</p>
                <a
                  href="#vault"
                  className="mt-5 inline-flex font-manrope text-xs tracking-widest uppercase px-5 py-2.5 rounded-full transition-all duration-300"
                  style={{
                    border: `1px solid ${award.color}`,
                    color: award.color,
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.background = award.color;
                    (e.target as HTMLElement).style.color = "#000";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.background = "transparent";
                    (e.target as HTMLElement).style.color = award.color;
                  }}
                >
                  Get This Decant →
                </a>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right side: other awards + controls */}
          <div className="flex-1 w-full">
            {/* Carousel thumbnails */}
            <div className="space-y-3">
              {AWARDS.map((a, i) => (
                <motion.button
                  key={a.id}
                  onClick={() => setActive(i)}
                  className="w-full text-left flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group"
                  style={{
                    background:
                      i === active
                        ? `rgba(${a.color === "#C5A059" ? "197,160,89" : a.color === "#3D5A80" ? "61,90,128" : "197,116,53"},0.1)`
                        : "rgba(255,255,255,0.02)",
                    border: `1px solid ${i === active ? `${a.color}50` : "rgba(255,255,255,0.05)"}`,
                  }}
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={a.img}
                      alt={a.name}
                      className="w-full h-full object-cover"
                      style={{ filter: i !== active ? "grayscale(60%)" : "none" }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-manrope text-[10px] tracking-widest uppercase text-white/40 mb-0.5">
                      {a.month}
                    </p>
                    <p
                      className="font-bebas text-white text-xl leading-tight"
                      style={{ color: i === active ? a.color : "#fff" }}
                    >
                      {a.name}
                    </p>
                    <p className="font-manrope text-xs text-white/40">{a.house}</p>
                  </div>

                  <div
                    className="font-bebas text-lg flex-shrink-0"
                    style={{ color: i === active ? a.color : "rgba(255,255,255,0.2)" }}
                  >
                    ★ {a.score}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all duration-300"
              >
                ←
              </button>
              <div className="flex gap-2">
                {AWARDS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === active ? "24px" : "6px",
                      height: "6px",
                      background: i === active ? "var(--gold)" : "rgba(255,255,255,0.2)",
                    }}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all duration-300"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
