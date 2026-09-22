"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  Flame,
  Bookmark,
  Search,
  Dice5,
  Calendar,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { getWatchlistIds } from "@/lib/storage";
import { randomService } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSurpriseLoading, setIsSurpriseLoading] = useState(false);

  useEffect(() => {
    const updateCount = () => {
      setWatchlistCount(getWatchlistIds().length);
    };
    updateCount();

    const handleStorage = () => updateCount();
    window.addEventListener("aniway_storage_update", handleStorage);
    window.addEventListener("storage", handleStorage);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("aniway_storage_update", handleStorage);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSurpriseMe = async () => {
    if (isSurpriseLoading) return;
    setIsSurpriseLoading(true);
    try {
      const res = await randomService.getRandomAnime();
      if (res?.data?.mal_id) {
        router.push(`/anime/${res.data.mal_id}`);
      }
    } catch {
      router.push("/anime/52991");
    } finally {
      setIsSurpriseLoading(false);
    }
  };

  const navLinks = [
    { name: "Home", href: "/", icon: null },
    { name: "Explore", href: "/anime", icon: Compass },
    { name: "Trending", href: "/rankings", icon: Flame },
    { name: "Manga", href: "/manga", icon: BookOpen },
    { name: "Seasons", href: "/seasons", icon: Sparkles },
    { name: "Schedule", href: "/schedule", icon: Calendar },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[#09090B]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-gradient-to-b from-[#09090B]/95 via-[#09090B]/70 to-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-[#22D3EE] p-[1px] shadow-[0_0_15px_rgba(124,58,237,0.5)] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.7)] transition-all duration-300">
              <div className="w-full h-full bg-[#09090B] rounded-[7px] flex items-center justify-center">
                <span className="font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-[#C084FC] to-[#22D3EE] text-base">
                  A
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold tracking-wider text-lg text-white group-hover:text-[#22D3EE] transition-colors">
                  ANIWAY
                </span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#C084FC]">
                  V4
                </span>
              </div>
              <span className="text-[9px] tracking-widest text-[#A1A1AA] font-light -mt-1">
                アニウェイ // CYBER STREAM
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? "text-white bg-[#18181F] border border-white/10 shadow-sm"
                      : "text-[#A1A1AA] hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Surprise Me Button */}
          <button
            onClick={handleSurpriseMe}
            disabled={isSurpriseLoading}
            title="Surprise Me (Random Anime)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111116] hover:bg-[#18181F] border border-white/10 hover:border-[#C084FC]/40 text-xs font-medium text-[#C084FC] transition-all active:scale-95 cursor-pointer"
          >
            <Dice5 className={`w-3.5 h-3.5 ${isSurpriseLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Surprise Me</span>
          </button>

          {/* Quick Search trigger */}
          <Link
            href="/search"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111116] hover:bg-[#18181F] border border-white/10 text-xs text-[#A1A1AA] hover:text-white transition group"
          >
            <Search className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:text-[#22D3EE]" />
            <span className="hidden sm:inline text-xs">Search database...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#18181F] text-[#A1A1AA] rounded border border-white/10">
              /
            </kbd>
          </Link>

          {/* Watchlist with counter badge */}
          <Link
            href="/watchlist"
            title="Watchlist"
            className={`relative p-2 rounded-lg border transition ${
              pathname === "/watchlist"
                ? "bg-[#18181F] border-[#7C3AED] text-[#C084FC]"
                : "bg-[#111116] border-white/10 text-[#A1A1AA] hover:text-white hover:border-white/20"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            {watchlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center px-1 rounded-full bg-[#7C3AED] text-[10px] font-bold text-white shadow-[0_0_10px_rgba(124,58,237,0.7)] animate-in fade-in zoom-in">
                {watchlistCount}
              </span>
            )}
          </Link>

          {/* Profile / Preferences */}
          <Link
            href="/profile"
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#18181F] to-[#111116] border border-white/15 hover:border-[#22D3EE]/50 transition text-xs font-mono font-bold text-[#F5F5F5] shadow-inner"
            title="User Matrix Profile"
          >
            <span className="text-[#22D3EE]">7</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
