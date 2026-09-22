"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Bookmark,
  Check,
  Star,
  Film,
  Users,
  Award,
  Calendar,
  Clock,
  Tv,
  ExternalLink,
  MessageSquare,
  Image as ImageIcon,
  Music,
  Share2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Anime,
  Episode,
  CharacterItem,
  StaffItem,
  RecommendationItem,
  RelationItem,
  ReviewItem,
  AnimePicture,
  AnimeThemes,
  animeService,
} from "@/lib/api";
import { isAnimeInWatchlist, toggleWatchlistId } from "@/lib/storage";
import CharacterCard from "@/components/characters/CharacterCard";

interface AnimeDetailsProps {
  anime: Anime;
  initialEpisodes: Episode[];
}

type TabType = "episodes" | "characters" | "staff" | "videos" | "relations" | "reviews" | "gallery";

export default function AnimeDetails({ anime, initialEpisodes }: AnimeDetailsProps) {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("episodes");

  // Secondary progressive data states
  const [episodes, setEpisodes] = useState<Episode[]>(initialEpisodes);
  const [characters, setCharacters] = useState<CharacterItem[]>([]);
  const [staff, setStaff] = useState<StaffItem[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [relations, setRelations] = useState<RelationItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [pictures, setPictures] = useState<AnimePicture[]>([]);
  const [themes, setThemes] = useState<AnimeThemes | null>(null);

  const [loadingTab, setLoadingTab] = useState(false);

  useEffect(() => {
    setInWatchlist(isAnimeInWatchlist(anime.mal_id));
  }, [anime.mal_id]);

  // Progressive fetching on tab selection
  useEffect(() => {
    let isMounted = true;
    const loadSecondaryData = async () => {
      setLoadingTab(true);
      try {
        if (activeTab === "characters" && characters.length === 0) {
          const res = await animeService.getAnimeCharacters(anime.mal_id);
          if (isMounted && res.data) setCharacters(res.data);
        } else if (activeTab === "staff" && staff.length === 0) {
          const res = await animeService.getAnimeStaff(anime.mal_id);
          if (isMounted && res.data) setStaff(res.data);
        } else if (activeTab === "relations" && relations.length === 0) {
          const [relRes, recRes] = await Promise.all([
            animeService.getAnimeRelations(anime.mal_id),
            animeService.getAnimeRecommendations(anime.mal_id),
          ]);
          if (isMounted) {
            if (relRes.data) setRelations(relRes.data);
            if (recRes.data) setRecommendations(recRes.data);
          }
        } else if (activeTab === "reviews" && reviews.length === 0) {
          const res = await animeService.getAnimeReviews(anime.mal_id);
          if (isMounted && res.data) setReviews(res.data);
        } else if (activeTab === "gallery" && pictures.length === 0) {
          const [picRes, thmRes] = await Promise.all([
            animeService.getAnimePictures(anime.mal_id),
            animeService.getAnimeThemes(anime.mal_id),
          ]);
          if (isMounted) {
            if (picRes.data) setPictures(picRes.data);
            if (thmRes.data) setThemes(thmRes.data);
          }
        }
      } catch {
        // Handled silently
      } finally {
        if (isMounted) setLoadingTab(false);
      }
    };

    loadSecondaryData();
    return () => {
      isMounted = false;
    };
  }, [activeTab, anime.mal_id, characters.length, staff.length, relations.length, reviews.length, pictures.length]);

  const handleWatchlist = () => {
    const state = toggleWatchlistId(anime.mal_id);
    setInWatchlist(state);
  };

  const bannerImg =
    anime.images?.webp?.large_image_url ||
    anime.images?.jpg?.large_image_url ||
    "/placeholder-hero.jpg";

  const posterImg =
    anime.images?.webp?.large_image_url ||
    anime.images?.jpg?.large_image_url ||
    "/placeholder-poster.jpg";

  const displayTitle = anime.title_english || anime.title;

  return (
    <div className="w-full flex flex-col">
      {/* Hero Banner Header */}
      <div className="relative w-full h-[45vh] min-h-[350px] max-h-[500px] overflow-hidden">
        <Image
          src={bannerImg}
          alt={displayTitle}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter blur-xs brightness-[0.4] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090B] via-transparent to-transparent" />
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-44 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Poster & Quick Controls */}
          <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-4">
            <div className="relative aspect-[3/4.2] w-full rounded-2xl overflow-hidden bg-[#111116] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
              <Image
                src={posterImg}
                alt={displayTitle}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 280px"
                className="object-cover"
              />
              <div className="absolute top-3 right-3">
                {anime.score && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-amber-400/40 text-amber-300 font-mono font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{anime.score.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2.5">
              <Link
                href={`/watch/${anime.mal_id}?ep=1`}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#7E22CE] text-white font-heading font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(124,58,237,0.45)] transition active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                WATCH NOW
              </Link>

              <button
                onClick={handleWatchlist}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-semibold tracking-wide transition active:scale-95 cursor-pointer ${
                  inWatchlist
                    ? "bg-[#7C3AED]/20 border-[#C084FC] text-[#C084FC]"
                    : "bg-[#18181F] hover:bg-[#1f1f2a] border-white/10 text-white"
                }`}
              >
                {inWatchlist ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                {inWatchlist ? "IN WATCHLIST" : "ADD TO WATCHLIST"}
              </button>
            </div>

            {/* Quick Metadata Box */}
            <div className="p-4 rounded-xl bg-[#111116] border border-white/5 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[#A1A1AA]">Format</span>
                <span className="text-white font-mono">{anime.type || "TV"}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[#A1A1AA]">Status</span>
                <span className="text-[#22D3EE] font-mono">{anime.status}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[#A1A1AA]">Episodes</span>
                <span className="text-white font-mono">{anime.episodes || "Ongoing"}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[#A1A1AA]">Duration</span>
                <span className="text-white font-mono">{anime.duration || "24 min"}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[#A1A1AA]">Season</span>
                <span className="text-white font-mono uppercase">
                  {anime.season} {anime.year}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A1A1AA]">Studio</span>
                <span className="text-[#C084FC] font-mono truncate max-w-[140px]">
                  {anime.studios && anime.studios[0] ? anime.studios[0].name : "Unknown"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Titles, Synopsis, Badges, Tabs */}
          <div className="md:col-span-8 lg:col-span-9 flex flex-col">
            {/* Header info */}
            <div className="space-y-2 mb-6">
              {anime.title_japanese && (
                <p className="text-sm font-mono text-[#22D3EE] font-medium tracking-wide">
                  {anime.title_japanese}
                </p>
              )}
              <h1 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight">
                {displayTitle}
              </h1>

              {anime.title_english && anime.title !== anime.title_english && (
                <p className="text-xs text-[#A1A1AA] italic">
                  Romaji: {anime.title}
                </p>
              )}

              {/* Stats badges */}
              <div className="flex items-center flex-wrap gap-2 pt-2 text-xs font-mono">
                {anime.rank && (
                  <span className="px-2.5 py-1 rounded-md bg-[#18181F] border border-white/10 text-[#C084FC] font-bold">
                    RANK #{anime.rank}
                  </span>
                )}
                {anime.popularity && (
                  <span className="px-2.5 py-1 rounded-md bg-[#18181F] border border-white/10 text-white">
                    POPULARITY #{anime.popularity}
                  </span>
                )}
                {anime.members && (
                  <span className="px-2.5 py-1 rounded-md bg-[#18181F] border border-white/10 text-[#A1A1AA]">
                    {anime.members.toLocaleString()} MEMBERS
                  </span>
                )}
                {anime.rating && (
                  <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[#A1A1AA]">
                    {anime.rating.split(" ")[0]}
                  </span>
                )}
              </div>

              {/* Genres Pills */}
              <div className="flex items-center flex-wrap gap-1.5 pt-2">
                {anime.genres?.map((g) => (
                  <Link
                    key={g.mal_id}
                    href={`/anime?genres=${g.mal_id}`}
                    className="px-2.5 py-1 rounded-lg bg-[#111116] hover:bg-[#18181F] border border-white/10 text-xs font-mono text-white/90 hover:text-[#22D3EE] transition"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Synopsis */}
            {anime.synopsis && (
              <div className="mb-8 p-5 rounded-2xl bg-[#111116] border border-white/5">
                <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-2">
                  Synopsis // あらすじ
                </h3>
                <p
                  className={`text-xs sm:text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-line ${
                    !synopsisExpanded ? "line-clamp-4" : ""
                  }`}
                >
                  {anime.synopsis}
                </p>
                {anime.synopsis.length > 280 && (
                  <button
                    onClick={() => setSynopsisExpanded(!synopsisExpanded)}
                    className="flex items-center gap-1 text-xs font-mono text-[#C084FC] hover:text-[#22D3EE] mt-2 cursor-pointer"
                  >
                    <span>{synopsisExpanded ? "Show Less" : "Read Full Synopsis"}</span>
                    {synopsisExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            )}

            {/* Tab Navigation */}
            <div className="border-b border-white/10 mb-6 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {[
                { id: "episodes", label: "Episodes", count: episodes.length },
                { id: "characters", label: "Characters & Cast" },
                { id: "staff", label: "Production Staff" },
                { id: "videos", label: "Trailers & Videos" },
                { id: "relations", label: "Relations & Recs" },
                { id: "reviews", label: "Community Reviews" },
                { id: "gallery", label: "Gallery & Themes" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`pb-3 px-3 text-xs sm:text-sm font-heading font-medium tracking-wide border-b-2 transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                    activeTab === tab.id
                      ? "border-[#7C3AED] text-white font-bold"
                      : "border-transparent text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/10">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content Panes */}
            <div className="pb-16 min-h-[300px]">
              {/* 1. EPISODES TAB */}
              {activeTab === "episodes" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-base text-white">
                      Episode Archive
                    </h3>
                    <span className="text-xs font-mono text-[#A1A1AA]">
                      {episodes.length} Episodes available
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {episodes.map((ep) => (
                      <Link
                        key={ep.mal_id}
                        href={`/watch/${anime.mal_id}?ep=${ep.mal_id}`}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#111116] hover:bg-[#18181F] border border-white/5 hover:border-[#7C3AED]/50 transition group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-8 h-8 rounded-lg bg-[#18181F] group-hover:bg-[#7C3AED] text-white font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 transition">
                            {ep.mal_id}
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-white truncate group-hover:text-[#22D3EE] transition">
                              {ep.title}
                            </h4>
                            <p className="text-[10px] text-[#A1A1AA] font-mono">
                              {ep.aired || "Aired"}
                            </p>
                          </div>
                        </div>
                        <Play className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:text-[#22D3EE] flex-shrink-0 ml-2" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. CHARACTERS TAB */}
              {activeTab === "characters" && (
                <div className="space-y-4">
                  {loadingTab ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="aspect-[3/4] bg-[#111116] rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : characters.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {characters.map((item) => (
                        <CharacterCard
                          key={item.character.mal_id}
                          character={{
                            mal_id: item.character.mal_id,
                            url: item.character.url,
                            images: item.character.images,
                            name: item.character.name,
                            name_kanji: null,
                            favorites: item.favorites || 0,
                            about: null,
                          }}
                          role={item.role}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#A1A1AA] py-8 text-center">
                      Character telemetry synchronized on request.
                    </p>
                  )}
                </div>
              )}

              {/* 3. STAFF TAB */}
              {activeTab === "staff" && (
                <div className="space-y-4">
                  {loadingTab ? (
                    <div className="h-32 bg-[#111116] rounded-xl animate-pulse" />
                  ) : staff.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {staff.map((item) => (
                        <div
                          key={item.person.mal_id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-[#111116] border border-white/5"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#18181F] flex-shrink-0">
                            <Image
                              src={item.person.images.jpg.image_url}
                              alt={item.person.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-white truncate">
                              {item.person.name}
                            </h4>
                            <p className="text-[10px] font-mono text-[#22D3EE] truncate">
                              {item.positions.join(", ")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#A1A1AA] py-8 text-center">
                      Production crew telemetry records not indexed.
                    </p>
                  )}
                </div>
              )}

              {/* 4. VIDEOS & TRAILERS TAB */}
              {activeTab === "videos" && (
                <div className="space-y-6">
                  {anime.trailer?.embed_url ? (
                    <div className="space-y-2">
                      <h4 className="font-heading font-bold text-sm text-white">
                        Official Promotional Trailer
                      </h4>
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black">
                        <iframe
                          src={anime.trailer.embed_url}
                          title={`${anime.title} Trailer`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#A1A1AA] py-8 text-center">
                      No promotional trailers embedded for this record.
                    </p>
                  )}
                </div>
              )}

              {/* 5. RELATIONS & RECOMMENDATIONS */}
              {activeTab === "relations" && (
                <div className="space-y-6">
                  {relations.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-heading font-bold text-sm text-white">
                        Franchise Relations // 関連作品
                      </h4>
                      <div className="divide-y divide-white/5 bg-[#111116] rounded-xl border border-white/5 p-4">
                        {relations.map((rel, i) => (
                          <div key={i} className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs">
                            <span className="font-mono text-[#C084FC] uppercase w-32 flex-shrink-0 font-bold">
                              {rel.relation}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {rel.entry.map((e) => (
                                <Link
                                  key={e.mal_id}
                                  href={e.type === "anime" ? `/anime/${e.mal_id}` : `/manga/${e.mal_id}`}
                                  className="text-white hover:text-[#22D3EE] transition font-medium"
                                >
                                  {e.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {recommendations.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-heading font-bold text-sm text-white">
                        Community Recommendations // おすすめ
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {recommendations.slice(0, 4).map((rec) => (
                          <Link
                            key={rec.entry.mal_id}
                            href={`/anime/${rec.entry.mal_id}`}
                            className="group flex flex-col gap-2"
                          >
                            <div className="relative aspect-[3/4.2] w-full rounded-xl overflow-hidden bg-[#18181F] border border-white/10 group-hover:border-[#7C3AED]/70 transition">
                              <Image
                                src={rec.entry.images.jpg.image_url}
                                alt={rec.entry.title}
                                fill
                                sizes="160px"
                                className="object-cover group-hover:scale-105 transition"
                              />
                            </div>
                            <span className="text-xs font-medium text-white line-clamp-1 group-hover:text-[#22D3EE] transition">
                              {rec.entry.title}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 6. REVIEWS TAB */}
              {activeTab === "reviews" && (
                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((rev) => (
                      <div
                        key={rev.mal_id}
                        className="p-4 rounded-xl bg-[#111116] border border-white/5 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#18181F] flex items-center justify-center font-mono font-bold text-xs text-[#22D3EE]">
                              {rev.user.username.slice(0, 1).toUpperCase()}
                            </div>
                            <span className="text-xs font-semibold text-white">
                              {rev.user.username}
                            </span>
                          </div>
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-300 font-mono">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {rev.score} / 10
                          </span>
                        </div>
                        <p className="text-xs text-[#A1A1AA] line-clamp-4 leading-relaxed whitespace-pre-line">
                          {rev.review}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#A1A1AA] py-8 text-center">
                      No community reviews currently indexed for this entry.
                    </p>
                  )}
                </div>
              )}

              {/* 7. GALLERY & THEMES TAB */}
              {activeTab === "gallery" && (
                <div className="space-y-6">
                  {pictures.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-heading font-bold text-sm text-white">
                        Artwork Gallery
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {pictures.map((pic, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-[3/4.2] rounded-xl overflow-hidden bg-[#18181F] border border-white/10"
                          >
                            <Image
                              src={pic.jpg.image_url}
                              alt="Gallery pic"
                              fill
                              sizes="200px"
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {themes && (themes.openings.length > 0 || themes.endings.length > 0) && (
                    <div className="space-y-4">
                      <h4 className="font-heading font-bold text-sm text-white">
                        Theme Songs // 主題歌
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-[#111116] border border-white/5 space-y-2">
                          <span className="text-xs font-mono font-bold text-[#C084FC]">
                            OPENINGS (OP)
                          </span>
                          <ul className="space-y-1.5 text-xs text-[#A1A1AA]">
                            {themes.openings.map((op, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <Music className="w-3.5 h-3.5 text-[#22D3EE] mt-0.5 flex-shrink-0" />
                                <span>{op}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 rounded-xl bg-[#111116] border border-white/5 space-y-2">
                          <span className="text-xs font-mono font-bold text-[#22D3EE]">
                            ENDINGS (ED)
                          </span>
                          <ul className="space-y-1.5 text-xs text-[#A1A1AA]">
                            {themes.endings.map((ed, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <Music className="w-3.5 h-3.5 text-[#C084FC] mt-0.5 flex-shrink-0" />
                                <span>{ed}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
