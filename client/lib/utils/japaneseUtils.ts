/**
 * Japanese text conversion utilities for search functionality
 */

/**
 * Convert katakana to hiragana
 * @param str - Input string containing katakana characters
 * @returns String with katakana converted to hiragana
 */
export function toHiragana(str: string): string {
  return str.replace(/[\u30A1-\u30F6]/g, (match) => {
    const charCode = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(charCode);
  });
}

/**
 * Convert hiragana to katakana
 * @param str - Input string containing hiragana characters
 * @returns String with hiragana converted to katakana
 */
export function toKatakana(str: string): string {
  return str.replace(/[\u3041-\u3096]/g, (match) => {
    const charCode = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(charCode);
  });
}

/**
 * Convert full-width katakana to half-width katakana
 * @param str - Input string containing full-width katakana
 * @returns String with full-width katakana converted to half-width
 */
export function toHalfWidthKatakana(str: string): string {
  const fullWidthToHalfWidth: Record<string, string> = {
    ア: "ｱ",
    イ: "ｲ",
    ウ: "ｳ",
    エ: "ｴ",
    オ: "ｵ",
    カ: "ｶ",
    キ: "ｷ",
    ク: "ｸ",
    ケ: "ｹ",
    コ: "ｺ",
    サ: "ｻ",
    シ: "ｼ",
    ス: "ｽ",
    セ: "ｾ",
    ソ: "ｿ",
    タ: "ﾀ",
    チ: "ﾁ",
    ツ: "ﾂ",
    テ: "ﾃ",
    ト: "ﾄ",
    ナ: "ﾅ",
    ニ: "ﾆ",
    ヌ: "ﾇ",
    ネ: "ﾈ",
    ノ: "ﾉ",
    ハ: "ﾊ",
    ヒ: "ﾋ",
    フ: "ﾌ",
    ヘ: "ﾍ",
    ホ: "ﾎ",
    マ: "ﾏ",
    ミ: "ﾐ",
    ム: "ﾑ",
    メ: "ﾒ",
    モ: "ﾓ",
    ヤ: "ﾔ",
    ユ: "ﾕ",
    ヨ: "ﾖ",
    ラ: "ﾗ",
    リ: "ﾘ",
    ル: "ﾙ",
    レ: "ﾚ",
    ロ: "ﾛ",
    ワ: "ﾜ",
    ヲ: "ｦ",
    ン: "ﾝ",
    ガ: "ｶﾞ",
    ギ: "ｷﾞ",
    グ: "ｸﾞ",
    ゲ: "ｹﾞ",
    ゴ: "ｺﾞ",
    ザ: "ｻﾞ",
    ジ: "ｼﾞ",
    ズ: "ｽﾞ",
    ゼ: "ｾﾞ",
    ゾ: "ｿﾞ",
    ダ: "ﾀﾞ",
    ヂ: "ﾁﾞ",
    ヅ: "ﾂﾞ",
    デ: "ﾃﾞ",
    ド: "ﾄﾞ",
    バ: "ﾊﾞ",
    ビ: "ﾋﾞ",
    ブ: "ﾌﾞ",
    ベ: "ﾍﾞ",
    ボ: "ﾎﾞ",
    パ: "ﾊﾟ",
    ピ: "ﾋﾟ",
    プ: "ﾌﾟ",
    ペ: "ﾍﾟ",
    ポ: "ﾎﾟ",
    ッ: "ｯ",
    ャ: "ｬ",
    ュ: "ｭ",
    ョ: "ｮ",
    ァ: "ｧ",
    ィ: "ｨ",
    ゥ: "ｩ",
    ェ: "ｪ",
    ォ: "ｫ",
  };

  return str.replace(
    /[ァ-ヾ]/g,
    (match) => fullWidthToHalfWidth[match] || match,
  );
}

/**
 * Convert half-width katakana to full-width katakana
 * @param str - Input string containing half-width katakana
 * @returns String with half-width katakana converted to full-width
 */
export function toFullWidthKatakana(str: string): string {
  const halfWidthToFullWidth: Record<string, string> = {
    ｱ: "ア",
    ｲ: "イ",
    ｳ: "ウ",
    ｴ: "エ",
    ｵ: "オ",
    ｶ: "カ",
    ｷ: "キ",
    ｸ: "ク",
    ｹ: "ケ",
    ｺ: "コ",
    ｻ: "サ",
    ｼ: "シ",
    ｽ: "ス",
    ｾ: "セ",
    ｿ: "ソ",
    ﾀ: "タ",
    ﾁ: "チ",
    ﾂ: "ツ",
    ﾃ: "テ",
    ﾄ: "ト",
    ﾅ: "ナ",
    ﾆ: "ニ",
    ﾇ: "ヌ",
    ﾈ: "ネ",
    ﾉ: "ノ",
    ﾊ: "ハ",
    ﾋ: "ヒ",
    ﾌ: "フ",
    ﾍ: "ヘ",
    ﾎ: "ホ",
    ﾏ: "マ",
    ﾐ: "ミ",
    ﾑ: "ム",
    ﾒ: "メ",
    ﾓ: "モ",
    ﾔ: "ヤ",
    ﾕ: "ユ",
    ﾖ: "ヨ",
    ﾗ: "ラ",
    ﾘ: "リ",
    ﾙ: "ル",
    ﾚ: "レ",
    ﾛ: "ロ",
    ﾜ: "ワ",
    ｦ: "ヲ",
    ﾝ: "ン",
    ｯ: "ッ",
    ｬ: "ャ",
    ｭ: "ュ",
    ｮ: "ョ",
    ｧ: "ァ",
    ｨ: "ィ",
    ｩ: "ゥ",
    ｪ: "ェ",
    ｫ: "ォ",
  };

  // Handle voiced marks (dakuten and handakuten)
  let result = str.replace(/([ｶ-ｺｻ-ｿﾀ-ﾄﾊ-ﾎ])ﾞ/g, (match, base) => {
    const voiced: Record<string, string> = {
      ｶ: "ガ",
      ｷ: "ギ",
      ｸ: "グ",
      ｹ: "ゲ",
      ｺ: "ゴ",
      ｻ: "ザ",
      ｼ: "ジ",
      ｽ: "ズ",
      ｾ: "ゼ",
      ｿ: "ゾ",
      ﾀ: "ダ",
      ﾁ: "ヂ",
      ﾂ: "ヅ",
      ﾃ: "デ",
      ﾄ: "ド",
      ﾊ: "バ",
      ﾋ: "ビ",
      ﾌ: "ブ",
      ﾍ: "ベ",
      ﾎ: "ボ",
    };
    return voiced[base] || match;
  });

  result = result.replace(/([ﾊ-ﾎ])ﾟ/g, (match, base) => {
    const semiVoiced: Record<string, string> = {
      ﾊ: "パ",
      ﾋ: "ピ",
      ﾌ: "プ",
      ﾍ: "ペ",
      ﾎ: "ポ",
    };
    return semiVoiced[base] || match;
  });

  return result.replace(
    /[ｦ-ﾟ]/g,
    (match) => halfWidthToFullWidth[match] || match,
  );
}

/**
 * Normalize Japanese text for search purposes
 * Converts text to both hiragana and katakana variants for comprehensive matching
 * @param text - Input Japanese text
 * @returns Object containing original, hiragana, and katakana versions
 */
export function normalizeJapanese(text: string) {
  const lowercaseText = text.toLowerCase();
  const fullWidthText = toFullWidthKatakana(lowercaseText);
  const hiraganaText = toHiragana(fullWidthText);
  const katakanaText = toKatakana(fullWidthText);

  return {
    original: lowercaseText,
    hiragana: hiraganaText,
    katakana: katakanaText,
    fullWidth: fullWidthText,
  };
}

/**
 * Check if text contains Japanese characters
 * @param text - Input text to check
 * @returns True if text contains hiragana, katakana, or kanji
 */
export function hasJapanese(text: string): boolean {
  return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\uFF66-\uFF9F]/.test(text);
}

/**
 * Perform Japanese-aware text matching
 * @param query - Search query
 * @param target - Target text to match against
 * @returns True if query matches target in any Japanese script variation
 */
export function japaneseMatch(query: string, target: string): boolean {
  if (!hasJapanese(query) && !hasJapanese(target)) {
    return target.toLowerCase().includes(query.toLowerCase());
  }

  const normalizedQuery = normalizeJapanese(query);
  const normalizedTarget = normalizeJapanese(target);

  // Check all variations
  return (
    normalizedTarget.original.includes(normalizedQuery.original) ||
    normalizedTarget.hiragana.includes(normalizedQuery.hiragana) ||
    normalizedTarget.katakana.includes(normalizedQuery.katakana) ||
    normalizedTarget.hiragana.includes(normalizedQuery.katakana) ||
    normalizedTarget.katakana.includes(normalizedQuery.hiragana) ||
    normalizedTarget.fullWidth.includes(normalizedQuery.original)
  );
}
