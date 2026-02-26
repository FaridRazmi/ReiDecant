"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const MARQUEE_WORDS = [
  "AUTHENTIC",
  "◈",
  "NICHE",
  "◈",
  "PREMIUM",
  "◈",
  "HAND-FILLED",
  "◈",
  "10ML",
  "◈",
  "CURATED",
  "◈",
  "LUXURY",
  "◈",
  "PORTABLE",
  "◈",
];

export default function MarqueeStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="curtain-section relative overflow-hidden py-10 md:py-14 border-t border-b"
      style={{
        borderColor: "rgba(197,160,89,0.1)",
        background: "linear-gradient(180deg, #000 0%, #050505 50%, #000 100%)",
      }}
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--gold) 0px, var(--gold) 1px, transparent 1px, transparent 120px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="marquee-inner">
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((word, i) => (
            <span
              key={i}
              className="font-bebas text-white/20 select-none"
              style={{
                fontSize: "clamp(18px, 2vw, 28px)",
                letterSpacing: "0.15em",
                color: word === "◈" ? "var(--gold)" : undefined,
                opacity: word === "◈" ? 0.5 : undefined,
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
