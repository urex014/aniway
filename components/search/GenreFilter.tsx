"use client";

import React from "react";
import Link from "next/link";
import { Genre } from "@/lib/api";

interface GenreFilterProps {
  genres: Genre[];
  selectedGenreId?: number;
  onSelectGenre?: (id: number) => void;
  baseHref?: string;
}

export default function GenreFilter({
  genres,
  selectedGenreId,
  onSelectGenre,
  baseHref = "/anime",
}: GenreFilterProps) {
  if (!genres || genres.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
      {onSelectGenre ? (
        <button
          onClick={() => onSelectGenre(0)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 cursor-pointer ${
            !selectedGenreId
              ? "bg-[#8B5CF6] text-white font-semibold"
              : "bg-[#181818] hover:bg-[#262626] text-[#A3A3A3] hover:text-white"
          }`}
        >
          All
        </button>
      ) : (
        <Link
          href={baseHref}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 ${
            !selectedGenreId
              ? "bg-[#8B5CF6] text-white font-semibold"
              : "bg-[#181818] hover:bg-[#262626] text-[#A3A3A3] hover:text-white"
          }`}
        >
          All
        </Link>
      )}

      {genres.map((genre) => {
        const isSelected = selectedGenreId === genre.mal_id;
        if (onSelectGenre) {
          return (
            <button
              key={genre.mal_id}
              onClick={() => onSelectGenre(genre.mal_id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-[#8B5CF6] text-white font-semibold"
                  : "bg-[#181818] hover:bg-[#262626] text-[#A3A3A3] hover:text-white"
              }`}
            >
              {genre.name}
            </button>
          );
        }

        return (
          <Link
            key={genre.mal_id}
            href={`${baseHref}?genres=${genre.mal_id}`}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 ${
              isSelected
                ? "bg-[#8B5CF6] text-white font-semibold"
                : "bg-[#181818] hover:bg-[#262626] text-[#A3A3A3] hover:text-white"
            }`}
          >
            {genre.name}
          </Link>
        );
      })}
    </div>
  );
}
