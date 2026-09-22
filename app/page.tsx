import React from "react";
import Hero from "@/components/anime/Hero";
import AnimeRow from "@/components/anime/AnimeRow";
import ContinueWatching from "@/components/anime/ContinueWatching";
import GenreFilter from "@/components/search/GenreFilter";
import {
  rankingService,
  seasonService,
  genreService,
  recommendationService,
} from "@/lib/api";

export const revalidate = 300; // 5 minute revalidation

export default async function HomePage() {
  // Fetch primary real data from services
  const [
    popularRes,
    topRatedRes,
    airingRes,
    upcomingRes,
    genresRes,
  ] = await Promise.all([
    rankingService.getTopAnime({ filter: "bypopularity", limit: 10 }),
    rankingService.getTopAnime({ limit: 10 }),
    seasonService.getSeasonNow({ limit: 10 }),
    seasonService.getSeasonUpcoming({ limit: 10 }),
    genreService.getAnimeGenres(),
  ]);

  const popularAnime = popularRes.data || [];
  const topRatedAnime = topRatedRes.data || [];
  const airingAnime = airingRes.data || [];
  const upcomingAnime = upcomingRes.data || [];
  const genres = genresRes.data || [];

  // Use top 5 popular anime for hero slider
  const heroItems = popularAnime.slice(0, 5);

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* 1. Cinematic Hero Section */}
      <Hero featuredAnime={heroItems} />

      {/* 2. Continue Watching (Locally Persisted) */}
      <ContinueWatching />

      {/* 3. Genres Quick Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-[#A1A1AA] uppercase tracking-wider font-bold">
            Sector Matrix // ジャンル
          </span>
        </div>
        <GenreFilter genres={genres.slice(0, 15)} />
      </section>

      {/* 4. Trending Now */}
      <AnimeRow
        title="Trending Now"
        subtitleJapanese="今話題の作品"
        animeList={popularAnime}
        viewAllHref="/rankings?filter=bypopularity"
      />

      {/* 5. Currently Airing Seasons */}
      <AnimeRow
        title="Currently Airing"
        subtitleJapanese="放送中アニメ"
        animeList={airingAnime}
        viewAllHref="/seasons"
      />

      {/* 6. Top Rated of All Time */}
      <AnimeRow
        title="Top Rated All-Time"
        subtitleJapanese="歴代最高評価"
        animeList={topRatedAnime}
        viewAllHref="/rankings"
      />

      {/* 7. Upcoming Season */}
      <AnimeRow
        title="Anticipated & Upcoming"
        subtitleJapanese="近日公開"
        animeList={upcomingAnime}
        viewAllHref="/seasons?tab=upcoming"
      />
    </div>
  );
}
