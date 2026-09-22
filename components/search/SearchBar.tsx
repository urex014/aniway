"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Loader2, Star, ArrowRight } from "lucide-react";
import { animeService, Anime } from "@/lib/api";

interface SearchBarProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
  showSuggestions?: boolean;
}

export default function SearchBar({
  initialQuery = "",
  onSearch,
  showSuggestions = true,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced suggestion fetcher
  useEffect(() => {
    if (!showSuggestions || !query.trim() || query.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await animeService.getAnimeSearch({ q: query.trim(), limit: 5 });
        if (res && res.data) {
          setSuggestions(res.data.slice(0, 5));
          setIsOpen(true);
        }
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, showSuggestions]);

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    if (onSearch) {
      onSearch(query.trim());
    } else {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
        <div className="absolute left-3.5 text-[#A1A1AA] pointer-events-none">
          <Search className="w-4 h-4 text-[#A1A1AA]" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder="Search anime, manga, characters, seiyuu..."
          className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#111116] border border-white/10 hover:border-white/20 focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] text-sm text-white placeholder-[#A1A1AA] outline-none transition duration-200"
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {isLoading && <Loader2 className="w-4 h-4 text-[#22D3EE] animate-spin" />}
          {query && !isLoading && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
                setIsOpen(false);
              }}
              className="p-1 rounded-md text-[#A1A1AA] hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Live Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#111116]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-2 border-b border-white/5 flex items-center justify-between text-[11px] font-mono text-[#A1A1AA] px-3">
            <span>SUGGESTED TITLES</span>
            <span>ENTER TO SEARCH ALL</span>
          </div>

          <div className="divide-y divide-white/5">
            {suggestions.map((item) => (
              <Link
                key={item.mal_id}
                href={`/anime/${item.mal_id}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2.5 hover:bg-[#18181F] transition group"
              >
                <div className="relative w-10 h-14 rounded-md overflow-hidden bg-[#18181F] flex-shrink-0">
                  <Image
                    src={
                      item.images?.webp?.small_image_url ||
                      item.images?.jpg?.small_image_url ||
                      item.images?.jpg?.image_url ||
                      "/placeholder-poster.jpg"
                    }
                    alt={item.title}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-medium text-white truncate group-hover:text-[#22D3EE] transition">
                    {item.title_english || item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-[#A1A1AA] mt-0.5">
                    <span>{item.type || "Anime"}</span>
                    <span>•</span>
                    <span>{item.year || (item.aired?.prop?.from?.year ? item.aired.prop.from.year : "")}</span>
                    {item.score && (
                      <span className="flex items-center gap-0.5 text-amber-300 ml-auto font-mono">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {item.score.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="p-2 bg-[#18181F]/70 border-t border-white/5">
            <button
              onClick={handleSubmit}
              className="w-full py-2 flex items-center justify-center gap-1.5 text-xs font-mono font-semibold text-[#C084FC] hover:text-[#22D3EE] transition"
            >
              <span>View all matching results for &ldquo;{query}&rdquo;</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
