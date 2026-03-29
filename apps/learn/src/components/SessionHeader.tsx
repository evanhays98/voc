import { FaFire } from "react-icons/fa";
import { SpeechToggleButton } from "./SpeechToggleButton";

interface SessionHeaderProps {
  title: string;
  current: number;
  total: number;
  streak: number;
  onExit: () => void;
}

export const SessionHeader = ({ title, current, total, streak, onExit }: SessionHeaderProps) => {
  const pct = Math.round(((current - 1) / total) * 100);

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        <button
          onClick={onExit}
          className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          ← Quitter
        </button>

        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </span>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <SpeechToggleButton />
          {streak >= 2 && (
            <span className="flex items-center gap-1 text-sm font-semibold text-orange-500">
              <FaFire /> {streak}
            </span>
          )}
          <span className="text-sm text-gray-400 tabular-nums">
            {current}/{total}
          </span>
        </div>
      </div>
    </header>
  );
};
