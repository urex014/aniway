import React from "react";
import Link from "next/link";
import MangaCard from "@/components/manga/MangaCard";
import { mangaService, genreService } from "@/lib/api";
import { EmptyState } from "@/components/shared/EmptyState";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

interface MangaPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    type?: string;
    status?: string;
    order_by?: string;
  }>;
}

export default async function MangaCatalogPage({ searchParams }: MangaPageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);
  const q = resolvedParams.q || "";
  const type = resolvedParams.type || "";
  const status = resolvedParams.status || "";
  const orderBy = resolvedParams.order_by || "score";

  const res = await mangaService.getMangaSearch({
    q: q || undefined,
    page,
    limit: 24,
    type: type || undefined,
    status: status || undefined,
    order_by: (orderBy as any) || undefined,
    sort: "desc",
  });

  const mangaList = res.data || [];
  const pagination = res.pagination;

  const types = ["manga", "novel", "lightnovel", "manhwa", "manhua"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#22D3EE] uppercase tracking-wider font-bold">
            <BookOpen className="w-4 h-4 text-[#22D3EE]" />
            <span>Literature Archives // マンガ</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
            Manga & Light Novels
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Explore the literary origins of premier animated adaptations.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
          <span className="text-[#A1A1AA]">TYPE:</span>
          {types.map((t) => {
            const isActive = type === t;
            return (
              <Link
                key={t}
                href={`/manga?type=${isActive ? "" : t}`}
                className={`px-2.5 py-1 rounded-lg uppercase transition ${
                  isActive
                    ? "bg-[#22D3EE]/20 border border-[#22D3EE] text-[#22D3EE] font-bold"
                    : "bg-[#111116] text-[#A1A1AA] hover:text-white border border-white/5"
                }`}
              >
                {t}
              </Link>
            );
          })}
        </div>
      </div>

      {mangaList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 mt-6">
          {mangaList.map((manga) => (
            <MangaCard key={manga.mal_id} manga={manga} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Manga Records Located"
          description="Try broadening your filter criteria."
          actionText="Reset Filter"
          actionHref="/manga"
        />
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-12 pt-6 border-t border-white/5">
        <Link
          href={`/manga?${new URLSearchParams({ ...resolvedParams, page: String(Math.max(1, page - 1)) }).toString()}`}
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
          href={`/manga?${new URLSearchParams({ ...resolvedParams, page: String(page + 1) }).toString()}`}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-mono font-medium transition shadow-sm"
        >
          NEXT
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
