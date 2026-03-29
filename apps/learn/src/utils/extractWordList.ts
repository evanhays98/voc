export const extractWordList = (text: string): string[] => {
  const matches = [...text.matchAll(/[\p{L}\p{M}][\p{L}\p{M}'-]*/gu)];
  const words = matches
    .map(([w]) => w.toLowerCase().replace(/['-]+$/, ""))
    .filter((w) => w.length >= 2);
  return [...new Set(words)].sort((a, b) => a.localeCompare(b));
};
