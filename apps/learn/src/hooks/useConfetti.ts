import { useCallback } from "react";
import confetti from "canvas-confetti";

const INDIGO_PALETTE = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#4ade80", "#fb923c"];

export const useConfetti = () => {
  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.55 },
      colors: INDIGO_PALETTE,
      scalar: 1.1,
    });
  }, []);

  const triggerSmallConfetti = useCallback(() => {
    confetti({
      particleCount: 45,
      spread: 55,
      origin: { y: 0.65 },
      colors: INDIGO_PALETTE,
      scalar: 0.9,
    });
  }, []);

  return { triggerConfetti, triggerSmallConfetti };
};
