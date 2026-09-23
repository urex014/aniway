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
    <section className="relative my-7 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-bold text-lg sm:text-xl text-white tracking-tight">
          Continue Watching for You
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-1 w-full overscroll-x-contain touch-pan-x">
        {items.map((item) => {
          const percent =
            item.durationSeconds > 0
              ? Math.min(100, Math.round((item.progressSeconds / item.durationSeconds) * 100))
              : 25;

          return (
            <div
              key={`${item.animeId}-${item.episode}`}
              className="w-[200px] sm:w-[240px] flex-shrink-0 group"
            >
              <Link
                href={`/watch/${item.animeId}?ep=${item.episode}`}
                className="block relative aspect-video rounded-md overflow-hidden bg-[#111111] transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_8px_25px_rgba(0,0,0,0.8)]"
              >
                {item.posterUrl ? (
                  <Image
                    src={item.posterUrl}
                    alt={item.animeTitle}
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#181818] flex items-center justify-center">
                    <Clock className="w-8 h-8 text-[#A3A3A3]" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Netflix Red/Purple Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div
                    className="h-full bg-[#8B5CF6]"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </Link>

              <div className="mt-2 space-y-0.5">
                <Link
                  href={`/watch/${item.animeId}?ep=${item.episode}`}
                  className="font-medium text-xs sm:text-sm text-white line-clamp-1 group-hover:text-[#8B5CF6] transition-colors"
                >
                  {item.animeTitle}
                </Link>
                <div className="flex items-center justify-between text-[11px] text-[#A3A3A3]">
                  <span>Episode {item.episode}</span>
                  <span>{percent}% watched</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
