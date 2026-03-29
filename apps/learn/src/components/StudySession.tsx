import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import type { Lesson, LessonCard, CardProgress } from "@vocabulary/utils";
import { VocabCard } from "./VocabCard";
import { SessionComplete } from "./SessionComplete";
import { useProgressFn } from "../store/progressStoreInstance";
import { SessionHeader } from "./SessionHeader";
import { useConfetti } from "../hooks/useConfetti";

const RETRY_OFFSET = 10;

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
  const [queue, setQueue] = useState<LessonCard[]>(dueCards);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [sessionStreak, setSessionStreak] = useState(0);
  const totalUniqueRef = useRef(dueCards.length);
  const seenRef = useRef(0);

  const { recordSuccess, recordFailure } = useProgressFn();
  const { triggerConfetti, triggerSmallConfetti } = useConfetti();

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

  const current = queue[0];

  const handleCorrect = () => {
    if (!current) return;
    const wasLevel = progressByCard[current.id]?.level;
    recordSuccess(current.id, lesson.id);

    const willMaster = wasLevel === 4 || wasLevel === undefined;
    if (willMaster) {
      triggerConfetti();
    }

    const newStreak = sessionStreak + 1;
    setSessionStreak(newStreak);
    if (newStreak > 0 && newStreak % 3 === 0 && !willMaster) {
      triggerSmallConfetti();
    }

    setCorrectCount((n) => n + 1);
    seenRef.current += 1;
    const rest = queue.slice(1);
    if (rest.length === 0) {
      setIsComplete(true);
    } else {
      setQueue(rest);
    }
  };

  const handleWrong = () => {
    if (!current) return;
    recordFailure(current.id, lesson.id);
    setSessionStreak(0);
    seenRef.current += 1;

    const rest = queue.slice(1);
    const insertAt = Math.min(RETRY_OFFSET, rest.length);
    const withRetry = [...rest.slice(0, insertAt), current, ...rest.slice(insertAt)];
    setQueue(withRetry);
  };

  const restart = () => {
    setQueue(dueCards);
    setCorrectCount(0);
    setIsComplete(false);
    setSessionStreak(0);
    seenRef.current = 0;
  };

  if (isComplete) {
    return (
      <SessionComplete
        totalDue={totalUniqueRef.current}
        correctCount={correctCount}
        onExit={onExit}
        onRestart={restart}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      <SessionHeader
        title={lesson.title}
        current={Math.min(seenRef.current + 1, totalUniqueRef.current)}
        total={totalUniqueRef.current}
        streak={sessionStreak}
        onExit={onExit}
      />

      <main className="flex-1 flex items-start justify-center px-6 py-10">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            {current && (
              <VocabCard
                key={`${current.id}-${seenRef.current}`}
                card={current}
                targetLanguage={lesson.targetLanguage}
                progress={progressByCard[current.id]}
                onCorrect={handleCorrect}
                onWrong={handleWrong}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
