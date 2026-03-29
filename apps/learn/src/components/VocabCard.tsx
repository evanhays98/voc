import { useState, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { LuMic, LuMicOff, LuVolume2 } from "react-icons/lu";
import { InlineSentence } from "./InlineSentence";
import { AccentKeyTray } from "./AccentKeyTray";
import { HintButton } from "./HintButton";
import type { LessonCard, CardProgress } from "@vocabulary/utils";
import { isAnswerCorrect, isAnswerExact } from "@vocabulary/utils";
import { useSpeech } from "../hooks/useSpeech";
import { useVoiceInput } from "../hooks/useVoiceInput";
import { useSettings } from "../store/settingsStoreInstance";

// ─── Animation variants ───────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 26 },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: -22,
    transition: { duration: 0.18, ease: "easeIn" as const },
  },
};

const feedbackVariants = {
  idle: { x: 0 },
  shake: {
    x: [0, -14, 14, -10, 10, -6, 6, 0],
    transition: { duration: 0.44 },
  },
  pulse: {
    scale: [1, 1.018, 1],
    transition: { duration: 0.38 },
  },
};

// ─── VocabCard ────────────────────────────────────────────────────────────────

interface VocabCardProps {
  card: LessonCard;
  targetLanguage: string;
  progress: CardProgress | undefined;
  onCorrect: () => void;
  onWrong: () => void;
  onAssisted: () => void;
}

export const VocabCard = ({
  card,
  targetLanguage,
  progress,
  onCorrect,
  onWrong,
  onAssisted,
}: VocabCardProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const settings = useSettings();
  const { speak, isSpeaking, skip } = useSpeech();
  const { isListening, isSupported: isVoiceSupported, startListening, stopListening } =
    useVoiceInput();
  const feedbackControls = useAnimationControls();

  const cardLang = card.targetLanguage ?? targetLanguage;
  const level = progress?.level ?? 0;
  const maxHints = Math.max(card.targetWord.length - 1, 0);
  const hintText = card.targetWord.slice(0, hintsRevealed);

  const revealHint = () => {
    if (hintsRevealed < maxHints) setHintsRevealed((n) => n + 1);
  };

  const insertAccent = (char: string) => {
    const input = inputRef.current;
    if (!input) {
      setInputValue((v) => v + char);
      return;
    }
    const start = input.selectionStart ?? inputValue.length;
    const end = input.selectionEnd ?? inputValue.length;
    const next = inputValue.slice(0, start) + char + inputValue.slice(end);
    setInputValue(next);
    requestAnimationFrame(() => {
      input.setSelectionRange(start + char.length, start + char.length);
      input.focus();
    });
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(cardLang, (text) => setInputValue(text));
    }
  };

  const advance = (correct: boolean, usedHints: boolean) => {
    if (correct && usedHints) onAssisted();
    else if (correct) onCorrect();
    else onWrong();
  };

  const playSentenceOrAdvance = (correct: boolean, usedHints: boolean) => {
    const spokenSentence = card.sentence.replace("____", card.targetWord);
    speak(spokenSentence, cardLang, () => advance(correct, usedHints), !settings.isSpeechEnabled);
  };

  const submit = () => {
    if (isRevealed) return;
    const correct = isAnswerCorrect(inputValue, card.targetWord);
    const usedHints = hintsRevealed > 0;
    setIsCorrect(correct);
    setIsRevealed(true);

    if (correct && !usedHints) {
      feedbackControls.start("pulse");
    } else if (!correct) {
      feedbackControls.start("shake");
    }

    playSentenceOrAdvance(correct, usedHints);
  };

  const replayAndAdvance = () => {
    const spokenSentence = card.sentence.replace("____", card.targetWord);
    const usedHints = hintsRevealed > 0;
    speak(spokenSentence, cardLang, () => advance(isCorrect!, usedHints), !settings.isSpeechEnabled);
  };

  const hasAccentMismatch =
    isRevealed && isCorrect === true && !isAnswerExact(inputValue, card.targetWord);

  const usedHints = hintsRevealed > 0;
  const borderClass =
    isCorrect === null
      ? "border-white/60"
      : isCorrect && !usedHints
      ? "border-green-200"
      : isCorrect && usedHints
      ? "border-amber-200"
      : "border-red-200";

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" exit="exit">
      <motion.div
        variants={feedbackVariants}
        animate={feedbackControls}
        initial="idle"
        className={`rounded-3xl bg-white/85 backdrop-blur-sm border shadow-2xl p-5 sm:p-8 flex flex-col gap-5 sm:gap-6 transition-colors ${borderClass}`}
      >
        <div className="flex items-center justify-between">
          <LevelIndicator level={level} />
          <HintButton
            revealed={hintsRevealed}
            max={maxHints}
            hintText={hintText}
            onReveal={revealHint}
            disabled={isRevealed}
          />
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
          inputRef={inputRef}
        />

        <TranslationBlock
          translation={card.translation}
          nativeWord={card.nativeWord}
          isCorrect={isRevealed ? isCorrect : null}
          hasAccentMismatch={hasAccentMismatch}
        />

        {!isRevealed && (
          <div className="flex flex-col gap-3">
            <AccentKeyTray lang={cardLang} onAccent={insertAccent} />
            <div className="flex items-center gap-3">
              {isVoiceSupported && (
                <VoiceButton isListening={isListening} onToggle={handleVoiceToggle} />
              )}
              <button
                onClick={submit}
                className="ml-auto rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 active:scale-95 transition-all"
              >
                Valider →
              </button>
            </div>
          </div>
        )}

        {isRevealed && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <SpeakingIndicator isSpeaking={isSpeaking} isCorrect={isCorrect!} />
            <div className="flex items-center gap-3">
              {!isSpeaking && (
                <button
                  onClick={replayAndAdvance}
                  className="flex items-center gap-1.5 text-xs rounded-lg border border-gray-200 px-3 py-1.5 text-gray-500 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
                >
                  <LuVolume2 className="w-3.5 h-3.5" /> {settings.isSpeechEnabled ? "Réécouter" : "Relire"}
                </button>
              )}
              <button
                onClick={skip}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
              >
                Passer →
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface LevelIndicatorProps {
  level: number;
}

const LevelIndicator = ({ level }: LevelIndicatorProps) => {
  const label =
    level === 0 ? "Nouveau" : level === 5 ? "✓ Maîtrisé" : `Niveau ${level}/5`;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((dot) => (
          <span
            key={dot}
            className={`w-2 h-2 rounded-full transition-colors ${
              level === 0 ? "bg-gray-200" : dot <= level ? "bg-indigo-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-gray-400">{label}</span>
    </div>
  );
};

interface TranslationBlockProps {
  translation: string;
  nativeWord: string;
  isCorrect: boolean | null;
  hasAccentMismatch?: boolean;
}

const TranslationBlock = ({
  translation,
  nativeWord,
  isCorrect,
  hasAccentMismatch,
}: TranslationBlockProps) => {
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
      {hasAccentMismatch && (
        <p className="mt-1.5 text-xs text-amber-600 font-medium">⚠ Attention aux accents !</p>
      )}
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
      {isSpeaking ? "Lecture…" : isCorrect ? "Correct ✓" : "Incorrect ✗"}
    </span>
  </div>
);

interface VoiceButtonProps {
  isListening: boolean;
  onToggle: () => void;
}

const VoiceButton = ({ isListening, onToggle }: VoiceButtonProps) => (
  <button
    type="button"
    onClick={onToggle}
    title={isListening ? "Arrêter" : "Dicter ma réponse"}
    className={`rounded-xl border px-3 py-2.5 text-sm transition-all ${
      isListening
        ? "border-rose-300 bg-rose-50 text-rose-600 animate-pulse"
        : "border-gray-200 bg-gray-50 text-gray-500 hover:border-indigo-300 hover:text-indigo-600"
    }`}
  >
    {isListening ? <LuMicOff className="w-4 h-4" /> : <LuMic className="w-4 h-4" />}
  </button>
);
