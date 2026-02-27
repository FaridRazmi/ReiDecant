/**
 * Sends a formatted booking notification to Telegram
 */
export async function sendTelegramNotification(booking: {
  bookingId: string;
  name: string;
  phone: string;
  product: string;
  size: string;
  totalPrice: number;
  roomNumber: string;
  notes?: string;
  date: string;
}) {
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram credentials missing");
    return false;
  }

  const message = `
🔔 <b>NEW BOOKING RECEIVED</b>

━━━━━━━━━━━━━━━━━━━━━━

📋 <b>Booking ID:</b> <code>${booking.bookingId}</code>
👤 <b>Name:</b> ${booking.name}
📱 <b>Phone:</b> ${booking.phone}
📅 <b>Date:</b> ${booking.date}

🧴 <b>Product:</b> ${booking.product}
📦 <b>Size:</b> ${booking.size}
🏠 <b>Room Number:</b> ${booking.roomNumber}
💰 <b>Total:</b> RM${booking.totalPrice.toFixed(2)}

${booking.notes ? `📝 <b>Notes:</b> ${booking.notes}` : ""}

━━━━━━━━━━━━━━━━━━━━━━
✅ <i>Via ReiDecant Booking System</i>
  `.trim();

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    const data = await res.json();
    if (!data.ok) {
      console.error("Telegram API error:", data);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Telegram send failed:", err);
    return false;
  }
}
