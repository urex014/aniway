"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Bookmark, Check, Star, Info, Volume2, VolumeX } from "lucide-react";
import { Anime } from "@/lib/api";
import { isAnimeInWatchlist, toggleWatchlistId } from "@/lib/storage";

interface HeroProps {
  featuredAnime: Anime[];
}

export default function Hero({ featuredAnime }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  const currentAnime = featuredAnime[currentIndex] || featuredAnime[0];

  useEffect(() => {
    if (currentAnime) {
      setInWatchlist(isAnimeInWatchlist(currentAnime.mal_id));
      setShowTrailer(false);
    }
  }, [currentAnime]);

  // Auto-advance hero carousel every 8 seconds if trailer isn't playing
  useEffect(() => {
    if (featuredAnime.length <= 1 || showTrailer) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredAnime.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredAnime.length, showTrailer]);

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

  const trailerEmbed = currentAnime.trailer?.embed_url;

  return (
    <div className="relative w-full h-[72vh] min-h-[520px] max-h-[760px] bg-[#09090B] overflow-hidden border-b border-white/5">
      {/* Background Media */}
      {showTrailer && trailerEmbed ? (
        <div className="absolute inset-0 z-0">
          <iframe
            src={`${trailerEmbed}&autoplay=1&mute=1`}
            title={displayTitle}
            className="w-full h-full object-cover scale-125 pointer-events-none"
            allow="autoplay; encrypted-media"
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImage}
            alt={displayTitle}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter brightness-[0.75] contrast-[1.08] transition-all duration-700 ease-in-out"
          />
        </div>
      )}

      {/* Cyberpunk Vignette & Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#09090B] via-[#09090B]/85 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#09090B] via-transparent to-black/50" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#7C3AED]/20 via-transparent to-transparent pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto h-full flex flex-col justify-end pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-4">
          {/* Metadata Badges */}
          <div className="flex items-center flex-wrap gap-2 text-xs font-mono">
            <span className="px-2.5 py-0.5 rounded-full bg-[#7C3AED] text-white font-bold tracking-wider shadow-[0_0_12px_rgba(124,58,237,0.6)]">
              FEATURED // 注目
            </span>
            {currentAnime.type && (
              <span className="px-2 py-0.5 rounded bg-white/10 text-white font-semibold backdrop-blur-md">
                {currentAnime.type}
              </span>
            )}
            {currentAnime.score && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{currentAnime.score.toFixed(1)}</span>
              </div>
            )}
            {currentAnime.episodes && (
              <span className="px-2 py-0.5 rounded bg-white/10 text-[#A1A1AA]">
                {currentAnime.episodes} EPISODES
              </span>
            )}
            {currentAnime.rating && (
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#A1A1AA] text-[10px]">
                {currentAnime.rating.split(" ")[0]}
              </span>
            )}
          </div>

          {/* Titles */}
          <div className="space-y-1">
            {currentAnime.title_japanese && (
              <p className="text-xs sm:text-sm font-mono text-[#22D3EE] tracking-wide">
                {currentAnime.title_japanese}
              </p>
            )}
            <h1 className="font-heading font-black text-2xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight line-clamp-2 drop-shadow-md">
              {displayTitle}
            </h1>
          </div>

          {/* Synopsis */}
          {currentAnime.synopsis && (
            <p className="text-xs sm:text-sm text-[#A1A1AA] line-clamp-3 leading-relaxed max-w-xl">
              {currentAnime.synopsis}
            </p>
          )}

          {/* Genres Chips */}
          {currentAnime.genres && currentAnime.genres.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-1">
              {currentAnime.genres.slice(0, 4).map((g) => (
                <span
                  key={g.mal_id}
                  className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#18181F]/80 border border-white/10 text-white/90"
                >
                  {g.name}
                </span>
              ))}
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex items-center gap-3 pt-3 flex-wrap">
            <Link
              href={`/watch/${currentAnime.mal_id}?ep=1`}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#7E22CE] text-white font-heading font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(124,58,237,0.5)] transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              WATCH NOW
            </Link>

            <button
              onClick={handleWatchlist}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl backdrop-blur-md border text-sm font-medium transition-all active:scale-95 cursor-pointer ${
                inWatchlist
                  ? "bg-[#7C3AED]/20 border-[#C084FC] text-[#C084FC]"
                  : "bg-[#18181F]/80 hover:bg-[#1f1f2a] border-white/15 text-white"
              }`}
            >
              {inWatchlist ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              {inWatchlist ? "IN WATCHLIST" : "ADD TO WATCHLIST"}
            </button>

            <Link
              href={`/anime/${currentAnime.mal_id}`}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-[#A1A1AA] hover:text-white transition"
            >
              <Info className="w-4 h-4" />
              DETAILS
            </Link>

            {trailerEmbed && (
              <button
                onClick={() => setShowTrailer(!showTrailer)}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#22D3EE] transition"
                title={showTrailer ? "Stop Trailer" : "Preview Trailer"}
              >
                {showTrailer ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        {featuredAnime.length > 1 && (
          <div className="flex items-center gap-2 pt-6">
            {featuredAnime.map((item, idx) => (
              <button
                key={item.mal_id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setShowTrailer(false);
                }}
                aria-label={`Slide to ${item.title}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? "w-8 bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] shadow-[0_0_8px_#22D3EE]"
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
