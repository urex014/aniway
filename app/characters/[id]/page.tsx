import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { characterService } from "@/lib/api";
import { Heart, Mic, Film, BookOpen, ArrowLeft } from "lucide-react";

interface CharacterDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CharacterDetailPage({ params }: CharacterDetailPageProps) {
  const { id } = await params;

  const [charRes, animeRes, mangaRes, voicesRes, picturesRes] = await Promise.all([
    characterService.getCharacterFull(id),
    characterService.getCharacterAnime(id),
    characterService.getCharacterManga(id),
    characterService.getCharacterVoices(id),
    characterService.getCharacterPictures(id),
  ]);

  const character = charRes.data;
  if (!character) notFound();

  const animeRoles = animeRes.data || [];
  const mangaRoles = mangaRes.data || [];
  const voiceActors = voicesRes.data || [];
  const pictures = picturesRes.data || [];

  const posterImg = character.images?.webp?.image_url || character.images?.jpg?.image_url || "/placeholder-character.jpg";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen">
      <div className="mb-6">
        <Link
          href="/characters"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#A1A1AA] hover:text-[#22D3EE] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO CHARACTERS</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Portrait */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-4">
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#111116] border border-white/10 shadow-xl">
            <Image
              src={posterImg}
              alt={character.name}
              fill
              priority
              sizes="280px"
              className="object-cover object-top"
            />
          </div>

          <div className="p-4 rounded-xl bg-[#111116] border border-white/5 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[#A1A1AA]">Favorites</span>
              <span className="text-pink-400 font-bold flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-pink-400" />
                {character.favorites.toLocaleString()}
              </span>
            </div>
            {character.nicknames && character.nicknames.length > 0 && (
              <div className="pt-2 border-t border-white/5">
                <span className="text-[#A1A1AA] block mb-1">Aliases:</span>
                <div className="flex flex-wrap gap-1">
                  {character.nicknames.map((n, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-white/5 text-white/80 text-[10px]">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Name, Kanji, Biography, Appearances */}
        <div className="md:col-span-8 lg:col-span-9 space-y-8">
          <div>
            {character.name_kanji && (
              <p className="text-sm font-mono text-[#22D3EE] mb-1">
                {character.name_kanji}
              </p>
            )}
            <h1 className="font-heading font-black text-2xl sm:text-4xl text-white">
              {character.name}
            </h1>
          </div>

          {/* About */}
          {character.about && (
            <div className="p-5 rounded-2xl bg-[#111116] border border-white/5 space-y-2">
              <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                Biography // プロフィール
              </h3>
              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-line">
                {character.about}
              </p>
            </div>
          )}

          {/* Voice Actors (Seiyuu) */}
          {voiceActors.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <Mic className="w-4 h-4 text-[#22D3EE]" />
                <span>Voice Actors // 声優</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {voiceActors.slice(0, 6).map((va, i) => (
                  <Link
                    key={i}
                    href={`/people/${va.person.mal_id}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#111116] hover:bg-[#18181F] border border-white/5 transition group"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#18181F] flex-shrink-0">
                      <Image
                        src={va.person.images.jpg.image_url}
                        alt={va.person.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate group-hover:text-[#22D3EE] transition">
                        {va.person.name}
                      </p>
                      <p className="text-[10px] font-mono text-[#C084FC]">
                        {va.language}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Anime Appearances */}
          {animeRoles.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-[#7C3AED]" />
                <span>Anime Appearances // 出演アニメ</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {animeRoles.slice(0, 9).map((role, i) => (
                  <Link
                    key={i}
                    href={`/anime/${role.anime.mal_id}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#111116] hover:bg-[#18181F] border border-white/5 transition group"
                  >
                    <div className="relative w-12 aspect-[3/4] rounded-md overflow-hidden bg-[#18181F] flex-shrink-0">
                      <Image
                        src={role.anime.images.jpg.image_url}
                        alt={role.anime.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate group-hover:text-[#C084FC] transition">
                        {role.anime.title}
                      </p>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-[#A1A1AA] uppercase">
                        {role.role}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Character Gallery */}
          {pictures.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-base text-white">
                Image Gallery
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {pictures.slice(0, 6).map((pic, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#18181F] border border-white/10"
                  >
                    <Image
                      src={pic.jpg.image_url}
                      alt="Gallery"
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
