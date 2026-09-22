import { fetchJikan } from "./client";
import { Character, Anime, Manga, AnimePicture, JikanResponse } from "./types";

export interface CharacterRoleAnime {
  role: string;
  anime: Anime;
}

export interface CharacterRoleManga {
  role: string;
  manga: Manga;
}

export interface CharacterVoiceRole {
  language: string;
  person: {
    mal_id: number;
    url: string;
    images: { jpg: { image_url: string } };
    name: string;
  };
}

const FALLBACK_CHARACTERS: Character[] = [
  {
    mal_id: 417,
    url: "https://myanimelist.net/character/417/Lelouch_Lamperouge",
    images: {
      jpg: { image_url: "https://cdn.myanimelist.net/images/characters/8/406163.jpg" },
      webp: { image_url: "https://cdn.myanimelist.net/images/characters/8/406163.webp" },
    },
    name: "Lelouch Lamperouge",
    name_kanji: "ルルーシュ・ランペルージ",
    nicknames: ["Zero", "Lulu", "Black Prince"],
    favorites: 168000,
    about: "Lelouch Lamperouge is the main protagonist of Code Geass: Lelouch of the Rebellion and R2. An exiled Britannian prince and son of the Emperor Charles zi Britannia, Lelouch assumes the masked identity of 'Zero' after obtaining the power of Geass.",
  },
  {
    mal_id: 40,
    url: "https://myanimelist.net/character/40/L_Lawliet",
    images: {
      jpg: { image_url: "https://cdn.myanimelist.net/images/characters/10/249697.jpg" },
      webp: { image_url: "https://cdn.myanimelist.net/images/characters/10/249697.webp" },
    },
    name: "L Lawliet",
    name_kanji: "エル・ローライト",
    nicknames: ["Ryuzaki", "Hideki Ryuga", "Eraldo Coil"],
    favorites: 132000,
    about: "L is a world-renowned detective who takes on the challenge of catching the mass murderer known as Kira. In his investigation, L becomes strongly suspicious of Light Yagami and makes it his goal to prove that Light is Kira.",
  },
  {
    mal_id: 183984,
    url: "https://myanimelist.net/character/183984/Frieren",
    images: {
      jpg: { image_url: "https://cdn.myanimelist.net/images/characters/15/524336.jpg" },
      webp: { image_url: "https://cdn.myanimelist.net/images/characters/15/524336.webp" },
    },
    name: "Frieren",
    name_kanji: "フリーレン",
    nicknames: ["Frieren the Slayer"],
    favorites: 24000,
    about: "Frieren is the titular protagonist of Sousou no Frieren. She was the elven mage of the hero's party that defeated the Demon King after a ten-year quest. With a lifespan exceeding a millennium, she embarks on a new voyage to understand mortal humans.",
  },
];

export const characterService = {
  async getCharactersSearch(params?: { q?: string; page?: number; limit?: number; order_by?: string; sort?: "desc" | "asc" }): Promise<JikanResponse<Character[]>> {
    try {
      const res = await fetchJikan<JikanResponse<Character[]>>("/characters", params as Record<string, string | number | undefined>);
      if (res && res.data && res.data.length > 0) return res;
      throw new Error("No characters found");
    } catch {
      let filtered = [...FALLBACK_CHARACTERS];
      if (params?.q) {
        const query = params.q.toLowerCase();
        filtered = filtered.filter((c) => c.name.toLowerCase().includes(query) || (c.name_kanji && c.name_kanji.includes(query)));
      }
      return {
        data: filtered,
        pagination: { current_page: 1, has_next_page: false, last_visible_page: 1 },
      };
    }
  },

  async getCharacterById(id: number | string): Promise<JikanResponse<Character>> {
    try {
      return await fetchJikan<JikanResponse<Character>>(`/characters/${id}`);
    } catch {
      const found = FALLBACK_CHARACTERS.find((c) => c.mal_id === Number(id)) || FALLBACK_CHARACTERS[0];
      return { data: found };
    }
  },

  async getCharacterFull(id: number | string): Promise<JikanResponse<Character>> {
    try {
      return await fetchJikan<JikanResponse<Character>>(`/characters/${id}/full`);
    } catch {
      const found = FALLBACK_CHARACTERS.find((c) => c.mal_id === Number(id)) || FALLBACK_CHARACTERS[0];
      return { data: found };
    }
  },

  async getCharacterAnime(id: number | string): Promise<JikanResponse<CharacterRoleAnime[]>> {
    try {
      return await fetchJikan<JikanResponse<CharacterRoleAnime[]>>(`/characters/${id}/anime`);
    } catch {
      return { data: [] };
    }
  },

  async getCharacterManga(id: number | string): Promise<JikanResponse<CharacterRoleManga[]>> {
    try {
      return await fetchJikan<JikanResponse<CharacterRoleManga[]>>(`/characters/${id}/manga`);
    } catch {
      return { data: [] };
    }
  },

  async getCharacterVoices(id: number | string): Promise<JikanResponse<CharacterVoiceRole[]>> {
    try {
      return await fetchJikan<JikanResponse<CharacterVoiceRole[]>>(`/characters/${id}/voices`);
    } catch {
      return { data: [] };
    }
  },

  async getCharacterPictures(id: number | string): Promise<JikanResponse<AnimePicture[]>> {
    try {
      return await fetchJikan<JikanResponse<AnimePicture[]>>(`/characters/${id}/pictures`);
    } catch {
      const found = FALLBACK_CHARACTERS.find((c) => c.mal_id === Number(id)) || FALLBACK_CHARACTERS[0];
      return { data: [{ jpg: found.images.jpg }] };
    }
  },
};
