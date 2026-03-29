import { ObservableStore } from "@starter/global-store";
import { saveInDb, getFromDb } from "@starter/global-store";
import type { AppSettings } from "@vocabulary/utils";

const DB_TABLE = "settings";

export class SettingsStore extends ObservableStore {
  dailyGoal = 10;
  hasSeenOnboarding = false;
  lastLessonSlug: string | null = null;
  isLoaded = false;

  async loadFromDb() {
    const saved = await getFromDb<AppSettings>(DB_TABLE);
    if (saved) {
      this.dailyGoal = saved.dailyGoal ?? 10;
      this.hasSeenOnboarding = saved.hasSeenOnboarding ?? false;
      this.lastLessonSlug = saved.lastLessonSlug ?? null;
    }
    this.isLoaded = true;
    this.notify();
  }

  private async persistToDb() {
    await saveInDb<AppSettings>({
      tableName: DB_TABLE,
      data: { dailyGoal: this.dailyGoal, hasSeenOnboarding: this.hasSeenOnboarding, lastLessonSlug: this.lastLessonSlug ?? undefined },
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

  setLastLessonSlug(slug: string) {
    this.lastLessonSlug = slug;
    this.notify();
    this.persistToDb();
  }
}
