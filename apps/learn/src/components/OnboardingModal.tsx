import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuHand, LuBrain, LuRocket, LuPartyPopper } from "react-icons/lu";

const stepVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 260, damping: 22 } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.18 } },
};

const STEPS = [
  {
    icon: <LuHand className="w-14 h-14 text-indigo-500" />,
    title: "Bienvenue dans Vocab !",
    body: "Apprends du vocabulaire avec des phrases complètes et un système de répétition espacée. Plus tu pratiques, moins tu oublies.",
  },
  {
    icon: <LuBrain className="w-14 h-14 text-indigo-500" />,
    title: "Comment ça marche ?",
    body: "Chaque mot a un niveau (0-5). Réponds correctement → le niveau monte et l'intervalle de révision augmente. Après le niveau 5, le mot est maîtrisé pour toujours.",
  },
  {
    icon: <LuRocket className="w-14 h-14 text-indigo-500" />,
    title: "Fixe-toi un objectif",
    body: "Révise au moins 10 cartes par jour pour construire une habitude solide. Ton tableau de bord te montre ta progression en temps réel.",
  },
];

interface OnboardingModalProps {
  onDone: () => void;
}

export const OnboardingModal = ({ onDone }: OnboardingModalProps) => {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onDone();
    } else {
      setStep((s) => s + 1);
    }
  };

  const current = STEPS[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 24 } }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
      >
        <div className="p-8 flex flex-col items-center text-center gap-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col items-center gap-4"
            >
              <div className="flex items-center justify-center">{current?.icon}</div>
              <h2 className="text-xl font-bold text-gray-900">{current?.title}</h2>
              <p className="text-gray-500 text-sm leading-relaxed">{current?.body}</p>
            </motion.div>
          </AnimatePresence>

          {/* Step dots */}
          <div className="flex items-center gap-2 py-2">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === step ? "bg-indigo-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 active:scale-95 transition-all"
          >
            {isLast ? <span className="flex items-center justify-center gap-1.5">C'est parti ! <LuPartyPopper /></span> : "Suivant →"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
