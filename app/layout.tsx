import type { Metadata } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ReiDecant – Luxury, Unbottled.",
  description:
    "Premium perfume decants. Experience authentic, niche fragrances in a refined portable format. 500+ curated scents, 10k+ happy enthusiasts.",
  openGraph: {
    title: "ReiDecant – Luxury, Unbottled.",
    description: "Premium perfume decants. Authentic niche fragrances.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${bebasNeue.variable} ${manrope.variable} bg-black text-white font-manrope antialiased`}>
        {children}
      </body>
    </html>
  );
}
