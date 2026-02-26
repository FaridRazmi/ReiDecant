"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Booking {
  id: number;
  booking_id: string;
  name: string;
  phone: string;
  product: string;
  total_price: number;
  room_number: string;
  notes: string | null;
  quantity: number;
  status: string;
  created_at: string;
}

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ total: 0, revenue: 0, today: 0 });

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/bookings?secret=${encodeURIComponent(secret)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to fetch");
        setAuthenticated(false);
        return;
      }

      setBookings(data.bookings);
      setAuthenticated(true);

      // Calculate stats
      const today = new Date().toDateString();
      const todayBookings = data.bookings.filter(
        (b: Booking) => new Date(b.created_at).toDateString() === today
      );
      const totalRevenue = data.bookings.reduce(
        (sum: number, b: Booking) => sum + (b.total_price || 0),
        0
      );

      setStats({
        total: data.bookings.length,
        revenue: totalRevenue,
        today: todayBookings.length,
      });
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  return (
    <main className="bg-black min-h-screen text-white">
      {/* ── Topbar ────────────────────────────────────────────────── */}
      <header className="border-b border-white/5 px-6 md:px-10 py-5 flex items-center justify-between">
        <a href="/" className="font-bebas text-2xl tracking-widest">
          REI<span style={{ color: "var(--gold)" }}>DECANT</span>
          <span className="font-manrope text-[10px] ml-3 tracking-[0.3em] text-white/30 uppercase">
            Admin
          </span>
        </a>
        {authenticated && (
          <button
            onClick={() => {
              setAuthenticated(false);
              setSecret("");
              setBookings([]);
            }}
            className="font-manrope text-xs tracking-widest text-white/40 hover:text-white transition-colors uppercase"
          >
            Logout
          </button>
        )}
      </header>

      <div className="px-6 md:px-10 py-10 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!authenticated ? (
            /* ── Login ─────────────────────────────────────────────── */
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-sm mx-auto mt-20"
            >
              <h1
                className="font-bebas text-center mb-10"
                style={{ fontSize: "clamp(36px, 6vw, 56px)" }}
              >
                ADMIN <span className="gradient-gold">ACCESS</span>
              </h1>

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="password"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Enter admin secret..."
                  className="form-input text-center"
                  required
                />
                {error && (
                  <p className="text-red-400 text-sm text-center font-manrope">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-manrope text-xs tracking-[0.2em] uppercase py-3 rounded-full border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-all disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Login →"}
                </button>
              </form>
            </motion.div>
          ) : (
            /* ── Dashboard ─────────────────────────────────────────── */
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                <StatCard
                  label="Total Bookings"
                  value={String(stats.total)}
                  delay={0}
                />
                <StatCard
                  label="Total Revenue"
                  value={`RM${stats.revenue.toFixed(0)}`}
                  delay={0.1}
                />
                <StatCard
                  label="Today"
                  value={String(stats.today)}
                  delay={0.2}
                />
              </div>

              {/* Refresh */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bebas text-2xl tracking-wide">
                  RECENT <span className="gradient-gold">BOOKINGS</span>
                </h2>
                <button
                  onClick={fetchBookings}
                  className="font-manrope text-[11px] tracking-widest uppercase text-white/40 hover:text-[var(--gold)] transition-colors"
                >
                  ↻ Refresh
                </button>
              </div>

              {/* Bookings Table */}
              {bookings.length === 0 ? (
                <div className="text-center py-20">
                  <p className="font-manrope text-white/30 text-sm">
                    No bookings yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        {[
                          "Booking ID",
                          "Name",
                          "Phone",
                          "Product",
                          "Room",
                          "Total",
                          "Status",
                          "Date",
                        ].map((h) => (
                          <th
                            key={h}
                            className="font-manrope text-[10px] tracking-[0.2em] uppercase text-white/30 py-3 px-3 text-left"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b, i) => (
                        <motion.tr
                          key={b.booking_id || i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-3 px-3 font-mono text-xs text-[var(--gold)]">
                            {b.booking_id}
                          </td>
                          <td className="py-3 px-3 font-manrope text-sm text-white/80">
                            {b.name}
                          </td>
                          <td className="py-3 px-3 font-manrope text-xs text-white/50">
                            {b.phone}
                          </td>
                          <td className="py-3 px-3 font-manrope text-xs text-white/60 max-w-[180px] truncate">
                            {b.product}
                          </td>
                          <td className="py-3 px-3 font-manrope text-xs text-white/50">
                            {b.room_number}
                          </td>
                          <td className="py-3 px-3 font-bebas text-lg text-white">
                            RM{b.total_price}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className="font-manrope text-[10px] tracking-widest uppercase px-3 py-1 rounded-full"
                              style={{
                                background:
                                  b.status === "confirmed"
                                    ? "rgba(72,187,120,0.15)"
                                    : "rgba(197,160,89,0.15)",
                                color:
                                  b.status === "confirmed"
                                    ? "#48BB78"
                                    : "var(--gold)",
                                border: `1px solid ${
                                  b.status === "confirmed"
                                    ? "rgba(72,187,120,0.3)"
                                    : "rgba(197,160,89,0.3)"
                                }`,
                              }}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-manrope text-[11px] text-white/40">
                            {new Date(b.created_at).toLocaleDateString("en-MY", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  delay,
}: {
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-6 rounded-2xl border border-white/5"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(197,160,89,0.03) 100%)",
      }}
    >
      <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-white/30 mb-2">
        {label}
      </p>
      <p className="font-bebas text-4xl gradient-gold">{value}</p>
    </motion.div>
  );
}
