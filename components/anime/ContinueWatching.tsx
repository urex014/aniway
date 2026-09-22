"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Clock } from "lucide-react";
import { getContinueWatchingList, WatchProgressItem } from "@/lib/storage";

export default function ContinueWatching() {
  const [items, setItems] = useState<WatchProgressItem[]>([]);

  useEffect(() => {
    const update = () => {
      setItems(getContinueWatchingList());
    };
    update();

    window.addEventListener("aniway_storage_update", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("aniway_storage_update", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="relative my-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline gap-2.5">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-white tracking-wide">
            Continue Watching
          </h2>
          <span className="text-[11px] font-mono text-[#22D3EE] font-light hidden sm:inline">
            // 再生中
          </span>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-1">
        {items.map((item) => {
          const percent = item.durationSeconds > 0
            ? Math.min(100, Math.round((item.progressSeconds / item.durationSeconds) * 100))
            : 25;

          return (
            <div
              key={`${item.animeId}-${item.episode}`}
              className="w-[200px] sm:w-[240px] flex-shrink-0 group"
            >
              <Link
                href={`/watch/${item.animeId}?ep=${item.episode}`}
                className="block relative aspect-video rounded-xl overflow-hidden bg-[#111116] border border-white/10 group-hover:border-[#7C3AED]/70 transition-all shadow-md group-hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
              >
                {item.posterUrl ? (
                  <Image
                    src={item.posterUrl}
                    alt={item.animeTitle}
                    fill
                    sizes="240px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-[#18181F] flex items-center justify-center">
                    <Clock className="w-8 h-8 text-[#A1A1AA]" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#7C3AED]/90 group-hover:bg-[#7C3AED] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Cyberpunk Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/60">
                  <div
                    className="h-full bg-gradient-to-r from-[#7C3AED] to-[#22D3EE]"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </Link>

              <div className="mt-2 space-y-0.5">
                <Link
                  href={`/watch/${item.animeId}?ep=${item.episode}`}
                  className="font-heading font-semibold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-[#22D3EE] transition"
                >
                  {item.animeTitle}
                </Link>
                <div className="flex items-center justify-between text-[11px] text-[#A1A1AA]">
                  <span>Episode {item.episode}</span>
                  <span className="font-mono text-[#C084FC]">{percent}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
