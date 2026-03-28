import { useState } from "react";
import { InlineSentence } from "./InlineSentence";
import type { LessonCard, CardProgress } from "@vocabulary/utils";

interface VocabCardProps {
  card: LessonCard;
  progress: CardProgress | undefined;
  onCorrect: () => void;
  onWrong: () => void;
}

export const VocabCard = ({ card, progress, onCorrect, onWrong }: VocabCardProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const level = progress?.level ?? 0;

  const submit = () => {
    if (isRevealed) return;
    const normalised = inputValue.trim().toLowerCase();
    const correct = normalised === card.targetWord.toLowerCase();
    setIsCorrect(correct);
    setIsRevealed(true);
    if (correct) {
      onCorrect();
    } else {
      onWrong();
    }
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white shadow-md p-8 flex flex-col gap-6">
      <InlineSentence
        sentence={card.sentence}
        targetWord={card.targetWord}
        inputValue={inputValue}
        isCorrect={isCorrect}
        isRevealed={isRevealed}
        onChange={setInputValue}
        onSubmit={submit}
        wordType={card.wordType}
        hint={card.hint}
      />

      {isRevealed && (
        <TranslationBlock
          translation={card.translation}
          nativeWord={card.nativeWord}
          isCorrect={isCorrect!}
        />
      )}

      {!isRevealed && (
        <div className="flex justify-end">
          <button
            onClick={submit}
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            Valider →
          </button>
        </div>
      )}

      {isRevealed && (
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <LevelIndicator level={level} />
          <NextButton isCorrect={isCorrect!} onNext={isCorrect ? onCorrect : onWrong} />
        </div>
      )}
    </div>
  );
};

interface TranslationBlockProps {
  translation: string;
  nativeWord: string;
  isCorrect: boolean;
}

const TranslationBlock = ({ translation, nativeWord, isCorrect }: TranslationBlockProps) => (
  <div className={`rounded-xl px-4 py-3 text-sm ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
    <p className="text-gray-500 italic">{translation}</p>
    <p className="mt-1 font-semibold text-gray-700">
      → <span className="text-indigo-600">{nativeWord}</span>
    </p>
  </div>
);

interface LevelIndicatorProps {
  level: number;
}

const LevelIndicator = ({ level }: LevelIndicatorProps) => (
  <div className="flex items-center gap-1.5">
    {[1, 2, 3, 4, 5].map((dot) => (
      <span
        key={dot}
        className={`w-2 h-2 rounded-full ${
          dot <= level ? "bg-indigo-500" : "bg-gray-200"
        }`}
      />
    ))}
    <span className="ml-1 text-xs text-gray-400">niveau {level}/5</span>
  </div>
);

interface NextButtonProps {
  isCorrect: boolean;
  onNext: () => void;
}

const NextButton = ({ isCorrect, onNext }: NextButtonProps) => (
  <button
    onClick={onNext}
    className={`rounded-xl px-5 py-2 text-sm font-semibold transition-colors ${
      isCorrect
        ? "bg-green-500 text-white hover:bg-green-400"
        : "bg-orange-500 text-white hover:bg-orange-400"
    }`}
  >
    {isCorrect ? "Suivant ✓" : "Revoir plus tard →"}
  </button>
);
