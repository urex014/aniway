"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AnimeCard from "@/components/anime/AnimeCard";
import { animeService, Anime } from "@/lib/api";
import { getWatchlistIds, getContinueWatchingList, WatchProgressItem } from "@/lib/storage";
import { EmptyState } from "@/components/shared/EmptyState";
import { Bookmark, Clock, Trash2, Play } from "lucide-react";
import Image from "next/image";

export default function WatchlistPage() {
  const [activeTab, setActiveTab] = useState<"watchlist" | "history">("watchlist");
  const [watchlistAnime, setWatchlistAnime] = useState<Anime[]>([]);
  const [historyItems, setHistoryItems] = useState<WatchProgressItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      const ids = getWatchlistIds();
      const history = getContinueWatchingList();
      if (isMounted) setHistoryItems(history);

      if (ids.length > 0) {
        try {
          const promises = ids.slice(0, 30).map((id) => animeService.getAnimeById(id));
          const responses = await Promise.all(promises);
          if (isMounted) {
            setWatchlistAnime(responses.map((r) => r.data).filter(Boolean));
          }
        } catch {
          // Handled
        }
      } else {
        if (isMounted) setWatchlistAnime([]);
      }
      if (isMounted) setLoading(false);
    };

    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener("aniway_storage_update", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("aniway_storage_update", handleUpdate);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/5 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#7C3AED] uppercase tracking-wider font-bold">
            <Bookmark className="w-4 h-4 text-[#C084FC]" />
            <span>Personal Matrix Storage // 保存リスト</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
            Personal Watchlist & History
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Stored locally in your secure browser cache. Real-time telemetry is automatically synchronized.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#111116] rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab("watchlist")}
            className={`px-4 py-1.5 rounded-lg text-xs font-heading font-medium transition cursor-pointer ${
              activeTab === "watchlist"
                ? "bg-[#7C3AED] text-white font-bold"
                : "text-[#A1A1AA] hover:text-white"
            }`}
          >
            Watchlist ({watchlistAnime.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-1.5 rounded-lg text-xs font-heading font-medium transition cursor-pointer ${
              activeTab === "history"
                ? "bg-[#7C3AED] text-white font-bold"
                : "text-[#A1A1AA] hover:text-white"
            }`}
          >
            Playback History ({historyItems.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[3/4.2] bg-[#111116] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : activeTab === "watchlist" ? (
        watchlistAnime.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {watchlistAnime.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Watchlist is Empty"
            description="Explore the catalog and bookmark titles you want to stream later."
            actionText="Discover Anime"
            actionHref="/anime"
          />
        )
      ) : (
        historyItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {historyItems.map((item) => {
              const percent = item.durationSeconds > 0
                ? Math.min(100, Math.round((item.progressSeconds / item.durationSeconds) * 100))
                : 10;
              return (
                <div
                  key={`${item.animeId}-${item.episode}`}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#111116] border border-white/5 hover:border-[#7C3AED]/40 transition group"
                >
                  <div className="relative w-16 aspect-[3/4] rounded-lg overflow-hidden bg-[#18181F] flex-shrink-0">
                    {item.posterUrl ? (
                      <Image
                        src={item.posterUrl}
                        alt={item.animeTitle}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <Clock className="w-6 h-6 text-[#A1A1AA] m-auto" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <h4 className="font-heading font-semibold text-xs sm:text-sm text-white truncate">
                      {item.animeTitle}
                    </h4>
                    <p className="text-[11px] text-[#22D3EE] font-mono">
                      Episode {item.episode}
                    </p>
                    <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="bg-[#7C3AED] h-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    href={`/watch/${item.animeId}?ep=${item.episode}`}
                    className="p-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white transition flex-shrink-0"
                    title="Resume playback"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No Playback History"
            description="Start watching episodes to track your streaming timeline."
            actionText="Start Watching"
            actionHref="/"
          />
        )
      )}
    </div>
  );
}
