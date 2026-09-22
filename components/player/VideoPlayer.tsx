"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  SkipForward,
  SkipBack,
  Tv,
  ExternalLink,
} from "lucide-react";
import { Anime, Episode, ExternalLink as ExtLink } from "@/lib/api";
import { saveEpisodeProgress, getUserPreferences } from "@/lib/storage";

interface VideoPlayerProps {
  anime: Anime;
  currentEpisodeNum: number;
  episodes: Episode[];
  trailerUrl?: string | null;
  officialStreams?: { name: string; url: string }[];
  externalLinks?: ExtLink[];
}

export default function VideoPlayer({
  anime,
  currentEpisodeNum,
  episodes,
  trailerUrl,
  officialStreams = [],
}: VideoPlayerProps) {
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [preferences] = useState(getUserPreferences());

  const currentEpisode = episodes.find((e) => e.mal_id === currentEpisodeNum) || {
    mal_id: currentEpisodeNum,
    title: `Episode ${currentEpisodeNum}`,
  };

  const hasPrevious = currentEpisodeNum > 1;
  const hasNext =
    episodes.length > 0
      ? currentEpisodeNum < episodes.length
      : currentEpisodeNum < (anime.episodes || 1);

  useEffect(() => {
    saveEpisodeProgress({
      animeId: anime.mal_id,
      animeTitle: anime.title_english || anime.title,
      posterUrl: anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url,
      episode: currentEpisodeNum,
      episodeTitle: currentEpisode.title,
      progressSeconds: 120,
      durationSeconds: 1440,
    });
  }, [anime, currentEpisodeNum, currentEpisode.title]);

  const validEmbed = trailerUrl || anime.trailer?.embed_url;

  return (
    <div className="w-full flex flex-col bg-[#050505]">
      {/* Dominant Video Viewport */}
      <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden flex items-center justify-center shadow-2xl">
        {validEmbed && isPlayingTrailer ? (
          <iframe
            src={`${validEmbed}&autoplay=1`}
            title={`${anime.title} - Video`}
            className="w-full h-full object-cover"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#0d0d0d]">
            <div className="max-w-md space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#181818] flex items-center justify-center text-[#8B5CF6] mx-auto">
                <Tv className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-bold text-lg text-white">
                  Official Broadcaster Stream
                </h3>
                <p className="text-xs text-[#A3A3A3] mt-1 leading-relaxed">
                  MyAnimeList does not host direct full-length pirated video streams. You can stream via official licensed services below or preview the official video clip.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {validEmbed && (
                  <button
                    onClick={() => setIsPlayingTrailer(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium text-xs transition cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Preview Official Video
                  </button>
                )}

                {anime.streaming && anime.streaming.length > 0 ? (
                  anime.streaming.slice(0, 2).map((s) => (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#181818] hover:bg-[#262626] border border-white/10 text-white font-medium text-xs transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#8B5CF6]" />
                      Stream on {s.name}
                    </a>
                  ))
                ) : (
                  <a
                    href={anime.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#181818] hover:bg-[#262626] border border-white/10 text-white font-medium text-xs transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open on MyAnimeList
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Minimal Navigation & Episode Info Bar Below Player */}
      <div className="mt-4 flex items-center justify-between gap-4 py-2">
        <div className="min-w-0">
          <p className="text-xs text-[#8B5CF6] font-semibold">
            Episode {currentEpisodeNum}
          </p>
          <h2 className="font-bold text-base sm:text-lg text-white truncate">
            {currentEpisode.title}
          </h2>
        </div>

        {/* Prev / Next controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href={hasPrevious ? `/watch/${anime.mal_id}?ep=${currentEpisodeNum - 1}` : "#"}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition ${
              hasPrevious
                ? "bg-[#181818] hover:bg-[#262626] text-white"
                : "opacity-40 pointer-events-none bg-[#111111] text-[#A3A3A3]"
            }`}
          >
            <SkipBack className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Previous</span>
          </Link>

          <Link
            href={hasNext ? `/watch/${anime.mal_id}?ep=${currentEpisodeNum + 1}` : "#"}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold transition ${
              hasNext
                ? "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                : "opacity-40 pointer-events-none bg-[#111111] text-[#A3A3A3]"
            }`}
          >
            <span>Next</span>
            <SkipForward className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
