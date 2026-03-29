const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
  { code: "ru", label: "Русский" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
  { code: "ar", label: "العربية" },
  { code: "ko", label: "한국어" },
  { code: "nl", label: "Nederlands" },
];

interface BuilderLanguagePickerProps {
  targetLanguage: string;
  nativeLanguage: string;
  onTargetChange: (v: string) => void;
  onNativeChange: (v: string) => void;
}

export const BuilderLanguagePicker = ({
  targetLanguage,
  nativeLanguage,
  onTargetChange,
  onNativeChange,
}: BuilderLanguagePickerProps) => (
  <div className="flex gap-4">
    <div className="flex-1 flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500">Langue à apprendre</label>
      <select
        value={targetLanguage}
        onChange={(e) => onTargetChange(e.target.value)}
        className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400 bg-white"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
    <div className="flex-1 flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500">Langue native</label>
      <select
        value={nativeLanguage}
        onChange={(e) => onNativeChange(e.target.value)}
        className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400 bg-white"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);
