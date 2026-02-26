"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PRODUCTS, type Product } from "@/lib/products";

type BookingStatus = "idle" | "loading" | "success" | "error";

interface BookingResult {
  id: string;
  name: string;
  product: string;
  totalPrice: number;
  roomNumber: string;
  date: string;
  quantity: number;
}

const CATEGORIES = [
  { key: "all", label: "All Products" },
  { key: "niche", label: "Niche" },
  { key: "aquatic", label: "Aquatics" },
  { key: "oud", label: "Oud & Spice" },
  { key: "designer", label: "Designer" },
];

export default function BookingForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [roomNumber, setRoomNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<BookingStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);

  const filteredProducts = useMemo(() => {
    if (category === "all") return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === category);
  }, [category]);

  const selectedProduct = PRODUCTS.find((p) => p.id === productId);
  const totalPrice = selectedProduct ? selectedProduct.price * quantity : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          productId,
          quantity,
          roomNumber,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong");
        return;
      }

      setStatus("success");
      setBookingResult(data.booking);
      // Reset form
      setName("");
      setPhone("");
      setProductId("");
      setQuantity(1);
      setRoomNumber("");
      setNotes("");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection.");
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setBookingResult(null);
    setErrorMsg("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {status === "success" && bookingResult ? (
          <SuccessCard booking={bookingResult} onBack={resetForm} />
        ) : (
          <motion.form
            key="booking-form"
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* ── Payment Notice Banner ────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex items-start gap-4 p-5 rounded-2xl border border-[var(--gold)]/30"
              style={{
                background:
                  "linear-gradient(135deg, rgba(197,160,89,0.08) 0%, rgba(197,160,89,0.03) 100%)",
              }}
            >
              <span className="text-2xl mt-0.5">💵</span>
              <div>
                <p className="font-manrope font-semibold text-[var(--gold)] text-sm tracking-wide mb-1">
                  Payment Method
                </p>
                <p className="font-manrope text-white/70 text-sm leading-relaxed">
                  We accept{" "}
                  <span className="text-white font-semibold">Cash/QR</span> Via{" "}
                  <span className="text-white font-semibold">Cash on Delivery (COD)</span>{" "}
                  only
                </p>
                <div className="flex gap-3 mt-3">
                  <span className="inline-flex items-center gap-1.5 font-manrope text-[11px] tracking-widest uppercase px-3 py-1.5 rounded-full border border-[var(--gold)]/40 text-[var(--gold)]">
                    💵 Cash
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-manrope text-[11px] tracking-widest uppercase px-3 py-1.5 rounded-full border border-[var(--gold)]/40 text-[var(--gold)]">
                    🏠 COD
                  </span>
                </div>
              </div>
            </motion.div>

            {/* ── Name ─────────────────────────────────────────────── */}
            <div>
              <label className="form-label">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="form-input"
                required
                minLength={2}
              />
            </div>

            {/* ── Phone ────────────────────────────────────────────── */}
            <div>
              <label className="form-label">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0123456789"
                className="form-input"
                required
                minLength={8}
              />
            </div>

            {/* ── Category Filter ──────────────────────────────────── */}
            <div>
              <label className="form-label">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => {
                      setCategory(cat.key);
                      setProductId("");
                    }}
                    className={`font-manrope text-[11px] tracking-widest uppercase px-4 py-2 rounded-full border transition-all duration-300 ${
                      category === cat.key
                        ? "border-[var(--gold)] bg-[var(--gold)] text-black"
                        : "border-white/15 text-white/50 hover:border-white/30"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Product Select ───────────────────────────────────── */}
            <div>
              <label className="form-label">
                Select Product <span className="text-red-400">*</span>
              </label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="form-input form-select"
                required
              >
                <option value="">Choose a product...</option>
                {filteredProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — RM{p.price}
                  </option>
                ))}
              </select>

              {/* Product description */}
              {selectedProduct && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-xs text-white/40 font-manrope tracking-wide"
                >
                  {selectedProduct.description}
                </motion.p>
              )}
            </div>

            {/* ── Quantity ─────────────────────────────────────────── */}
            <div>
              <label className="form-label">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-white/20 text-white/60 flex items-center justify-center hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
                >
                  −
                </button>
                <span className="font-bebas text-3xl text-white w-12 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-10 h-10 rounded-full border border-white/20 text-white/60 flex items-center justify-center hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* ── Price Display ────────────────────────────────────── */}
            {selectedProduct && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl border border-[var(--gold)]/20"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(197,160,89,0.06) 0%, rgba(0,0,0,0.4) 100%)",
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-manrope text-sm text-white/60">
                    {selectedProduct.name} × {quantity}
                  </span>
                  <span className="font-bebas text-4xl gradient-gold">
                    RM{totalPrice}
                  </span>
                </div>
              </motion.div>
            )}

            {/* ── Room Number ──────────────────────────────────────── */}
            <div>
              <label className="form-label">
                Room Number / Address <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g. Aishah 98"
                className="form-input"
                required
              />
            </div>

            {/* ── Notes ────────────────────────────────────────────── */}
            <div>
              <label className="form-label">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions..."
                className="form-input min-h-[100px] resize-none"
                rows={3}
              />
            </div>

            {/* ── Error Message ────────────────────────────────────── */}
            <AnimatePresence>
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-xl border border-red-500/30 bg-red-500/10"
                >
                  <p className="font-manrope text-sm text-red-400">
                    ⚠️ {errorMsg}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Payment Reminder ─────────────────────────────────── */}
            <div className="flex items-center gap-2 py-1">
              <div className="flex-1 h-px bg-white/5" />
              <p className="font-manrope text-[11px] tracking-widest text-white/30 uppercase whitespace-nowrap">
                💵 Cash/QR with COD only — paid upon delivery
              </p>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* ── Submit Button ────────────────────────────────────── */}
            <motion.button
              type="submit"
              disabled={status === "loading"}
              className="w-full font-manrope text-sm tracking-[0.2em] uppercase py-4 px-8 rounded-full border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-all duration-400 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              whileHover={status !== "loading" ? { scale: 1.01 } : {}}
              whileTap={status !== "loading" ? { scale: 0.98 } : {}}
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-3">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                "Confirm Booking →"
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Success Card ──────────────────────────────────────────────────────────── */
function SuccessCard({
  booking,
  onBack,
}: {
  booking: BookingResult;
  onBack: () => void;
}) {
  return (
    <motion.div
      key="success-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      className="text-center"
    >
      {/* Success checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 mx-auto mb-8 rounded-full border-2 border-[var(--gold)] flex items-center justify-center"
      >
        <svg
          className="w-12 h-12 text-[var(--gold)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </motion.div>

      <motion.h3
        className="font-bebas text-5xl md:text-6xl text-white mb-3"
        style={{ letterSpacing: "0.05em" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        BOOKING <span className="gradient-gold">CONFIRMED</span>
      </motion.h3>

      <motion.p
        className="font-manrope text-white/50 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Your decant is being prepared with care.
      </motion.p>

      {/* Invoice Card */}
      <motion.div
        className="glass-card p-8 text-left max-w-md mx-auto mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-8 h-1 rounded-full"
            style={{ background: "var(--gold)" }}
          />
          <span className="font-manrope text-[10px] tracking-[0.4em] text-white/40 uppercase">
            Invoice Summary
          </span>
        </div>

        <div className="space-y-3">
          <InvoiceRow label="Booking ID" value={booking.id} highlight />
          <InvoiceRow label="Name" value={booking.name} />
          <InvoiceRow label="Product" value={booking.product} />
          <InvoiceRow label="Qty" value={String(booking.quantity)} />
          <InvoiceRow label="Room" value={booking.roomNumber} />
          <InvoiceRow label="Date" value={booking.date} />
          <div className="pt-3 mt-3 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="font-manrope text-sm text-white/60 uppercase tracking-widest">
                Total
              </span>
              <span className="font-bebas text-3xl gradient-gold">
                RM{booking.totalPrice}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <button
          onClick={onBack}
          className="font-manrope text-xs tracking-[0.2em] uppercase px-8 py-3 rounded-full border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-all duration-300"
        >
          New Booking
        </button>
        <a
          href="/"
          className="font-manrope text-xs tracking-[0.2em] uppercase px-8 py-3 rounded-full border border-white/20 text-white/50 hover:border-white/40 hover:text-white transition-all duration-300"
        >
          Back to Home
        </a>
      </motion.div>
    </motion.div>
  );
}

function InvoiceRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="font-manrope text-xs text-white/40 uppercase tracking-widest">
        {label}
      </span>
      <span
        className={`font-manrope text-sm ${
          highlight ? "text-[var(--gold)] font-semibold" : "text-white/80"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
