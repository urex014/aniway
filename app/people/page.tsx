import React from "react";
import Link from "next/link";
import PersonCard from "@/components/people/PersonCard";
import { peopleService } from "@/lib/api";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";

interface PeoplePageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

export default async function PeoplePage({ searchParams }: PeoplePageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);
  const q = resolvedParams.q || "";

  const res = await peopleService.getPeopleSearch({
    q: q || undefined,
    page,
    limit: 24,
    order_by: "favorites",
    sort: "desc",
  });

  const people = res.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/5 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#22D3EE] uppercase tracking-wider font-bold">
            <Users className="w-4 h-4 text-[#22D3EE]" />
            <span>Voice Talent & Staff Index // 声優・スタッフ</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
            Voice Actors & Creators
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Explore industry voice actors (seiyuu), directors, musical composers, and studio artists.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {people.map((person) => (
          <PersonCard key={person.mal_id} person={person} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-12 pt-6 border-t border-white/5">
        <Link
          href={`/people?page=${Math.max(1, page - 1)}`}
          className={`flex items-center gap-1 px-4 py-2 rounded-xl border text-xs font-mono font-medium transition ${
            page <= 1
              ? "opacity-30 pointer-events-none bg-[#111116] border-white/5 text-[#A1A1AA]"
              : "bg-[#111116] hover:bg-[#18181F] border-white/10 text-white"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          PREVIOUS
        </Link>
        <span className="text-xs font-mono font-bold text-[#C084FC] px-3 py-1 rounded-lg bg-[#18181F] border border-white/10">
          PAGE {page}
        </span>
        <Link
          href={`/people?page=${page + 1}`}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-mono font-medium transition shadow-sm"
        >
          NEXT
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
