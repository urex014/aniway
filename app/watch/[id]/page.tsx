import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { animeService } from "@/lib/api";
import VideoPlayer from "@/components/player/VideoPlayer";
import EpisodeSelector from "@/components/player/EpisodeSelector";
import { ChevronLeft } from "lucide-react";

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
  if (!anime) notFound();

  const episodes = episodesRes.data || [];
  const trailerUrl = anime.trailer?.embed_url || (videosRes.data?.promo?.[0]?.trailer?.embed_url ?? null);

  return (
    <div className="w-full min-h-screen bg-[#050505] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-3">
          <Link
            href={`/anime/${anime.mal_id}`}
            className="inline-flex items-center gap-1.5 text-xs text-[#A3A3A3] hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Overview</span>
          </Link>
        </div>

        {/* Minimal Dominant Player Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Video Viewport (8 or 9 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            <VideoPlayer
              anime={anime}
              currentEpisodeNum={currentEpisodeNum}
              episodes={episodes}
              trailerUrl={trailerUrl}
              officialStreams={anime.streaming || []}
              externalLinks={externalRes.data || []}
            />

            {/* Clean Metadata Line */}
            <div className="py-2 flex items-center justify-between text-xs text-[#A3A3A3] border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">
                  {anime.title_english || anime.title}
                </span>
                <span>•</span>
                <span>{anime.year || "Series"}</span>
                <span>•</span>
                <span>{anime.rating || "TV-14"}</span>
              </div>

              <Link
                href={`/anime/${anime.mal_id}`}
                className="text-[#8B5CF6] hover:underline font-medium"
              >
                Series Details
              </Link>
            </div>
          </div>

          {/* Episode Browser (4 cols on Desktop, below Player on Mobile) */}
          <div className="lg:col-span-4">
            <EpisodeSelector
              animeId={anime.mal_id}
              episodes={episodes}
              currentEpisode={currentEpisodeNum}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
