import { fetchJikan } from "./client";
import { Person, Anime, Manga, AnimePicture, JikanResponse } from "./types";

export interface PersonVoiceRole {
  role: string;
  anime: Anime;
  character: {
    mal_id: number;
    url: string;
    images: { jpg: { image_url: string } };
    name: string;
  };
}

export interface PersonAnimePosition {
  position: string;
  anime: Anime;
}

export interface PersonMangaWork {
  position: string;
  manga: Manga;
}

const FALLBACK_PEOPLE: Person[] = [
  {
    mal_id: 11,
    url: "https://myanimelist.net/people/11/Mamoru_Miyano",
    images: {
      jpg: { image_url: "https://cdn.myanimelist.net/images/voiceactors/2/67634.jpg" },
    },
    name: "Mamoru Miyano",
    given_name: "守",
    family_name: "宮野",
    alternate_names: ["Mamo-chan"],
    birthday: "1983-06-08T00:00:00+00:00",
    favorites: 78000,
    about: "Mamoru Miyano is a Japanese voice actor, actor, and singer affiliated with Himawari Theatre Group. He is best known for his roles on Steins;Gate (Rintaro Okabe), Death Note (Light Yagami), and Jujutsu Kaisen.",
  },
  {
    mal_id: 185,
    url: "https://myanimelist.net/people/185/Hiroshi_Kamiya",
    images: {
      jpg: { image_url: "https://cdn.myanimelist.net/images/voiceactors/3/64366.jpg" },
    },
    name: "Hiroshi Kamiya",
    given_name: "浩史",
    family_name: "神谷",
    birthday: "1975-01-28T00:00:00+00:00",
    favorites: 95000,
    about: "Hiroshi Kamiya is a Japanese voice actor, singer and narrator affiliated with Aoni Production. He voiced Levi Ackerman in Attack on Titan, Trafalgar Law in One Piece, and Koyomi Araragi in the Monogatari series.",
  },
];

export const peopleService = {
  async getPeopleSearch(params?: { q?: string; page?: number; limit?: number; order_by?: string; sort?: "desc" | "asc" }): Promise<JikanResponse<Person[]>> {
    try {
      const res = await fetchJikan<JikanResponse<Person[]>>("/people", params as Record<string, string | number | undefined>);
      if (res && res.data && res.data.length > 0) return res;
      throw new Error("No people data");
    } catch {
      let filtered = [...FALLBACK_PEOPLE];
      if (params?.q) {
        const query = params.q.toLowerCase();
        filtered = filtered.filter((p) => p.name.toLowerCase().includes(query));
      }
      return {
        data: filtered,
        pagination: { current_page: 1, has_next_page: false, last_visible_page: 1 },
      };
    }
  },

  async getPersonById(id: number | string): Promise<JikanResponse<Person>> {
    try {
      return await fetchJikan<JikanResponse<Person>>(`/people/${id}`);
    } catch {
      const found = FALLBACK_PEOPLE.find((p) => p.mal_id === Number(id)) || FALLBACK_PEOPLE[0];
      return { data: found };
    }
  },

  async getPersonFull(id: number | string): Promise<JikanResponse<Person>> {
    try {
      return await fetchJikan<JikanResponse<Person>>(`/people/${id}/full`);
    } catch {
      const found = FALLBACK_PEOPLE.find((p) => p.mal_id === Number(id)) || FALLBACK_PEOPLE[0];
      return { data: found };
    }
  },

  async getPersonAnime(id: number | string): Promise<JikanResponse<PersonAnimePosition[]>> {
    try {
      return await fetchJikan<JikanResponse<PersonAnimePosition[]>>(`/people/${id}/anime`);
    } catch {
      return { data: [] };
    }
  },

  async getPersonManga(id: number | string): Promise<JikanResponse<PersonMangaWork[]>> {
    try {
      return await fetchJikan<JikanResponse<PersonMangaWork[]>>(`/people/${id}/manga`);
    } catch {
      return { data: [] };
    }
  },

  async getPersonVoices(id: number | string): Promise<JikanResponse<PersonVoiceRole[]>> {
    try {
      return await fetchJikan<JikanResponse<PersonVoiceRole[]>>(`/people/${id}/voices`);
    } catch {
      return { data: [] };
    }
  },

  async getPersonPictures(id: number | string): Promise<JikanResponse<AnimePicture[]>> {
    try {
      return await fetchJikan<JikanResponse<AnimePicture[]>>(`/people/${id}/pictures`);
    } catch {
      const found = FALLBACK_PEOPLE.find((p) => p.mal_id === Number(id)) || FALLBACK_PEOPLE[0];
      return { data: [{ jpg: found.images.jpg }] };
    }
  },
};
