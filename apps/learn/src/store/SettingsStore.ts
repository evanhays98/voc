import { ObservableStore } from "@starter/global-store";
import { saveInDb, getFromDb } from "@starter/global-store";
import type { AppSettings } from "@vocabulary/utils";

const DB_TABLE = "settings";

export class SettingsStore extends ObservableStore {
  dailyGoal = 10;
  hasSeenOnboarding = false;
  isSpeechEnabled = true;
  lastLessonSlug: string | null = null;
  maxNewCardsPerSession = 10;
  isLoaded = false;

  async loadFromDb() {
    const saved = await getFromDb<AppSettings>(DB_TABLE);
    if (saved) {
      this.dailyGoal = saved.dailyGoal ?? 10;
      this.hasSeenOnboarding = saved.hasSeenOnboarding ?? false;
      this.isSpeechEnabled = saved.isSpeechEnabled ?? true;
      this.lastLessonSlug = saved.lastLessonSlug ?? null;
      this.maxNewCardsPerSession = saved.maxNewCardsPerSession ?? 10;
    }
    this.isLoaded = true;
    this.notify();
  }

  private async persistToDb() {
    await saveInDb<AppSettings>({
      tableName: DB_TABLE,
      data: {
        dailyGoal: this.dailyGoal,
        hasSeenOnboarding: this.hasSeenOnboarding,
        isSpeechEnabled: this.isSpeechEnabled,
        lastLessonSlug: this.lastLessonSlug ?? undefined,
        maxNewCardsPerSession: this.maxNewCardsPerSession,
      },
    });
  }

  setDailyGoal(goal: number) {
    this.dailyGoal = Math.max(1, Math.min(100, goal));
    this.notify();
    this.persistToDb();
  }

  setHasSeenOnboarding(seen: boolean) {
    this.hasSeenOnboarding = seen;
    this.notify();
    this.persistToDb();
  }

  setIsSpeechEnabled(isEnabled: boolean) {
    this.isSpeechEnabled = isEnabled;
    this.notify();
    this.persistToDb();
  }

  setLastLessonSlug(slug: string) {
    this.lastLessonSlug = slug;
    this.notify();
    this.persistToDb();
  }

  setMaxNewCardsPerSession(max: number) {
    this.maxNewCardsPerSession = Math.max(1, Math.min(200, max));
    this.notify();
    this.persistToDb();
  }
}
