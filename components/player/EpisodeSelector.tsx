"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Play, CheckCircle2 } from "lucide-react";
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
  const [selectedRange, setSelectedRange] = useState(0);

  const RANGE_SIZE = 50;
  const totalEpisodes = episodes.length;

  // Generate ranges if > 50 episodes
  const ranges = useMemo(() => {
    if (totalEpisodes <= RANGE_SIZE) return [];
    const count = Math.ceil(totalEpisodes / RANGE_SIZE);
    return Array.from({ length: count }, (_, i) => {
      const start = i * RANGE_SIZE + 1;
      const end = Math.min((i + 1) * RANGE_SIZE, totalEpisodes);
      return { label: `${start}-${end}`, start, end };
    });
  }, [totalEpisodes]);

  const filteredEpisodes = useMemo(() => {
    let list = episodes;
    if (ranges.length > 0 && ranges[selectedRange]) {
      const { start, end } = ranges[selectedRange];
      list = list.filter((e) => e.mal_id >= start && e.mal_id <= end);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (e) =>
          String(e.mal_id).includes(q) ||
          e.title.toLowerCase().includes(q) ||
          (e.title_romanji && e.title_romanji.toLowerCase().includes(q))
      );
    }
    return list;
  }, [episodes, ranges, selectedRange, searchTerm]);

  return (
    <div className="w-full flex flex-col bg-[#111116] rounded-2xl border border-white/5 p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-baseline gap-2">
          <h3 className="font-heading font-bold text-base text-white">Episodes</h3>
          <span className="text-xs font-mono text-[#A1A1AA]">
            ({totalEpisodes || "Ongoing"})
          </span>
        </div>
      </div>

      {/* Filter / Search input */}
      <div className="relative mb-3">
        <Search className="w-3.5 h-3.5 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter episode..."
          className="w-full bg-[#18181F] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#A1A1AA] outline-none focus:border-[#7C3AED]"
        />
      </div>

      {/* Episode Range Badges (if > 50 episodes) */}
      {ranges.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2.5 mb-2">
          {ranges.map((r, idx) => (
            <button
              key={r.label}
              onClick={() => setSelectedRange(idx)}
              className={`px-2 py-1 rounded-md text-[11px] font-mono transition flex-shrink-0 ${
                selectedRange === idx
                  ? "bg-[#7C3AED] text-white font-bold"
                  : "bg-[#18181F] hover:bg-white/5 text-[#A1A1AA] hover:text-white border border-white/10"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}

      {/* Scrollable Episode List */}
      <div className="flex flex-col gap-1.5 max-h-[500px] overflow-y-auto pr-1">
        {filteredEpisodes.map((ep) => {
          const isActive = ep.mal_id === currentEpisode;
          return (
            <Link
              key={ep.mal_id}
              href={`/watch/${animeId}?ep=${ep.mal_id}`}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition group ${
                isActive
                  ? "bg-[#7C3AED]/20 border-[#7C3AED] text-white shadow-sm"
                  : "bg-[#18181F]/60 hover:bg-[#18181F] border-transparent hover:border-white/10 text-[#A1A1AA] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 ${
                    isActive
                      ? "bg-[#7C3AED] text-white"
                      : "bg-[#111116] text-[#A1A1AA] group-hover:text-white"
                  }`}
                >
                  {ep.mal_id}
                </span>

                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">
                    {ep.title}
                  </p>
                  {ep.title_japanese && (
                    <p className="text-[10px] font-mono text-[#22D3EE] truncate">
                      {ep.title_japanese}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                {ep.filler && (
                  <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    FILLER
                  </span>
                )}
                {isActive ? (
                  <Play className="w-3.5 h-3.5 fill-[#22D3EE] text-[#22D3EE]" />
                ) : (
                  <span className="text-[10px] font-mono text-[#A1A1AA] opacity-0 group-hover:opacity-100 transition">
                    PLAY
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
