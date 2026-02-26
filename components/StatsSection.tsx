"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";

const STATS = [
  { value: 500, suffix: "+", label: "Curated Scents", desc: "Across niche, designer & oriental" },
  { value: 10, suffix: "k+", label: "Happy Enthusiasts", desc: "And growing every week" },
  { value: 24, suffix: "h", label: "Fast Shipping", desc: "Orders dispatched next business day" },
  { value: 100, suffix: "%", label: "Authentic", desc: "Every bottle validated & tested" },
];

function CountUp({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [active, target]);

  return (
    <span>
      {value}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="curtain-section py-32 md:py-44 px-6 md:px-[8vw] relative overflow-hidden">
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(197,160,89,1) 1px, transparent 1px), linear-gradient(90deg, rgba(197,160,89,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Glowing orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(197,160,89,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-4 mb-16 justify-center"
        >
          <div className="w-10 h-px" style={{ background: "var(--gold)" }} />
          <span className="font-manrope text-xs tracking-[0.4em] uppercase text-white/40">
            By The Numbers
          </span>
          <div className="w-10 h-px" style={{ background: "var(--gold)" }} />
        </motion.div>

        <motion.h2
          className="font-bebas text-center mb-24 leading-[0.9]"
          style={{ fontSize: "clamp(48px, 9vw, 130px)", letterSpacing: "0.05em" }}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          <span className="text-white">REI</span>
          <span className="gradient-gold">STATS</span>
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ border: "1px solid rgba(197,160,89,0.1)", borderRadius: "20px", overflow: "hidden" }}>
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center justify-center py-16 px-6 text-center relative group"
              style={{ background: "rgba(5,5,5,0.9)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.1 }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(ellipse at center, rgba(197,160,89,0.06) 0%, transparent 70%)" }}
              />
              {/* Divider right */}
              {i < 3 && (
                <div className="absolute right-0 top-8 bottom-8 w-px hidden md:block" style={{ background: "rgba(197,160,89,0.15)" }} />
              )}

              <div className="stat-number relative z-10">
                <CountUp target={stat.value} suffix={stat.suffix} active={inView} />
              </div>
              <p
                className="font-bebas tracking-widest mt-3 relative z-10"
                style={{ fontSize: "clamp(14px, 1.5vw, 20px)", color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em" }}
              >
                {stat.label}
              </p>
              <p className="font-manrope text-xs text-white/30 mt-2 relative z-10">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
