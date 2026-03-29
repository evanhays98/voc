import { LuLightbulb } from "react-icons/lu";

interface HintButtonProps {
  revealed: number;
  max: number;
  hintText: string;
  onReveal: () => void;
  disabled: boolean;
}

export const HintButton = ({ revealed, max, hintText, onReveal, disabled }: HintButtonProps) => {
  const canReveal = !disabled && revealed < max;

  return (
    <div className="flex items-center gap-2">
      {revealed > 0 && (
        <span className="text-xs font-mono bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-md tracking-widest">
          {hintText}
          {"·".repeat(max - revealed)}
        </span>
      )}
      <button
        type="button"
        onClick={onReveal}
        disabled={!canReveal}
        title={canReveal ? "Indice" : "Plus d'indices"}
        className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium border transition-colors ${
          canReveal
            ? "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100"
            : "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
        }`}
      >
        <LuLightbulb className="w-3.5 h-3.5" /> {revealed > 0 ? `${revealed}/${max}` : "Indice"}
      </button>
    </div>
  );
};
