"use client";

export interface WatchProgressItem {
  animeId: number;
  animeTitle: string;
  posterUrl?: string;
  episode: number;
  episodeTitle?: string;
  progressSeconds: number;
  durationSeconds: number;
  updatedAt: number;
}

export interface UserPreferences {
  audioPreference: "sub" | "dub";
  autoPlayNext: boolean;
  skipIntro: boolean;
  defaultQuality: "1080p" | "720p" | "480p" | "auto";
  volume: number;
}

const STORAGE_KEYS = {
  WATCHLIST: "aniway_watchlist_v1",
  WATCH_PROGRESS: "aniway_watch_progress_v1",
  PREFERENCES: "aniway_user_preferences_v1",
};

// Safe window access helper
function isBrowser(): boolean {
  return typeof window !== "undefined";
}

// Event dispatcher for reactive synchronization across components
function notifyStorageChange(key: string) {
  if (isBrowser()) {
    window.dispatchEvent(new CustomEvent("aniway_storage_update", { detail: { key } }));
  }
}

// Watchlist
export function getWatchlistIds(): number[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleWatchlistId(id: number): boolean {
  if (!isBrowser()) return false;
  const current = getWatchlistIds();
  const index = current.indexOf(id);
  let isAdded = false;

  if (index >= 0) {
    current.splice(index, 1);
    isAdded = false;
  } else {
    current.unshift(id);
    isAdded = true;
  }

  localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(current));
  notifyStorageChange(STORAGE_KEYS.WATCHLIST);
  return isAdded;
}

export function isAnimeInWatchlist(id: number): boolean {
  if (!isBrowser()) return false;
  return getWatchlistIds().includes(id);
}

// Continue Watching / Progress
export function getContinueWatchingList(): WatchProgressItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WATCH_PROGRESS);
    const list: WatchProgressItem[] = raw ? JSON.parse(raw) : [];
    return list.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export function saveEpisodeProgress(item: Omit<WatchProgressItem, "updatedAt">): void {
  if (!isBrowser()) return;
  const list = getContinueWatchingList();
  const existingIndex = list.findIndex((i) => i.animeId === item.animeId);

  const newItem: WatchProgressItem = {
    ...item,
    updatedAt: Date.now(),
  };

  if (existingIndex >= 0) {
    list[existingIndex] = newItem;
  } else {
    list.unshift(newItem);
  }

  // Cap at 30 items
  const trimmed = list.slice(0, 30);
  localStorage.setItem(STORAGE_KEYS.WATCH_PROGRESS, JSON.stringify(trimmed));
  notifyStorageChange(STORAGE_KEYS.WATCH_PROGRESS);
}

export function getAnimeEpisodeProgress(animeId: number): WatchProgressItem | undefined {
  if (!isBrowser()) return undefined;
  const list = getContinueWatchingList();
  return list.find((i) => i.animeId === animeId);
}

// User Preferences
export function getUserPreferences(): UserPreferences {
  const defaults: UserPreferences = {
    audioPreference: "sub",
    autoPlayNext: true,
    skipIntro: false,
    defaultQuality: "1080p",
    volume: 0.8,
  };

  if (!isBrowser()) return defaults;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return defaults;
  }
}

export function saveUserPreferences(prefs: Partial<UserPreferences>): void {
  if (!isBrowser()) return;
  const current = getUserPreferences();
  const updated = { ...current, ...prefs };
  localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
  notifyStorageChange(STORAGE_KEYS.PREFERENCES);
}
