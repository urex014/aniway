"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, User, Bookmark } from "lucide-react";
import { getWatchlistIds } from "@/lib/storage";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const updateCount = () => {
      setWatchlistCount(getWatchlistIds().length);
    };
    updateCount();

    const handleStorage = () => updateCount();
    window.addEventListener("aniway_storage_update", handleStorage);
    window.addEventListener("storage", handleStorage);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("aniway_storage_update", handleStorage);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Anime", href: "/anime" },
    { name: "Trending", href: "/rankings" },
    { name: "Seasonal", href: "/seasons" },
    { name: "Genres", href: "/anime?genres=1" },
    { name: "My List", href: "/watchlist" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#050505] shadow-[0_4px_20px_rgba(0,0,0,0.8)] border-b border-white/5"
          : "bg-gradient-to-b from-[#050505]/90 via-[#050505]/40 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-6">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-extrabold text-2xl tracking-tighter text-white group-hover:text-white transition">
              ANI<span className="text-[#8B5CF6]">WAY</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-5 text-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-[#A3A3A3] hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Search, My List Indicator, Profile */}
        <div className="flex items-center gap-4">
          {/* Expandable Search Input */}
          <div className="relative flex items-center">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => {
                    if (!searchQuery) setSearchOpen(false);
                  }}
                  placeholder="Titles, characters, genres..."
                  className="w-48 sm:w-64 bg-[#111111] border border-white/20 rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#A3A3A3] outline-none focus:border-[#8B5CF6] transition-all"
                />
                <Search className="w-3.5 h-3.5 text-[#A3A3A3] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="text-[#A3A3A3] hover:text-white transition p-1.5 cursor-pointer"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* My List counter link */}
          <Link
            href="/watchlist"
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#A3A3A3] hover:text-white transition"
            title="My List"
          >
            <Bookmark className="w-4 h-4" />
            {watchlistCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#8B5CF6] text-white text-[10px] font-bold">
                {watchlistCount}
              </span>
            )}
          </Link>

          {/* Profile Avatar */}
          <Link
            href="/profile"
            className="w-8 h-8 rounded-md bg-[#181818] border border-white/10 hover:border-[#8B5CF6] flex items-center justify-center text-xs font-bold text-white transition overflow-hidden"
            title="Account Profile"
          >
            <div className="w-full h-full bg-gradient-to-tr from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center">
              <span>A</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
