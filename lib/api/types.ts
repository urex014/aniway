export interface JikanPagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items?: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface JikanResponse<T> {
  data: T;
  pagination?: JikanPagination;
}

export interface JikanImage {
  image_url: string;
  small_image_url?: string;
  large_image_url?: string;
}

export interface JikanImages {
  jpg: JikanImage;
  webp?: JikanImage;
}

export interface JikanTitle {
  type: string;
  title: string;
}

export interface JikanTrailer {
  youtube_id: string | null;
  url: string | null;
  embed_url: string | null;
  images?: {
    image_url: string | null;
    small_image_url: string | null;
    medium_image_url: string | null;
    large_image_url: string | null;
    maximum_image_url: string | null;
  };
}

export interface JikanNamedEntity {
  mal_id: number;
  type?: string;
  name: string;
  url?: string;
}

export interface Anime {
  mal_id: number;
  url: string;
  images: JikanImages;
  trailer?: JikanTrailer;
  approved?: boolean;
  titles: JikanTitle[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms?: string[];
  type: string | null;
  source?: string | null;
  episodes: number | null;
  status: string;
  airing: boolean;
  aired?: {
    from: string | null;
    to: string | null;
    prop?: {
      from: { day: number | null; month: number | null; year: number | null };
      to: { day: number | null; month: number | null; year: number | null };
    };
    string?: string;
  };
  duration?: string | null;
  rating?: string | null;
  score: number | null;
  scored_by?: number | null;
  rank?: number | null;
  popularity?: number | null;
  members?: number | null;
  favorites?: number | null;
  synopsis: string | null;
  background?: string | null;
  season?: string | null;
  year?: number | null;
  broadcast?: {
    day: string | null;
    time: string | null;
    timezone: string | null;
    string: string | null;
  };
  producers?: JikanNamedEntity[];
  licensors?: JikanNamedEntity[];
  studios?: JikanNamedEntity[];
  genres: JikanNamedEntity[];
  explicit_genres?: JikanNamedEntity[];
  themes?: JikanNamedEntity[];
  demographics?: JikanNamedEntity[];
  streaming?: { name: string; url: string }[];
}

export interface Manga {
  mal_id: number;
  url: string;
  images: JikanImages;
  approved?: boolean;
  titles: JikanTitle[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms?: string[];
  type: string | null;
  chapters?: number | null;
  volumes?: number | null;
  status: string;
  publishing: boolean;
  published?: {
    from: string | null;
    to: string | null;
    string?: string;
  };
  score: number | null;
  scored_by?: number | null;
  rank?: number | null;
  popularity?: number | null;
  members?: number | null;
  favorites?: number | null;
  synopsis: string | null;
  background?: string | null;
  authors?: JikanNamedEntity[];
  serializations?: JikanNamedEntity[];
  genres: JikanNamedEntity[];
  explicit_genres?: JikanNamedEntity[];
  themes?: JikanNamedEntity[];
  demographics?: JikanNamedEntity[];
}

export interface Episode {
  mal_id: number;
  url?: string;
  title: string;
  title_japanese?: string | null;
  title_romanji?: string | null;
  aired?: string | null;
  score?: number | null;
  filler?: boolean;
  recap?: boolean;
  forum_url?: string;
}

export interface EpisodeDetail {
  mal_id: number;
  url?: string;
  title: string;
  title_japanese?: string | null;
  title_romanji?: string | null;
  duration?: number | null;
  aired?: string | null;
  filler?: boolean;
  recap?: boolean;
  synopsis?: string | null;
}

export interface CharacterItem {
  character: {
    mal_id: number;
    url: string;
    images: JikanImages;
    name: string;
  };
  role: string;
  favorites?: number;
  voice_actors: {
    person: {
      mal_id: number;
      url: string;
      images: JikanImages;
      name: string;
    };
    language: string;
  }[];
}

export interface StaffItem {
  person: {
    mal_id: number;
    url: string;
    images: JikanImages;
    name: string;
  };
  positions: string[];
}

export interface Character {
  mal_id: number;
  url: string;
  images: JikanImages;
  name: string;
  name_kanji: string | null;
  nicknames?: string[];
  favorites: number;
  about: string | null;
}

export interface Person {
  mal_id: number;
  url: string;
  website_url?: string | null;
  images: JikanImages;
  name: string;
  given_name?: string | null;
  family_name?: string | null;
  alternate_names?: string[];
  birthday?: string | null;
  favorites?: number;
  about?: string | null;
}

export interface AnimePicture {
  jpg: JikanImage;
  webp?: JikanImage;
}

export interface AnimeStatistics {
  watching?: number;
  reading?: number;
  completed?: number;
  on_hold?: number;
  dropped?: number;
  plan_to_watch?: number;
  total?: number;
  scores?: {
    score: number;
    votes: number;
    percentage: number;
  }[];
}

export interface RecommendationItem {
  entry: {
    mal_id: number;
    url: string;
    images: JikanImages;
    title: string;
  };
  url?: string;
  votes?: number;
}

export interface RelationItem {
  relation: string;
  entry: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
}

export interface AnimeThemes {
  openings: string[];
  endings: string[];
}

export interface NewsItem {
  mal_id: number;
  url: string;
  title: string;
  date: string;
  author_username: string;
  author_url: string;
  forum_url: string;
  images?: JikanImages;
  comments: number;
  excerpt: string;
}

export interface ReviewItem {
  mal_id: number;
  url: string;
  type: string;
  reactions?: {
    overall: number;
    nice: number;
    love_it: number;
    funny: number;
    confusing: number;
    informative: number;
    well_written: number;
    creative: number;
  };
  date: string;
  review: string;
  score: number;
  tags: string[];
  is_spoiler: boolean;
  is_preliminary: boolean;
  episodes_watched?: number;
  user: {
    url: string;
    username: string;
    images?: JikanImages;
  };
}

export interface ExternalLink {
  name: string;
  url: string;
}

export interface VideoData {
  promo: {
    title: string;
    trailer: JikanTrailer;
  }[];
  episodes: {
    mal_id: number;
    title: string;
    episode: string;
    url: string;
    images?: JikanImages;
  }[];
  music_videos?: {
    title: string;
    video: JikanTrailer;
    meta?: {
      title?: string;
      author?: string;
    };
  }[];
}

export interface PlayableEpisodeSource {
  mal_id: number;
  episode: string;
  title: string;
  url: string;
  images?: JikanImages;
}

export interface Genre {
  mal_id: number;
  name: string;
  url: string;
  count: number;
}

export interface SeasonInfo {
  year: number;
  seasons: string[];
}
