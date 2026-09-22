import React from "react";
import Link from "next/link";
import Image from "next/image";
import { rankingService, TopFilterParams } from "@/lib/api";
import { Star, Trophy, Users, Heart, ChevronLeft, ChevronRight, Play } from "lucide-react";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#C084FC] uppercase tracking-wider font-bold">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Leaderboard Matrix // ランキング</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
            Global Database Rankings
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Official ranked standings derived from community scores, member engagement and telemetry.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-[#111116] rounded-xl border border-white/5">
          {[
            { id: "anime", label: "Top Anime" },
            { id: "manga", label: "Top Manga" },
            { id: "characters", label: "Characters" },
            { id: "people", label: "People / Seiyuu" },
          ].map((t) => (
            <Link
              key={t.id}
              href={`/rankings?tab=${t.id}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-heading font-medium transition ${
                tab === t.id
                  ? "bg-[#7C3AED] text-white font-bold shadow-sm"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Subfilters for Anime */}
      {tab === "anime" && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-4 mb-2">
          {animeFilters.map((f) => {
            const isActive = (filter || "") === f.value;
            return (
              <Link
                key={f.value}
                href={`/rankings?tab=anime${f.value ? `&filter=${f.value}` : ""}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex-shrink-0 ${
                  isActive
                    ? "bg-[#18181F] border border-[#7C3AED] text-[#C084FC]"
                    : "bg-[#111116] hover:bg-[#18181F] text-[#A1A1AA] hover:text-white border border-white/5"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Ranked List */}
      <div className="mt-4 flex flex-col gap-3">
        {tab === "anime" &&
          animeList.map((anime, idx) => {
            const rankNum = anime.rank || (page - 1) * 20 + idx + 1;
            const isTop3 = rankNum <= 3;
            return (
              <div
                key={anime.mal_id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-xl bg-[#111116] hover:bg-[#18181F] border border-white/5 hover:border-[#7C3AED]/40 transition group gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Rank Badge */}
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-heading font-black text-sm flex-shrink-0 border ${
                      isTop3
                        ? "bg-gradient-to-br from-amber-400/20 to-[#7C3AED]/30 border-amber-400/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                        : "bg-[#18181F] border-white/10 text-[#A1A1AA]"
                    }`}
                  >
                    #{rankNum}
                  </span>

                  {/* Thumbnail Poster */}
                  <Link
                    href={`/anime/${anime.mal_id}`}
                    className="relative w-14 aspect-[3/4] rounded-lg overflow-hidden bg-[#18181F] flex-shrink-0"
                  >
                    <Image
                      src={anime.images?.webp?.small_image_url || anime.images?.jpg?.small_image_url || "/placeholder-poster.jpg"}
                      alt={anime.title}
                      fill
                      sizes="56px"
                      className="object-cover group-hover:scale-105 transition"
                    />
                  </Link>

                  {/* Title & Metadata */}
                  <div className="min-w-0 space-y-1">
                    <Link
                      href={`/anime/${anime.mal_id}`}
                      className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-[#22D3EE] transition line-clamp-1"
                    >
                      {anime.title_english || anime.title}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-[#A1A1AA] flex-wrap">
                      <span className="font-mono text-white/80">{anime.type || "TV"}</span>
                      <span>•</span>
                      <span>{anime.episodes ? `${anime.episodes} eps` : "Ongoing"}</span>
                      <span>•</span>
                      <span className="text-[#22D3EE] font-mono">{anime.status}</span>
                      {anime.members && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-[#A1A1AA]" />
                            {anime.members.toLocaleString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Score & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  {anime.score && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18181F] border border-amber-400/30 text-amber-300 font-mono font-bold text-sm">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{anime.score.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/watch/${anime.mal_id}?ep=1`}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium text-xs shadow-sm transition active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      Watch
                    </Link>
                    <Link
                      href={`/anime/${anime.mal_id}`}
                      className="px-3 py-1.5 rounded-lg bg-[#18181F] hover:bg-white/10 border border-white/10 text-xs text-[#A1A1AA] hover:text-white transition"
                    >
                      Info
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

        {tab === "manga" &&
          mangaList.map((manga, idx) => (
            <div
              key={manga.mal_id}
              className="flex items-center justify-between p-4 rounded-xl bg-[#111116] border border-white/5 gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="w-8 h-8 rounded-lg bg-[#18181F] text-[#A1A1AA] flex items-center justify-center font-mono text-xs font-bold">
                  #{(page - 1) * 20 + idx + 1}
                </span>
                <Link
                  href={`/manga/${manga.mal_id}`}
                  className="font-heading font-bold text-sm text-white hover:text-[#22D3EE] transition"
                >
                  {manga.title_english || manga.title}
                </Link>
              </div>
              {manga.score && (
                <span className="font-mono text-xs font-bold text-amber-300">
                  ★ {manga.score.toFixed(2)}
                </span>
              )}
            </div>
          ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-12 pt-6 border-t border-white/5">
        <Link
          href={`/rankings?${new URLSearchParams({ ...resolvedParams, page: String(Math.max(1, page - 1)) }).toString()}`}
          className={`flex items-center gap-1 px-4 py-2 rounded-xl border text-xs font-mono font-medium transition ${
            page <= 1
              ? "opacity-30 pointer-events-none bg-[#111116] border-white/5 text-[#A1A1AA]"
              : "bg-[#111116] hover:bg-[#18181F] border-white/10 text-white"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          PREVIOUS
        </Link>
        <span className="text-xs font-mono font-bold text-[#C084FC] px-3 py-1 rounded-lg bg-[#18181F] border border-white/10">
          PAGE {page}
        </span>
        <Link
          href={`/rankings?${new URLSearchParams({ ...resolvedParams, page: String(page + 1) }).toString()}`}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white border-transparent text-xs font-mono font-medium transition shadow-sm"
        >
          NEXT
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
