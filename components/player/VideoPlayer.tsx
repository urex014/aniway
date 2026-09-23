"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Maximize,
  Tv,
  Film,
  ExternalLink,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Anime, Episode, ExternalLink as ExtLink } from "@/lib/api";
import { saveEpisodeProgress } from "@/lib/storage";
import { ResolvedStream } from "@/lib/api/archiveStream";

interface VideoPlayerProps {
  anime: Anime;
  currentEpisodeNum: number;
  episodes: Episode[];
  trailerUrl?: string | null;
  officialStreams?: { name: string; url: string }[];
  externalLinks?: ExtLink[];
  initialStream?: ResolvedStream | null;
}

export default function VideoPlayer({
  anime,
  currentEpisodeNum,
  episodes,
  trailerUrl,
  officialStreams = [],
  initialStream = null,
}: VideoPlayerProps) {
  const [stream, setStream] = useState<ResolvedStream | null>(initialStream);
  const [loadingStream, setLoadingStream] = useState(!initialStream);
  const [sourceMode, setSourceMode] = useState<"stream" | "trailer" | "official">(
    initialStream?.success ? "stream" : "trailer"
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentEpisode = episodes.find((e) => e.mal_id === currentEpisodeNum) || {
    mal_id: currentEpisodeNum,
    title: `Episode ${currentEpisodeNum}`,
  };

  const hasPrevious = currentEpisodeNum > 1;
  const hasNext =
    episodes.length > 0
      ? currentEpisodeNum < episodes.length
      : currentEpisodeNum < (anime.episodes || 1);

  // Fetch or re-resolve stream when anime or episode changes
  useEffect(() => {
    let isCancelled = false;

    async function loadStream() {
      // If we already have the matching initial stream, reuse it
      if (
        initialStream &&
        initialStream.episodeNumber === currentEpisodeNum &&
        initialStream.animeTitle === anime.title
      ) {
        setStream(initialStream);
        setSourceMode(initialStream.success ? "stream" : "trailer");
        setLoadingStream(false);
        return;
      }

      setLoadingStream(true);
      try {
        const query = new URLSearchParams({
          id: String(anime.mal_id),
          title: anime.title,
          ep: String(currentEpisodeNum),
        });
        if (anime.title_english) {
          query.set("titleEnglish", anime.title_english);
        }

        const res = await fetch(`/api/streams?${query.toString()}`);
        if (!res.ok) throw new Error("Stream lookup failed");
        const data: ResolvedStream = await res.json();

        if (!isCancelled) {
          setStream(data);
          if (data.success && data.streamUrl) {
            setSourceMode("stream");
          } else {
            setSourceMode("trailer");
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setStream(null);
          setSourceMode("trailer");
        }
      } finally {
        if (!isCancelled) {
          setLoadingStream(false);
        }
      }
    }

    loadStream();
    return () => {
      isCancelled = true;
    };
  }, [anime.mal_id, anime.title, anime.title_english, currentEpisodeNum, initialStream]);

  // Sync playback progress into localStorage for Continue Watching
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1440;
    setCurrentTime(curr);
    setDuration(dur);

    // Save every ~5 seconds
    if (Math.floor(curr) % 5 === 0) {
      saveEpisodeProgress({
        animeId: anime.mal_id,
        animeTitle: anime.title_english || anime.title,
        posterUrl:
          anime.images?.webp?.large_image_url ||
          anime.images?.jpg?.large_image_url,
        episode: currentEpisodeNum,
        episodeTitle: currentEpisode.title,
        progressSeconds: Math.floor(curr),
        durationSeconds: Math.floor(dur),
      });
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (hasNext) {
      window.location.href = `/watch/${anime.mal_id}?ep=${currentEpisodeNum + 1}`;
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const target = parseFloat(e.target.value);
    videoRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const next = !isMuted;
    setIsMuted(next);
    videoRef.current.muted = next;
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen?.() ||
        (videoRef.current as any).webkitRequestFullscreen?.();
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const validTrailer = trailerUrl || anime.trailer?.embed_url;

  return (
    <div className="w-full flex flex-col bg-[#050505]">
      {/* Source Selector Pill Navigation */}
      <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
        <div className="flex items-center gap-2">
          {stream?.success && stream.streamUrl && (
            <button
              onClick={() => setSourceMode("stream")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                sourceMode === "stream"
                  ? "bg-[#8B5CF6] text-white shadow-sm"
                  : "bg-[#181818] text-[#A3A3A3] hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Episode (Archive HD)</span>
            </button>
          )}

          {validTrailer && (
            <button
              onClick={() => setSourceMode("trailer")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                sourceMode === "trailer"
                  ? "bg-[#8B5CF6] text-white shadow-sm"
                  : "bg-[#181818] text-[#A3A3A3] hover:text-white"
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Official Trailer</span>
            </button>
          )}

          <button
            onClick={() => setSourceMode("official")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              sourceMode === "official"
                ? "bg-[#8B5CF6] text-white shadow-sm"
                : "bg-[#181818] text-[#A3A3A3] hover:text-white"
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Broadcasters & Info</span>
          </button>
        </div>

        {/* Streaming Resolution Badge */}
        {stream?.success && sourceMode === "stream" && (
          <span className="text-[10px] font-bold text-white bg-black/80 border border-[#8B5CF6]/50 px-2 py-0.5 rounded">
            DIRECT MP4 STREAM
          </span>
        )}
      </div>

      {/* Main Dominant Video Screen */}
      <div
        className="relative w-full aspect-video bg-black rounded-md overflow-hidden flex items-center justify-center shadow-2xl group/player select-none"
        onMouseMove={() => {
          setShowControls(true);
          if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
          controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
        }}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Loading Spinner */}
        {loadingStream && (
          <div className="absolute inset-0 z-30 bg-black/90 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#8B5CF6] animate-spin" />
            <p className="text-xs text-[#A3A3A3] font-medium tracking-wide">
              Resolving media stream from archive...
            </p>
          </div>
        )}

        {/* 1. Direct Archive MP4 Stream Player */}
        {!loadingStream && sourceMode === "stream" && stream?.streamUrl && (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={stream.streamUrl}
              className="w-full h-full object-contain bg-black cursor-pointer"
              playsInline
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
            />
          </div>
        )}

        {/* 2. Official Trailer View */}
        {!loadingStream && sourceMode === "trailer" && validTrailer && (
          <div className="relative w-full h-full bg-black">
            <iframe
              src={`${validTrailer}&autoplay=1`}
              title={`${anime.title} - Official Video`}
              className="w-full h-full object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* 3. Official Broadcasters Fallback / Directory */}
        {!loadingStream && (sourceMode === "official" || (!stream?.streamUrl && !validTrailer)) && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#0d0d0d]">
            <div className="max-w-md space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#181818] flex items-center justify-center text-[#8B5CF6] mx-auto">
                <Tv className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-bold text-lg text-white">
                  {stream?.success
                    ? "Official Broadcast Distribution"
                    : "Direct Stream Indexing"}
                </h3>
                <p className="text-xs text-[#A3A3A3] mt-1 leading-relaxed">
                  {stream?.success
                    ? "You may stream the archive video above or access licensed syndication below."
                    : "An uncompressed archive stream for this specific episode is currently being processed. You can watch the official trailer or stream via authorized services."}
                </p>
              </div>

              {validTrailer && (
                <button
                  onClick={() => setSourceMode("trailer")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium text-xs transition cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Watch Official Trailer
                </button>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {officialStreams.length > 0 ? (
                  officialStreams.slice(0, 3).map((s) => (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#181818] hover:bg-[#262626] border border-white/10 text-white font-medium text-xs transition"
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
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#181818] hover:bg-[#262626] border border-white/10 text-white font-medium text-xs transition"
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

      {/* Episode Header & Controls below Player */}
      <div className="mt-4 flex items-center justify-between gap-4 py-2 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8B5CF6] font-semibold">
              Episode {currentEpisodeNum}
            </span>
            {stream?.success && (
              <span className="px-1.5 py-0.2 rounded bg-[#181818] text-[10px] text-[#A3A3A3] border border-white/10">
                Archive Video
              </span>
            )}
          </div>
          <h2 className="font-bold text-base sm:text-lg text-white truncate">
            {currentEpisode.title}
          </h2>
        </div>

        {/* Previous / Next Controls */}
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
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition ${
              hasNext
                ? "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                : "opacity-40 pointer-events-none bg-[#111111] text-[#A3A3A3]"
            }`}
          >
            <span className="hidden sm:inline">Next Episode</span>
            <SkipForward className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
