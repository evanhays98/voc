import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { LuTrash2 } from "react-icons/lu";
import type { LessonCard } from "@vocabulary/utils";

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.2 },
  }),
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.15 } },
};

interface BuilderCardItemProps {
  card: LessonCard;
  index: number;
  onRemove: (id: string) => void;
  isReduced: boolean;
}

const BuilderCardItem = ({ card, index, onRemove, isReduced }: BuilderCardItemProps) => (
  <motion.div
    key={card.id}
    layout
    variants={isReduced ? undefined : itemVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    custom={index}
    className="bg-white/80 rounded-xl border border-gray-100 px-4 py-3 flex items-start justify-between gap-3"
  >
    <div className="flex flex-col gap-0.5 min-w-0">
      <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
        {card.targetWord}
        <span className="text-xs font-normal text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-md">
          {card.wordType}
        </span>
      </p>
      <p className="text-xs text-gray-500 truncate">{card.sentence}</p>
      <p className="text-xs text-gray-400 italic truncate">{card.translation}</p>
    </div>
    <button
      type="button"
      onClick={() => onRemove(card.id)}
      className="flex-shrink-0 rounded-lg p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
    >
      <LuTrash2 className="w-3.5 h-3.5" />
    </button>
  </motion.div>
);

interface BuilderCardListProps {
  cards: LessonCard[];
  onRemove: (id: string) => void;
}

export const BuilderCardList = ({ cards, onRemove }: BuilderCardListProps) => {
  const isReduced = useReducedMotion() ?? false;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {cards.length} carte{cards.length > 1 ? "s" : ""} générée{cards.length > 1 ? "s" : ""}
      </p>
      <AnimatePresence>
        {cards.map((card, i) => (
          <BuilderCardItem
            key={card.id}
            card={card}
            index={i}
            onRemove={onRemove}
            isReduced={isReduced}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
