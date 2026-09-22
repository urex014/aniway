"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Plus, Check, Info, Star } from "lucide-react";
import { Anime } from "@/lib/api";
import { isAnimeInWatchlist, toggleWatchlistId } from "@/lib/storage";

interface HeroProps {
  featuredAnime: Anime[];
}

export default function Hero({ featuredAnime }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inWatchlist, setInWatchlist] = useState(false);

  const currentAnime = featuredAnime[currentIndex] || featuredAnime[0];

  useEffect(() => {
    if (currentAnime) {
      setInWatchlist(isAnimeInWatchlist(currentAnime.mal_id));
    }
  }, [currentAnime]);

  // Subtle auto-advance every 9 seconds
  useEffect(() => {
    if (featuredAnime.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredAnime.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [featuredAnime.length]);

  if (!currentAnime) return null;

  const handleWatchlist = () => {
    const updated = toggleWatchlistId(currentAnime.mal_id);
    setInWatchlist(updated);
  };

  const displayTitle = currentAnime.title_english || currentAnime.title;
  const bannerImage =
    currentAnime.images?.webp?.large_image_url ||
    currentAnime.images?.jpg?.large_image_url ||
    "/placeholder-hero.jpg";

  return (
    <div className="relative w-full h-[85vh] min-h-[580px] max-h-[850px] bg-[#050505] overflow-hidden">
      {/* Background Anime Artwork */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bannerImage}
          alt={displayTitle}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.7] contrast-[1.05] transition-all duration-1000 ease-in-out"
        />
      </div>

      {/* Netflix Left-to-Right and Bottom Vignettes */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#050505] via-[#050505]/75 to-transparent w-full md:w-3/4" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-transparent to-black/30" />

      {/* Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto h-full flex flex-col justify-end pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-4">
          {/* Metadata Row */}
          <div className="flex items-center gap-3 text-xs text-[#A3A3A3] font-medium">
            {currentAnime.score && (
              <span className="flex items-center gap-1 text-white font-bold">
                <Star className="w-3.5 h-3.5 fill-[#8B5CF6] text-[#8B5CF6]" />
                {currentAnime.score.toFixed(1)} Rating
              </span>
            )}
            <span>•</span>
            <span>{currentAnime.year || (currentAnime.aired?.prop?.from?.year ?? "Series")}</span>
            <span>•</span>
            <span>{currentAnime.episodes ? `${currentAnime.episodes} Episodes` : "Ongoing"}</span>
            {currentAnime.rating && (
              <>
                <span>•</span>
                <span className="px-1.5 py-0.2 rounded border border-white/20 text-[10px] text-white">
                  {currentAnime.rating.split(" ")[0]}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="font-extrabold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight line-clamp-2 drop-shadow-lg">
            {displayTitle}
          </h1>

          {/* Short Synopsis */}
          {currentAnime.synopsis && (
            <p className="text-xs sm:text-sm text-[#A3A3A3] line-clamp-3 leading-relaxed max-w-xl">
              {currentAnime.synopsis}
            </p>
          )}

          {/* Genres (clean inline format) */}
          {currentAnime.genres && currentAnime.genres.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-white/70 pt-1">
              {currentAnime.genres.slice(0, 3).map((g, idx) => (
                <React.Fragment key={g.mal_id}>
                  <span>{g.name}</span>
                  {idx < Math.min(2, currentAnime.genres.length - 1) && (
                    <span className="text-white/30">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Netflix Style Buttons */}
          <div className="flex items-center gap-3 pt-3">
            <Link
              href={`/watch/${currentAnime.mal_id}?ep=1`}
              className="flex items-center gap-2 px-7 py-3 rounded-md bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold text-sm transition-all duration-200 shadow-md active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              Watch Now
            </Link>

            <button
              onClick={handleWatchlist}
              className="flex items-center gap-2 px-6 py-3 rounded-md bg-[#181818]/90 hover:bg-[#262626] border border-white/15 text-white font-medium text-sm transition-all duration-200 active:scale-95 cursor-pointer"
            >
              {inWatchlist ? <Check className="w-4 h-4 text-[#8B5CF6]" /> : <Plus className="w-4 h-4" />}
              <span>{inWatchlist ? "In My List" : "My List"}</span>
            </button>

            <Link
              href={`/anime/${currentAnime.mal_id}`}
              className="flex items-center gap-2 px-4 py-3 rounded-md bg-[#111111]/70 hover:bg-[#181818] border border-white/10 text-xs text-[#A3A3A3] hover:text-white transition"
              title="More Info"
            >
              <Info className="w-4 h-4" />
              More Info
            </Link>
          </div>
        </div>

        {/* Carousel indicators */}
        {featuredAnime.length > 1 && (
          <div className="flex items-center gap-2 pt-8">
            {featuredAnime.map((item, idx) => (
              <button
                key={item.mal_id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Slide to ${item.title}`}
                className={`h-1 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? "w-8 bg-[#8B5CF6]"
                    : "w-3 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
