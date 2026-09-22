import React from "react";
import Link from "next/link";
import AnimeCard from "@/components/anime/AnimeCard";
import GenreFilter from "@/components/search/GenreFilter";
import { animeService, genreService } from "@/lib/api";
import { EmptyState } from "@/components/shared/EmptyState";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

interface AnimeExploreProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    type?: string;
    status?: string;
    order_by?: string;
    genres?: string;
  }>;
}

export default async function AnimeExplorePage({ searchParams }: AnimeExploreProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);
  const q = resolvedParams.q || "";
  const type = resolvedParams.type || "";
  const status = resolvedParams.status || "";
  const orderBy = resolvedParams.order_by || "score";
  const genres = resolvedParams.genres || "";

  const [animeRes, genresRes] = await Promise.all([
    animeService.getAnimeSearch({
      q: q || undefined,
      page,
      limit: 24,
      type: type || undefined,
      status: status || undefined,
      order_by: (orderBy as any) || undefined,
      sort: "desc",
      genres: genres || undefined,
    }),
    genreService.getAnimeGenres(),
  ]);

  const animeList = animeRes.data || [];
  const pagination = animeRes.pagination;
  const genreList = genresRes.data || [];

  const types = ["tv", "movie", "ova", "ona", "special"];
  const statuses = ["airing", "complete", "upcoming"];
  const sortOptions = [
    { label: "Top Score", value: "score" },
    { label: "Most Popular", value: "popularity" },
    { label: "Members", value: "members" },
    { label: "Title", value: "title" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <span className="text-xs font-mono text-[#22D3EE] uppercase tracking-wider font-bold">
            Sector Catalog // アニメ探索
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
            Explore Anime Database
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Browse and filter through certified real-time anime telemetry records.
          </p>
        </div>

        {/* Filter Badges Container */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
          <SlidersHorizontal className="w-4 h-4 text-[#7C3AED]" />
          <span className="text-[#A1A1AA]">FILTERS:</span>
          {types.map((t) => {
            const isActive = type === t;
            return (
              <Link
                key={t}
                href={`/anime?${new URLSearchParams({ ...resolvedParams, type: isActive ? "" : t, page: "1" }).toString()}`}
                className={`px-2.5 py-1 rounded-lg uppercase transition ${
                  isActive
                    ? "bg-[#7C3AED] text-white font-bold"
                    : "bg-[#111116] hover:bg-[#18181F] text-[#A1A1AA] hover:text-white border border-white/5"
                }`}
              >
                {t}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Genres Bar */}
      <div className="my-4">
        <GenreFilter
          genres={genreList}
          selectedGenreId={genres ? parseInt(genres, 10) : undefined}
          baseHref="/anime"
        />
      </div>

      {/* Grid of Results */}
      {animeList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 mt-6">
          {animeList.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Telemetry Signals Found"
          description="Adjust your search filters or selected genre to locate matching anime signals."
          actionText="Reset All Filters"
          actionHref="/anime"
        />
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-4 mt-12 pt-6 border-t border-white/5">
        <Link
          href={`/anime?${new URLSearchParams({ ...resolvedParams, page: String(Math.max(1, page - 1)) }).toString()}`}
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
          PAGE {page} {pagination?.last_visible_page ? `/ ${pagination.last_visible_page}` : ""}
        </span>

        <Link
          href={`/anime?${new URLSearchParams({ ...resolvedParams, page: String(page + 1) }).toString()}`}
          className={`flex items-center gap-1 px-4 py-2 rounded-xl border text-xs font-mono font-medium transition ${
            pagination && !pagination.has_next_page
              ? "opacity-30 pointer-events-none bg-[#111116] border-white/5 text-[#A1A1AA]"
              : "bg-[#7C3AED] hover:bg-[#6D28D9] text-white border-transparent shadow-sm"
          }`}
        >
          NEXT
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
