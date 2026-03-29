const NON_WORDS = new Set([
  "org", "com", "net", "www", "gov", "edu", "io", "co",
  "html", "htm", "php", "css", "xml", "pdf",
  "jpg", "jpeg", "png", "gif", "svg", "mp3", "mp4",
  "http", "https", "src", "href", "url",
]);

export const extractWordList = (text: string): string[] => {
  const cleaned = text
    .replace(/https?:\/\/\S+/gi, " ")   // strip full URLs
    .replace(/(?<=\w)\.(?=\w)/g, " ");  // split dot-joined tokens (codes.droit.org → 3 tokens)

  const matches = [...cleaned.matchAll(/[\p{L}\p{M}][\p{L}\p{M}'-]*/gu)];
  const isAcronym = (w: string) => /^\p{Lu}+$/u.test(w);
  const startsWithUpper = (w: string) => /^\p{Lu}/u.test(w);
  const isRomanNumeral = (w: string) => /^[ivxlcdmIVXLCDM]+$/i.test(w);
  const words = matches
    .filter(([w]) => !isAcronym(w) && !startsWithUpper(w))
    .map(([w]) => w.toLowerCase().replace(/['-]+$/, ""))
    .filter((w) => w.length >= 2 && !NON_WORDS.has(w) && !w.includes("-") && !w.includes("'") && !isRomanNumeral(w));
  return [...new Set(words)].sort((a, b) => a.localeCompare(b));
};
