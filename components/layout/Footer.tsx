import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 pt-16 pb-20 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-xl tracking-tighter text-white">
            ANI<span className="text-[#8B5CF6]">WAY</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs text-[#A3A3A3]">
          <ul className="space-y-2.5">
            <li>
              <Link href="/anime" className="hover:text-white transition">
                All Anime
              </Link>
            </li>
            <li>
              <Link href="/rankings" className="hover:text-white transition">
                Trending & Popular
              </Link>
            </li>
            <li>
              <Link href="/seasons" className="hover:text-white transition">
                Seasonal Releases
              </Link>
            </li>
            <li>
              <Link href="/schedule" className="hover:text-white transition">
                Airing Schedule
              </Link>
            </li>
          </ul>

          <ul className="space-y-2.5">
            <li>
              <Link href="/manga" className="hover:text-white transition">
                Manga Archive
              </Link>
            </li>
            <li>
              <Link href="/characters" className="hover:text-white transition">
                Characters
              </Link>
            </li>
            <li>
              <Link href="/people" className="hover:text-white transition">
                Voice Actors
              </Link>
            </li>
            <li>
              <Link href="/watchlist" className="hover:text-white transition">
                My List
              </Link>
            </li>
          </ul>

          <ul className="space-y-2.5">
            <li>
              <Link href="/profile" className="hover:text-white transition">
                Playback Preferences
              </Link>
            </li>
            <li>
              <Link href="/search" className="hover:text-white transition">
                Global Search
              </Link>
            </li>
            <li>
              <a
                href="https://jikan.moe"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                Jikan v4 Protocol
              </a>
            </li>
            <li>
              <a
                href="https://myanimelist.net"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                MyAnimeList Database
              </a>
            </li>
          </ul>

          <div className="space-y-2">
            <p className="text-[#A3A3A3] leading-relaxed">
              Powered by real-time Jikan v4 API. Built with Next.js App Router and Tailwind CSS.
            </p>
            <p className="text-[11px] text-white/40">
              © {new Date().getFullYear()} ANIWAY. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
