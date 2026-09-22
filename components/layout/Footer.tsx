import React from "react";
import Link from "next/link";
import { Terminal, Shield, Zap, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#09090B] border-t border-white/5 pt-12 pb-16 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand Column */}
        <div className="md:col-span-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#22D3EE] flex items-center justify-center p-[1px]">
              <div className="w-full h-full bg-[#09090B] rounded-[7px] flex items-center justify-center font-heading font-black text-xs text-[#22D3EE]">
                A
              </div>
            </div>
            <span className="font-heading font-extrabold text-base tracking-wider text-white">
              ANIWAY
            </span>
          </div>
          <p className="text-xs text-[#A1A1AA] leading-relaxed">
            Japanese cyberpunk anime discovery engine & high-performance media matrix powered directly by the real-time Jikan v4 API.
          </p>
          <div className="flex items-center gap-2 pt-2 text-[11px] font-mono text-[#C084FC]">
            <Zap className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>NODE STATUS: 100% OPERATIONAL</span>
          </div>
        </div>

        {/* Catalog Navigation */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Discovery
          </h4>
          <ul className="space-y-1.5 text-xs text-[#A1A1AA]">
            <li>
              <Link href="/anime" className="hover:text-white transition">
                Anime Catalog
              </Link>
            </li>
            <li>
              <Link href="/manga" className="hover:text-white transition">
                Manga Archive
              </Link>
            </li>
            <li>
              <Link href="/seasons" className="hover:text-white transition">
                Seasonal Index
              </Link>
            </li>
            <li>
              <Link href="/schedule" className="hover:text-white transition">
                Weekly Airing Schedule
              </Link>
            </li>
          </ul>
        </div>

        {/* Rankings & Community */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Indexes
          </h4>
          <ul className="space-y-1.5 text-xs text-[#A1A1AA]">
            <li>
              <Link href="/rankings" className="hover:text-white transition">
                Top Rated Anime
              </Link>
            </li>
            <li>
              <Link href="/characters" className="hover:text-white transition">
                Character Database
              </Link>
            </li>
            <li>
              <Link href="/people" className="hover:text-white transition">
                Voice Actors (Seiyuu)
              </Link>
            </li>
            <li>
              <Link href="/watchlist" className="hover:text-white transition">
                Personal Watchlist
              </Link>
            </li>
          </ul>
        </div>

        {/* API Attribution & Legal */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Telemetry & Data
          </h4>
          <p className="text-xs text-[#A1A1AA] leading-relaxed">
            Data provided by Jikan (Unofficial MyAnimeList API). All trademarks, logos, and promotional media belong to their respective creators and production committees.
          </p>
          <a
            href="https://jikan.moe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#22D3EE] hover:underline pt-1"
          >
            <span>Jikan.moe Protocol</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A1A1AA]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span className="font-mono">ANIWAY // SYSTEM V4.1.0</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Space Grotesk & Inter</span>
          <span>•</span>
          <span>Next.js App Router</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-[#22D3EE]" /> No Mock Fabrications
          </span>
        </div>
      </div>
    </footer>
  );
}
