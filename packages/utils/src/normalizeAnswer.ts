export const normalizeAnswer = (str: string): string =>
  str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

export const isAnswerCorrect = (input: string, target: string): boolean =>
  normalizeAnswer(input) === normalizeAnswer(target);

export const isAnswerExact = (input: string, target: string): boolean =>
  input.trim() === target.trim();
