"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Play, Plus, Check } from "lucide-react";
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
    <div className="group relative flex flex-col w-full text-left">
      <Link
        href={`/anime/${anime.mal_id}`}
        className="block relative w-full aspect-[2/3] rounded-md overflow-hidden bg-[#111111] transition-transform duration-300 ease-out group-hover:scale-105 group-hover:z-30 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.8)]"
      >
        {/* Poster Artwork */}
        <Image
          src={imgSrc}
          alt={displayTitle}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
          priority={priority}
          onError={() => setImgSrc("/placeholder-poster.jpg")}
          className="object-cover"
        />

        {/* Minimal Score Badge */}
        {ratingScore && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[11px] font-semibold text-white">
            <Star className="w-3 h-3 fill-[#8B5CF6] text-[#8B5CF6]" />
            <span>{ratingScore}</span>
          </div>
        )}

        {/* Dark Bottom Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

        {/* Netflix Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 pointer-events-none">
          <div className="flex items-center justify-between mb-2 pointer-events-auto">
            <span className="w-8 h-8 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center shadow-md transform group-hover:scale-105 transition">
              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
            </span>

            <button
              onClick={handleWatchlistClick}
              title={inWatchlist ? "Remove from My List" : "Add to My List"}
              className="w-8 h-8 rounded-full bg-[#181818]/90 hover:bg-[#262626] border border-white/20 text-white flex items-center justify-center transition"
            >
              {inWatchlist ? <Check className="w-3.5 h-3.5 text-[#8B5CF6]" /> : <Plus className="w-3.5 h-3.5" />}
            </button>
          </div>

          <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">
            {displayTitle}
          </h4>

          <div className="flex items-center gap-2 text-[10px] text-[#A3A3A3]">
            <span>{anime.episodes ? `${anime.episodes} Eps` : "Ongoing"}</span>
            <span>•</span>
            <span>{anime.type || "TV"}</span>
          </div>
        </div>

        {/* Watch Progress Bar */}
        {progressPercent !== null && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
            <div
              className="h-full bg-[#8B5CF6]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </Link>

      {/* Title Below Card */}
      <div className="mt-2 space-y-0.5">
        <Link
          href={`/anime/${anime.mal_id}`}
          className="font-medium text-xs sm:text-sm text-white line-clamp-1 group-hover:text-[#A855F7] transition-colors"
          title={displayTitle}
        >
          {displayTitle}
        </Link>
        <p className="text-[11px] text-[#A3A3A3]">
          {anime.year || (anime.aired?.prop?.from?.year ?? anime.type ?? "Anime")}
        </p>
      </div>
    </div>
  );
}
