import React from "react";
import Link from "next/link";
import AnimeCard from "@/components/anime/AnimeCard";
import { seasonService, SeasonInfo } from "@/lib/api";
import { EmptyState } from "@/components/shared/EmptyState";
import { Sparkles, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface SeasonsPageProps {
  searchParams: Promise<{
    tab?: "now" | "upcoming" | "archive";
    year?: string;
    season?: "winter" | "spring" | "summer" | "fall";
    page?: string;
  }>;
}

export default async function SeasonsPage({ searchParams }: SeasonsPageProps) {
  const resolvedParams = await searchParams;
  const tab = resolvedParams.tab || "now";
  const year = parseInt(resolvedParams.year || "2024", 10);
  const season = resolvedParams.season || "fall";
  const page = parseInt(resolvedParams.page || "1", 10);

  let animeList = [];
  let seasonsArchive: SeasonInfo[] = [];

  if (tab === "now") {
    const res = await seasonService.getSeasonNow({ page, limit: 24 });
    animeList = res.data || [];
  } else if (tab === "upcoming") {
    const res = await seasonService.getSeasonUpcoming({ page, limit: 24 });
    animeList = res.data || [];
  } else {
    const [archiveRes, seasonRes] = await Promise.all([
      seasonService.getSeasonsList(),
      seasonService.getSeason(year, season, { page, limit: 24 }),
    ]);
    seasonsArchive = archiveRes.data || [];
    animeList = seasonRes.data || [];
  }

  const seasonNames = ["winter", "spring", "summer", "fall"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#22D3EE] uppercase tracking-wider font-bold">
            <Sparkles className="w-4 h-4 text-[#22D3EE]" />
            <span>Seasonal Broadcast Matrix // 季節別</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
            Seasonal Broadcasts
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Track current seasonal broadcasts, upcoming premieres, and full historical quarterly archives.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1.5 p-1 bg-[#111116] rounded-xl border border-white/5">
          <Link
            href="/seasons?tab=now"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-medium transition ${
              tab === "now" ? "bg-[#7C3AED] text-white font-bold" : "text-[#A1A1AA] hover:text-white"
            }`}
          >
            Current Season
          </Link>
          <Link
            href="/seasons?tab=upcoming"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-medium transition ${
              tab === "upcoming" ? "bg-[#7C3AED] text-white font-bold" : "text-[#A1A1AA] hover:text-white"
            }`}
          >
            Upcoming
          </Link>
          <Link
            href="/seasons?tab=archive"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-medium transition ${
              tab === "archive" ? "bg-[#7C3AED] text-white font-bold" : "text-[#A1A1AA] hover:text-white"
            }`}
          >
            Historical Archive
          </Link>
        </div>
      </div>

      {/* Archive Selector bar */}
      {tab === "archive" && (
        <div className="p-4 rounded-xl bg-[#111116] border border-white/5 my-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#A1A1AA]">YEAR:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
                <Link
                  key={y}
                  href={`/seasons?tab=archive&year=${y}&season=${season}`}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                    year === y
                      ? "bg-[#7C3AED] text-white font-bold"
                      : "bg-[#18181F] text-[#A1A1AA] hover:text-white border border-white/5"
                  }`}
                >
                  {y}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#A1A1AA]">SEASON:</span>
            <div className="flex items-center gap-1.5">
              {seasonNames.map((s) => (
                <Link
                  key={s}
                  href={`/seasons?tab=archive&year=${year}&season=${s}`}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono uppercase transition ${
                    season === s
                      ? "bg-[#22D3EE]/20 border border-[#22D3EE] text-[#22D3EE] font-bold"
                      : "bg-[#18181F] text-[#A1A1AA] hover:text-white border border-white/5"
                  }`}
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {animeList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 mt-6">
          {animeList.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Seasonal Broadcast Records"
          description="Try switching between current, upcoming, or archive quarters."
          actionText="View Current Season"
          actionHref="/seasons?tab=now"
        />
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-12 pt-6 border-t border-white/5">
        <Link
          href={`/seasons?${new URLSearchParams({ ...resolvedParams, page: String(Math.max(1, page - 1)) }).toString()}`}
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
          href={`/seasons?${new URLSearchParams({ ...resolvedParams, page: String(page + 1) }).toString()}`}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-mono font-medium transition shadow-sm"
        >
          NEXT
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
