"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Plus,
  Check,
  Star,
  Film,
  Users,
  Calendar,
  Clock,
  ExternalLink,
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
  animeService,
} from "@/lib/api";
import { isAnimeInWatchlist, toggleWatchlistId } from "@/lib/storage";

interface AnimeDetailsProps {
  anime: Anime;
  initialEpisodes: Episode[];
}

type TabType = "episodes" | "characters" | "staff" | "trailer" | "more_like_this" | "reviews";

export default function AnimeDetails({ anime, initialEpisodes }: AnimeDetailsProps) {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("episodes");

  const [episodes, setEpisodes] = useState<Episode[]>(initialEpisodes);
  const [characters, setCharacters] = useState<CharacterItem[]>([]);
  const [staff, setStaff] = useState<StaffItem[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [relations, setRelations] = useState<RelationItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loadingTab, setLoadingTab] = useState(false);

  useEffect(() => {
    setInWatchlist(isAnimeInWatchlist(anime.mal_id));
  }, [anime.mal_id]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoadingTab(true);
      try {
        if (activeTab === "characters" && characters.length === 0) {
          const res = await animeService.getAnimeCharacters(anime.mal_id);
          if (isMounted && res.data) setCharacters(res.data);
        } else if (activeTab === "staff" && staff.length === 0) {
          const res = await animeService.getAnimeStaff(anime.mal_id);
          if (isMounted && res.data) setStaff(res.data);
        } else if (activeTab === "more_like_this" && recommendations.length === 0) {
          const [recRes, relRes] = await Promise.all([
            animeService.getAnimeRecommendations(anime.mal_id),
            animeService.getAnimeRelations(anime.mal_id),
          ]);
          if (isMounted) {
            if (recRes.data) setRecommendations(recRes.data);
            if (relRes.data) setRelations(relRes.data);
          }
        } else if (activeTab === "reviews" && reviews.length === 0) {
          const res = await animeService.getAnimeReviews(anime.mal_id);
          if (isMounted && res.data) setReviews(res.data);
        }
      } catch {
        // Handled silently
      } finally {
        if (isMounted) setLoadingTab(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [activeTab, anime.mal_id, characters.length, staff.length, recommendations.length, reviews.length]);

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
    <div className="w-full flex flex-col bg-[#050505]">
      {/* 1. Cinematic Banner */}
      <div className="relative w-full h-[50vh] min-h-[400px] max-h-[550px] overflow-hidden">
        <Image
          src={bannerImg}
          alt={displayTitle}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.5] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/40 to-transparent w-full md:w-2/3" />
      </div>

      {/* 2. Main Details Content Overlay */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-44 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Overlapping Poster & CTAs */}
          <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-4">
            <div className="relative aspect-[2/3] w-full rounded-md overflow-hidden bg-[#111111] shadow-[0_12px_40px_rgba(0,0,0,0.9)]">
              <Image
                src={posterImg}
                alt={displayTitle}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 280px"
                className="object-cover"
              />
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2.5">
              <Link
                href={`/watch/${anime.mal_id}?ep=1`}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-md bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                Watch Now
              </Link>

              <button
                onClick={handleWatchlist}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-[#181818] hover:bg-[#262626] border border-white/10 text-white font-medium text-xs transition active:scale-95 cursor-pointer"
              >
                {inWatchlist ? <Check className="w-4 h-4 text-[#8B5CF6]" /> : <Plus className="w-4 h-4" />}
                <span>{inWatchlist ? "In My List" : "Add to My List"}</span>
              </button>
            </div>

            {/* Metadata Sidebar Card */}
            <div className="p-4 rounded-md bg-[#111111] border border-white/5 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[#A3A3A3]">Format</span>
                <span className="text-white font-medium">{anime.type || "TV"}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[#A3A3A3]">Status</span>
                <span className="text-white font-medium">{anime.status}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[#A3A3A3]">Episodes</span>
                <span className="text-white font-medium">{anime.episodes || "Ongoing"}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[#A3A3A3]">Duration</span>
                <span className="text-white font-medium">{anime.duration || "24m"}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[#A3A3A3]">Season</span>
                <span className="text-white font-medium capitalize">
                  {anime.season} {anime.year}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A3A3A3]">Studio</span>
                <span className="text-white font-medium truncate max-w-[140px]">
                  {anime.studios && anime.studios[0] ? anime.studios[0].name : "Unknown"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Synopsis, Metadata, Tabs */}
          <div className="md:col-span-8 lg:col-span-9 flex flex-col">
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-xs text-[#A3A3A3] font-medium">
                {anime.score && (
                  <span className="flex items-center gap-1 text-white font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#8B5CF6] text-[#8B5CF6]" />
                    {anime.score.toFixed(1)} Rating
                  </span>
                )}
                {anime.rank && <span>• Rank #{anime.rank}</span>}
                {anime.popularity && <span>• #{anime.popularity} Most Popular</span>}
                {anime.rating && (
                  <>
                    <span>•</span>
                    <span className="px-1.5 py-0.2 rounded border border-white/20 text-[10px] text-white">
                      {anime.rating.split(" ")[0]}
                    </span>
                  </>
                )}
              </div>

              <h1 className="font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                {displayTitle}
              </h1>

              {anime.title_japanese && (
                <p className="text-xs text-[#A3A3A3]">
                  Original Title: {anime.title_japanese}
                </p>
              )}

              {/* Genres */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                {anime.genres?.map((g) => (
                  <Link
                    key={g.mal_id}
                    href={`/anime?genres=${g.mal_id}`}
                    className="px-3 py-1 rounded-full bg-[#181818] hover:bg-[#262626] text-xs text-[#A3A3A3] hover:text-white transition"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Synopsis */}
            {anime.synopsis && (
              <div className="mb-8 p-5 rounded-md bg-[#111111] border border-white/5 space-y-2">
                <h3 className="font-bold text-sm text-white">
                  Storyline
                </h3>
                <p
                  className={`text-xs sm:text-sm text-[#A3A3A3] leading-relaxed whitespace-pre-line ${
                    !synopsisExpanded ? "line-clamp-4" : ""
                  }`}
                >
                  {anime.synopsis}
                </p>
                {anime.synopsis.length > 250 && (
                  <button
                    onClick={() => setSynopsisExpanded(!synopsisExpanded)}
                    className="flex items-center gap-1 text-xs font-semibold text-[#8B5CF6] hover:text-white mt-1 cursor-pointer"
                  >
                    <span>{synopsisExpanded ? "Show Less" : "Read More"}</span>
                    {synopsisExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            )}

            {/* Netflix-style Minimal Tabs */}
            <div className="border-b border-white/10 mb-6 flex items-center gap-6 overflow-x-auto no-scrollbar">
              {[
                { id: "episodes", label: "Episodes", count: episodes.length },
                { id: "characters", label: "Cast & Characters" },
                { id: "staff", label: "Creators & Staff" },
                { id: "trailer", label: "Trailers & Clips" },
                { id: "more_like_this", label: "More Like This" },
                { id: "reviews", label: "Reviews" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`pb-3 text-sm font-medium transition cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
                    activeTab === tab.id
                      ? "text-white font-bold border-b-2 border-[#8B5CF6]"
                      : "text-[#A3A3A3] hover:text-white border-b-2 border-transparent"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="text-xs text-[#A3A3A3]">({tab.count})</span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Panes */}
            <div className="pb-16 min-h-[300px]">
              {/* Episodes */}
              {activeTab === "episodes" && (
                <div className="space-y-3">
                  {episodes.map((ep) => (
                    <Link
                      key={ep.mal_id}
                      href={`/watch/${anime.mal_id}?ep=${ep.mal_id}`}
                      className="flex items-center justify-between p-3.5 rounded-md bg-[#111111] hover:bg-[#181818] transition group gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <span className="text-lg font-bold text-[#A3A3A3] group-hover:text-white w-6 text-center">
                          {ep.mal_id}
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-white truncate group-hover:text-[#8B5CF6] transition">
                            {ep.title}
                          </h4>
                          <p className="text-xs text-[#A3A3A3]">
                            {ep.aired || "Aired"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="w-8 h-8 rounded-full bg-[#181818] group-hover:bg-[#8B5CF6] text-white flex items-center justify-center transition">
                          <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Characters */}
              {activeTab === "characters" && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {characters.slice(0, 12).map((item) => (
                    <div
                      key={item.character.mal_id}
                      className="flex flex-col p-2.5 rounded-md bg-[#111111] space-y-2"
                    >
                      <div className="relative aspect-[3/4] w-full rounded overflow-hidden bg-[#181818]">
                        <Image
                          src={item.character.images.jpg.image_url}
                          alt={item.character.name}
                          fill
                          sizes="150px"
                          className="object-cover object-top"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-white truncate">
                          {item.character.name}
                        </h4>
                        <p className="text-[11px] text-[#A3A3A3] truncate">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Staff */}
              {activeTab === "staff" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {staff.slice(0, 9).map((item) => (
                    <div
                      key={item.person.mal_id}
                      className="flex items-center gap-3 p-3 rounded-md bg-[#111111]"
                    >
                      <div className="relative w-12 h-12 rounded overflow-hidden bg-[#181818] flex-shrink-0">
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
                        <p className="text-[11px] text-[#A3A3A3] truncate">
                          {item.positions.join(", ")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Trailer */}
              {activeTab === "trailer" && (
                <div>
                  {anime.trailer?.embed_url ? (
                    <div className="relative w-full aspect-video rounded-md overflow-hidden bg-black max-w-3xl">
                      <iframe
                        src={anime.trailer.embed_url}
                        title="Official Trailer"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <p className="text-xs text-[#A3A3A3] py-8">
                      No trailer video available for this series.
                    </p>
                  )}
                </div>
              )}

              {/* More Like This */}
              {activeTab === "more_like_this" && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {recommendations.slice(0, 8).map((rec) => (
                    <Link
                      key={rec.entry.mal_id}
                      href={`/anime/${rec.entry.mal_id}`}
                      className="group flex flex-col gap-2"
                    >
                      <div className="relative aspect-[2/3] w-full rounded-md overflow-hidden bg-[#111111] group-hover:scale-105 transition duration-300">
                        <Image
                          src={rec.entry.images.jpg.image_url}
                          alt={rec.entry.title}
                          fill
                          sizes="160px"
                          className="object-cover"
                        />
                      </div>
                      <h4 className="text-xs font-medium text-white line-clamp-1 group-hover:text-[#8B5CF6] transition">
                        {rec.entry.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              )}

              {/* Reviews */}
              {activeTab === "reviews" && (
                <div className="space-y-3">
                  {reviews.length > 0 ? (
                    reviews.slice(0, 5).map((rev) => (
                      <div key={rev.mal_id} className="p-4 rounded-md bg-[#111111] space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white">{rev.user.username}</span>
                          <span className="text-[#8B5CF6] font-bold">★ {rev.score}/10</span>
                        </div>
                        <p className="text-xs text-[#A3A3A3] line-clamp-4 leading-relaxed">
                          {rev.review}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#A3A3A3] py-8">
                      No reviews available for this series.
                    </p>
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
