import { useState } from "react";
import { LuCopy, LuCheck } from "react-icons/lu";

interface ExtractorResultProps {
  words: string[];
}

export const ExtractorResult = ({ words }: ExtractorResultProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(words.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (words.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500">{words.length} mots triés alphabétiquement</p>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
        >
          {copied ? <LuCheck className="w-3.5 h-3.5 text-emerald-500" /> : <LuCopy className="w-3.5 h-3.5" />}
          {copied ? "Copié !" : "Copier la liste"}
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5 max-h-72 overflow-y-auto rounded-xl bg-gray-50 border border-gray-100 p-3">
        {words.map((word) => (
          <span
            key={word}
            className="rounded-lg bg-white border border-indigo-100 px-2 py-0.5 text-xs text-indigo-700 shadow-sm"
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};
