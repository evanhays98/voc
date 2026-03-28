import { useState } from "react";
import { InlineSentence } from "./InlineSentence";
import type { LessonCard, CardProgress } from "@vocabulary/utils";
import { useSpeech } from "../hooks/useSpeech";

interface VocabCardProps {
  card: LessonCard;
  targetLanguage: string;
  progress: CardProgress | undefined;
  onCorrect: () => void;
  onWrong: () => void;
}

export const VocabCard = ({ card, targetLanguage, progress, onCorrect, onWrong }: VocabCardProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const { speak, isSpeaking, skip } = useSpeech();
  const level = progress?.level ?? 0;

  const handleNext = (correct: boolean) => {
    if (correct) onCorrect();
    else onWrong();
  };

  const submit = () => {
    if (isRevealed) return;
    const normalised = inputValue.trim().toLowerCase();
    const correct = normalised === card.targetWord.toLowerCase();
    setIsCorrect(correct);
    setIsRevealed(true);

    const spokenSentence = card.sentence.replace("____", card.targetWord);
    speak(spokenSentence, targetLanguage, () => handleNext(correct));
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white shadow-md p-8 flex flex-col gap-6">
      {/* Always-visible: level badge */}
      <div className="flex items-center justify-between">
        <LevelIndicator level={level} />
      </div>

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

      {/* Always-visible: native translation block */}
      <TranslationBlock
        translation={card.translation}
        nativeWord={card.nativeWord}
        isCorrect={isRevealed ? isCorrect : null}
      />

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
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <SpeakingIndicator isSpeaking={isSpeaking} isCorrect={isCorrect!} />
          <button
            onClick={skip}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
          >
            Passer →
          </button>
        </div>
      )}
    </div>
  );
};

interface TranslationBlockProps {
  translation: string;
  nativeWord: string;
  isCorrect: boolean | null; // null = not yet answered
}

const TranslationBlock = ({ translation, nativeWord, isCorrect }: TranslationBlockProps) => {
  const bg =
    isCorrect === null
      ? "bg-gray-50 border-gray-200"
      : isCorrect
      ? "bg-green-50 border-green-200"
      : "bg-red-50 border-red-200";

  return (
    <div className={`rounded-xl px-4 py-3 text-sm border ${bg} transition-colors`}>
      <p className="text-gray-500 italic">{translation}</p>
      <p className="mt-1 font-semibold text-gray-700">
        → <span className="text-indigo-600">{nativeWord}</span>
      </p>
    </div>
  );
};

interface LevelIndicatorProps {
  level: number;
}

const LevelIndicator = ({ level }: LevelIndicatorProps) => {
  const label = level === 0 ? "Nouveau" : level === 5 ? "Maîtrisé" : `Niveau ${level}/5`;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((dot) => (
          <span
            key={dot}
            className={`w-2 h-2 rounded-full transition-colors ${
              level === 0
                ? "bg-gray-200"
                : dot <= level
                ? "bg-indigo-500"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-gray-400">{label}</span>
    </div>
  );
};

interface SpeakingIndicatorProps {
  isSpeaking: boolean;
  isCorrect: boolean;
}

const SpeakingIndicator = ({ isSpeaking, isCorrect }: SpeakingIndicatorProps) => (
  <div className="flex items-center gap-2">
    <span
      className={`w-2 h-2 rounded-full ${
        isSpeaking
          ? "bg-indigo-400 animate-pulse"
          : isCorrect
          ? "bg-green-400"
          : "bg-red-400"
      }`}
    />
    <span className="text-xs text-gray-400">
      {isSpeaking ? "Lecture en cours…" : isCorrect ? "Correct ✓" : "Incorrect ✗"}
    </span>
  </div>
);
