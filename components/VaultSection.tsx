"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";

const BENTO_ITEMS = [
  {
    id: "niche",
    title: "Niche Originals",
    subtitle: "The rarest compositions",
    description:
      "From Amouage to Xerjoff — bottle your obsession without the full investment.",
    size: "large",
    category: "gold",
    icon: "◈",
    tags: ["Maison Margiela", "Creed", "Parfums de Marly"],
    count: "180+",
  },
  {
    id: "aquatics",
    title: "Fresh Aquatics",
    subtitle: "Ocean at your wrist",
    description:
      "Blue, salt-kissed, and endlessly refreshing. The perfect daily signature.",
    size: "small",
    category: "blue",
    icon: "◇",
    tags: ["Acqua di Gio", "Rare Reef", "Davidoff Cool Water"],
    count: "90+",
  },
  {
    id: "oud",
    title: "Warm Oud & Spices",
    subtitle: "From the heart of Arabia",
    description:
      "Rich oriental blends for evenings that demand presence and mystery.",
    size: "small",
    category: "amber",
    icon: "◉",
    tags: ["Khamrah", "Oud Wood", "Black Phantom"],
    count: "120+",
  },
  {
    id: "designer",
    title: "Designer Favorites",
    subtitle: "Icons, re-bottled",
    description:
      "The classics you love — Dior, YSL, Chanel — now in a purse-friendly form.",
    size: "medium",
    category: "gold",
    icon: "◈",
    tags: ["Sauvage", "Y Le Parfum", "Bleu de Chanel"],
    count: "210+",
  },
];

type Category = "gold" | "blue" | "amber";

const CATEGORY_STYLES: Record<Category, { border: string; glow: string; text: string; bg: string }> = {
  gold: {
    border: "rgba(197,160,89,0.5)",
    glow: "rgba(197,160,89,0.12)",
    text: "#C5A059",
    bg: "rgba(197,160,89,0.06)",
  },
  blue: {
    border: "rgba(61,90,128,0.6)",
    glow: "rgba(61,90,128,0.15)",
    text: "#3D5A80",
    bg: "rgba(61,90,128,0.06)",
  },
  amber: {
    border: "rgba(139,94,60,0.5)",
    glow: "rgba(139,94,60,0.15)",
    text: "#C97435",
    bg: "rgba(139,94,60,0.06)",
  },
};

export default function VaultSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="vault" ref={ref} className="curtain-section py-32 md:py-44 px-6 md:px-[8vw]">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-10 h-px" style={{ background: "var(--gold)" }} />
          <span className="font-manrope text-xs tracking-[0.4em] uppercase text-white/40">
            The Collection
          </span>
        </motion.div>

        <motion.h2
          className="font-bebas leading-[0.9] mb-4"
          style={{ fontSize: "clamp(52px, 10vw, 150px)", letterSpacing: "0.04em" }}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.1 }}
        >
          <span className="text-white">THE </span>
          <span className="gradient-gold">VAULT</span>
        </motion.h2>

        <motion.p
          className="font-manrope text-white/50 max-w-2xl"
          style={{ fontSize: "clamp(14px, 1.4vw, 18px)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          Four curated universes. One decant. Every occasion covered.
        </motion.p>

        {/* Bento Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 grid-rows-auto gap-4">
          {/* Large card (2/3 width, left) */}
          <motion.div
            className="md:col-span-2 md:row-span-2"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <BentoCard item={BENTO_ITEMS[0]} />
          </motion.div>

          {/* Small card (1/3 width) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <BentoCard item={BENTO_ITEMS[1]} />
          </motion.div>

          {/* Small card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <BentoCard item={BENTO_ITEMS[2]} />
          </motion.div>

          {/* Medium card (full width) */}
          <motion.div
            className="md:col-span-3"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <BentoCard item={BENTO_ITEMS[3]} horizontal />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Bento Card ───────────────────────────────────────────────────────────── */
function BentoCard({
  item,
  horizontal = false,
}: {
  item: (typeof BENTO_ITEMS)[0];
  horizontal?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const styles = CATEGORY_STYLES[item.category as Category];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    const rect = card.getBoundingClientRect();
    glow.style.left = `${e.clientX - rect.left}px`;
    glow.style.top = `${e.clientY - rect.top}px`;
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`bento-card bento-card-${item.category} group relative overflow-hidden cursor-pointer ${
        horizontal ? "flex items-center gap-10 p-8 md:p-10" : "flex flex-col p-8 min-h-[260px] md:min-h-[300px]"
      }`}
      style={{
        background: `linear-gradient(135deg, rgba(10,10,10,0.95), ${styles.bg})`,
        border: `1px solid ${styles.border}`,
        borderRadius: "20px",
      }}
    >
      {/* Cursor glow */}
      <div
        ref={glowRef}
        className="bento-glow"
        style={{
          background: `radial-gradient(circle, ${styles.glow} 0%, transparent 70%)`,
        }}
      />

      {horizontal ? (
        <>
          {/* Icon left */}
          <div
            className="flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
            style={{ background: styles.glow, border: `1px solid ${styles.border}`, color: styles.text }}
          >
            {item.icon}
          </div>
          {/* Text center */}
          <div className="flex-1 min-w-0">
            <p className="font-manrope text-xs tracking-[0.3em] uppercase mb-2" style={{ color: styles.text }}>
              {item.subtitle}
            </p>
            <h3 className="font-bebas text-white text-4xl md:text-5xl mb-2" style={{ letterSpacing: "0.04em" }}>
              {item.title}
            </h3>
            <p className="font-manrope text-sm text-white/50 max-w-xl">{item.description}</p>
          </div>
          {/* Count right */}
          <div className="flex-shrink-0 text-right hidden md:block">
            <span className="font-bebas block" style={{ fontSize: "64px", color: styles.text, lineHeight: 1 }}>
              {item.count}
            </span>
            <span className="font-manrope text-xs tracking-widest text-white/30 uppercase">Scents</span>
          </div>
          {/* Tags */}
          <div className="absolute bottom-4 right-6 flex gap-2 flex-wrap justify-end">
            {item.tags.map((t) => (
              <span
                key={t}
                className="font-manrope text-[10px] tracking-widest uppercase px-3 py-1 rounded-full"
                style={{ background: styles.glow, color: styles.text, border: `1px solid ${styles.border}` }}
              >
                {t}
              </span>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Icon + count header */}
          <div className="flex justify-between items-start mb-auto">
            <span className="text-3xl" style={{ color: styles.text }}>
              {item.icon}
            </span>
            <span className="font-bebas text-4xl" style={{ color: styles.text }}>
              {item.count}
            </span>
          </div>

          {/* Content */}
          <div className="mt-auto">
            <p className="font-manrope text-xs tracking-[0.3em] uppercase mb-2" style={{ color: styles.text }}>
              {item.subtitle}
            </p>
            <h3
              className="font-bebas text-white mb-2"
              style={{ fontSize: "clamp(28px, 3vw, 44px)", letterSpacing: "0.04em" }}
            >
              {item.title}
            </h3>
            <p className="font-manrope text-sm text-white/50">{item.description}</p>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <span
                key={t}
                className="font-manrope text-[10px] tracking-widest uppercase px-3 py-1 rounded-full"
                style={{ background: styles.glow, color: styles.text, border: `1px solid ${styles.border}` }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Hover arrow */}
          <div className="mt-5 flex items-center gap-2 text-xs font-manrope tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: styles.text }}>
            Browse →
          </div>
        </>
      )}
    </div>
  );
}
