import { fetchJikan } from "./client";
import { JikanResponse, Anime } from "./types";
import { FALLBACK_ANIME } from "./fallbacks";

export interface GlobalRecommendation {
  mal_id: string;
  entry: [
    {
      mal_id: number;
      url: string;
      images: Anime["images"];
      title: string;
    },
    {
      mal_id: number;
      url: string;
      images: Anime["images"];
      title: string;
    }
  ];
  content: string;
  user: {
    url: string;
    username: string;
  };
}

export const recommendationService = {
  /**
   * Recent Community Anime Recommendations
   * GET /recommendations/anime
   */
  async getRecentAnimeRecommendations(page = 1): Promise<JikanResponse<GlobalRecommendation[]>> {
    try {
      const res = await fetchJikan<JikanResponse<GlobalRecommendation[]>>("/recommendations/anime", { page });
      if (res && res.data && res.data.length > 0) return res;
      throw new Error("No recommendations");
    } catch {
      const recs: GlobalRecommendation[] = [
        {
          mal_id: "52991-5114",
          entry: [
            {
              mal_id: FALLBACK_ANIME[0].mal_id,
              url: FALLBACK_ANIME[0].url,
              images: FALLBACK_ANIME[0].images,
              title: FALLBACK_ANIME[0].title,
            },
            {
              mal_id: FALLBACK_ANIME[2].mal_id,
              url: FALLBACK_ANIME[2].url,
              images: FALLBACK_ANIME[2].images,
              title: FALLBACK_ANIME[2].title,
            },
          ],
          content: "Both stories masterfully explore deep emotional themes of mortality, the passage of time, and the weight of promises made to fallen comrades.",
          user: { url: "", username: "CyberOtaku" },
        },
      ];
      return { data: recs, pagination: { current_page: 1, has_next_page: false, last_visible_page: 1 } };
    }
  },

  /**
   * Recent Community Manga Recommendations
   * GET /recommendations/manga
   */
  async getRecentMangaRecommendations(page = 1): Promise<JikanResponse<GlobalRecommendation[]>> {
    try {
      return await fetchJikan<JikanResponse<GlobalRecommendation[]>>("/recommendations/manga", { page });
    } catch {
      return { data: [], pagination: { current_page: 1, has_next_page: false, last_visible_page: 1 } };
    }
  },
};
