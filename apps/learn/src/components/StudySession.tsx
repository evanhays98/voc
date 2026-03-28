import { useState, useMemo } from "react";
import type { Lesson, LessonCard, CardProgress } from "@vocabulary/utils";
import { shuffleArray } from "@vocabulary/utils";
import { VocabCard } from "./VocabCard";
import { SessionComplete } from "./SessionComplete";
import { useProgressFn } from "../store/progressStoreInstance";
import { SessionHeader } from "./SessionHeader";

interface StudySessionProps {
  lesson: Lesson;
  dueCards: LessonCard[];
  progressByCard: Record<string, CardProgress>;
  onExit: () => void;
}

export const StudySession = ({
  lesson,
  dueCards,
  progressByCard,
  onExit,
}: StudySessionProps) => {
  const shuffled = useMemo(() => shuffleArray(dueCards), [dueCards]);
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const { recordSuccess, recordFailure } = useProgressFn();

  if (dueCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6">
        <p className="text-4xl">✅</p>
        <h2 className="text-xl font-bold text-gray-900">Rien à réviser pour le moment !</h2>
        <p className="text-gray-500 text-center text-sm">
          Tous les mots sont maîtrisés ou en attente de leur intervalle de révision.
        </p>
        <button
          onClick={onExit}
          className="mt-4 rounded-xl border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ← Retour aux leçons
        </button>
      </div>
    );
  }

  const current = shuffled[index];

  const advance = () => {
    if (index + 1 >= shuffled.length) {
      setIsComplete(true);
    } else {
      setIndex((i) => i + 1);
    }
  };

  const handleCorrect = () => {
    if (!current) return;
    recordSuccess(current.id, lesson.id);
    setCorrectCount((n) => n + 1);
    advance();
  };

  const handleWrong = () => {
    if (!current) return;
    recordFailure(current.id, lesson.id);
    advance();
  };

  const restart = () => {
    setIndex(0);
    setCorrectCount(0);
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <SessionComplete
        totalDue={dueCards.length}
        correctCount={correctCount}
        onExit={onExit}
        onRestart={restart}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SessionHeader
        title={lesson.title}
        current={index + 1}
        total={shuffled.length}
        onExit={onExit}
      />

      <main className="flex-1 flex items-start justify-center px-6 py-10">
        <div className="w-full max-w-xl">
          {current && (
            <VocabCard
              key={current.id}
              card={current}
              targetLanguage={lesson.targetLanguage}
              progress={progressByCard[current.id]}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
            />
          )}
        </div>
      </main>
    </div>
  );
};
