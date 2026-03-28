interface SessionCompleteProps {
  totalDue: number;
  correctCount: number;
  onExit: () => void;
  onRestart: () => void;
}

export const SessionComplete = ({
  totalDue,
  correctCount,
  onExit,
  onRestart,
}: SessionCompleteProps) => {
  const pct = totalDue > 0 ? Math.round((correctCount / totalDue) * 100) : 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6">
      <div className="text-6xl">{pct === 100 ? "🎉" : "💪"}</div>
      <h2 className="text-2xl font-bold text-gray-900 text-center">
        {pct === 100 ? "Parfait !" : "Bonne session !"}
      </h2>
      <p className="text-gray-500 text-center">
        {correctCount}/{totalDue} bons du premier coup — {pct}%
      </p>

      <div className="flex gap-3 mt-4">
        <button
          onClick={onExit}
          className="rounded-xl border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ← Retour aux leçons
        </button>
        <button
          onClick={onRestart}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          Recommencer
        </button>
      </div>
    </div>
  );
};
