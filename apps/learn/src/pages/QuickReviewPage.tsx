import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ALL_LESSONS } from "../lessons";
import { useProgress } from "../store/progressStoreInstance";
import { StudySession } from "../components/StudySession";

export function QuickReviewPage() {
  const navigate = useNavigate();
  const progress = useProgress();

  const { quickLesson, dueCards } = useMemo(() => {
    const now = Date.now();
    const cards = ALL_LESSONS.flatMap((lesson) =>
      lesson.cards
        .filter((c) => {
          const p = progress.progressByCard[c.id];
          return !p || (p.level < 5 && p.nextReviewAt <= now);
        })
        .map((c) => ({ ...c, targetLanguage: lesson.targetLanguage }))
    );

    const lesson = {
      id: "quick-review",
      slug: "quick-review",
      title: "Révision rapide",
      description: "Tous les mots dus à réviser",
      targetLanguage: "fr",
      nativeLanguage: "en",
      color: "violet" as const,
      emoji: "⚡",
      cards,
    };

    return { quickLesson: lesson, dueCards: cards };
  }, [progress.progressByCard]);

  if (!progress.isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Chargement…</p>
      </div>
    );
  }

  return (
    <StudySession
      lesson={quickLesson}
      dueCards={dueCards}
      progressByCard={progress.progressByCard}
      onExit={() => navigate("/")}
    />
  );
}
