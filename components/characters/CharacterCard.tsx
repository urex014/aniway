"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Character } from "@/lib/api";

interface CharacterCardProps {
  character: Character;
  role?: string;
}

export default function CharacterCard({ character, role }: CharacterCardProps) {
  const [imgSrc, setImgSrc] = useState<string>(
    character.images?.webp?.image_url ||
    character.images?.jpg?.image_url ||
    "/placeholder-character.jpg"
  );

  return (
    <Link
      href={`/characters/${character.mal_id}`}
      className="group relative flex flex-col p-3 rounded-xl bg-[#111116] border border-white/5 hover:border-[#7C3AED]/50 hover:bg-[#18181F] transition-all duration-300 shadow-sm"
    >
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#18181F] mb-2.5">
        <Image
          src={imgSrc}
          alt={character.name}
          fill
          sizes="160px"
          onError={() => setImgSrc("/placeholder-character.jpg")}
          className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
        />

        {character.favorites !== undefined && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-[10px] font-mono text-pink-400">
            <Heart className="w-3 h-3 fill-pink-400" />
            <span>{character.favorites.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="space-y-0.5">
        <h4 className="font-heading font-semibold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-[#C084FC] transition">
          {character.name}
        </h4>
        {character.name_kanji && (
          <p className="text-[10px] font-mono text-[#22D3EE] truncate">
            {character.name_kanji}
          </p>
        )}
        {role && (
          <span className="inline-block text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-[#A1A1AA] uppercase mt-1">
            {role}
          </span>
        )}
      </div>
    </Link>
  );
}
