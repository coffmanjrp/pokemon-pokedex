import {
  toHiragana,
  toKatakana,
  normalizeJapanese,
  japaneseMatch,
  hasJapanese,
} from "../lib/utils/japaneseUtils";

describe("Japanese Utils", () => {
  describe("toHiragana", () => {
    it("should convert katakana to hiragana", () => {
      expect(toHiragana("フシギダネ")).toBe("ふしぎだね");
      expect(toHiragana("ピカチュウ")).toBe("ぴかちゅう");
      expect(toHiragana("リザードン")).toBe("りざーどん");
    });
  });

  describe("toKatakana", () => {
    it("should convert hiragana to katakana", () => {
      expect(toKatakana("ふしぎだね")).toBe("フシギダネ");
      expect(toKatakana("ぴかちゅう")).toBe("ピカチュウ");
      expect(toKatakana("りざーどん")).toBe("リザードン");
    });
  });

  describe("hasJapanese", () => {
    it("should detect Japanese characters", () => {
      expect(hasJapanese("フシギダネ")).toBe(true);
      expect(hasJapanese("ふしぎだね")).toBe(true);
      expect(hasJapanese("ﾌｼｷﾞﾀﾞﾈ")).toBe(true);
      expect(hasJapanese("Bulbasaur")).toBe(false);
      expect(hasJapanese("123")).toBe(false);
    });
  });

  describe("normalizeJapanese", () => {
    it("should normalize Japanese text to all variants", () => {
      const result = normalizeJapanese("フシギダネ");
      expect(result.hiragana).toBe("ふしぎだね");
      expect(result.katakana).toBe("フシギダネ");
      expect(result.original).toBe("フシギダネ".toLowerCase());
    });
  });

  describe("japaneseMatch", () => {
    it("should match hiragana query with katakana target", () => {
      expect(japaneseMatch("ふしぎ", "フシギダネ")).toBe(true);
      expect(japaneseMatch("フシギ", "ふしぎだね")).toBe(true);
      expect(japaneseMatch("ピカ", "ピカチュウ")).toBe(true);
      expect(japaneseMatch("ぴか", "ピカチュウ")).toBe(true);
    });

    it("should handle non-Japanese text normally", () => {
      expect(japaneseMatch("bulba", "Bulbasaur")).toBe(true);
      expect(japaneseMatch("char", "Charmander")).toBe(true);
      expect(japaneseMatch("xyz", "Bulbasaur")).toBe(false);
    });

    it("should match partial text", () => {
      expect(japaneseMatch("だね", "フシギダネ")).toBe(true);
      expect(japaneseMatch("ダネ", "ふしぎだね")).toBe(true);
    });
  });
});
