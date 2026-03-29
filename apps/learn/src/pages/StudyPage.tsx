import { useParams, useNavigate } from "react-router-dom";
import { getLessonBySlug, ALL_LESSONS } from "../lessons";
import { useProgress, useProgressFn } from "../store/progressStoreInstance";
import { useCustomLessons } from "../store/customLessonsStoreInstance";
import { useSettings } from "../store/settingsStoreInstance";
import { StudySession } from "../components/StudySession";
import { shuffleArray } from "@vocabulary/utils";
import { useMemo } from "react";

export function StudyPage() {
  const { lessonSlug } = useParams<{ lessonSlug: string }>();
  const navigate = useNavigate();
  const progress = useProgress();
  const customLessons = useCustomLessons();
  const settings = useSettings();
  const { getSessionCards, getMasteredTargetWords } = useProgressFn();

  const lesson =
    getLessonBySlug(lessonSlug ?? "") ??
    customLessons.lessons.find((l) => l.slug === lessonSlug);

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Leçon introuvable.</p>
      </div>
    );
  }

  const allLessons = [...ALL_LESSONS, ...customLessons.lessons];
  const masteredTargetWords = getMasteredTargetWords(
    lesson.targetLanguage,
    lesson.nativeLanguage,
    allLessons,
  );

  const eligibleCards = lesson.cards.filter(
    (c) => !masteredTargetWords.has(c.targetWord),
  );

  const allCardIds = eligibleCards.map((c) => c.id);
  const { reviewCardIds, newCardIds } = getSessionCards(lesson.id, allCardIds);

  const reviewCards = eligibleCards.filter((c) => reviewCardIds.includes(c.id));
  const newCards = eligibleCards.filter((c) => newCardIds.includes(c.id));
  const cappedNewCards = newCards.slice(0, settings.maxNewCardsPerSession);

  const orderedCards = useMemo(
    () => [...shuffleArray(reviewCards), ...shuffleArray(cappedNewCards)],
    [reviewCards, cappedNewCards],
  );

  return (
    <StudySession
      lesson={lesson}
      dueCards={orderedCards}
      progressByCard={progress.progressByCard}
      onExit={() => navigate("/")}
    />
  );
}
