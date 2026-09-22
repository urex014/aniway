import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ANIWAY // アニウェイ — Next-Gen Anime Streaming & Database",
  description:
    "Cyberpunk-infused modern anime streaming platform and media encyclopedia powered by real-time Jikan data.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} dark`}
    >
      <body className="min-h-screen flex flex-col bg-[#09090B] text-[#F5F5F5] antialiased selection:bg-[#7C3AED] selection:text-white">
        <Navbar />
        <main className="flex-1 pb-20 md:pb-12">{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
