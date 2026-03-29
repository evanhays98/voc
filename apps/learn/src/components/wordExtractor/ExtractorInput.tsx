interface ExtractorInputProps {
  value: string;
  onChange: (v: string) => void;
  wordCount: number;
}

export const ExtractorInput = ({ value, onChange, wordCount }: ExtractorInputProps) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <label className="text-xs font-medium text-gray-500">Texte source</label>
      {wordCount > 0 && (
        <span className="text-xs text-indigo-600 font-medium">{wordCount} mots uniques</span>
      )}
    </div>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Collez un texte ici (livre, article, chanson…)"
      rows={12}
      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 resize-none"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange("")}
        className="self-end text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        Effacer
      </button>
    )}
  </div>
);
