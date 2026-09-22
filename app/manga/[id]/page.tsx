import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { mangaService } from "@/lib/api";
import { Star, BookOpen, User, Calendar, ExternalLink, ArrowLeft } from "lucide-react";

interface MangaDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: MangaDetailPageProps) {
  const { id } = await params;
  try {
    const res = await mangaService.getMangaById(id);
    const m = res.data;
    if (!m) return { title: "Manga Details // ANIWAY" };
    return { title: `${m.title_english || m.title} — Manga — ANIWAY` };
  } catch {
    return { title: "Manga Details // ANIWAY" };
  }
}

export default async function MangaDetailPage({ params }: MangaDetailPageProps) {
  const { id } = await params;
  const res = await mangaService.getMangaFull(id);
  const manga = res.data;

  if (!manga) notFound();

  const displayTitle = manga.title_english || manga.title;
  const posterImg = manga.images?.webp?.large_image_url || manga.images?.jpg?.large_image_url || "/placeholder-poster.jpg";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen">
      <div className="mb-6">
        <Link
          href="/manga"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#A1A1AA] hover:text-[#22D3EE] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO MANGA ARCHIVE</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Poster */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-4">
          <div className="relative aspect-[3/4.2] w-full rounded-2xl overflow-hidden bg-[#111116] border border-white/10 shadow-xl">
            <Image
              src={posterImg}
              alt={displayTitle}
              fill
              priority
              sizes="280px"
              className="object-cover"
            />
          </div>

          <div className="p-4 rounded-xl bg-[#111116] border border-white/5 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-[#A1A1AA]">Type</span>
              <span className="text-white font-mono uppercase">{manga.type || "Manga"}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-[#A1A1AA]">Status</span>
              <span className="text-[#22D3EE] font-mono">{manga.status}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-[#A1A1AA]">Chapters</span>
              <span className="text-white font-mono">{manga.chapters || "Unknown"}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-[#A1A1AA]">Volumes</span>
              <span className="text-white font-mono">{manga.volumes || "Unknown"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#A1A1AA]">Author</span>
              <span className="text-[#C084FC] font-mono truncate max-w-[130px]">
                {manga.authors && manga.authors[0] ? manga.authors[0].name : "Unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Information */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          <div>
            {manga.title_japanese && (
              <p className="text-sm font-mono text-[#22D3EE] mb-1">
                {manga.title_japanese}
              </p>
            )}
            <h1 className="font-heading font-black text-2xl sm:text-4xl text-white">
              {displayTitle}
            </h1>

            <div className="flex items-center gap-2 flex-wrap pt-3 text-xs font-mono">
              {manga.score && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{manga.score.toFixed(2)}</span>
                </div>
              )}
              {manga.rank && (
                <span className="px-2.5 py-1 rounded-lg bg-[#18181F] border border-white/10 text-[#C084FC]">
                  RANK #{manga.rank}
                </span>
              )}
              {manga.popularity && (
                <span className="px-2.5 py-1 rounded-lg bg-[#18181F] border border-white/10 text-white">
                  POPULARITY #{manga.popularity}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap pt-3">
              {manga.genres?.map((g) => (
                <span
                  key={g.mal_id}
                  className="px-2.5 py-1 rounded-md bg-[#18181F] text-xs font-mono text-white/90 border border-white/5"
                >
                  {g.name}
                </span>
              ))}
            </div>
          </div>

          {/* Synopsis */}
          {manga.synopsis && (
            <div className="p-5 rounded-2xl bg-[#111116] border border-white/5 space-y-2">
              <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                Synopsis // あらすじ
              </h3>
              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-line">
                {manga.synopsis}
              </p>
            </div>
          )}

          {/* External MAL resource */}
          <div className="flex items-center gap-3">
            <a
              href={manga.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#18181F] hover:bg-white/10 border border-white/10 text-xs font-mono text-white transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>View on MyAnimeList</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
