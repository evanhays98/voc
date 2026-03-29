import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { extractWordList } from "../utils/extractWordList";
import { ExtractorInput } from "../components/wordExtractor/ExtractorInput";
import { ExtractorResult } from "../components/wordExtractor/ExtractorResult";

export function WordExtractorPage() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const words = useMemo(() => extractWordList(text), [text]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            ← Retour
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Extraire les mots</h1>
            <p className="text-sm text-gray-500">Collez un texte pour obtenir une liste de mots prêts à générer des cartes</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-6">
          <ExtractorInput value={text} onChange={setText} wordCount={words.length} />
          <ExtractorResult words={words} />
        </div>
      </div>
    </div>
  );
}
