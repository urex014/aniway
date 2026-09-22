import React from "react";
import Link from "next/link";
import AnimeCard from "@/components/anime/AnimeCard";
import GenreFilter from "@/components/search/GenreFilter";
import { animeService, genreService } from "@/lib/api";
import { EmptyState } from "@/components/shared/EmptyState";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 w-full min-h-screen bg-[#050505]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <h1 className="font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Anime Catalog
          </h1>
          <p className="text-xs text-[#A3A3A3] mt-1">
            Browse full-length TV series, theatrical films, and original net animations.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[#A3A3A3]">Type:</span>
          {types.map((t) => {
            const isActive = type === t;
            return (
              <Link
                key={t}
                href={`/anime?${new URLSearchParams({ ...resolvedParams, type: isActive ? "" : t, page: "1" }).toString()}`}
                className={`px-3 py-1 rounded-full uppercase transition text-[11px] font-medium ${
                  isActive
                    ? "bg-[#8B5CF6] text-white font-semibold"
                    : "bg-[#181818] hover:bg-[#262626] text-[#A3A3A3] hover:text-white"
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

      {/* Grid */}
      {animeList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 mt-6">
          {animeList.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Anime Located"
          description="Try selecting a different genre or reset your filters."
          actionText="Reset Filters"
          actionHref="/anime"
        />
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-12 pt-6 border-t border-white/5">
        <Link
          href={`/anime?${new URLSearchParams({ ...resolvedParams, page: String(Math.max(1, page - 1)) }).toString()}`}
          className={`flex items-center gap-1 px-4 py-2 rounded-md text-xs font-medium transition ${
            page <= 1
              ? "opacity-30 pointer-events-none bg-[#111111] text-[#A3A3A3]"
              : "bg-[#181818] hover:bg-[#262626] text-white"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Link>

        <span className="text-xs text-[#A3A3A3] px-3 py-1">
          Page {page} {pagination?.last_visible_page ? `of ${pagination.last_visible_page}` : ""}
        </span>

        <Link
          href={`/anime?${new URLSearchParams({ ...resolvedParams, page: String(page + 1) }).toString()}`}
          className={`flex items-center gap-1 px-4 py-2 rounded-md text-xs font-semibold transition ${
            pagination && !pagination.has_next_page
              ? "opacity-30 pointer-events-none bg-[#111111] text-[#A3A3A3]"
              : "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
          }`}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
