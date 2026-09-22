import React from "react";
import Hero from "@/components/anime/Hero";
import AnimeRow from "@/components/anime/AnimeRow";
import TrendingSection from "@/components/anime/TrendingSection";
import ContinueWatching from "@/components/anime/ContinueWatching";
import GenreFilter from "@/components/search/GenreFilter";
import {
  rankingService,
  seasonService,
  genreService,
} from "@/lib/api";

export const revalidate = 300;

export default async function HomePage() {
  const [
    popularRes,
    topRatedRes,
    airingRes,
    upcomingRes,
    genresRes,
  ] = await Promise.all([
    rankingService.getTopAnime({ filter: "bypopularity", limit: 12 }),
    rankingService.getTopAnime({ limit: 12 }),
    seasonService.getSeasonNow({ limit: 12 }),
    seasonService.getSeasonUpcoming({ limit: 12 }),
    genreService.getAnimeGenres(),
  ]);

  const popularAnime = popularRes.data || [];
  const topRatedAnime = topRatedRes.data || [];
  const airingAnime = airingRes.data || [];
  const upcomingAnime = upcomingRes.data || [];
  const genres = genresRes.data || [];

  const heroItems = popularAnime.slice(0, 5);

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#050505]">
      {/* 1. Cinematic Hero */}
      <Hero featuredAnime={heroItems} />

      {/* 2. Continue Watching */}
      <ContinueWatching />

      {/* 3. Netflix Top 10 Today */}
      <TrendingSection animeList={popularAnime} />

      {/* 4. Trending Now */}
      <AnimeRow
        title="Trending Now"
        animeList={popularAnime}
        viewAllHref="/rankings?filter=bypopularity"
      />

      {/* 5. Currently Airing */}
      <AnimeRow
        title="Currently Airing"
        animeList={airingAnime}
        viewAllHref="/seasons"
      />

      {/* 6. Popular Anime */}
      <AnimeRow
        title="Top Rated Anime"
        animeList={topRatedAnime}
        viewAllHref="/rankings"
      />

      {/* 7. Upcoming Anime */}
      <AnimeRow
        title="Coming Soon to Aniway"
        animeList={upcomingAnime}
        viewAllHref="/seasons?tab=upcoming"
      />

      {/* 8. Genres Quick Browsing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-6 mb-8">
        <h3 className="font-bold text-base text-white mb-3">
          Explore by Category
        </h3>
        <GenreFilter genres={genres.slice(0, 14)} />
      </section>
    </div>
  );
}
