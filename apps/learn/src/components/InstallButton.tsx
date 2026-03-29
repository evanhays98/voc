import { motion, AnimatePresence } from "framer-motion";
import { LuDownload } from "react-icons/lu";
import { usePwaInstall } from "../hooks/usePwaInstall";

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 22 } },
  exit: { opacity: 0, scale: 0.75, transition: { duration: 0.15 } },
};

export const InstallButton = () => {
  const { canInstall, install } = usePwaInstall();

  return (
    <AnimatePresence>
      {canInstall && (
        <motion.button
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={install}
          className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 active:scale-95 transition-colors"
        >
          <LuDownload className="w-3.5 h-3.5" />
          Installer
        </motion.button>
      )}
    </AnimatePresence>
  );
};
