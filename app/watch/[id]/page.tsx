import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { animeService } from "@/lib/api";
import VideoPlayer from "@/components/player/VideoPlayer";
import EpisodeSelector from "@/components/player/EpisodeSelector";
import { Star, Bookmark, Share2, Info, ArrowLeft } from "lucide-react";

interface WatchPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    ep?: string;
  }>;
}

export async function generateMetadata({ params, searchParams }: WatchPageProps) {
  const { id } = await params;
  const { ep = "1" } = await searchParams;
  try {
    const res = await animeService.getAnimeById(id);
    const anime = res.data;
    if (!anime) return { title: "Watch Anime // ANIWAY" };
    return {
      title: `Watch ${anime.title_english || anime.title} — Episode ${ep} — ANIWAY`,
    };
  } catch {
    return { title: "Watch Anime // ANIWAY" };
  }
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const currentEpisodeNum = parseInt(resolvedSearchParams.ep || "1", 10);

  const [animeRes, episodesRes, videosRes, externalRes] = await Promise.all([
    animeService.getAnimeFull(id),
    animeService.getAnimeEpisodes(id, 1),
    animeService.getAnimeVideos(id),
    animeService.getAnimeExternal(id),
  ]);

  const anime = animeRes.data;
  if (!anime) {
    notFound();
  }

  const episodes = episodesRes.data || [];
  const currentEpisode = episodes.find((e) => e.mal_id === currentEpisodeNum) || {
    mal_id: currentEpisodeNum,
    title: `Episode ${currentEpisodeNum}`,
  };

  const trailerUrl = anime.trailer?.embed_url || (videosRes.data?.promo?.[0]?.trailer?.embed_url ?? null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full min-h-screen">
      {/* Back to details link */}
      <div className="mb-4">
        <Link
          href={`/anime/${anime.mal_id}`}
          className="inline-flex items-center gap-2 text-xs font-mono text-[#A1A1AA] hover:text-[#22D3EE] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO ANIME OVERVIEW</span>
        </Link>
      </div>

      {/* Main Grid: Player + Episode Sidebar on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Video Player & Episode Info */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <VideoPlayer
            anime={anime}
            currentEpisodeNum={currentEpisodeNum}
            episodes={episodes}
            trailerUrl={trailerUrl}
            officialStreams={anime.streaming || []}
            externalLinks={externalRes.data || []}
          />

          {/* Episode Info Banner */}
          <div className="p-5 rounded-2xl bg-[#111116] border border-white/5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono text-[#22D3EE] font-bold">
                  EPISODE {currentEpisodeNum}
                </span>
                <h1 className="font-heading font-bold text-lg sm:text-xl text-white mt-0.5">
                  {currentEpisode.title}
                </h1>
                {currentEpisode.title_japanese && (
                  <p className="text-xs font-mono text-[#A1A1AA]">
                    {currentEpisode.title_japanese}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {anime.score && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#18181F] border border-amber-400/30 text-amber-300 font-mono font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{anime.score.toFixed(1)}</span>
                  </div>
                )}
                <Link
                  href={`/anime/${anime.mal_id}`}
                  className="p-2 rounded-lg bg-[#18181F] hover:bg-white/10 border border-white/10 text-[#A1A1AA] hover:text-white transition"
                  title="View Full Series Details"
                >
                  <Info className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Anime summary & genres */}
            <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[#C084FC] font-semibold">
                  {anime.title_english || anime.title}
                </span>
                <span>•</span>
                <span className="text-[#A1A1AA]">{anime.type || "Anime"}</span>
                <span>•</span>
                <span className="text-[#A1A1AA]">{anime.status}</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {anime.genres?.slice(0, 3).map((g) => (
                  <span
                    key={g.mal_id}
                    className="px-2 py-0.5 rounded bg-white/5 text-[#A1A1AA] text-[11px] font-mono"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols on Desktop, below Player on Mobile): Episode Selector */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <EpisodeSelector
            animeId={anime.mal_id}
            episodes={episodes}
            currentEpisode={currentEpisodeNum}
          />

          {/* Quick Series Poster & Synopsis Preview */}
          <div className="hidden lg:flex flex-col p-4 rounded-2xl bg-[#111116] border border-white/5 space-y-3">
            <div className="flex gap-3">
              <div className="relative w-16 aspect-[3/4] rounded-lg overflow-hidden bg-[#18181F] flex-shrink-0">
                <Image
                  src={anime.images?.webp?.image_url || anime.images?.jpg?.image_url || "/placeholder-poster.jpg"}
                  alt={anime.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 space-y-1">
                <h4 className="font-heading font-semibold text-xs text-white line-clamp-1">
                  {anime.title_english || anime.title}
                </h4>
                <p className="text-[11px] text-[#A1A1AA] line-clamp-3 leading-relaxed">
                  {anime.synopsis}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
