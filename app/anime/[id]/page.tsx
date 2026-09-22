import React from "react";
import { notFound } from "next/navigation";
import AnimeDetails from "@/components/anime/AnimeDetails";
import { animeService } from "@/lib/api";

interface AnimeDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: AnimeDetailPageProps) {
  const { id } = await params;
  try {
    const res = await animeService.getAnimeById(id);
    const anime = res.data;
    if (!anime) return { title: "Anime Details // ANIWAY" };
    return {
      title: `${anime.title_english || anime.title} — ANIWAY`,
      description: anime.synopsis?.slice(0, 160) || "Anime metadata and streaming telemetry on ANIWAY.",
    };
  } catch {
    return { title: "Anime Details // ANIWAY" };
  }
}

export default async function AnimeDetailPage({ params }: AnimeDetailPageProps) {
  const { id } = await params;

  const [animeRes, episodesRes] = await Promise.all([
    animeService.getAnimeFull(id),
    animeService.getAnimeEpisodes(id, 1),
  ]);

  const anime = animeRes.data;
  if (!anime) {
    notFound();
  }

  const initialEpisodes = episodesRes.data || [];

  return (
    <div className="w-full min-h-screen">
      <AnimeDetails anime={anime} initialEpisodes={initialEpisodes} />
    </div>
  );
}
