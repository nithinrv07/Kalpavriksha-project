import { describe, expect, it } from "vitest";
import { SONG_LIBRARY, CATEGORY_META } from "./songs-data";
import { filterSongs } from "./song-filters";
import { fmtTime } from "./use-music-player";
import { getVinylVariant } from "./vinyl-record";

describe("Song Library Data Validation", () => {
  it("contains at least 10 educational songs", () => {
    expect(SONG_LIBRARY.length).toBeGreaterThanOrEqual(10);
  });

  it("has unique IDs for every song", () => {
    const ids = SONG_LIBRARY.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("contains valid metadata for all songs", () => {
    for (const song of SONG_LIBRARY) {
      expect(song.id).toBeTruthy();
      expect(song.title.en).toBeTruthy();
      expect(song.title.ta).toBeTruthy();
      expect(song.credit.en).toBeTruthy();
      expect(song.description.en).toBeTruthy();
      expect(song.meaning.en).toBeTruthy();
      expect(song.fact.en).toBeTruthy();
      expect(song.lyrics.length).toBeGreaterThan(0);
      expect(song.classRange[0]).toBeLessThanOrEqual(song.classRange[1]);
      expect(CATEGORY_META[song.category]).toBeDefined();
    }
  });

  it("correctly identifies available vs unavailable audio assets", () => {
    const withAudio = SONG_LIBRARY.filter((s) => s.audioSrc !== null);
    const withoutAudio = SONG_LIBRARY.filter((s) => s.audioSrc === null);

    // Verified files present in public/audio/patriotic-songs/
    expect(withAudio.map((s) => s.id)).toEqual([
      "jana-gana-mana",
      "vande-mataram",
      "senthamizh-naadu",
    ]);

    // Graceful placeholders for remaining songs
    expect(withoutAudio.length).toBe(7);
  });
});

describe("Song Filtering Logic", () => {
  it("filters songs by category", () => {
    const patriotic = filterSongs(SONG_LIBRARY, { search: "", category: "patriotic-tamil", language: "all" }, "en");
    expect(patriotic.every((s) => s.category === "patriotic-tamil")).toBe(true);
    expect(patriotic.length).toBeGreaterThan(0);
  });

  it("filters songs by language", () => {
    const tamil = filterSongs(SONG_LIBRARY, { search: "", category: "all", language: "ta" }, "en");
    expect(tamil.every((s) => s.language === "ta")).toBe(true);
    expect(tamil.length).toBe(4);
  });

  it("filters songs by search query", () => {
    const result = filterSongs(SONG_LIBRARY, { search: "Tagore", category: "all", language: "all" }, "en");
    expect(result.some((s) => s.id === "jana-gana-mana")).toBe(true);
  });
});

describe("Audio Utilities & Helpers", () => {
  it("formats time seconds to MM:SS string correctly", () => {
    expect(fmtTime(0)).toBe("0:00");
    expect(fmtTime(9)).toBe("0:09");
    expect(fmtTime(52)).toBe("0:52");
    expect(fmtTime(65)).toBe("1:05");
    expect(fmtTime(185)).toBe("3:05");
    expect(fmtTime(-5)).toBe("0:00");
  });

  it("determines vinyl artwork variant from category", () => {
    expect(getVinylVariant("national-anthem")).toBe("patriotic");
    expect(getVinylVariant("national-song")).toBe("patriotic");
    expect(getVinylVariant("patriotic-tamil")).toBe("tamil");
    expect(getVinylVariant("children-english")).toBe("english");
    expect(getVinylVariant("traditional")).toBe("default");
  });
});

