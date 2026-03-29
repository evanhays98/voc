import type { LessonColor } from "@vocabulary/utils";
import { LESSON_COLORS } from "../../lessons/lessonColors";

const COLORS: LessonColor[] = ["sky", "orange", "violet", "emerald", "rose", "amber"];

interface BuilderLessonMetaProps {
  title: string;
  description: string;
  emoji: string;
  color: LessonColor;
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onEmojiChange: (v: string) => void;
  onColorChange: (v: LessonColor) => void;
}

export const BuilderLessonMeta = ({
  title,
  description,
  emoji,
  color,
  onTitleChange,
  onDescriptionChange,
  onEmojiChange,
  onColorChange,
}: BuilderLessonMetaProps) => (
  <div className="flex flex-col gap-4">
    <div className="flex gap-3 items-end">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Emoji</label>
        <input
          value={emoji}
          onChange={(e) => onEmojiChange(e.target.value.slice(0, 2))}
          className="w-14 border border-gray-200 rounded-xl px-2 py-2 text-center text-xl outline-none focus:border-indigo-400"
        />
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Nom de la leçon *</label>
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="ex : Animaux — Espagnol"
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400"
        />
      </div>
    </div>

    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500">Description</label>
      <input
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Courte description de la leçon"
        className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400"
      />
    </div>

    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-500">Couleur</label>
      <div className="flex gap-2">
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onColorChange(c)}
            className={`w-7 h-7 rounded-full ${LESSON_COLORS[c].dot} transition-transform ${
              color === c ? "ring-2 ring-offset-2 ring-indigo-500 scale-110" : "hover:scale-105"
            }`}
          />
        ))}
      </div>
    </div>
  </div>
);
