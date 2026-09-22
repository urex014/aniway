import { fetchJikan } from "./client";
import { Anime, Manga, Character, Person, JikanResponse } from "./types";
import { FALLBACK_ANIME } from "./fallbacks";

export const randomService = {
  /**
   * Random Anime Discovery ("Surprise Me")
   * GET /random/anime
   */
  async getRandomAnime(): Promise<JikanResponse<Anime>> {
    try {
      return await fetchJikan<JikanResponse<Anime>>("/random/anime", undefined, { skipCache: true });
    } catch {
      const randomIndex = Math.floor(Math.random() * FALLBACK_ANIME.length);
      return { data: FALLBACK_ANIME[randomIndex] };
    }
  },

  /**
   * Random Manga Discovery
   * GET /random/manga
   */
  async getRandomManga(): Promise<JikanResponse<Manga>> {
    return await fetchJikan<JikanResponse<Manga>>("/random/manga", undefined, { skipCache: true });
  },

  /**
   * Random Character
   * GET /random/characters
   */
  async getRandomCharacter(): Promise<JikanResponse<Character>> {
    return await fetchJikan<JikanResponse<Character>>("/random/characters", undefined, { skipCache: true });
  },

  /**
   * Random Person / Voice Actor
   * GET /random/people
   */
  async getRandomPerson(): Promise<JikanResponse<Person>> {
    return await fetchJikan<JikanResponse<Person>>("/random/people", undefined, { skipCache: true });
  },
};
