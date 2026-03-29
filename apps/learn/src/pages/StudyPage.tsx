import { useParams, useNavigate } from "react-router-dom";
import { getLessonBySlug } from "../lessons";
import { useProgress, useProgressFn } from "../store/progressStoreInstance";
import { useCustomLessons } from "../store/customLessonsStoreInstance";
import { StudySession } from "../components/StudySession";

export function StudyPage() {
  const { lessonSlug } = useParams<{ lessonSlug: string }>();
  const navigate = useNavigate();
  const progress = useProgress();
  const customLessons = useCustomLessons();
  const { getDueCards } = useProgressFn();

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

  const allCardIds = lesson.cards.map((c) => c.id);
  const dueCardIds = getDueCards(lesson.id, allCardIds);
  const dueCards = lesson.cards.filter((c) => dueCardIds.includes(c.id));

  return (
    <StudySession
      lesson={lesson}
      dueCards={dueCards}
      progressByCard={progress.progressByCard}
      onExit={() => navigate("/")}
    />
  );
}
