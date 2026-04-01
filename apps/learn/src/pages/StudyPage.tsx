import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Lesson } from "@vocabulary/utils";
import { getLessonBySlug, getAllLessons } from "../lessons";
import { useProgress, useProgressFn } from "../store/progressStoreInstance";
import { useCustomLessons } from "../store/customLessonsStoreInstance";
import { useSettings } from "../store/settingsStoreInstance";
import { StudySession } from "../components/StudySession";
import { shuffleArray } from "@vocabulary/utils";

export function StudyPage() {
  const { lessonSlug } = useParams<{ lessonSlug: string }>();
  const navigate = useNavigate();
  const progress = useProgress();
  const customLessons = useCustomLessons();
  const settings = useSettings();
  const { getSessionCards, getMasteredTargetWords } = useProgressFn();
  const [builtInLessons, setBuiltInLessons] = useState<Lesson[]>([]);
  const [lesson, setLesson] = useState<Lesson | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLesson = async () => {
      setIsLoading(true);
      const foundLesson =
        (await getLessonBySlug(lessonSlug ?? "")) ??
        customLessons.lessons.find((l) => l.slug === lessonSlug);
      const lessons = await getAllLessons();
      setLesson(foundLesson);
      setBuiltInLessons(lessons);
      setIsLoading(false);
    };

    loadLesson();
  }, [lessonSlug, customLessons.lessons]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Chargement de la leçon...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Leçon introuvable.</p>
      </div>
    );
  }

  const allLessons = [...builtInLessons, ...customLessons.lessons];
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

  const reviewKey = reviewCardIds.sort().join(",");
  const newKey = newCardIds.sort().join(",");
  const prevKeyRef = useRef("");
  const cardsRef = useRef<typeof eligibleCards>([]);

  const currentKey = `${reviewKey}|${newKey}|${settings.maxNewCardsPerSession}`;
  if (prevKeyRef.current !== currentKey) {
    prevKeyRef.current = currentKey;
    const shuffledNew = shuffleArray(newCards);
    const cappedNew = shuffledNew.slice(0, settings.maxNewCardsPerSession);
    cardsRef.current = [...shuffleArray(reviewCards), ...cappedNew];
  }

  return (
    <StudySession
      lesson={lesson}
      initialCards={cardsRef.current}
      allCards={eligibleCards}
      allLessons={allLessons}
      progressByCard={progress.progressByCard}
      onExit={() => navigate("/")}
    />
  );
}
