import { WordTypeBadge } from "./WordTypeBadge";
import type { WordType } from "@vocabulary/utils";

interface InlineSentenceProps {
  sentence: string;
  targetWord: string;
  inputValue: string;
  isCorrect: boolean | null;
  isRevealed: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  wordType: WordType;
  hint: string;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const InlineSentence = ({
  sentence,
  targetWord,
  inputValue,
  isCorrect,
  isRevealed,
  onChange,
  onSubmit,
  wordType,
  hint,
  inputRef,
}: InlineSentenceProps) => {
  const parts = sentence.split("____");
  const before = parts[0] ?? "";
  const after = parts[1] ?? "";

  // Auto-size: grow with typed content, minimum = target word length + padding
  const inputWidth = Math.max(inputValue.length + 2, targetWord.length + 2, 6);

  const borderColor =
    isCorrect === null
      ? "border-gray-300 focus-within:border-indigo-500"
      : isCorrect
      ? "border-green-400"
      : "border-red-400";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSubmit();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline flex-wrap gap-x-1 text-2xl font-medium text-gray-800 leading-relaxed">
        <span>{before}</span>

        <span
          className={`inline-flex items-center border-b-2 px-1 transition-colors ${borderColor}`}
        >
          {isRevealed ? (
            <span
              className={`font-bold ${isCorrect ? "text-green-600" : "text-red-500"}`}
              style={{ minWidth: `${Math.max(targetWord.length + 2, 6)}ch` }}
            >
              {targetWord}
            </span>
          ) : (
            <input
              ref={inputRef}
              autoFocus
              value={inputValue}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent outline-none text-indigo-700 placeholder-gray-300"
              style={{ width: `${inputWidth}ch` }}
              placeholder="..."
              disabled={isRevealed}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
            />
          )}
        </span>

        <span>{after}</span>
      </div>

      <div className="flex items-center gap-2">
        <WordTypeBadge wordType={wordType} />
        <span className="text-xs text-gray-400 italic">{hint}</span>
        {!isRevealed && (
          <span className="ml-auto text-xs font-medium text-gray-400 tabular-nums">
            {targetWord.replace(/\s+/g, "").length} lettres
          </span>
        )}
      </div>
    </div>
  );
};
