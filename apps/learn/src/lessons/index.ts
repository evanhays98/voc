import type { Lesson } from "@vocabulary/utils";
import { roadLesson } from "./roadLesson";
import { foodLesson } from "./foodLesson";

export const ALL_LESSONS: Lesson[] = [roadLesson, foodLesson];

export const getLessonBySlug = (slug: string): Lesson | undefined =>
  ALL_LESSONS.find((l) => l.slug === slug);
