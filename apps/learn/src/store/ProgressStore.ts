import { ObservableStore } from "@starter/global-store";
import { saveInDb, getFromDb } from "@starter/global-store";
import type { CardProgress, UserProgress } from "@vocabulary/utils";
import { SRS_INTERVALS_MINUTES } from "@vocabulary/utils";

const DB_TABLE = "userProgress";

const clampLevel = (n: number): 0 | 1 | 2 | 3 | 4 | 5 => {
  const clamped = Math.min(5, Math.max(0, n));
  return clamped as 0 | 1 | 2 | 3 | 4 | 5;
};

const intervalMs = (level: 0 | 1 | 2 | 3 | 4 | 5): number => {
  const minutes = SRS_INTERVALS_MINUTES[level];
  return minutes === Infinity ? Infinity : minutes * 60 * 1000;
};

export class ProgressStore extends ObservableStore {
  progressByCard: Record<string, CardProgress> = {};
  isLoaded = false;

  async loadFromDb() {
    const saved = await getFromDb<UserProgress>(DB_TABLE);
    if (saved) {
      this.progressByCard = saved.progressByCard;
    }
    this.isLoaded = true;
    this.notify();
  }

  private async persistToDb() {
    await saveInDb<UserProgress>({
      tableName: DB_TABLE,
      data: { progressByCard: this.progressByCard },
    });
  }

  recordSuccess(cardId: string, lessonId: string) {
    const existing = this.progressByCard[cardId];
    const now = Date.now();

    const newLevel = existing ? clampLevel(existing.level + 1) : clampLevel(5);
    const nextReview = newLevel === 5 ? Infinity : now + intervalMs(newLevel);

    this.progressByCard = {
      ...this.progressByCard,
      [cardId]: {
        cardId,
        lessonId,
        level: newLevel,
        nextReviewAt: nextReview,
        lastSeenAt: now,
      },
    };

    this.notify();
    this.persistToDb();
  }

  recordFailure(cardId: string, lessonId: string) {
    const existing = this.progressByCard[cardId];
    const now = Date.now();

    const baseLevel = existing ? Math.max(1, existing.level - 1) : 1;
    const newLevel = clampLevel(baseLevel);
    const nextReview = now + intervalMs(newLevel);

    this.progressByCard = {
      ...this.progressByCard,
      [cardId]: {
        cardId,
        lessonId,
        level: newLevel,
        nextReviewAt: nextReview,
        lastSeenAt: now,
      },
    };

    this.notify();
    this.persistToDb();
  }

  getCardProgress(cardId: string): CardProgress | undefined {
    return this.progressByCard[cardId];
  }

  isMastered(cardId: string): boolean {
    return this.progressByCard[cardId]?.level === 5;
  }

  isDue(cardId: string): boolean {
    const progress = this.progressByCard[cardId];
    if (!progress) return true;
    if (progress.level === 5) return false;
    return Date.now() >= progress.nextReviewAt;
  }

  getDueCards(_lessonId: string, allCardIds: string[]): string[] {
    return allCardIds.filter(
      (id) => !this.isMastered(id) && (!(id in this.progressByCard) || this.isDue(id))
    );
  }

  getLessonStats(allCardIds: string[]) {
    const mastered = allCardIds.filter((id) => this.isMastered(id)).length;
    const learning = allCardIds.filter(
      (id) => id in this.progressByCard && !this.isMastered(id)
    ).length;
    const unseen = allCardIds.length - mastered - learning;
    return { mastered, learning, unseen, total: allCardIds.length };
  }
}

