import type { Lesson } from "@vocabulary/utils";
import { roadLesson } from "./roadLesson";

export const ALL_LESSONS: Lesson[] = [roadLesson];

const staticLessonLoaders: Record<string, () => Promise<Lesson>> = {
  food: async () => {
    const module = await import("./foodLesson");
    return module.foodLesson;
  },
};

export const getLessonBySlug = async (slug: string): Promise<Lesson | undefined> => {
  const staticLesson = ALL_LESSONS.find((l) => l.slug === slug);
  if (staticLesson) return staticLesson;

  const loader = staticLessonLoaders[slug];
  if (!loader) return undefined;

  return loader();
};

export const getAllLessons = async (): Promise<Lesson[]> => {
  const lazyLessons = await Promise.all(
    Object.values(staticLessonLoaders).map((loadLesson) => loadLesson()),
  );

  return [...ALL_LESSONS, ...lazyLessons];
};
