import React from "react";
import Link from "next/link";
import Image from "next/image";
import { rankingService, TopFilterParams } from "@/lib/api";
import { Star, ChevronLeft, ChevronRight, Play } from "lucide-react";

interface RankingsPageProps {
  searchParams: Promise<{
    tab?: string;
    filter?: string;
    page?: string;
  }>;
}

export default async function RankingsPage({ searchParams }: RankingsPageProps) {
  const resolvedParams = await searchParams;
  const tab = resolvedParams.tab || "anime";
  const filter = (resolvedParams.filter as TopFilterParams["filter"]) || undefined;
  const page = parseInt(resolvedParams.page || "1", 10);

  let animeList: import("@/lib/api").Anime[] = [];
  let mangaList: import("@/lib/api").Manga[] = [];
  let charactersList: import("@/lib/api").Character[] = [];
  let peopleList: import("@/lib/api").Person[] = [];

  if (tab === "anime") {
    const res = await rankingService.getTopAnime({ filter, page, limit: 20 });
    animeList = res.data || [];
  } else if (tab === "manga") {
    const res = await rankingService.getTopManga({ filter, page, limit: 20 });
    mangaList = res.data || [];
  } else if (tab === "characters") {
    const res = await rankingService.getTopCharacters({ page, limit: 20 });
    charactersList = res.data || [];
  } else if (tab === "people") {
    const res = await rankingService.getTopPeople({ page, limit: 20 });
    peopleList = res.data || [];
  }

  const animeFilters = [
    { label: "Top Rated", value: "" },
    { label: "Most Popular", value: "bypopularity" },
    { label: "Currently Airing", value: "airing" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Most Favorited", value: "favorite" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full min-h-screen bg-[#050505]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/5 mb-6">
        <div>
          <h1 className="font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
            Top Rankings
          </h1>
          <p className="text-xs sm:text-sm text-[#A3A3A3] mt-1">
            Global streaming standings and community ratings.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-2">
          {[
            { id: "anime", label: "Top Anime" },
            { id: "manga", label: "Top Manga" },
            { id: "characters", label: "Characters" },
            { id: "people", label: "People" },
          ].map((t) => (
            <Link
              key={t.id}
              href={`/rankings?tab=${t.id}`}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                tab === t.id
                  ? "bg-[#8B5CF6] text-white"
                  : "bg-[#181818] hover:bg-[#262626] text-[#A3A3A3] hover:text-white"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Subfilters */}
      {tab === "anime" && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-4">
          {animeFilters.map((f) => {
            const isActive = (filter || "") === f.value;
            return (
              <Link
                key={f.value}
                href={`/rankings?tab=anime${f.value ? `&filter=${f.value}` : ""}`}
                className={`px-3 py-1 rounded-md text-xs font-medium transition flex-shrink-0 ${
                  isActive
                    ? "bg-white text-black font-semibold"
                    : "bg-[#181818] text-[#A3A3A3] hover:text-white"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Ranked List */}
      <div className="flex flex-col gap-3">
        {tab === "anime" &&
          animeList.map((anime, idx) => {
            const rankNum = anime.rank || (page - 1) * 20 + idx + 1;
            const rankStr = String(rankNum).padStart(2, "0");
            const isTop3 = rankNum <= 3;
            const displayTitle = anime.title_english || anime.title;

            return (
              <div
                key={anime.mal_id}
                className="flex items-center justify-between p-3.5 rounded-md bg-[#111111] hover:bg-[#181818] transition group gap-4"
              >
                <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                  {/* Oversized Netflix Rank Number */}
                  <span
                    className={`font-black text-2xl sm:text-3xl w-10 text-center select-none ${
                      isTop3 ? "text-[#8B5CF6]" : "text-[#525252]"
                    }`}
                  >
                    {rankStr}
                  </span>

                  {/* Poster */}
                  <Link
                    href={`/anime/${anime.mal_id}`}
                    className="relative w-12 sm:w-16 aspect-[2/3] rounded overflow-hidden bg-[#181818] flex-shrink-0"
                  >
                    <Image
                      src={anime.images?.webp?.small_image_url || anime.images?.jpg?.small_image_url || "/placeholder-poster.jpg"}
                      alt={anime.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </Link>

                  {/* Title & Metadata */}
                  <div className="min-w-0">
                    <Link
                      href={`/anime/${anime.mal_id}`}
                      className="font-bold text-sm sm:text-base text-white hover:text-[#8B5CF6] transition line-clamp-1"
                    >
                      {displayTitle}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-[#A3A3A3] mt-0.5">
                      <span>{anime.type || "TV"}</span>
                      <span>•</span>
                      <span>{anime.episodes ? `${anime.episodes} Eps` : "Ongoing"}</span>
                      <span>•</span>
                      <span>{anime.status}</span>
                    </div>
                  </div>
                </div>

                {/* Score & Action */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  {anime.score && (
                    <div className="flex items-center gap-1 text-sm font-semibold text-white">
                      <Star className="w-3.5 h-3.5 fill-[#8B5CF6] text-[#8B5CF6]" />
                      <span>{anime.score.toFixed(1)}</span>
                    </div>
                  )}

                  <Link
                    href={`/watch/${anime.mal_id}?ep=1`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold text-xs transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Watch</span>
                  </Link>
                </div>
              </div>
            );
          })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-12 pt-6 border-t border-white/5">
        <Link
          href={`/rankings?${new URLSearchParams({ ...resolvedParams, page: String(Math.max(1, page - 1)) }).toString()}`}
          className={`flex items-center gap-1 px-4 py-2 rounded-md text-xs font-medium transition ${
            page <= 1 ? "opacity-30 pointer-events-none bg-[#111111] text-[#A3A3A3]" : "bg-[#181818] hover:bg-[#262626] text-white"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Link>
        <span className="text-xs text-[#A3A3A3] px-3 py-1">
          Page {page}
        </span>
        <Link
          href={`/rankings?${new URLSearchParams({ ...resolvedParams, page: String(page + 1) }).toString()}`}
          className="flex items-center gap-1 px-4 py-2 rounded-md bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold transition"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
