import React from "react";
import Link from "next/link";
import Image from "next/image";
import { seasonService, DayOfWeek } from "@/lib/api";
import { Calendar, Clock, Star, Play } from "lucide-react";

interface SchedulePageProps {
  searchParams: Promise<{
    day?: string;
  }>;
}

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const resolvedParams = await searchParams;
  const currentDay = (resolvedParams.day?.toLowerCase() as DayOfWeek) || "monday";

  const days: { label: string; value: DayOfWeek; kanji: string }[] = [
    { label: "Monday", value: "monday", kanji: "月曜日" },
    { label: "Tuesday", value: "tuesday", kanji: "火曜日" },
    { label: "Wednesday", value: "wednesday", kanji: "水曜日" },
    { label: "Thursday", value: "thursday", kanji: "木曜日" },
    { label: "Friday", value: "friday", kanji: "金曜日" },
    { label: "Saturday", value: "saturday", kanji: "土曜日" },
    { label: "Sunday", value: "sunday", kanji: "日曜日" },
  ];

  const res = await seasonService.getSchedules({ filter: currentDay, limit: 25 });
  const scheduledAnime = res.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#22D3EE] uppercase tracking-wider font-bold">
            <Calendar className="w-4 h-4 text-[#22D3EE]" />
            <span>Weekly Airing Transmissions // 放送日程</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
            Weekly Broadcast Schedule
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Real-time Japanese standard broadcast timeline organized by weekly transmission day.
          </p>
        </div>
      </div>

      {/* Day of Week Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-6 w-full max-w-full overscroll-x-contain touch-pan-x">
        {days.map((d) => {
          const isActive = currentDay === d.value;
          return (
            <Link
              key={d.value}
              href={`/schedule?day=${d.value}`}
              className={`flex flex-col items-center justify-center min-w-[110px] py-3 px-4 rounded-xl border transition-all flex-shrink-0 ${
                isActive
                  ? "bg-[#7C3AED] border-[#C084FC] text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                  : "bg-[#111116] hover:bg-[#18181F] border-white/5 text-[#A1A1AA] hover:text-white"
              }`}
            >
              <span className="font-heading font-bold text-sm">{d.label}</span>
              <span className={`text-[11px] font-mono mt-0.5 ${isActive ? "text-[#22D3EE]" : "text-white/40"}`}>
                {d.kanji}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Airing Anime List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        {scheduledAnime.map((anime) => (
          <div
            key={anime.mal_id}
            className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#111116] hover:bg-[#18181F] border border-white/5 hover:border-[#7C3AED]/50 transition group"
          >
            {/* Poster */}
            <Link
              href={`/anime/${anime.mal_id}`}
              className="relative w-16 aspect-[3/4] rounded-lg overflow-hidden bg-[#18181F] flex-shrink-0"
            >
              <Image
                src={anime.images?.webp?.small_image_url || anime.images?.jpg?.small_image_url || "/placeholder-poster.jpg"}
                alt={anime.title}
                fill
                sizes="64px"
                className="object-cover group-hover:scale-105 transition"
              />
            </Link>

            {/* Info */}
            <div className="min-w-0 flex-1 space-y-1">
              <Link
                href={`/anime/${anime.mal_id}`}
                className="font-heading font-bold text-xs sm:text-sm text-white group-hover:text-[#22D3EE] transition line-clamp-1"
              >
                {anime.title_english || anime.title}
              </Link>
              {anime.broadcast?.string && (
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#C084FC]">
                  <Clock className="w-3 h-3 text-[#22D3EE]" />
                  <span className="truncate">{anime.broadcast.string}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-[11px] text-[#A1A1AA]">
                <span>{anime.type || "TV"}</span>
                {anime.score && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-amber-300 font-mono">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {anime.score.toFixed(1)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Action */}
            <Link
              href={`/watch/${anime.mal_id}?ep=1`}
              className="p-2.5 rounded-lg bg-[#18181F] hover:bg-[#7C3AED] text-[#A1A1AA] hover:text-white transition flex-shrink-0"
              title="Watch Episode"
            >
              <Play className="w-4 h-4 fill-current" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
