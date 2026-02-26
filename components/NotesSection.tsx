"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

const WORD_IMAGES: Record<string, string> = {
  cinnamon: "/images/cinnamon.png",
  vanilla: "/images/vanilla.png",
  amber: "/images/amber.png",
  oud: "/images/oud.png",
  aquatic: "/images/aquatic.png",
};

const PARAGRAPHS = [
  [{ text: "We believe a fragrance is not just a scent." }],
  [
    { text: "It is " },
    { text: "cinnamon", highlight: true },
    { text: " curling through winter air. " },
    { text: "vanilla", highlight: true },
    { text: " warming the quiet moments. " },
  ],
  [
    { text: "The haunting allure of " },
    { text: "amber", highlight: true },
    { text: " in evening light. The deep pull of " },
    { text: "oud", highlight: true },
    { text: " from a distant bazaar." },
  ],
  [
    { text: "The cool breath of " },
    { text: "aquatic", highlight: true },
    { text: " notes from open ocean. Each scent tells a story — and every story deserves to travel with you." },
  ],
  [
    {
      text: "ReiDecant sources the world's most coveted niche and designer fragrances. Each decant is filled slowly, by hand, with obsessive care, into premium glass atomizers.",
    },
  ],
  [
    {
      text: "Your signature scent — in a format that travels as boldly as you do.",
    },
  ],
];

export default function NotesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="notes"
      ref={ref}
      className="curtain-section py-32 md:py-44 px-6 md:px-[10vw] relative overflow-hidden"
    >
      {/* Background subtle gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(197,160,89,0.03) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="w-10 h-px" style={{ background: "var(--gold)" }} />
          <span className="font-manrope text-xs tracking-[0.4em] uppercase text-white/40">
            Our Philosophy
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          className="font-bebas text-white mb-16 leading-[0.95]"
          style={{
            fontSize: "clamp(52px, 9vw, 140px)",
            letterSpacing: "0.04em",
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          THE ART OF THE{" "}
          <span className="gradient-gold">DECANT</span>
        </motion.h2>

        {/* Main prose with interactive words */}
        <div className="space-y-6">
          {PARAGRAPHS.map((para, pi) => (
            <motion.p
              key={pi}
              className="font-manrope text-white/70 leading-relaxed"
              style={{ fontSize: "clamp(17px, 1.8vw, 22px)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + pi * 0.12 }}
            >
              {para.map((segment, si) =>
                (segment as any).highlight ? (
                  <WordHover
                    key={si}
                    word={segment.text}
                    imgSrc={WORD_IMAGES[segment.text] ?? ""}
                  />
                ) : (
                  <span key={si}>{segment.text}</span>
                )
              )}
            </motion.p>
          ))}
        </div>

        {/* Decorative line */}
        <motion.div
          className="mt-20 mb-16"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.8 }}
          style={{ transformOrigin: "left" }}
        >
          <div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, var(--gold), transparent 80%)",
              opacity: 0.3,
            }}
          />
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-0"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          <a
            href="#vault"
            className="inline-flex items-center gap-3 font-manrope text-sm tracking-widest uppercase text-[var(--gold)] border border-[var(--gold)] px-8 py-4 rounded-full hover:bg-[var(--gold)] hover:text-black transition-all duration-400 group"
          >
            Explore The Vault
            <span className="ml-1 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Word Hover Image ──────────────────────────────────────────────────────── */
function WordHover({ word, imgSrc }: { word: string; imgSrc: string }) {
  return (
    <span className="word-hover-wrap cursor-crosshair font-semibold text-white border-b border-dashed border-[var(--gold)] pb-0.5">
      {word}
      {imgSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgSrc}
          alt={word}
          className="word-hover-image"
          loading="lazy"
        />
      )}
    </span>
  );
}
