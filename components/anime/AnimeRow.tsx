"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Anime } from "@/lib/api";
import AnimeCard from "./AnimeCard";

interface AnimeRowProps {
  title: string;
  animeList: Anime[];
  viewAllHref?: string;
}

export default function AnimeRow({
  title,
  animeList,
  viewAllHref,
}: AnimeRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -750 : 750;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!animeList || animeList.length === 0) return null;

  return (
    <section
      className="relative my-7 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto group/row"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Row Header */}
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-bold text-lg sm:text-xl text-white tracking-tight">
          {title}
        </h2>

        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-xs font-semibold text-[#8B5CF6] hover:text-[#A855F7] transition"
          >
            Explore All →
          </Link>
        )}
      </div>

      {/* Row Wrapper with Floating Netflix Chevron Controls */}
      <div className="relative">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className={`absolute left-0 top-0 bottom-8 z-40 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-opacity duration-200 cursor-pointer ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Horizontal Card Track */}
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-1"
        >
          {animeList.map((anime, index) => (
            <div
              key={`${anime.mal_id}-${index}`}
              className="w-[140px] sm:w-[170px] md:w-[190px] flex-shrink-0"
            >
              <AnimeCard anime={anime} />
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className={`absolute right-0 top-0 bottom-8 z-40 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-opacity duration-200 cursor-pointer ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
