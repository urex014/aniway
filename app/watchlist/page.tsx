"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AnimeCard from "@/components/anime/AnimeCard";
import { animeService, Anime } from "@/lib/api";
import { getWatchlistIds, getContinueWatchingList, WatchProgressItem } from "@/lib/storage";
import { EmptyState } from "@/components/shared/EmptyState";
import { Play, Clock } from "lucide-react";
import Image from "next/image";

export default function MyListPage() {
  const [activeTab, setActiveTab] = useState<"mylist" | "continue">("mylist");
  const [savedAnime, setSavedAnime] = useState<Anime[]>([]);
  const [continueList, setContinueList] = useState<WatchProgressItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      const ids = getWatchlistIds();
      const progress = getContinueWatchingList();
      if (isMounted) setContinueList(progress);

      if (ids.length > 0) {
        try {
          const promises = ids.slice(0, 30).map((id) => animeService.getAnimeById(id));
          const responses = await Promise.all(promises);
          if (isMounted) {
            setSavedAnime(responses.map((r) => r.data).filter(Boolean));
          }
        } catch {
          // Handled
        }
      } else {
        if (isMounted) setSavedAnime([]);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full min-h-screen bg-[#050505]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/5 mb-8">
        <div>
          <h1 className="font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
            My List
          </h1>
          <p className="text-xs sm:text-sm text-[#A3A3A3] mt-1">
            Personal titles saved to your library and ongoing viewing progress.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("mylist")}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
              activeTab === "mylist"
                ? "bg-[#8B5CF6] text-white"
                : "bg-[#181818] hover:bg-[#262626] text-[#A3A3A3] hover:text-white"
            }`}
          >
            Saved Titles ({savedAnime.length})
          </button>
          <button
            onClick={() => setActiveTab("continue")}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
              activeTab === "continue"
                ? "bg-[#8B5CF6] text-white"
                : "bg-[#181818] hover:bg-[#262626] text-[#A3A3A3] hover:text-white"
            }`}
          >
            Continue Watching ({continueList.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-[#111111] rounded-md animate-pulse" />
          ))}
        </div>
      ) : activeTab === "mylist" ? (
        savedAnime.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {savedAnime.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="You haven't added any titles to your list yet."
            description="Explore our catalog and click the '+' button on any anime to add it here."
            actionText="Find Titles to Add"
            actionHref="/anime"
          />
        )
      ) : (
        continueList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {continueList.map((item) => {
              const percent =
                item.durationSeconds > 0
                  ? Math.min(100, Math.round((item.progressSeconds / item.durationSeconds) * 100))
                  : 15;
              return (
                <div
                  key={`${item.animeId}-${item.episode}`}
                  className="flex items-center gap-3.5 p-3 rounded-md bg-[#111111] hover:bg-[#181818] transition group"
                >
                  <div className="relative w-20 aspect-video rounded overflow-hidden bg-[#181818] flex-shrink-0">
                    {item.posterUrl ? (
                      <Image
                        src={item.posterUrl}
                        alt={item.animeTitle}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <Clock className="w-5 h-5 text-[#A3A3A3] m-auto" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <h4 className="font-semibold text-xs sm:text-sm text-white truncate">
                      {item.animeTitle}
                    </h4>
                    <p className="text-xs text-[#A3A3A3]">
                      Episode {item.episode}
                    </p>
                    <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden mt-1">
                      <div className="bg-[#8B5CF6] h-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>

                  <Link
                    href={`/watch/${item.animeId}?ep=${item.episode}`}
                    className="p-2.5 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition flex-shrink-0"
                    title="Resume"
                  >
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No Viewing History"
            description="Episodes you stream will appear here so you can pick up where you left off."
            actionText="Start Watching"
            actionHref="/"
          />
        )
      )}
    </div>
  );
}
