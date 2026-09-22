import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { peopleService } from "@/lib/api";
import { Mic, Film, Heart, Calendar, ArrowLeft, ExternalLink } from "lucide-react";

interface PersonDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PersonDetailPage({ params }: PersonDetailPageProps) {
  const { id } = await params;

  const [personRes, animeRes, voicesRes, picturesRes] = await Promise.all([
    peopleService.getPersonFull(id),
    peopleService.getPersonAnime(id),
    peopleService.getPersonVoices(id),
    peopleService.getPersonPictures(id),
  ]);

  const person = personRes.data;
  if (!person) notFound();

  const animePositions = animeRes.data || [];
  const voiceRoles = voicesRes.data || [];
  const pictures = picturesRes.data || [];

  const posterImg = person.images?.jpg?.image_url || "/placeholder-person.jpg";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen">
      <div className="mb-6">
        <Link
          href="/people"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#A1A1AA] hover:text-[#22D3EE] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO VOICE TALENT</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-4">
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#111116] border border-white/10 shadow-xl">
            <Image
              src={posterImg}
              alt={person.name}
              fill
              priority
              sizes="280px"
              className="object-cover object-top"
            />
          </div>

          <div className="p-4 rounded-xl bg-[#111116] border border-white/5 space-y-2 text-xs font-mono">
            {person.favorites !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-[#A1A1AA]">Favorites</span>
                <span className="text-pink-400 font-bold flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-pink-400" />
                  {person.favorites.toLocaleString()}
                </span>
              </div>
            )}
            {person.birthday && (
              <div className="flex items-center justify-between pt-1 border-t border-white/5">
                <span className="text-[#A1A1AA]">Birthday</span>
                <span className="text-white">
                  {new Date(person.birthday).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
            {person.website_url && (
              <div className="pt-2 border-t border-white/5">
                <a
                  href={person.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#22D3EE] hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Official Website</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-8 lg:col-span-9 space-y-8">
          <div>
            {person.given_name && person.family_name && (
              <p className="text-sm font-mono text-[#22D3EE] mb-1">
                {person.family_name} {person.given_name}
              </p>
            )}
            <h1 className="font-heading font-black text-2xl sm:text-4xl text-white">
              {person.name}
            </h1>
          </div>

          {person.about && (
            <div className="p-5 rounded-2xl bg-[#111116] border border-white/5 space-y-2">
              <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                Biography // 経歴
              </h3>
              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-line">
                {person.about}
              </p>
            </div>
          )}

          {/* Voice Acting Roles */}
          {voiceRoles.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <Mic className="w-4 h-4 text-[#22D3EE]" />
                <span>Voice Acting Roles // 出演作品</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {voiceRoles.slice(0, 9).map((vr, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#111116] border border-white/5"
                  >
                    <div className="relative w-12 aspect-[3/4] rounded-md overflow-hidden bg-[#18181F] flex-shrink-0">
                      <Image
                        src={vr.anime.images.jpg.image_url}
                        alt={vr.anime.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/anime/${vr.anime.mal_id}`}
                        className="text-xs font-semibold text-white truncate block hover:text-[#22D3EE] transition"
                      >
                        {vr.anime.title}
                      </Link>
                      <p className="text-[11px] font-medium text-[#C084FC] truncate">
                        as {vr.character.name}
                      </p>
                      <span className="text-[9px] font-mono text-[#A1A1AA] uppercase">
                        {vr.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {pictures.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-base text-white">
                Photos & Portraits
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {pictures.slice(0, 6).map((pic, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#18181F] border border-white/10"
                  >
                    <Image
                      src={pic.jpg.image_url}
                      alt="Photo"
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
