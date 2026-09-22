"use client";

import React, { useState, useEffect } from "react";
import {
  getUserPreferences,
  saveUserPreferences,
  UserPreferences,
  getWatchlistIds,
  getContinueWatchingList,
} from "@/lib/storage";
import { User, Settings, ShieldCheck, Volume2, Film, Check, Trash2 } from "lucide-react";

export default function ProfilePage() {
  const [prefs, setPrefs] = useState<UserPreferences>(getUserPreferences());
  const [savedMessage, setSavedMessage] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    setPrefs(getUserPreferences());
    setWatchlistCount(getWatchlistIds().length);
    setHistoryCount(getContinueWatchingList().length);
  }, []);

  const handleUpdate = (updated: Partial<UserPreferences>) => {
    saveUserPreferences(updated);
    setPrefs((prev) => ({ ...prev, ...updated }));
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to reset your local watch history and preferences?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-white/5 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#22D3EE] p-[1px] shadow-[0_0_25px_rgba(124,58,237,0.4)]">
          <div className="w-full h-full bg-[#09090B] rounded-[15px] flex items-center justify-center font-heading font-black text-2xl text-[#22D3EE]">
            7
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#22D3EE] font-bold">
            <ShieldCheck className="w-4 h-4 text-[#22D3EE]" />
            <span>CYBER MATRIX PROFILE // 設定</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white mt-0.5">
            Streaming Configuration
          </h1>
          <p className="text-xs text-[#A1A1AA]">
            Tailor playback telemetry and interface defaults. All settings are encrypted in local sandbox storage.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-[#111116] border border-white/5 space-y-1">
          <span className="text-[11px] font-mono text-[#A1A1AA]">WATCHLIST ITEMS</span>
          <p className="font-heading font-black text-2xl text-white">{watchlistCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-[#111116] border border-white/5 space-y-1">
          <span className="text-[11px] font-mono text-[#A1A1AA]">TRACKED EPISODES</span>
          <p className="font-heading font-black text-2xl text-[#22D3EE]">{historyCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-[#111116] border border-white/5 space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-mono text-[#A1A1AA]">API PROTOCOL</span>
          <p className="font-heading font-bold text-sm text-[#C084FC] truncate">Jikan v4 / MAL</p>
        </div>
      </div>

      {/* Settings form */}
      <div className="space-y-6">
        {/* Audio Track */}
        <div className="p-5 rounded-2xl bg-[#111116] border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-white">
                Default Audio & Subtitle Language
              </h3>
              <p className="text-xs text-[#A1A1AA]">
                Preferred default audio track for compatible anime streams.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => handleUpdate({ audioPreference: "sub" })}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-medium border transition cursor-pointer ${
                prefs.audioPreference === "sub"
                  ? "bg-[#7C3AED] border-[#C084FC] text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]"
                  : "bg-[#18181F] border-white/10 text-[#A1A1AA] hover:text-white"
              }`}
            >
              Japanese (Subtitles)
            </button>
            <button
              onClick={() => handleUpdate({ audioPreference: "dub" })}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-medium border transition cursor-pointer ${
                prefs.audioPreference === "dub"
                  ? "bg-[#7C3AED] border-[#C084FC] text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]"
                  : "bg-[#18181F] border-white/10 text-[#A1A1AA] hover:text-white"
              }`}
            >
              English (Dubbed)
            </button>
          </div>
        </div>

        {/* Autoplay & Skip Intro */}
        <div className="p-5 rounded-2xl bg-[#111116] border border-white/5 space-y-4">
          <h3 className="font-heading font-bold text-sm text-white">
            Playback Automation
          </h3>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <div>
              <span className="text-xs font-semibold text-white block">
                Auto-play Next Episode
              </span>
              <span className="text-xs text-[#A1A1AA]">
                Automatically progress to the subsequent episode when finished.
              </span>
            </div>
            <button
              onClick={() => handleUpdate({ autoPlayNext: !prefs.autoPlayNext })}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                prefs.autoPlayNext ? "bg-[#7C3AED]" : "bg-[#18181F] border border-white/10"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  prefs.autoPlayNext ? "right-1" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-xs font-semibold text-white block">
                Auto-Skip Opening Themes
              </span>
              <span className="text-xs text-[#A1A1AA]">
                Skip 85 seconds forward automatically at episode launch.
              </span>
            </div>
            <button
              onClick={() => handleUpdate({ skipIntro: !prefs.skipIntro })}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                prefs.skipIntro ? "bg-[#7C3AED]" : "bg-[#18181F] border border-white/10"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  prefs.skipIntro ? "right-1" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Reset / Danger Zone */}
        <div className="p-5 rounded-2xl bg-[#18181F]/40 border border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-heading font-bold text-sm text-red-400">
              Clear Storage Matrix
            </h4>
            <p className="text-xs text-[#A1A1AA]">
              Purge all cached history, watchlist items, and telemetry cookies from this device.
            </p>
          </div>
          <button
            onClick={handleClearData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-mono transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Purge Local Storage
          </button>
        </div>
      </div>

      {savedMessage && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7C3AED] text-white text-xs font-mono shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4" />
          <span>PREFERENCES PERSISTED</span>
        </div>
      )}
    </div>
  );
}
