export const parseWords = (raw: string): string[] =>
  raw
    .split(/[\n,;]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0);

interface BuilderWordListProps {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  batchSize: number;
  onBatchSizeChange: (v: number) => void;
}

export const BuilderWordList = ({ value, onChange, disabled, batchSize, onBatchSizeChange }: BuilderWordListProps) => {
  const wordCount = parseWords(value).length;
  const batchCount = Math.ceil(wordCount / batchSize);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-500">
          Liste de mots (un par ligne, ou séparés par virgule/point-virgule)
        </label>
        {wordCount > 0 && (
          <span className="text-xs text-indigo-600 font-medium">
            {wordCount} mot{wordCount > 1 ? "s" : ""} · {batchCount} lot{batchCount > 1 ? "s" : ""} parallèles
          </span>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={"manger\nboire\nfarine\ncouteau\n..."}
        rows={8}
        className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono resize-none outline-none focus:border-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-500">Mots par lot</label>
        <select
          value={batchSize}
          onChange={(e) => onBatchSizeChange(Number(e.target.value))}
          disabled={disabled}
          className="border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-indigo-400 disabled:opacity-50"
        >
          {[5, 10, 15, 20, 25, 50, 100].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
