"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
import { Anime } from "@/lib/api";

interface TrendingSectionProps {
  animeList: Anime[];
}

export default function TrendingSection({ animeList }: TrendingSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(false);

  const top10 = animeList.slice(0, 10);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -700 : 700;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!top10 || top10.length === 0) return null;

  return (
    <section
      className="relative my-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto group/trending w-full overflow-hidden"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h2 className="font-bold text-xl sm:text-2xl text-white tracking-tight">
            Top 10 Anime Today
          </h2>
          <p className="text-xs text-[#A3A3A3] mt-0.5">
            Most watched series currently streaming on Aniway.
          </p>
        </div>

        <Link
          href="/rankings?filter=bypopularity"
          className="text-xs font-semibold text-[#8B5CF6] hover:text-[#A855F7] transition shrink-0 ml-2"
        >
          View Full Chart →
        </Link>
      </div>

      <div className="relative w-full">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className={`absolute left-0 top-0 bottom-6 z-40 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-opacity duration-200 cursor-pointer ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Top 10 Track */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-2 w-full overscroll-x-contain touch-pan-x"
        >
          {top10.map((anime, index) => {
            const rankFormatted = String(index + 1).padStart(2, "0");
            const isTop3 = index < 3;
            const displayTitle = anime.title_english || anime.title;
            const posterImg =
              anime.images?.webp?.large_image_url ||
              anime.images?.jpg?.large_image_url ||
              "/placeholder-poster.jpg";

            return (
              <div
                key={anime.mal_id}
                className="flex items-center flex-shrink-0 group/card cursor-pointer"
              >
                {/* Giant Netflix Number Behind Poster */}
                <span
                  className={`netflix-rank-number text-7xl sm:text-9xl tracking-tighter select-none -mr-4 sm:-mr-7 z-0 transition-transform duration-300 group-hover/card:scale-105 ${
                    isTop3 ? "netflix-rank-number-top" : ""
                  }`}
                >
                  {rankFormatted}
                </span>

                {/* Poster Card */}
                <Link
                  href={`/anime/${anime.mal_id}`}
                  className="relative z-10 w-[130px] sm:w-[155px] md:w-[170px] aspect-[2/3] rounded-md overflow-hidden bg-[#111111] transition-transform duration-300 ease-out group-hover/card:scale-105 group-hover/card:shadow-[0_8px_25px_rgba(0,0,0,0.8)]"
                >
                  <Image
                    src={posterImg}
                    alt={displayTitle}
                    fill
                    sizes="170px"
                    className="object-cover"
                  />

                  {/* Gradient & Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover/card:opacity-90 transition-opacity" />

                  {anime.score && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] font-bold text-white">
                      <Star className="w-3 h-3 fill-[#8B5CF6] text-[#8B5CF6]" />
                      <span>{anime.score.toFixed(1)}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                    <span className="w-7 h-7 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center shadow mb-1">
                      <Play className="w-3 h-3 fill-white ml-0.5" />
                    </span>
                    <h4 className="text-[11px] font-bold text-white line-clamp-1">
                      {displayTitle}
                    </h4>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className={`absolute right-0 top-0 bottom-6 z-40 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-opacity duration-200 cursor-pointer ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
