import { fetchJikan } from "./client";
import { Anime, Manga, Character, Person, ReviewItem, JikanResponse } from "./types";
import { FALLBACK_ANIME } from "./fallbacks";

export interface TopFilterParams {
  type?: string;
  filter?: "airing" | "upcoming" | "bypopularity" | "favorite";
  page?: number;
  limit?: number;
}

export const rankingService = {
  /**
   * Top Ranked Anime
   * GET /top/anime
   */
  async getTopAnime(params?: TopFilterParams): Promise<JikanResponse<Anime[]>> {
    try {
      const res = await fetchJikan<JikanResponse<Anime[]>>("/top/anime", params as Record<string, string | number | undefined>);
      if (res && res.data && res.data.length > 0) return res;
      throw new Error("No top anime");
    } catch {
      let list = [...FALLBACK_ANIME];
      if (params?.filter === "bypopularity") {
        list.sort((a, b) => (a.popularity || 999) - (b.popularity || 999));
      } else {
        list.sort((a, b) => (b.score || 0) - (a.score || 0));
      }
      return {
        data: list,
        pagination: { current_page: 1, has_next_page: false, last_visible_page: 1 },
      };
    }
  },

  /**
   * Top Ranked Manga
   * GET /top/manga
   */
  async getTopManga(params?: TopFilterParams): Promise<JikanResponse<Manga[]>> {
    try {
      return await fetchJikan<JikanResponse<Manga[]>>("/top/manga", params as Record<string, string | number | undefined>);
    } catch {
      return {
        data: [],
        pagination: { current_page: 1, has_next_page: false, last_visible_page: 1 },
      };
    }
  },

  /**
   * Top Characters
   * GET /top/characters
   */
  async getTopCharacters(params?: { page?: number; limit?: number }): Promise<JikanResponse<Character[]>> {
    try {
      return await fetchJikan<JikanResponse<Character[]>>("/top/characters", params as Record<string, number | undefined>);
    } catch {
      return {
        data: [],
        pagination: { current_page: 1, has_next_page: false, last_visible_page: 1 },
      };
    }
  },

  /**
   * Top People / Voice Actors
   * GET /top/people
   */
  async getTopPeople(params?: { page?: number; limit?: number }): Promise<JikanResponse<Person[]>> {
    try {
      return await fetchJikan<JikanResponse<Person[]>>("/top/people", params as Record<string, number | undefined>);
    } catch {
      return {
        data: [],
        pagination: { current_page: 1, has_next_page: false, last_visible_page: 1 },
      };
    }
  },

  /**
   * Top Community Reviews
   * GET /top/reviews
   */
  async getTopReviews(params?: { page?: number }): Promise<JikanResponse<ReviewItem[]>> {
    try {
      return await fetchJikan<JikanResponse<ReviewItem[]>>("/top/reviews", params as Record<string, number | undefined>);
    } catch {
      return {
        data: [],
        pagination: { current_page: 1, has_next_page: false, last_visible_page: 1 },
      };
    }
  },
};
