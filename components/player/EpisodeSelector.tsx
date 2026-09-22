"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Play } from "lucide-react";
import { Episode } from "@/lib/api";

interface EpisodeSelectorProps {
  animeId: number;
  episodes: Episode[];
  currentEpisode: number;
}

export default function EpisodeSelector({
  animeId,
  episodes,
  currentEpisode,
}: EpisodeSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const totalEpisodes = episodes.length;

  const filteredEpisodes = useMemo(() => {
    let list = episodes;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (e) => String(e.mal_id).includes(q) || e.title.toLowerCase().includes(q)
      );
    }
    return list;
  }, [episodes, searchTerm]);

  return (
    <div className="w-full flex flex-col bg-[#111111] rounded-md p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-white">
          Episodes
        </h3>
        <span className="text-xs text-[#A3A3A3]">
          {totalEpisodes} Total
        </span>
      </div>

      {/* Filter */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-[#A3A3A3] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter episodes..."
          className="w-full bg-[#181818] rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#A3A3A3] outline-none focus:border-[#8B5CF6] border border-transparent"
        />
      </div>

      {/* List */}
      <div className="flex flex-col gap-1 max-h-[500px] overflow-y-auto pr-1">
        {filteredEpisodes.map((ep) => {
          const isActive = ep.mal_id === currentEpisode;
          return (
            <Link
              key={ep.mal_id}
              href={`/watch/${animeId}?ep=${ep.mal_id}`}
              className={`flex items-center justify-between p-2.5 rounded transition group ${
                isActive
                  ? "bg-[#181818] border-l-2 border-[#8B5CF6] text-white"
                  : "hover:bg-[#181818] text-[#A3A3A3] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`text-xs font-bold w-6 text-center ${
                    isActive ? "text-[#8B5CF6]" : "text-[#A3A3A3]"
                  }`}
                >
                  {ep.mal_id}
                </span>
                <div className="min-w-0">
                  <p className={`text-xs font-medium truncate ${isActive ? "text-white font-bold" : ""}`}>
                    {ep.title}
                  </p>
                  <p className="text-[10px] text-[#A3A3A3]">
                    {ep.aired || "Aired"}
                  </p>
                </div>
              </div>

              {isActive ? (
                <span className="w-6 h-6 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center flex-shrink-0 ml-2">
                  <Play className="w-3 h-3 fill-white ml-0.5" />
                </span>
              ) : (
                <Play className="w-3.5 h-3.5 text-[#A3A3A3] opacity-0 group-hover:opacity-100 transition ml-2 flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
