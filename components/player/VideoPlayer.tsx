"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Play,
  SkipForward,
  SkipBack,
  Maximize2,
  Tv,
  ExternalLink,
  ShieldAlert,
  Film,
  Sparkles,
  Settings,
} from "lucide-react";
import { Anime, Episode, ExternalLink as ExtLink } from "@/lib/api";
import { saveEpisodeProgress, getUserPreferences, saveUserPreferences } from "@/lib/storage";

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
  externalLinks = [],
}: VideoPlayerProps) {
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);
  const [activeServer, setActiveServer] = useState<string>("Official PV / Stream");
  const [preferences, setPreferences] = useState(getUserPreferences());

  const currentEpisode = episodes.find((e) => e.mal_id === currentEpisodeNum) || {
    mal_id: currentEpisodeNum,
    title: `Episode ${currentEpisodeNum}`,
  };

  const hasPrevious = currentEpisodeNum > 1;
  const hasNext = episodes.length > 0
    ? currentEpisodeNum < episodes.length
    : currentEpisodeNum < (anime.episodes || 1);

  // Save watch progress on mount and episode change
  useEffect(() => {
    saveEpisodeProgress({
      animeId: anime.mal_id,
      animeTitle: anime.title_english || anime.title,
      posterUrl: anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url,
      episode: currentEpisodeNum,
      episodeTitle: currentEpisode.title,
      progressSeconds: 120, // tracked start
      durationSeconds: 1440, // 24 min standard
    });
  }, [anime, currentEpisodeNum, currentEpisode.title]);

  const toggleAutoPlay = () => {
    const newVal = !preferences.autoPlayNext;
    saveUserPreferences({ autoPlayNext: newVal });
    setPreferences((prev) => ({ ...prev, autoPlayNext: newVal }));
  };

  // Check if Jikan provided an embed URL
  const validEmbed = trailerUrl || anime.trailer?.embed_url;

  return (
    <div className={`w-full flex flex-col transition-all duration-300 ${theaterMode ? "max-w-none" : ""}`}>
      {/* Video Viewport Container */}
      <div className="relative w-full aspect-video bg-[#09090B] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
        {validEmbed && isPlayingTrailer ? (
          <iframe
            src={`${validEmbed}&autoplay=1`}
            title={`${anime.title} - Official Video`}
            className="w-full h-full object-cover"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          /* Jikan Real Data Compliance Notice (No fake videos) */
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 sm:p-10 text-center bg-gradient-to-b from-[#111116] to-[#09090B]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#7C3AED]/10 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-lg space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#18181F] border border-white/10 flex items-center justify-center text-[#22D3EE] mx-auto shadow-[0_0_20px_-5px_rgba(34,211,238,0.4)]">
                <Tv className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#C084FC] uppercase tracking-wider font-bold">
                  TELEMETRY PROTOCOL NOTICE
                </span>
                <h3 className="font-heading font-bold text-lg sm:text-xl text-white mt-2">
                  No Third-Party Pirated Stream Injected
                </h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed mt-1">
                  In compliance with Jikan v4 standards, full episode video streams are not hosted on MyAnimeList servers. You can watch the official broadcaster stream or preview promotional video footage below.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {validEmbed && (
                  <button
                    onClick={() => setIsPlayingTrailer(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium text-xs shadow-[0_0_15px_rgba(124,58,237,0.5)] transition active:scale-95 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Play Official Preview Stream
                  </button>
                )}

                {anime.streaming && anime.streaming.length > 0 ? (
                  anime.streaming.slice(0, 2).map((stream) => (
                    <a
                      key={stream.name}
                      href={stream.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#18181F] hover:bg-[#22D3EE]/20 hover:border-[#22D3EE]/40 border border-white/10 text-white font-medium text-xs transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#22D3EE]" />
                      Stream on {stream.name}
                    </a>
                  ))
                ) : (
                  <a
                    href={anime.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#18181F] hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#C084FC]" />
                    Official MAL Source
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Video Player Floating Overlay Header */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
          <div className="flex items-center gap-2 pointer-events-auto">
            <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-xs font-mono font-bold text-white">
              EP {currentEpisodeNum}
            </span>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-xs text-[#A1A1AA] truncate max-w-xs">
              {currentEpisode.title}
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setTheaterMode(!theaterMode)}
              className="p-2 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-white hover:text-[#22D3EE] transition"
              title={theaterMode ? "Normal Mode" : "Theater Mode"}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar Below Player */}
      <div className="mt-4 p-4 rounded-xl bg-[#111116] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Previous / Next Episode Navigation */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <Link
            href={hasPrevious ? `/watch/${anime.mal_id}?ep=${currentEpisodeNum - 1}` : "#"}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-semibold transition ${
              hasPrevious
                ? "bg-[#18181F] hover:bg-white/10 border border-white/10 text-white"
                : "opacity-40 pointer-events-none bg-[#111116] text-[#A1A1AA]"
            }`}
          >
            <SkipBack className="w-3.5 h-3.5" />
            PREV EP
          </Link>

          <Link
            href={hasNext ? `/watch/${anime.mal_id}?ep=${currentEpisodeNum + 1}` : "#"}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-semibold transition ${
              hasNext
                ? "bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-sm"
                : "opacity-40 pointer-events-none bg-[#111116] text-[#A1A1AA]"
            }`}
          >
            NEXT EP
            <SkipForward className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Server & Player Toggles */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-[#A1A1AA]">SERVER:</span>
            <select
              value={activeServer}
              onChange={(e) => setActiveServer(e.target.value)}
              className="bg-[#18181F] border border-white/10 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-[#7C3AED]"
            >
              <option value="Official PV / Stream">Official PV / Stream</option>
              <option value="Jikan Mirror 1">Jikan Protocol 1</option>
              <option value="Broadcaster Direct">Broadcaster Direct</option>
            </select>
          </div>

          <button
            onClick={toggleAutoPlay}
            className={`px-2.5 py-1.5 rounded-lg border transition ${
              preferences.autoPlayNext
                ? "bg-[#7C3AED]/20 border-[#7C3AED] text-[#C084FC]"
                : "bg-[#18181F] border-white/10 text-[#A1A1AA]"
            }`}
          >
            AUTOPLAY: {preferences.autoPlayNext ? "ON" : "OFF"}
          </button>
        </div>
      </div>
    </div>
  );
}
