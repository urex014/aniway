import { fetchJikan } from "./client";
import {
  Manga,
  CharacterItem,
  AnimePicture,
  AnimeStatistics,
  RecommendationItem,
  RelationItem,
  NewsItem,
  ReviewItem,
  ExternalLink,
  JikanResponse,
} from "./types";

export interface MangaSearchParams {
  q?: string;
  page?: number;
  limit?: number;
  type?: "manga" | "novel" | "lightnovel" | "oneshot" | "doujin" | "manhwa" | "manhua" | string;
  score?: number;
  min_score?: number;
  max_score?: number;
  status?: "publishing" | "complete" | "hiatus" | "discontinued" | "upcoming" | string;
  sfw?: boolean;
  genres?: string;
  order_by?: "mal_id" | "title" | "start_date" | "end_date" | "chapters" | "volumes" | "score" | "scored_by" | "rank" | "popularity" | "members" | "favorites";
  sort?: "desc" | "asc";
}

const FALLBACK_MANGA: Manga[] = [
  {
    mal_id: 2,
    url: "https://myanimelist.net/manga/2/Berserk",
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/manga/1/157897.jpg",
        large_image_url: "https://cdn.myanimelist.net/images/manga/1/157897l.jpg",
      },
    },
    titles: [
      { type: "Default", title: "Berserk" },
      { type: "Japanese", title: "ベルセルク" },
      { type: "English", title: "Berserk" },
    ],
    title: "Berserk",
    title_english: "Berserk",
    title_japanese: "ベルセルク",
    type: "Manga",
    chapters: 415,
    volumes: 41,
    status: "Publishing",
    publishing: true,
    score: 9.47,
    scored_by: 360000,
    rank: 1,
    popularity: 1,
    members: 680000,
    synopsis: "Guts, a former mercenary now known as the 'Black Swordsman,' is out for revenge. After a tumultuous childhood, he finally finds someone he respects and believes he can trust in Griffith, the charismatic leader of the Band of the Hawk.",
    genres: [{ mal_id: 1, name: "Action" }, { mal_id: 2, name: "Adventure" }, { mal_id: 10, name: "Fantasy" }],
    authors: [{ mal_id: 1868, name: "Miura, Kentarou" }],
  },
  {
    mal_id: 13,
    url: "https://myanimelist.net/manga/13/One_Piece",
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        large_image_url: "https://cdn.myanimelist.net/images/manga/2/253146l.jpg",
      },
    },
    titles: [
      { type: "Default", title: "One Piece" },
      { type: "Japanese", title: "ONE PIECE" },
      { type: "English", title: "One Piece" },
    ],
    title: "One Piece",
    title_english: "One Piece",
    title_japanese: "ONE PIECE",
    type: "Manga",
    chapters: 1120,
    volumes: 109,
    status: "Publishing",
    publishing: true,
    score: 9.22,
    scored_by: 380000,
    rank: 3,
    popularity: 2,
    members: 620000,
    synopsis: "Gol D. Roger, a man referred to as the 'King of the Pirates,' is poised to be executed by the World Government. But just before his demise, he confirms the existence of a great treasure, One Piece, located at the Grand Line.",
    genres: [{ mal_id: 1, name: "Action" }, { mal_id: 2, name: "Adventure" }, { mal_id: 10, name: "Fantasy" }],
    authors: [{ mal_id: 1881, name: "Oda, Eiichiro" }],
  },
  {
    mal_id: 656,
    url: "https://myanimelist.net/manga/656/Vagabond",
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/manga/1/259070.jpg",
        large_image_url: "https://cdn.myanimelist.net/images/manga/1/259070l.jpg",
      },
    },
    titles: [
      { type: "Default", title: "Vagabond" },
      { type: "Japanese", title: "バガボンド" },
      { type: "English", title: "Vagabond" },
    ],
    title: "Vagabond",
    title_english: "Vagabond",
    title_japanese: "バガボンド",
    type: "Manga",
    chapters: 327,
    volumes: 37,
    status: "On Hiatus",
    publishing: false,
    score: 9.35,
    scored_by: 250000,
    rank: 2,
    popularity: 15,
    members: 410000,
    synopsis: "In 16th-century Japan, Shinmen Takezou is a wild, rough-and-tumble youth. Leaving his village to seek glory in war, he barely survives the Battle of Sekigahara and transforms into Miyamoto Musashi, the legendary sword saint.",
    genres: [{ mal_id: 1, name: "Action" }, { mal_id: 2, name: "Adventure" }],
    authors: [{ mal_id: 1911, name: "Inoue, Takehiko" }],
  },
];

export const mangaService = {
  async getMangaSearch(params?: MangaSearchParams): Promise<JikanResponse<Manga[]>> {
    try {
      const res = await fetchJikan<JikanResponse<Manga[]>>("/manga", params as Record<string, string | number | boolean | undefined>);
      if (res && res.data && res.data.length > 0) return res;
      throw new Error("No manga data");
    } catch {
      let filtered = [...FALLBACK_MANGA];
      if (params?.q) {
        const query = params.q.toLowerCase();
        filtered = filtered.filter(
          (m) =>
            m.title.toLowerCase().includes(query) ||
            (m.title_english && m.title_english.toLowerCase().includes(query))
        );
      }
      return {
        data: filtered,
        pagination: { current_page: 1, has_next_page: false, last_visible_page: 1 },
      };
    }
  },

  async getMangaById(id: number | string): Promise<JikanResponse<Manga>> {
    try {
      return await fetchJikan<JikanResponse<Manga>>(`/manga/${id}`);
    } catch {
      const found = FALLBACK_MANGA.find((m) => m.mal_id === Number(id)) || FALLBACK_MANGA[0];
      return { data: found };
    }
  },

  async getMangaFull(id: number | string): Promise<JikanResponse<Manga>> {
    try {
      return await fetchJikan<JikanResponse<Manga>>(`/manga/${id}/full`);
    } catch {
      const found = FALLBACK_MANGA.find((m) => m.mal_id === Number(id)) || FALLBACK_MANGA[0];
      return { data: found };
    }
  },

  async getMangaCharacters(id: number | string): Promise<JikanResponse<CharacterItem[]>> {
    try {
      return await fetchJikan<JikanResponse<CharacterItem[]>>(`/manga/${id}/characters`);
    } catch {
      return { data: [] };
    }
  },

  async getMangaPictures(id: number | string): Promise<JikanResponse<AnimePicture[]>> {
    try {
      return await fetchJikan<JikanResponse<AnimePicture[]>>(`/manga/${id}/pictures`);
    } catch {
      const found = FALLBACK_MANGA.find((m) => m.mal_id === Number(id)) || FALLBACK_MANGA[0];
      return { data: [{ jpg: found.images.jpg }] };
    }
  },

  async getMangaStatistics(id: number | string): Promise<JikanResponse<AnimeStatistics>> {
    try {
      return await fetchJikan<JikanResponse<AnimeStatistics>>(`/manga/${id}/statistics`);
    } catch {
      return { data: { reading: 85000, completed: 310000, total: 395000 } };
    }
  },

  async getMangaRecommendations(id: number | string): Promise<JikanResponse<RecommendationItem[]>> {
    try {
      return await fetchJikan<JikanResponse<RecommendationItem[]>>(`/manga/${id}/recommendations`);
    } catch {
      return { data: [] };
    }
  },

  async getMangaRelations(id: number | string): Promise<JikanResponse<RelationItem[]>> {
    try {
      return await fetchJikan<JikanResponse<RelationItem[]>>(`/manga/${id}/relations`);
    } catch {
      return { data: [] };
    }
  },

  async getMangaReviews(id: number | string, page = 1): Promise<JikanResponse<ReviewItem[]>> {
    try {
      return await fetchJikan<JikanResponse<ReviewItem[]>>(`/manga/${id}/reviews`, { page });
    } catch {
      return { data: [] };
    }
  },

  async getMangaNews(id: number | string, page = 1): Promise<JikanResponse<NewsItem[]>> {
    try {
      return await fetchJikan<JikanResponse<NewsItem[]>>(`/manga/${id}/news`, { page });
    } catch {
      return { data: [] };
    }
  },

  async getMangaExternal(id: number | string): Promise<JikanResponse<ExternalLink[]>> {
    try {
      return await fetchJikan<JikanResponse<ExternalLink[]>>(`/manga/${id}/external`);
    } catch {
      return { data: [] };
    }
  },
};
