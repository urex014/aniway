"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Film, Search, Flame, Bookmark } from "lucide-react";
import { getWatchlistIds } from "@/lib/storage";

export default function MobileNav() {
  const pathname = usePathname();
  const [watchlistCount, setWatchlistCount] = useState(0);

  useEffect(() => {
    const update = () => setWatchlistCount(getWatchlistIds().length);
    update();
    window.addEventListener("aniway_storage_update", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("aniway_storage_update", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const items = [
    { label: "Home", href: "/", icon: Home },
    { label: "Anime", href: "/anime", icon: Film },
    { label: "Search", href: "/search", icon: Search },
    { label: "Trending", href: "/rankings", icon: Flame },
    { label: "My List", href: "/watchlist", icon: Bookmark, badge: watchlistCount },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#050505]/95 backdrop-blur-md border-t border-white/10 px-2 py-1 shadow-2xl">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-3 relative transition-colors ${
                isActive ? "text-[#8B5CF6]" : "text-[#A3A3A3] hover:text-white"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-3.5 min-w-3.5 items-center justify-center px-1 rounded-full bg-[#8B5CF6] text-[9px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? "text-white font-semibold" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
