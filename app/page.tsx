"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";

/* ── Lazy-load heavy components ──────────────────────────────────────────── */
const Loader = dynamic(() => import("@/components/Loader"), { ssr: false });
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });
const SequenceScroll = dynamic(() => import("@/components/SequenceScroll"), { ssr: false });
const MarqueeStrip = dynamic(() => import("@/components/MarqueeStrip"), { ssr: false });
const NotesSection = dynamic(() => import("@/components/NotesSection"), { ssr: false });
const VaultSection = dynamic(() => import("@/components/VaultSection"), { ssr: false });
const StatsSection = dynamic(() => import("@/components/StatsSection"), { ssr: false });
const AwardsSection = dynamic(() => import("@/components/AwardsSection"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const lenisRef = useRef<any>(null);

  const handleLoaderComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  /* ── Lenis Smooth Scroll ───────────────────────────────────────────────── */
  useEffect(() => {
    if (!loaded) return;

    let lenis: any;
    let raf: number;

    const initLenis = async () => {
      try {
        const Lenis = (await import("@studio-freight/lenis")).default;
        lenis = new Lenis({
          duration: 1.4,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
          wheelMultiplier: 0.9,
          touchMultiplier: 1.6,
        });

        lenisRef.current = lenis;

        const animate = (time: number) => {
          lenis.raf(time);
          raf = requestAnimationFrame(animate);
        }; ; 
        raf = requestAnimationFrame(animate);

        document.documentElement.classList.add("lenis");
      } catch (err) {
        console.warn("Lenis failed to load, falling back to native scroll:", err);
      }
    };

    initLenis();

    return () => {
      if (lenis) lenis.destroy();
      if (raf) cancelAnimationFrame(raf);
      document.documentElement.classList.remove("lenis");
    };
  }, [loaded]);

  return (
    <main className="relative bg-black">
      {/* ── Preloader ──────────────────────────────────────────────────────── */}
      {!loaded && <Loader onComplete={handleLoaderComplete} />}

      {/* ── Content ────────────────────────────────────────────────────────── */}
      {loaded && (
        <>
          <Navbar />

          {/* ── Hero: Sticky Canvas Sequence ─────────────────────────────── */}
          <SequenceScroll />

          {/* ── Curtain sections slide OVER the canvas ───────────────────── */}
          <div className="relative z-10 -mt-[100vh]">
            {/* ── Marquee Transition ─────────────────────────────────────── */}
            <MarqueeStrip />

            {/* ── Notes / About ──────────────────────────────────────────── */}
            <NotesSection />

            {/* ── The Vault (Bento Grid) ─────────────────────────────────── */}
            <VaultSection />

            {/* ── ReiStats (Count-Up Numbers) ────────────────────────────── */}
            <StatsSection />

            {/* ── Decant Awards (Carousel) ───────────────────────────────── */}
            <AwardsSection />

            {/* ── Footer ─────────────────────────────────────────────────── */}
            <Footer />
          </div>
        </>
      )}
    </main>
  );
}
