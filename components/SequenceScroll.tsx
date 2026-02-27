"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const TOTAL_FRAMES = 96; // ← Change this number to match how many frames you have

const FRAME_PATH = (n: number) =>
  `/sequence/ezgif-frame-${String(n).padStart(3, "0")}.jpg`;

interface TextOverlay {
  start: number; // fraction 0–1
  end: number;
  text: string;
  sub?: string;
  align: "center" | "left" | "right";
}

const TEXT_OVERLAYS: TextOverlay[] = [
  {
    start: 0,
    end: 0.22,
    text: "REIDECANT",
    sub: "Luxury, Unbottled.",
    align: "center",
  },
  {
    start: 0.28,
    end: 0.52,
    text: "AUTHENTICITY IN EVERY DROP",
    sub: "From architecturally crafted originals to your pocket.",
    align: "left",
  },
  {
    start: 0.58,
    end: 0.85,
    text: "YOUR SIGNATURE, ANYWHERE",
    sub: "Every 10ml is a story — yours to carry.",
    align: "right",
  },
];

export default function SequenceScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /* ── Preload frames ─────────────────────────────────────────── */
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      imgs.push(img);
    }
    imagesRef.current = imgs;

    // Draw first frame immediately
    imgs[0].onload = () => drawFrame(0);
  }, []);

  /* ── Canvas draw ────────────────────────────────────────────── */
  function drawFrame(index: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // object-fit: cover
    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
  }

  /* ── Canvas resize ──────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(currentFrameRef.current);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ── Scroll → frame ─────────────────────────────────────────── */
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (p) => {
      const frame = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(p * (TOTAL_FRAMES - 1)))
      );
      if (frame !== currentFrameRef.current) {
        currentFrameRef.current = frame;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(frame));
      }
    });
    return () => {
      unsubscribe();
      cancelAnimationFrame(rafRef.current);
    };
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="relative h-[400vh]">
      {/* Sticky Canvas */}
      <canvas
        ref={canvasRef}
        className="sequence-canvas"
        aria-label="Perfume sequence animation"
      />

      {/* Vignette overlay */}
      <div
        className="pointer-events-none sticky top-0 h-screen w-full -mt-screen"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%)",
          position: "sticky",
          top: 0,
          marginTop: "-100vh",
        }}
      />

      {/* Text Overlays */}
      {TEXT_OVERLAYS.map((overlay, i) => (
        <TextPanel key={i} overlay={overlay} scrollYProgress={scrollYProgress} />
      ))}
    </div>
  );
}

/* ── Text Overlay Panel ───────────────────────────────────────────────────── */
function TextPanel({
  overlay,
  scrollYProgress,
}: {
  overlay: TextOverlay;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const fadeIn = useTransform(
    scrollYProgress,
    [overlay.start, overlay.start + 0.06],
    [0, 1]
  );
  const fadeOut = useTransform(
    scrollYProgress,
    [overlay.end - 0.06, overlay.end],
    [1, 0]
  );
  const combined = useTransform(
    [fadeIn, fadeOut],
    ([fi, fo]) => Math.min(fi as number, fo as number)
  );

  const yIn = useTransform(
    scrollYProgress,
    [overlay.start, overlay.start + 0.08],
    [30, 0]
  );

  const alignMap = {
    center: "items-center text-center",
    left: "items-start text-left pl-[8vw]",
    right: "items-end text-right pr-[8vw]",
  };

  return (
    <motion.div
      className={`pointer-events-none sticky top-0 h-screen w-full flex flex-col justify-center -mt-screen ${alignMap[overlay.align]}`}
      style={{
        opacity: combined as any,
        y: yIn as any,
        position: "sticky",
        top: 0,
        marginTop: "-100vh",
      }}
    >
      <div className="max-w-3xl">
        <h2
          className="font-bebas text-white leading-none"
          style={{
            fontSize: "clamp(40px, 7vw, 110px)",
            letterSpacing: overlay.text === "REIDECANT" ? "0.25em" : "0.05em",
            textShadow: "0 4px 40px rgba(0,0,0,0.8)",
          }}
        >
          {overlay.text === "REIDECANT" ? (
            <span className="gradient-gold">{overlay.text}</span>
          ) : (
            overlay.text
          )}
        </h2>
        {overlay.sub && (
          <p
            className="font-manrope text-white/60 mt-4 tracking-widest uppercase"
            style={{ fontSize: "clamp(11px, 1.2vw, 15px)", letterSpacing: "0.2em" }}
          >
            {overlay.sub}
          </p>
        )}
        {overlay.text === "REIDECANT" && (
          <div className="mt-8 flex gap-4 justify-center">
            <div
              className="w-16 h-px"
              style={{ background: "var(--gold)", opacity: 0.7 }}
            />
            <span
              className="font-manrope text-xs tracking-[0.4em] text-white/40 uppercase"
            >
              Scroll to discover
            </span>
            <div
              className="w-16 h-px"
              style={{ background: "var(--gold)", opacity: 0.7 }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
