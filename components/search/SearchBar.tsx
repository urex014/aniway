"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Loader2, Star } from "lucide-react";
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

  useEffect(() => {
    if (!showSuggestions || !query.trim() || query.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await animeService.getAnimeSearch({ q: query.trim(), limit: 6 });
        if (res && res.data) {
          setSuggestions(res.data.slice(0, 6));
          setIsOpen(true);
        }
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, showSuggestions]);

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
    <div ref={dropdownRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
        <div className="absolute left-4 text-[#A3A3A3] pointer-events-none">
          <Search className="w-5 h-5 text-[#A3A3A3]" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder="Search by title, character, or studio..."
          className="w-full pl-12 pr-12 py-3.5 rounded-lg bg-[#111111] border border-white/10 hover:border-white/20 focus:border-[#8B5CF6] text-sm text-white placeholder-[#A3A3A3] outline-none transition duration-200"
        />

        <div className="absolute right-4 flex items-center gap-2">
          {isLoading && <Loader2 className="w-4 h-4 text-[#8B5CF6] animate-spin" />}
          {query && !isLoading && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
                setIsOpen(false);
              }}
              className="p-1 rounded text-[#A3A3A3] hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Netflix Live Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#181818] border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50">
          <div className="divide-y divide-white/5">
            {suggestions.map((item) => (
              <Link
                key={item.mal_id}
                href={`/anime/${item.mal_id}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3.5 p-3 hover:bg-[#262626] transition group"
              >
                <div className="relative w-11 aspect-[2/3] rounded overflow-hidden bg-[#111111] flex-shrink-0">
                  <Image
                    src={
                      item.images?.webp?.small_image_url ||
                      item.images?.jpg?.small_image_url ||
                      "/placeholder-poster.jpg"
                    }
                    alt={item.title}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate group-hover:text-[#8B5CF6] transition">
                    {item.title_english || item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-[#A3A3A3] mt-0.5">
                    <span>{item.type || "TV"}</span>
                    <span>•</span>
                    <span>{item.year || (item.aired?.prop?.from?.year ?? "")}</span>
                    {item.score && (
                      <span className="flex items-center gap-1 text-white font-medium ml-auto">
                        <Star className="w-3 h-3 fill-[#8B5CF6] text-[#8B5CF6]" />
                        {item.score.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="p-2.5 bg-[#111111] text-center border-t border-white/5">
            <button
              onClick={handleSubmit}
              className="text-xs font-semibold text-[#8B5CF6] hover:text-white transition cursor-pointer"
            >
              See all results for &ldquo;{query}&rdquo;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
