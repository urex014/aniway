"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Search, Flame, Bookmark } from "lucide-react";
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
    { label: "Explore", href: "/anime", icon: Compass },
    { label: "Search", href: "/search", icon: Search },
    { label: "Trending", href: "/rankings", icon: Flame },
    { label: "Watchlist", href: "/watchlist", icon: Bookmark, badge: watchlistCount },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#09090B]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1 shadow-[0_-4px_25px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg relative transition-all duration-200 ${
                isActive ? "text-[#C084FC]" : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110 text-[#C084FC]" : ""}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-3.5 min-w-3.5 items-center justify-center px-1 rounded-full bg-[#7C3AED] text-[9px] font-bold text-white shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium tracking-tight ${isActive ? "text-white font-semibold" : ""}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 bg-[#7C3AED] rounded-full shadow-[0_0_8px_#7C3AED]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
