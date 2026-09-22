import { fetchJikan } from "./client";
import { Genre, JikanResponse } from "./types";
import { FALLBACK_GENRES } from "./fallbacks";

export const genreService = {
  /**
   * Anime Genres List
   * GET /genres/anime
   */
  async getAnimeGenres(filter?: "genres" | "explicit_genres" | "themes" | "demographics"): Promise<JikanResponse<Genre[]>> {
    try {
      const res = await fetchJikan<JikanResponse<Genre[]>>("/genres/anime", { filter });
      if (res && res.data && res.data.length > 0) return res;
      throw new Error("No anime genres");
    } catch {
      return { data: FALLBACK_GENRES };
    }
  },

  /**
   * Manga Genres List
   * GET /genres/manga
   */
  async getMangaGenres(filter?: "genres" | "explicit_genres" | "themes" | "demographics"): Promise<JikanResponse<Genre[]>> {
    try {
      const res = await fetchJikan<JikanResponse<Genre[]>>("/genres/manga", { filter });
      if (res && res.data && res.data.length > 0) return res;
      throw new Error("No manga genres");
    } catch {
      return { data: FALLBACK_GENRES };
    }
  },
};
