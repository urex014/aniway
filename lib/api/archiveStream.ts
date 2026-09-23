/**
 * ANIWAY - Internet Archive Stream Resolver Service
 * Connects directly to the Internet Archive (archive.org) Metadata & Media API
 * to deliver direct, legitimate .mp4 video playback for anime episodes.
 */

export interface ResolvedStream {
  success: boolean;
  source: "archive" | "trailer" | "embed" | "none";
  streamUrl?: string;
  embedUrl?: string;
  archiveIdentifier?: string;
  filename?: string;
  episodeNumber: number;
  animeTitle: string;
  isPlayable: boolean;
}

// In-memory cache for fast repeated lookups (TTL 1 hour)
interface CacheEntry {
  timestamp: number;
  data: ResolvedStream;
}
const streamCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000;

/**
 * Curated high-reliability collections for top/classic anime
 * Maps MAL ID or title keywords to verified Internet Archive identifiers
 */
const VERIFIED_ARCHIVE_MAP: Record<
  string,
  {
    identifier: string;
    // Optional custom file name resolver if naming format is specific
    filePattern?: (epNum: number) => string | RegExp;
  }
> = {
  // Death Note (MAL ID 1535)
  "1535": {
    identifier: "death-note-complete-2006-2007",
    filePattern: (ep) => new RegExp(`E${String(ep).padStart(2, "0")}\\b`, "i"),
  },
  // Cowboy Bebop (MAL ID 1)
  "1": {
    identifier: "db-bebop-of-the-cowboys-1080p",
    filePattern: (ep) => new RegExp(`_${String(ep).padStart(2, "0")}_`, "i"),
  },
  // Steins;Gate (MAL ID 9253)
  "9253": {
    identifier: "anime-time-steins-gate",
    filePattern: (ep) => new RegExp(`-\\s*${String(ep).padStart(2, "0")}\\.mp4`, "i"),
  },
  // Serial Experiments Lain (MAL ID 339)
  "339": {
    identifier: "serial-experiments-lain-english",
    filePattern: (ep) => new RegExp(`S01E${String(ep).padStart(2, "0")}`, "i"),
  },
  // Berserk 1997 (MAL ID 33)
  "33": {
    identifier: "berserk-1997_202403",
    filePattern: (ep) => new RegExp(`S1E${String(ep).padStart(2, "0")}`, "i"),
  },
  // Trigun (MAL ID 6)
  "6": {
    identifier: "TrigunEpisode02TagalogDubbed",
    filePattern: (ep) => new RegExp(`Episode_${String(ep).padStart(2, "0")}`, "i"),
  },
};

/**
 * Normalizes title for searching
 */
function cleanSearchTitle(rawTitle: string): string {
  return rawTitle
    .replace(/\s*(\(TV\)|\(Movie\)|\(OVA\)|Season \d+|Part \d+|2nd Season|3rd Season|4th Season)/gi, "")
    .replace(/[^\w\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Searches the Internet Archive for an episode matching the given title and episode number
 */
export async function resolveArchiveStream(
  animeId: number | string,
  title: string,
  episodeNum: number = 1,
  englishTitle?: string | null
): Promise<ResolvedStream> {
  const cacheKey = `${animeId}_ep${episodeNum}`;
  const cached = streamCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // 1. Check verified archive registry first
  const verified = VERIFIED_ARCHIVE_MAP[String(animeId)];
  if (verified) {
    try {
      const stream = await resolveFromArchiveIdentifier(
        verified.identifier,
        episodeNum,
        title,
        verified.filePattern
      );
      if (stream && stream.success) {
        streamCache.set(cacheKey, { timestamp: Date.now(), data: stream });
        return stream;
      }
    } catch {
      // Fall through to dynamic search
    }
  }

  // 2. Dynamic Search on Internet Archive
  const searchTitles = [englishTitle, title].filter(Boolean) as string[];

  for (const rawName of searchTitles) {
    const clean = cleanSearchTitle(rawName);
    if (!clean) continue;

    try {
      // Construct targeted search query: anime title in movies mediatype
      const query = `("${clean}") AND mediatype:(movies)`;
      const searchUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(
        query
      )}&fl[]=identifier,title,downloads&sort[]=downloads+desc&rows=4&output=json`;

      const searchRes = await fetch(searchUrl, {
        headers: { "User-Agent": "AniwayStream/1.0" },
        signal: AbortSignal.timeout(3500),
      });
      if (!searchRes.ok) continue;

      const searchData = await searchRes.json();
      const docs = searchData.response?.docs || [];

      for (const doc of docs) {
        if (!doc.identifier) continue;
        const resolved = await resolveFromArchiveIdentifier(
          doc.identifier,
          episodeNum,
          title
        );
        if (resolved && resolved.success) {
          streamCache.set(cacheKey, { timestamp: Date.now(), data: resolved });
          return resolved;
        }
      }
    } catch {
      // Try next candidate
    }
  }

  // 3. Not found
  const notFoundResult: ResolvedStream = {
    success: false,
    source: "none",
    episodeNumber: episodeNum,
    animeTitle: title,
    isPlayable: false,
  };
  streamCache.set(cacheKey, { timestamp: Date.now(), data: notFoundResult });
  return notFoundResult;
}

/**
 * Inspects a specific Internet Archive identifier metadata to find the matching MP4 file
 */
async function resolveFromArchiveIdentifier(
  identifier: string,
  episodeNum: number,
  animeTitle: string,
  customPattern?: (ep: number) => string | RegExp
): Promise<ResolvedStream | null> {
  const metaUrl = `https://archive.org/metadata/${identifier}`;
  const res = await fetch(metaUrl, {
    headers: { "User-Agent": "AniwayStream/1.0" },
    signal: AbortSignal.timeout(3500),
  });
  if (!res.ok) return null;

  const data = await res.json();
  const files: Array<{ name: string; format?: string; size?: string }> =
    data.files || [];

  // Filter only playable MP4 files
  const mp4Files = files.filter(
    (f) =>
      f.name &&
      f.name.toLowerCase().endsWith(".mp4") &&
      !f.name.includes("_thumb") &&
      !f.name.includes("preview")
  );

  if (mp4Files.length === 0) return null;

  const epStr = String(episodeNum).padStart(2, "0");
  const epSingle = String(episodeNum);

  // If a custom pattern is provided, evaluate that first
  let matchedFile = null;
  if (customPattern) {
    const pat = customPattern(episodeNum);
    matchedFile = mp4Files.find((f) => {
      if (typeof pat === "string") return f.name.includes(pat);
      return pat.test(f.name);
    });
  }

  // Common episode naming conventions:
  // E01, E1, EP01, EP 1, Episode 01, Episode 1, _01_, - 01, etc.
  if (!matchedFile) {
    matchedFile = mp4Files.find((f) => {
      const name = f.name.toLowerCase();
      // Strict regex matching for episode number boundaries
      const regexPatterns = [
        new RegExp(`(?:e|ep|episode)\\s*0*${epSingle}(?:\\D|$)`, "i"),
        new RegExp(`(?:^|[\\s_\\-\\[(])0*${epSingle}(?:[\\s_\\-\\]).]|$)`, "i"),
        new RegExp(`_0*${epSingle}_`, "i"),
        new RegExp(`- 0*${epSingle}\\.`, "i"),
      ];
      return regexPatterns.some((rgx) => rgx.test(name));
    });
  }

  // If single movie / OVA and episode is 1, take first MP4
  if (!matchedFile && episodeNum === 1 && mp4Files.length === 1) {
    matchedFile = mp4Files[0];
  }

  if (matchedFile) {
    const rawName = matchedFile.name;
    // URL encode file path preserving slashes
    const encodedPath = rawName
      .split("/")
      .map((part) => encodeURIComponent(part))
      .join("/");
    const directStreamUrl = `https://archive.org/download/${identifier}/${encodedPath}`;
    const embedUrl = `https://archive.org/embed/${identifier}?playlist=1`;

    return {
      success: true,
      source: "archive",
      streamUrl: directStreamUrl,
      embedUrl: embedUrl,
      archiveIdentifier: identifier,
      filename: rawName,
      episodeNumber: episodeNum,
      animeTitle: animeTitle,
      isPlayable: true,
    };
  }

  return null;
}
