import type { WordType } from "@vocabulary/utils";

const colorMap: Record<WordType, string> = {
  verb: "bg-violet-100 text-violet-700",
  noun: "bg-blue-100 text-blue-700",
  adjective: "bg-amber-100 text-amber-700",
  adverb: "bg-teal-100 text-teal-700",
  preposition: "bg-pink-100 text-pink-700",
  pronoun: "bg-orange-100 text-orange-700",
  conjunction: "bg-lime-100 text-lime-700",
  other: "bg-gray-100 text-gray-600",
};

interface WordTypeBadgeProps {
  wordType: WordType;
}

export const WordTypeBadge = ({ wordType }: WordTypeBadgeProps) => (
  <span
    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${colorMap[wordType]}`}
  >
    {wordType}
  </span>
);
