import React from "react";
import Link from "next/link";
import SearchBar from "@/components/search/SearchBar";
import AnimeCard from "@/components/anime/AnimeCard";
import MangaCard from "@/components/manga/MangaCard";
import CharacterCard from "@/components/characters/CharacterCard";
import PersonCard from "@/components/people/PersonCard";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  animeService,
  mangaService,
  characterService,
  peopleService,
} from "@/lib/api";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    type?: "anime" | "manga" | "characters" | "people";
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || "";
  const currentTab = resolvedParams.type || "anime";

  let animeResults: import("@/lib/api").Anime[] = [];
  let mangaResults: import("@/lib/api").Manga[] = [];
  let characterResults: import("@/lib/api").Character[] = [];
  let peopleResults: import("@/lib/api").Person[] = [];

  if (q.trim()) {
    if (currentTab === "anime") {
      const res = await animeService.getAnimeSearch({ q: q.trim(), limit: 24 });
      animeResults = res.data || [];
    } else if (currentTab === "manga") {
      const res = await mangaService.getMangaSearch({ q: q.trim(), limit: 24 });
      mangaResults = res.data || [];
    } else if (currentTab === "characters") {
      const res = await characterService.getCharactersSearch({ q: q.trim(), limit: 24 });
      characterResults = res.data || [];
    } else if (currentTab === "people") {
      const res = await peopleService.getPeopleSearch({ q: q.trim(), limit: 24 });
      peopleResults = res.data || [];
    }
  }

  const tabs = [
    { id: "anime", label: "Anime" },
    { id: "manga", label: "Manga" },
    { id: "characters", label: "Characters" },
    { id: "people", label: "People" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full min-h-screen bg-[#050505]">
      {/* Prominent Search Input */}
      <div className="max-w-2xl mx-auto mb-8 space-y-3">
        <SearchBar initialQuery={q} />
      </div>

      {/* Tabs */}
      {q && (
        <div className="flex items-center justify-center gap-2 mb-8">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={`/search?q=${encodeURIComponent(q)}&type=${tab.id}`}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                  isActive
                    ? "bg-[#8B5CF6] text-white"
                    : "bg-[#181818] hover:bg-[#262626] text-[#A3A3A3] hover:text-white"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Results Grid */}
      {!q.trim() ? (
        <div className="text-center py-20 text-[#A3A3A3]">
          <p className="text-sm">Search for your favorite anime, manga, characters, or voice actors.</p>
        </div>
      ) : currentTab === "anime" ? (
        animeResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {animeResults.map((item) => (
              <AnimeCard key={item.mal_id} anime={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={`No results for "${q}"`}
            description="Explore our anime catalog or try searching for another title."
          />
        )
      ) : currentTab === "manga" ? (
        mangaResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {mangaResults.map((item) => (
              <MangaCard key={item.mal_id} manga={item} />
            ))}
          </div>
        ) : (
          <EmptyState title={`No manga results for "${q}"`} />
        )
      ) : currentTab === "characters" ? (
        characterResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {characterResults.map((item) => (
              <CharacterCard key={item.mal_id} character={item} />
            ))}
          </div>
        ) : (
          <EmptyState title={`No character results for "${q}"`} />
        )
      ) : currentTab === "people" ? (
        peopleResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {peopleResults.map((item) => (
              <PersonCard key={item.mal_id} person={item} />
            ))}
          </div>
        ) : (
          <EmptyState title={`No people results for "${q}"`} />
        )
      ) : null}
    </div>
  );
}
