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
import { Search, Film, BookOpen, User, Users } from "lucide-react";

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
    { id: "anime", label: "Anime", icon: Film },
    { id: "manga", label: "Manga", icon: BookOpen },
    { id: "characters", label: "Characters", icon: User },
    { id: "people", label: "People / Seiyuu", icon: Users },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen">
      {/* Search Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3 mb-8">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#22D3EE] uppercase tracking-wider font-bold">
          <Search className="w-4 h-4 text-[#22D3EE]" />
          <span>Universal Telemetry Radar // 全体検索</span>
        </div>
        <h1 className="font-heading font-black text-2xl sm:text-4xl text-white">
          Search the Cyber Database
        </h1>
        <p className="text-xs sm:text-sm text-[#A1A1AA]">
          Query indexed titles, literary works, characters, and voice talent across Jikan v4.
        </p>

        {/* Global Search Bar */}
        <div className="pt-2">
          <SearchBar initialQuery={q} />
        </div>
      </div>

      {/* Tabs */}
      {q && (
        <div className="flex items-center justify-center gap-2 border-b border-white/5 pb-4 mb-8 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={`/search?q=${encodeURIComponent(q)}&type=${tab.id}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-medium transition flex-shrink-0 ${
                  isActive
                    ? "bg-[#7C3AED] text-white font-bold shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                    : "bg-[#111116] hover:bg-[#18181F] text-[#A1A1AA] hover:text-white border border-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Results Rendering */}
      {!q.trim() ? (
        <div className="text-center py-16 text-[#A1A1AA] space-y-2">
          <p className="text-sm">Enter a search keyword above to query the Jikan v4 archives.</p>
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
            title="No Anime Signals Found"
            description={`No anime matched the search query "${q}".`}
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
          <EmptyState
            title="No Manga Signals Found"
            description={`No manga records matched "${q}".`}
          />
        )
      ) : currentTab === "characters" ? (
        characterResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {characterResults.map((item) => (
              <CharacterCard key={item.mal_id} character={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Characters Located"
            description={`No character records matched "${q}".`}
          />
        )
      ) : currentTab === "people" ? (
        peopleResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {peopleResults.map((item) => (
              <PersonCard key={item.mal_id} person={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Voice Actors Located"
            description={`No personnel matched "${q}".`}
          />
        )
      ) : null}
    </div>
  );
}
