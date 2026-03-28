// ─── Lesson (built-in, static) ───────────────────────────────────────────────

export type WordType =
  | "verb"
  | "noun"
  | "adjective"
  | "adverb"
  | "preposition"
  | "pronoun"
  | "conjunction"
  | "other";

export interface LessonCard {
  id: string;
  targetWord: string;           // e.g. "mange"  (word to find, in target language)
  sentence: string;             // e.g. "Je ____ des pâtes."  (use ____ as placeholder)
  translation: string;          // Translation of full sentence in native language
  nativeWord: string;           // Native equivalent of targetWord, e.g. "eat"
  hint: string;                 // Grammatical hint, e.g. "1st person singular, present"
  wordType: WordType;
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;                // e.g. "Code de la route"
  description: string;
  targetLanguage: string;       // e.g. "fr"
  nativeLanguage: string;       // e.g. "en"
  cards: LessonCard[];
}

// ─── SRS Progress (persisted in IndexedDB via global-store) ──────────────────

export type SrsLevel = 0 | 1 | 2 | 3 | 4 | 5;

// Minutes before the card is eligible for review again at each level
export const SRS_INTERVALS_MINUTES: Record<SrsLevel, number> = {
  0: 0,     // never seen / failed at lvl 0 → show again immediately
  1: 5,     // failed once → 5 min
  2: 30,    // lvl 2 → 30 min
  3: 120,   // lvl 3 → 2 h
  4: 1440,  // lvl 4 → 1 day
  5: Infinity, // mastered → never show again
};

export interface CardProgress {
  cardId: string;
  lessonId: string;
  level: SrsLevel;             // 0 = unseen / failed, 5 = mastered
  nextReviewAt: number;        // timestamp ms; 0 = immediately due
  lastSeenAt: number;          // timestamp ms
}

export interface UserProgress {
  progressByCard: Record<string, CardProgress>; // key = cardId
}
