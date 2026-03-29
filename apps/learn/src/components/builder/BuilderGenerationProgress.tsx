import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

const barVariants = {
  initial: { width: "0%" },
  animate: (pct: number) => ({
    width: `${pct}%`,
    transition: { duration: 0.35, ease: "easeOut" as const },
  }),
};

interface BuilderGenerationProgressProps {
  completed: number;
  total: number;
  failed: number;
}

export const BuilderGenerationProgress = ({
  completed,
  total,
  failed,
}: BuilderGenerationProgressProps) => {
  const shouldReduceMotion = useReducedMotion();
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-3 py-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {completed < total ? "Génération en cours…" : "Génération terminée"}
        </span>
        <span className="text-sm text-gray-500 tabular-nums">
          {completed}/{total} lot{total > 1 ? "s" : ""}
        </span>
      </div>

      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
          variants={shouldReduceMotion ? undefined : barVariants}
          initial="initial"
          animate="animate"
          custom={pct}
          style={shouldReduceMotion ? { width: `${pct}%` } : undefined}
        />
      </div>

      {failed > 0 && (
        <p className="text-xs text-red-500">
          {failed} lot{failed > 1 ? "s" : ""} en erreur — vérifiez votre clé API.
        </p>
      )}
    </div>
  );
};
