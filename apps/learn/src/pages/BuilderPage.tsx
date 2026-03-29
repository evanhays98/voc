import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { LessonColor } from "@vocabulary/utils";
import { useCustomLessonsFn } from "../store/customLessonsStoreInstance";
import { useCardGenerator, type ModelId } from "../hooks/useCardGenerator";
import { BuilderLessonMeta } from "../components/builder/BuilderLessonMeta";
import { BuilderLanguagePicker } from "../components/builder/BuilderLanguagePicker";
import { BuilderAiConfig } from "../components/builder/BuilderAiConfig";
import { BuilderWordList, parseWords } from "../components/builder/BuilderWordList";
import { BuilderGenerationProgress } from "../components/builder/BuilderGenerationProgress";
import { BuilderCardList } from "../components/builder/BuilderCardList";
import { LuSparkles, LuBookmark, LuRefreshCw, LuCopy, LuCheck } from "react-icons/lu";

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function BuilderPage() {
  const navigate = useNavigate();
  const { addLesson } = useCustomLessonsFn();
  const generator = useCardGenerator();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("📚");
  const [color, setColor] = useState<LessonColor>("violet");
  const [targetLanguage, setTargetLanguage] = useState("fr");
  const [nativeLanguage, setNativeLanguage] = useState("en");
  const [model, setModel] = useState<ModelId>("gpt-5.4");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("vocab_api_key") ?? "");
  const [wordListRaw, setWordListRaw] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleApiKeyChange = (v: string) => {
    setApiKey(v);
    localStorage.setItem("vocab_api_key", v);
  };

  const handleGenerate = async () => {
    const words = parseWords(wordListRaw);
    if (words.length === 0) {
      setError("Ajoute au moins un mot.");
      return;
    }
    if (!apiKey.trim()) {
      setError("Clé API requise.");
      return;
    }
    setError(null);
    await generator.generate({ words, targetLanguage, nativeLanguage, model, apiKey });
  };

  const handleSave = () => {
    if (!title.trim()) {
      setError("Le nom de la leçon est requis.");
      return;
    }
    if (generator.cards.length < 2) {
      setError("Il faut au moins 2 cartes.");
      return;
    }
    setError(null);
    addLesson({
      slug: title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      title,
      description,
      targetLanguage,
      nativeLanguage,
      color,
      emoji,
      cards: generator.cards,
    });
    navigate("/");
  };

  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    const json = JSON.stringify(
      {
        slug: title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        title,
        description,
        targetLanguage,
        nativeLanguage,
        color,
        emoji,
        cards: generator.cards,
      },
      null,
      2
    );
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const hasCards = generator.cards.length > 0;
  const isGenerating = generator.isGenerating;
  const showProgress = isGenerating || (generator.totalBatches > 0 && !hasCards);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-5 sm:gap-6">

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            ← Retour
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Créer une leçon avec l'IA</h1>
        </div>

        {/* Config */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 flex flex-col gap-5 sm:gap-6">
          <BuilderLessonMeta
            title={title}
            description={description}
            emoji={emoji}
            color={color}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onEmojiChange={setEmoji}
            onColorChange={setColor}
          />
          <BuilderLanguagePicker
            targetLanguage={targetLanguage}
            nativeLanguage={nativeLanguage}
            onTargetChange={setTargetLanguage}
            onNativeChange={setNativeLanguage}
          />
          <BuilderAiConfig
            model={model}
            apiKey={apiKey}
            onModelChange={setModel}
            onApiKeyChange={handleApiKeyChange}
          />
        </div>

        {/* Word list */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <BuilderWordList
            value={wordListRaw}
            onChange={setWordListRaw}
            disabled={isGenerating}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
            {error}
          </p>
        )}

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full rounded-2xl bg-indigo-600 py-3.5 text-sm font-semibold text-white hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
        >
          <LuSparkles className="w-4 h-4" />
          {isGenerating ? "Génération…" : "Générer les cartes"}
        </button>

        {/* Progress */}
        <AnimatePresence>
          {showProgress && (
            <motion.div
              key="progress"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6"
            >
              <BuilderGenerationProgress
                completed={generator.completedBatches}
                total={generator.totalBatches}
                failed={generator.failedBatches}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cards preview + Save */}
        <AnimatePresence>
          {hasCards && (
            <motion.div
              key="cards"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex flex-col gap-4"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
                <BuilderCardList
                  cards={generator.cards}
                  onRemove={generator.removeCard}
                />
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={generator.reset}
                  className="rounded-2xl border border-gray-200 bg-white/80 px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-semibold text-gray-700 hover:border-gray-300 transition-colors flex items-center gap-2"
                >
                  <LuRefreshCw className="w-4 h-4" />
                  Recommencer
                </button>
                <button
                  onClick={handleCopyJson}
                  className="rounded-2xl border border-gray-200 bg-white/80 px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-semibold text-gray-700 hover:border-gray-300 transition-colors flex items-center gap-2"
                >
                  {copied ? <LuCheck className="w-4 h-4 text-emerald-500" /> : <LuCopy className="w-4 h-4" />}
                  {copied ? "Copié !" : "JSON"}
                </button>
                <button
                  onClick={handleSave}
                  className="w-full sm:flex-1 rounded-2xl bg-emerald-600 py-2.5 sm:py-3 text-sm font-semibold text-white hover:bg-emerald-500 active:scale-95 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                >
                  <LuBookmark className="w-4 h-4" />
                  Sauvegarder la leçon ({generator.cards.length} cartes)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

