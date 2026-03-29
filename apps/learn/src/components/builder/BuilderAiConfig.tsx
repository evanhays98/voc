import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import type { ModelId } from "../../hooks/useCardGenerator";

const MODELS: { id: ModelId; label: string; provider: "openai" | "anthropic" }[] = [
  { id: "gpt-5.4", label: "GPT-5.4", provider: "openai" },
  { id: "claude-opus-4-6", label: "Claude Opus 4.6", provider: "anthropic" },
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", provider: "anthropic" },
];

interface BuilderAiConfigProps {
  model: ModelId;
  apiKey: string;
  onModelChange: (v: ModelId) => void;
  onApiKeyChange: (v: string) => void;
}

export const BuilderAiConfig = ({
  model,
  apiKey,
  onModelChange,
  onApiKeyChange,
}: BuilderAiConfigProps) => {
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const isAnthropic = model.startsWith("claude");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-500">Modèle IA</label>
        <div className="flex gap-2 flex-wrap">
          {MODELS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onModelChange(m.id)}
              className={`flex-1 rounded-xl border py-2 text-sm font-medium transition-all ${
                model === m.id
                  ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">
          {isAnthropic ? "Anthropic API Key" : "OpenAI API Key"}
        </label>
        <div className="flex gap-2">
          <input
            type={isKeyVisible ? "text" : "password"}
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder={isAnthropic ? "sk-ant-..." : "sk-..."}
            autoComplete="off"
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono outline-none focus:border-indigo-400"
          />
          <button
            type="button"
            onClick={() => setIsKeyVisible((v) => !v)}
            className="rounded-xl border border-gray-200 px-3 text-gray-400 hover:text-gray-700 transition-colors"
          >
            {isKeyVisible ? (
              <LuEyeOff className="w-4 h-4" />
            ) : (
              <LuEye className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400">
          La clé est stockée uniquement dans votre navigateur (localStorage).
        </p>
      </div>
    </div>
  );
};
