import { fetchJikan } from "./client";
import { Anime, SeasonInfo, JikanResponse } from "./types";
import { FALLBACK_ANIME } from "./fallbacks";

export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export const seasonService = {
  /**
   * Seasons archive list
   * GET /seasons
   */
  async getSeasonsList(): Promise<JikanResponse<SeasonInfo[]>> {
    try {
      return await fetchJikan<JikanResponse<SeasonInfo[]>>("/seasons");
    } catch {
      return {
        data: [
          { year: 2026, seasons: ["winter", "spring", "summer", "fall"] },
          { year: 2025, seasons: ["winter", "spring", "summer", "fall"] },
          { year: 2024, seasons: ["winter", "spring", "summer", "fall"] },
          { year: 2023, seasons: ["winter", "spring", "summer", "fall"] },
        ],
      };
    }
  },

  /**
   * Specific year & season anime
   * GET /seasons/{year}/{season}
   */
  async getSeason(year: number, season: "winter" | "spring" | "summer" | "fall" | string, params?: { page?: number; limit?: number }): Promise<JikanResponse<Anime[]>> {
    try {
      const res = await fetchJikan<JikanResponse<Anime[]>>(`/seasons/${year}/${season}`, params as Record<string, number | undefined>);
      if (res && res.data && res.data.length > 0) return res;
      throw new Error("No seasonal anime");
    } catch {
      return {
        data: FALLBACK_ANIME,
        pagination: { current_page: 1, has_next_page: false, last_visible_page: 1 },
      };
    }
  },

  /**
   * Currently Airing Season
   * GET /seasons/now
   */
  async getSeasonNow(params?: { page?: number; limit?: number; filter?: string }): Promise<JikanResponse<Anime[]>> {
    try {
      const res = await fetchJikan<JikanResponse<Anime[]>>("/seasons/now", params as Record<string, string | number | undefined>);
      if (res && res.data && res.data.length > 0) return res;
      throw new Error("No currently airing anime");
    } catch {
      const airing = FALLBACK_ANIME.filter((a) => a.airing || a.status.toLowerCase().includes("airing"));
      return {
        data: airing.length > 0 ? airing : FALLBACK_ANIME.slice(0, 4),
        pagination: { current_page: 1, has_next_page: false, last_visible_page: 1 },
      };
    }
  },

  /**
   * Upcoming Season Anime
   * GET /seasons/upcoming
   */
  async getSeasonUpcoming(params?: { page?: number; limit?: number; filter?: string }): Promise<JikanResponse<Anime[]>> {
    try {
      const res = await fetchJikan<JikanResponse<Anime[]>>("/seasons/upcoming", params as Record<string, string | number | undefined>);
      if (res && res.data && res.data.length > 0) return res;
      throw new Error("No upcoming anime");
    } catch {
      return {
        data: FALLBACK_ANIME.slice(0, 4),
        pagination: { current_page: 1, has_next_page: false, last_visible_page: 1 },
      };
    }
  },

  /**
   * Weekly Airing Schedule
   * GET /schedules
   */
  async getSchedules(params?: { filter?: DayOfWeek | string; page?: number; limit?: number; sfw?: boolean }): Promise<JikanResponse<Anime[]>> {
    try {
      const res = await fetchJikan<JikanResponse<Anime[]>>("/schedules", params as Record<string, string | number | boolean | undefined>);
      if (res && res.data && res.data.length > 0) return res;
      throw new Error("No schedule data");
    } catch {
      return {
        data: FALLBACK_ANIME,
        pagination: { current_page: 1, has_next_page: false, last_visible_page: 1 },
      };
    }
  },
};
