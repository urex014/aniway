"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Play, Bookmark, Check } from "lucide-react";
import { Anime } from "@/lib/api";
import { isAnimeInWatchlist, toggleWatchlistId, getAnimeEpisodeProgress } from "@/lib/storage";

interface AnimeCardProps {
  anime: Anime;
  priority?: boolean;
}

export default function AnimeCard({ anime, priority = false }: AnimeCardProps) {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(
    anime.images?.webp?.large_image_url ||
    anime.images?.jpg?.large_image_url ||
    anime.images?.jpg?.image_url ||
    "/placeholder-poster.jpg"
  );
  const [progressPercent, setProgressPercent] = useState<number | null>(null);

  useEffect(() => {
    setInWatchlist(isAnimeInWatchlist(anime.mal_id));
    const prog = getAnimeEpisodeProgress(anime.mal_id);
    if (prog && prog.durationSeconds > 0) {
      const pct = Math.min(100, Math.round((prog.progressSeconds / prog.durationSeconds) * 100));
      setProgressPercent(pct);
    }
  }, [anime.mal_id]);

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = toggleWatchlistId(anime.mal_id);
    setInWatchlist(updated);
  };

  const displayTitle = anime.title_english || anime.title;
  const ratingScore = anime.score ? anime.score.toFixed(1) : null;

  return (
    <div className="group relative flex flex-col w-full text-left transition-all duration-300">
      <Link href={`/anime/${anime.mal_id}`} className="block relative w-full aspect-[3/4.2] rounded-xl overflow-hidden bg-[#111116] border border-white/10 group-hover:border-[#7C3AED]/70 group-hover:shadow-[0_0_25px_-5px_rgba(124,58,237,0.4)] transition-all duration-300">
        {/* Poster Image */}
        <Image
          src={imgSrc}
          alt={displayTitle}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
          priority={priority}
          onError={() => setImgSrc("/placeholder-poster.jpg")}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Cyberpunk Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5">
            {anime.type && (
              <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold tracking-wider text-white uppercase">
                {anime.type}
              </span>
            )}
            {anime.airing && (
              <span className="px-1.5 py-0.5 rounded bg-[#22D3EE]/20 backdrop-blur-md border border-[#22D3EE]/50 text-[10px] font-mono font-bold text-[#22D3EE]">
                AIRING
              </span>
            )}
          </div>

          {ratingScore && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md border border-amber-400/30 text-[11px] font-bold text-amber-300">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{ratingScore}</span>
            </div>
          )}
        </div>

        {/* Quick Watchlist Bookmark Button */}
        <button
          onClick={handleWatchlistClick}
          title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          className={`absolute top-2.5 right-2.5 z-20 p-1.5 rounded-lg backdrop-blur-md border transition-all duration-200 ${
            inWatchlist
              ? "bg-[#7C3AED] border-[#C084FC] text-white opacity-100"
              : "bg-black/60 border-white/20 text-[#A1A1AA] hover:text-white opacity-0 group-hover:opacity-100"
          }`}
        >
          {inWatchlist ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
        </button>

        {/* Bottom Metadata Badges */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono font-semibold text-white/90">
            {anime.episodes ? `${anime.episodes} EPS` : "ONGOING"}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#7C3AED]/30 backdrop-blur-md border border-[#7C3AED]/50 text-[9px] font-mono font-bold text-[#C084FC]">
            SUB / DUB
          </span>
        </div>

        {/* Dark Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-black/40 pointer-events-none opacity-60 group-hover:opacity-90 transition-opacity" />

        {/* Hover Quick-Info Slide-Up Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/90 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3.5 z-10 pointer-events-none">
          {anime.title_japanese && (
            <p className="text-[10px] font-mono text-[#22D3EE] truncate mb-0.5">
              {anime.title_japanese}
            </p>
          )}
          {anime.synopsis && (
            <p className="text-[11px] text-[#A1A1AA] line-clamp-3 leading-relaxed mb-2.5">
              {anime.synopsis}
            </p>
          )}
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            {anime.genres?.slice(0, 2).map((g) => (
              <span
                key={g.mal_id}
                className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white font-mono"
              >
                {g.name}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-1 pointer-events-auto">
            <span className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-sm transition active:scale-95">
              <Play className="w-3 h-3 fill-white" />
              Watch
            </span>
          </div>
        </div>

        {/* Watch Progress Bar */}
        {progressPercent !== null && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
            <div
              className="h-full bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] shadow-[0_0_8px_#22D3EE]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </Link>

      {/* Title Text */}
      <div className="mt-2.5 space-y-0.5">
        <Link
          href={`/anime/${anime.mal_id}`}
          className="font-heading font-semibold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-[#C084FC] transition-colors"
          title={displayTitle}
        >
          {displayTitle}
        </Link>
        <div className="flex items-center gap-2 text-[11px] text-[#A1A1AA]">
          <span>{anime.year || (anime.aired?.prop?.from?.year ? anime.aired.prop.from.year : anime.type || "Anime")}</span>
          {anime.studios && anime.studios[0] && (
            <>
              <span>•</span>
              <span className="truncate max-w-[120px]">{anime.studios[0].name}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
