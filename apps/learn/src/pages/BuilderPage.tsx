import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateId } from "@vocabulary/utils";
import type { LessonCard, WordType, LessonColor } from "@vocabulary/utils";
import { useCustomLessonsFn } from "../store/customLessonsStoreInstance";

const WORD_TYPES: WordType[] = ["verb", "noun", "adjective", "adverb", "preposition", "pronoun", "conjunction", "other"];
const COLORS: LessonColor[] = ["sky", "orange", "violet", "emerald", "rose", "amber"];

const EMPTY_CARD: Omit<LessonCard, "id"> = {
  targetWord: "",
  sentence: "",
  translation: "",
  nativeWord: "",
  hint: "",
  wordType: "noun",
};

export function BuilderPage() {
  const navigate = useNavigate();
  const { addLesson } = useCustomLessonsFn();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("fr");
  const [selectedColor, setSelectedColor] = useState<LessonColor>("violet");
  const [emoji, setEmoji] = useState("📚");
  const [cards, setCards] = useState<LessonCard[]>([]);
  const [draft, setDraft] = useState<Omit<LessonCard, "id">>(EMPTY_CARD);
  const [error, setError] = useState<string | null>(null);

  const updateDraft = (field: keyof typeof EMPTY_CARD, value: string) => {
    setDraft((d) => ({ ...d, [field]: value }));
  };

  const addCard = () => {
    if (!draft.targetWord.trim() || !draft.sentence.includes("____")) {
      setError("Le mot cible et la phrase (avec ____) sont requis.");
      return;
    }
    setCards((cs) => [...cs, { ...draft, id: generateId() }]);
    setDraft(EMPTY_CARD);
    setError(null);
  };

  const removeCard = (id: string) => {
    setCards((cs) => cs.filter((c) => c.id !== id));
  };

  const handleSave = () => {
    if (!title.trim()) {
      setError("Le nom de la leçon est requis.");
      return;
    }
    if (cards.length < 2) {
      setError("Ajoute au moins 2 cartes.");
      return;
    }

    addLesson({
      slug: title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      title,
      description,
      targetLanguage,
      nativeLanguage: "fr",
      color: selectedColor,
      emoji,
      cards,
    });

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/")} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
            ← Retour
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Créer une leçon</h1>
        </div>

        {/* Lesson metadata */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-gray-900">Informations</h2>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1 w-16">
              <label className="text-xs font-medium text-gray-500">Emoji</label>
              <input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value.slice(0, 2))}
                className="border border-gray-200 rounded-xl px-3 py-2 text-center text-xl outline-none focus:border-indigo-400"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Nom *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ex : Animaux — Espagnol"
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Courte description de la leçon"
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Langue cible</label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400"
              >
                {["fr", "es", "en", "de", "it", "pt"].map((l) => (
                  <option key={l} value={l}>{l.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Couleur</label>
              <div className="flex gap-1.5">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      selectedColor === c ? "border-gray-800 scale-110" : "border-transparent"
                    } bg-gradient-to-br ${
                      c === "sky" ? "from-sky-400 to-blue-500"
                      : c === "orange" ? "from-orange-400 to-rose-500"
                      : c === "violet" ? "from-violet-400 to-purple-600"
                      : c === "emerald" ? "from-emerald-400 to-teal-500"
                      : c === "rose" ? "from-rose-400 to-pink-600"
                      : "from-amber-400 to-yellow-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-gray-900">
            Ajouter une carte ({cards.length} ajoutée{cards.length !== 1 ? "s" : ""})
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Mot cible *" value={draft.targetWord} onChange={(v) => updateDraft("targetWord", v)} placeholder="conduire" />
            <Field label="Mot natif" value={draft.nativeWord} onChange={(v) => updateDraft("nativeWord", v)} placeholder="to drive" />
          </div>

          <Field
            label="Phrase (utilise ____ pour le mot cible) *"
            value={draft.sentence}
            onChange={(v) => updateDraft("sentence", v)}
            placeholder="Il apprend à ____ depuis trois mois."
          />

          <Field
            label="Traduction"
            value={draft.translation}
            onChange={(v) => updateDraft("translation", v)}
            placeholder="He has been learning to drive for three months."
          />

          <div className="flex gap-3">
            <Field label="Indice" value={draft.hint} onChange={(v) => updateDraft("hint", v)} placeholder="verbe, infinitif" />
            <div className="flex flex-col gap-1 w-40">
              <label className="text-xs font-medium text-gray-500">Type</label>
              <select
                value={draft.wordType}
                onChange={(e) => updateDraft("wordType", e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400"
              >
                {WORD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <button
            onClick={addCard}
            className="self-end rounded-xl border border-indigo-300 bg-indigo-50 px-5 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            + Ajouter la carte
          </button>
        </div>

        {/* Card list */}
        {cards.length > 0 && (
          <div className="flex flex-col gap-2">
            {cards.map((card) => (
              <div key={card.id} className="flex items-center justify-between bg-white/80 rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
                <div>
                  <span className="font-medium text-gray-800">{card.targetWord}</span>
                  <span className="text-gray-400 text-sm ml-2">— {card.nativeWord}</span>
                </div>
                <button
                  onClick={() => removeCard(card.id)}
                  className="text-gray-300 hover:text-rose-500 transition-colors text-lg leading-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Save */}
        <button
          onClick={handleSave}
          className="w-full rounded-2xl bg-indigo-600 py-3.5 text-sm font-semibold text-white hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-200"
        >
          Enregistrer la leçon ({cards.length} carte{cards.length !== 1 ? "s" : ""})
        </button>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

const Field = ({ label, value, onChange, placeholder }: FieldProps) => (
  <div className="flex flex-col gap-1 flex-1">
    <label className="text-xs font-medium text-gray-500">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400"
    />
  </div>
);
