"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, BookOpen } from "lucide-react";
import { Manga } from "@/lib/api";

interface MangaCardProps {
  manga: Manga;
}

export default function MangaCard({ manga }: MangaCardProps) {
  const [imgSrc, setImgSrc] = useState<string>(
    manga.images?.webp?.large_image_url ||
    manga.images?.jpg?.large_image_url ||
    manga.images?.jpg?.image_url ||
    "/placeholder-poster.jpg"
  );

  const displayTitle = manga.title_english || manga.title;
  const ratingScore = manga.score ? manga.score.toFixed(1) : null;

  return (
    <div className="group relative flex flex-col w-full text-left transition-all duration-300">
      <Link
        href={`/manga/${manga.mal_id}`}
        className="block relative w-full aspect-[3/4.2] rounded-xl overflow-hidden bg-[#111116] border border-white/10 group-hover:border-[#22D3EE]/70 group-hover:shadow-[0_0_25px_-5px_rgba(34,211,238,0.35)] transition-all duration-300"
      >
        <Image
          src={imgSrc}
          alt={displayTitle}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
          onError={() => setImgSrc("/placeholder-poster.jpg")}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold tracking-wider text-[#22D3EE] uppercase">
            {manga.type || "MANGA"}
          </span>

          {ratingScore && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md border border-amber-400/30 text-[11px] font-bold text-amber-300">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{ratingScore}</span>
            </div>
          )}
        </div>

        {/* Bottom Badges */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono font-semibold text-white/90">
            {manga.chapters ? `${manga.chapters} CH` : "ONGOING"}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#22D3EE]/20 backdrop-blur-md border border-[#22D3EE]/40 text-[9px] font-mono font-bold text-[#22D3EE]">
            {manga.status}
          </span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-black/40 pointer-events-none opacity-60 group-hover:opacity-90 transition-opacity" />

        {/* Hover quick preview */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/90 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3.5 z-10 pointer-events-none">
          {manga.title_japanese && (
            <p className="text-[10px] font-mono text-[#22D3EE] truncate mb-0.5">
              {manga.title_japanese}
            </p>
          )}
          {manga.synopsis && (
            <p className="text-[11px] text-[#A1A1AA] line-clamp-3 leading-relaxed mb-2.5">
              {manga.synopsis}
            </p>
          )}
          <div className="flex items-center gap-2 pt-1 pointer-events-auto">
            <span className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[#22D3EE]/20 hover:bg-[#22D3EE]/30 border border-[#22D3EE]/40 text-white text-xs font-semibold transition active:scale-95">
              <BookOpen className="w-3 h-3 text-[#22D3EE]" />
              Read Info
            </span>
          </div>
        </div>
      </Link>

      <div className="mt-2.5 space-y-0.5">
        <Link
          href={`/manga/${manga.mal_id}`}
          className="font-heading font-semibold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-[#22D3EE] transition-colors"
          title={displayTitle}
        >
          {displayTitle}
        </Link>
        <div className="flex items-center gap-2 text-[11px] text-[#A1A1AA]">
          <span>{manga.authors && manga.authors[0] ? manga.authors[0].name : "Manga"}</span>
        </div>
      </div>
    </div>
  );
}
