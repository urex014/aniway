"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Mic } from "lucide-react";
import { Person } from "@/lib/api";

interface PersonCardProps {
  person: Person;
  occupation?: string;
}

export default function PersonCard({ person, occupation }: PersonCardProps) {
  const [imgSrc, setImgSrc] = useState<string>(
    person.images?.jpg?.image_url || "/placeholder-person.jpg"
  );

  return (
    <Link
      href={`/people/${person.mal_id}`}
      className="group relative flex flex-col p-3 rounded-xl bg-[#111116] border border-white/5 hover:border-[#22D3EE]/50 hover:bg-[#18181F] transition-all duration-300 shadow-sm"
    >
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#18181F] mb-2.5">
        <Image
          src={imgSrc}
          alt={person.name}
          fill
          sizes="160px"
          onError={() => setImgSrc("/placeholder-person.jpg")}
          className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
        />

        {person.favorites !== undefined && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-[10px] font-mono text-pink-400">
            <Heart className="w-3 h-3 fill-pink-400" />
            <span>{person.favorites.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="space-y-0.5">
        <h4 className="font-heading font-semibold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-[#22D3EE] transition">
          {person.name}
        </h4>
        {person.given_name && person.family_name && (
          <p className="text-[10px] font-mono text-[#A1A1AA] truncate">
            {person.family_name} {person.given_name}
          </p>
        )}
        <div className="flex items-center gap-1 text-[10px] font-mono text-[#C084FC] pt-0.5">
          <Mic className="w-3 h-3 text-[#22D3EE]" />
          <span>{occupation || "Voice Actor"}</span>
        </div>
      </div>
    </Link>
  );
}
