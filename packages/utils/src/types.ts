// ─── Lesson colours ──────────────────────────────────────────────────────────

export type LessonColor = "sky" | "orange" | "violet" | "emerald" | "rose" | "amber";

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
  targetWord: string;
  sentence: string;
  translation: string;
  nativeWord: string;
  hint: string;
  wordType: WordType;
  targetLanguage?: string; // override for cross-lesson sessions
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  targetLanguage: string;
  nativeLanguage: string;
  cards: LessonCard[];
  color?: LessonColor;
  emoji?: string;
  isCustom?: boolean;
  createdAt?: string;
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
  level: SrsLevel;
  nextReviewAt: number;
  lastSeenAt: number;
}

export interface DailyActivity {
  correct: number;
  total: number;
}

export interface AppSettings {
  dailyGoal: number;
  hasSeenOnboarding: boolean;
}

export interface UserProgress {
  progressByCard: Record<string, CardProgress>;
  dailyActivity?: Record<string, DailyActivity>;
}
