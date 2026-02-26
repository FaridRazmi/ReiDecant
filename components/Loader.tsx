"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const duration = 2200;
    const interval = 30;
    const steps = duration / interval;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const p = Math.round((current / steps) * 100);
      setProgress(p);
      if (current >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setDone(true);
          setTimeout(onComplete, 700);
        }, 200);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="loader"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Background grain */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
              backgroundSize: "200px",
            }}
          />

          {/* REI main text with clip-path reveal */}
          <div className="relative z-10 text-center">
            <div className="loader-text">REID</div>

            {/* Gold accent line */}
            <motion.div
              className="mx-auto mt-3 h-px"
              style={{ background: "var(--gold)" }}
              initial={{ width: 0 }}
              animate={{ width: "60px" }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />

            <motion.p
              className="font-manrope text-[10px] tracking-[0.5em] text-white/40 uppercase mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              Luxury Perfume Decants
            </motion.p>
          </div>

          {/* Progress bar */}
          <div className="loader-bar-wrap mt-12 relative z-10">
            <div
              className="loader-bar"
              style={{ width: `${progress}%`, transition: "width 0.03s linear" }}
            />
          </div>

          {/* Counter */}
          <div className="loader-counter relative z-10">{progress}%</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
