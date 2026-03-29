const ACCENTS: Record<string, string[]> = {
  fr: ["é", "è", "ê", "ë", "à", "â", "ç", "ù", "û", "ô", "î", "ï", "œ"],
  es: ["á", "é", "í", "ó", "ú", "ñ", "ü"],
  de: ["ä", "ö", "ü", "ß"],
  pt: ["á", "é", "í", "ó", "ú", "â", "ê", "ô", "ã", "õ", "ç"],
  it: ["à", "è", "é", "ì", "ò", "ù"],
};

interface AccentKeyTrayProps {
  lang: string;
  onAccent: (char: string) => void;
}

export const AccentKeyTray = ({ lang, onAccent }: AccentKeyTrayProps) => {
  const keys = ACCENTS[lang];
  if (!keys) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {keys.map((char) => (
        <button
          key={char}
          type="button"
          onMouseDown={(e) => {
            e.preventDefault(); // keep input focused
            onAccent(char);
          }}
          className="min-w-[2rem] rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
        >
          {char}
        </button>
      ))}
    </div>
  );
};
