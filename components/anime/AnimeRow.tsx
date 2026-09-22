"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Anime } from "@/lib/api";
import AnimeCard from "./AnimeCard";

interface AnimeRowProps {
  title: string;
  subtitleJapanese?: string;
  animeList: Anime[];
  viewAllHref?: string;
}

export default function AnimeRow({
  title,
  subtitleJapanese,
  animeList,
  viewAllHref,
}: AnimeRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -600 : 600;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!animeList || animeList.length === 0) return null;

  return (
    <section className="relative my-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Row Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline gap-2.5">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-white tracking-wide">
            {title}
          </h2>
          {subtitleJapanese && (
            <span className="text-[11px] font-mono text-[#22D3EE] font-light hidden sm:inline">
              // {subtitleJapanese}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-xs font-mono font-medium text-[#C084FC] hover:text-[#22D3EE] transition mr-2"
            >
              VIEW ALL →
            </Link>
          )}

          {/* Desktop Scroll Chevrons */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll Left"
              className="p-1.5 rounded-lg bg-[#111116] hover:bg-[#18181F] border border-white/10 text-[#A1A1AA] hover:text-white transition active:scale-90"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll Right"
              className="p-1.5 rounded-lg bg-[#111116] hover:bg-[#18181F] border border-white/10 text-[#A1A1AA] hover:text-white transition active:scale-90"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-1"
      >
        {animeList.map((anime, index) => (
          <div
            key={`${anime.mal_id}-${index}`}
            className="w-[145px] sm:w-[175px] md:w-[195px] flex-shrink-0"
          >
            <AnimeCard anime={anime} />
          </div>
        ))}
      </div>
    </section>
  );
}
