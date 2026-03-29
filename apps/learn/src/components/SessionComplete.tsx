import { motion } from "framer-motion";
import { LuPartyPopper, LuDumbbell } from "react-icons/lu";

const containerVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 22 },
  },
};

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
  const isPerfect = pct === 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 shadow-2xl p-10 flex flex-col items-center gap-6 text-center"
      >
        <div className="text-6xl flex items-center justify-center">
          {isPerfect ? <LuPartyPopper className="text-indigo-500" /> : <LuDumbbell className="text-violet-500" />}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isPerfect ? "Parfait !" : "Bonne session !"}
          </h2>
          <p className="mt-1 text-gray-500 text-sm">Session terminée</p>
        </div>

        {/* Score ring */}
        <div className="flex items-center justify-center gap-6">
          <ScoreStat value={correctCount} label="Corrects" color="text-green-600" />
          <div className="w-px h-10 bg-gray-200" />
          <ScoreStat value={totalDue - correctCount} label="Ratés" color="text-red-500" />
          <div className="w-px h-10 bg-gray-200" />
          <ScoreStat value={`${pct}%`} label="Score" color="text-indigo-600" />
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${isPerfect ? "from-green-400 to-emerald-500" : "from-indigo-500 to-violet-500"} transition-all duration-700`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={onExit}
            className="flex-1 rounded-xl border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← Accueil
          </button>
          <button
            onClick={onRestart}
            className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 active:scale-95 transition-all"
          >
            Recommencer
          </button>
        </div>
      </motion.div>
    </div>
  );
};

interface ScoreStatProps {
  value: number | string;
  label: string;
  color: string;
}

const ScoreStat = ({ value, label, color }: ScoreStatProps) => (
  <div className="flex flex-col items-center gap-0.5">
    <span className={`text-2xl font-bold ${color}`}>{value}</span>
    <span className="text-xs text-gray-400">{label}</span>
  </div>
);
