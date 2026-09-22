import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ANIWAY — Stream Anime Online",
  description:
    "Premium anime streaming destination powered by real-time Jikan data. Watch trending, top-rated, and seasonal anime.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="min-h-screen flex flex-col bg-[#050505] text-[#FFFFFF] antialiased selection:bg-[#8B5CF6] selection:text-white">
        <Navbar />
        <main className="flex-1 pb-16 md:pb-12">{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
