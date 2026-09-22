import { fetchJikan } from "./client";
import {
  Anime,
  Episode,
  EpisodeDetail,
  CharacterItem,
  StaffItem,
  AnimePicture,
  AnimeStatistics,
  RecommendationItem,
  RelationItem,
  AnimeThemes,
  NewsItem,
  ReviewItem,
  ExternalLink,
  VideoData,
  PlayableEpisodeSource,
  JikanResponse,
} from "./types";
import { FALLBACK_ANIME } from "./fallbacks";

export interface AnimeSearchParams {
  q?: string;
  page?: number;
  limit?: number;
  type?: "tv" | "movie" | "ova" | "special" | "ona" | "music" | string;
  score?: number;
  min_score?: number;
  max_score?: number;
  status?: "airing" | "complete" | "upcoming" | string;
  rating?: "g" | "pg" | "pg13" | "r17" | "r" | "rx" | string;
  sfw?: boolean;
  genres?: string;
  genres_exclude?: string;
  order_by?: "mal_id" | "title" | "type" | "rating" | "start_date" | "end_date" | "episodes" | "score" | "scored_by" | "rank" | "popularity" | "members" | "favorites";
  sort?: "desc" | "asc";
  letter?: string;
}

export const animeService = {
  /**
   * Search anime catalog with comprehensive filtering & pagination
   * GET /anime
   */
  async getAnimeSearch(params?: AnimeSearchParams): Promise<JikanResponse<Anime[]>> {
    try {
      const response = await fetchJikan<JikanResponse<Anime[]>>("/anime", params as Record<string, string | number | boolean | undefined>);
      if (response && response.data && response.data.length > 0) {
        return response;
      }
      throw new Error("No data returned");
    } catch {
      // Resilient fallback query
      let filtered = [...FALLBACK_ANIME];
      if (params?.q) {
        const query = params.q.toLowerCase();
        filtered = filtered.filter(
          (a) =>
            a.title.toLowerCase().includes(query) ||
            (a.title_english && a.title_english.toLowerCase().includes(query)) ||
            (a.title_japanese && a.title_japanese.includes(query))
        );
      }
      if (params?.status) {
        filtered = filtered.filter((a) => a.status.toLowerCase().includes(params.status!.toLowerCase()));
      }
      return {
        data: filtered,
        pagination: {
          current_page: params?.page || 1,
          has_next_page: false,
          last_visible_page: 1,
          items: { count: filtered.length, total: filtered.length, per_page: params?.limit || 25 },
        },
      };
    }
  },

  /**
   * Main anime details
   * GET /anime/{id}
   */
  async getAnimeById(id: number | string): Promise<JikanResponse<Anime>> {
    try {
      return await fetchJikan<JikanResponse<Anime>>(`/anime/${id}`);
    } catch {
      const found = FALLBACK_ANIME.find((a) => a.mal_id === Number(id)) || FALLBACK_ANIME[0];
      return { data: found };
    }
  },

  /**
   * Expanded anime information (synopsis, studios, relations, etc.)
   * GET /anime/{id}/full
   */
  async getAnimeFull(id: number | string): Promise<JikanResponse<Anime>> {
    try {
      return await fetchJikan<JikanResponse<Anime>>(`/anime/${id}/full`);
    } catch {
      const found = FALLBACK_ANIME.find((a) => a.mal_id === Number(id)) || FALLBACK_ANIME[0];
      return { data: found };
    }
  },

  /**
   * Complete episode list with pagination
   * GET /anime/{id}/episodes
   */
  async getAnimeEpisodes(id: number | string, page = 1): Promise<JikanResponse<Episode[]>> {
    try {
      return await fetchJikan<JikanResponse<Episode[]>>(`/anime/${id}/episodes`, { page });
    } catch {
      const found = FALLBACK_ANIME.find((a) => a.mal_id === Number(id)) || FALLBACK_ANIME[0];
      const count = found.episodes || 12;
      const episodes: Episode[] = Array.from({ length: Math.min(count, 50) }, (_, i) => ({
        mal_id: i + 1,
        title: `Episode ${i + 1}`,
        title_japanese: `第${i + 1}話`,
        aired: found.aired?.string || "Aired",
        score: found.score,
        filler: false,
        recap: false,
      }));
      return {
        data: episodes,
        pagination: { current_page: 1, has_next_page: false, last_visible_page: 1 },
      };
    }
  },

  /**
   * Single episode detail
   * GET /anime/{id}/episodes/{episode}
   */
  async getAnimeEpisodeById(id: number | string, episode: number | string): Promise<JikanResponse<EpisodeDetail>> {
    try {
      return await fetchJikan<JikanResponse<EpisodeDetail>>(`/anime/${id}/episodes/${episode}`);
    } catch {
      return {
        data: {
          mal_id: Number(episode),
          title: `Episode ${episode}`,
          title_japanese: `第${episode}話`,
          duration: 1440,
          synopsis: "Official synopsis for this episode will stream once synchronized with broadcaster archives.",
        },
      };
    }
  },

  /**
   * Characters & Voice Actors
   * GET /anime/{id}/characters
   */
  async getAnimeCharacters(id: number | string): Promise<JikanResponse<CharacterItem[]>> {
    try {
      return await fetchJikan<JikanResponse<CharacterItem[]>>(`/anime/${id}/characters`);
    } catch {
      return { data: [] };
    }
  },

  /**
   * Staff & Production Crew
   * GET /anime/{id}/staff
   */
  async getAnimeStaff(id: number | string): Promise<JikanResponse<StaffItem[]>> {
    try {
      return await fetchJikan<JikanResponse<StaffItem[]>>(`/anime/${id}/staff`);
    } catch {
      return { data: [] };
    }
  },

  /**
   * Official Pictures & Gallery
   * GET /anime/{id}/pictures
   */
  async getAnimePictures(id: number | string): Promise<JikanResponse<AnimePicture[]>> {
    try {
      return await fetchJikan<JikanResponse<AnimePicture[]>>(`/anime/${id}/pictures`);
    } catch {
      const found = FALLBACK_ANIME.find((a) => a.mal_id === Number(id)) || FALLBACK_ANIME[0];
      return { data: [{ jpg: found.images.jpg, webp: found.images.webp }] };
    }
  },

  /**
   * List & Score Statistics
   * GET /anime/{id}/statistics
   */
  async getAnimeStatistics(id: number | string): Promise<JikanResponse<AnimeStatistics>> {
    try {
      return await fetchJikan<JikanResponse<AnimeStatistics>>(`/anime/${id}/statistics`);
    } catch {
      return {
        data: {
          watching: 120400,
          completed: 450000,
          on_hold: 24000,
          dropped: 12000,
          plan_to_watch: 210000,
          total: 816400,
        },
      };
    }
  },

  /**
   * User recommendations
   * GET /anime/{id}/recommendations
   */
  async getAnimeRecommendations(id: number | string): Promise<JikanResponse<RecommendationItem[]>> {
    try {
      return await fetchJikan<JikanResponse<RecommendationItem[]>>(`/anime/${id}/recommendations`);
    } catch {
      const other = FALLBACK_ANIME.filter((a) => a.mal_id !== Number(id)).slice(0, 4);
      return {
        data: other.map((a) => ({
          entry: { mal_id: a.mal_id, url: a.url, images: a.images, title: a.title },
          votes: 180,
        })),
      };
    }
  },

  /**
   * Relations (prequels, sequels, spinoffs, etc.)
   * GET /anime/{id}/relations
   */
  async getAnimeRelations(id: number | string): Promise<JikanResponse<RelationItem[]>> {
    try {
      return await fetchJikan<JikanResponse<RelationItem[]>>(`/anime/${id}/relations`);
    } catch {
      return { data: [] };
    }
  },

  /**
   * OP & ED Themes
   * GET /anime/{id}/themes
   */
  async getAnimeThemes(id: number | string): Promise<JikanResponse<AnimeThemes>> {
    try {
      return await fetchJikan<JikanResponse<AnimeThemes>>(`/anime/${id}/themes`);
    } catch {
      return { data: { openings: [], endings: [] } };
    }
  },

  /**
   * Anime news updates
   * GET /anime/{id}/news
   */
  async getAnimeNews(id: number | string, page = 1): Promise<JikanResponse<NewsItem[]>> {
    try {
      return await fetchJikan<JikanResponse<NewsItem[]>>(`/anime/${id}/news`, { page });
    } catch {
      return { data: [] };
    }
  },

  /**
   * Community reviews
   * GET /anime/{id}/reviews
   */
  async getAnimeReviews(id: number | string, page = 1): Promise<JikanResponse<ReviewItem[]>> {
    try {
      return await fetchJikan<JikanResponse<ReviewItem[]>>(`/anime/${id}/reviews`, { page });
    } catch {
      return { data: [] };
    }
  },

  /**
   * External official streaming links & databases
   * GET /anime/{id}/external
   */
  async getAnimeExternal(id: number | string): Promise<JikanResponse<ExternalLink[]>> {
    try {
      return await fetchJikan<JikanResponse<ExternalLink[]>>(`/anime/${id}/external`);
    } catch {
      return {
        data: [
          { name: "Official Site", url: "https://myanimelist.net" },
          { name: "Crunchyroll", url: "https://www.crunchyroll.com" },
        ],
      };
    }
  },

  /**
   * Promotional Videos & Trailers
   * GET /anime/{id}/videos
   */
  async getAnimeVideos(id: number | string): Promise<JikanResponse<VideoData>> {
    try {
      return await fetchJikan<JikanResponse<VideoData>>(`/anime/${id}/videos`);
    } catch {
      const found = FALLBACK_ANIME.find((a) => a.mal_id === Number(id)) || FALLBACK_ANIME[0];
      return {
        data: {
          promo: found.trailer?.embed_url
            ? [{ title: "Official Cyber Trailer", trailer: found.trailer }]
            : [],
          episodes: [],
        },
      };
    }
  },

  /**
   * Playable Episode Video Sources
   * GET /anime/{id}/videos/episodes
   */
  async getAnimeEpisodeVideos(id: number | string, page = 1): Promise<JikanResponse<PlayableEpisodeSource[]>> {
    try {
      return await fetchJikan<JikanResponse<PlayableEpisodeSource[]>>(`/anime/${id}/videos/episodes`, { page });
    } catch {
      return { data: [] };
    }
  },
};
