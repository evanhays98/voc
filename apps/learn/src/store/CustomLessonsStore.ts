import { ObservableStore } from "@starter/global-store";
import { saveInDb, getFromDb } from "@starter/global-store";
import { generateId } from "@vocabulary/utils";
import type { Lesson } from "@vocabulary/utils";

const DB_TABLE = "customLessons";

export class CustomLessonsStore extends ObservableStore {
  lessons: Lesson[] = [];
  isLoaded = false;

  async loadFromDb() {
    const saved = await getFromDb<{ lessons: Lesson[] }>(DB_TABLE);
    if (saved?.lessons) {
      this.lessons = saved.lessons;
    }
    this.isLoaded = true;
    this.notify();
  }

  private async persistToDb() {
    await saveInDb({ tableName: DB_TABLE, data: { lessons: this.lessons } });
  }

  addLesson(lesson: Omit<Lesson, "id" | "isCustom" | "createdAt">) {
    const newLesson: Lesson = {
      ...lesson,
      id: generateId(),
      isCustom: true,
      createdAt: new Date().toISOString(),
    };
    this.lessons = [...this.lessons, newLesson];
    this.notify();
    this.persistToDb();
    return newLesson;
  }

  removeLesson(id: string) {
    this.lessons = this.lessons.filter((l) => l.id !== id);
    this.notify();
    this.persistToDb();
  }

  updateLesson(updated: Lesson) {
    this.lessons = this.lessons.map((l) => (l.id === updated.id ? updated : l));
    this.notify();
    this.persistToDb();
  }
}
