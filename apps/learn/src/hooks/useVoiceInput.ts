import { useCallback, useRef, useState } from "react";

const LANG_TAGS: Record<string, string> = {
  fr: "fr-FR",
  en: "en-US",
  es: "es-ES",
  de: "de-DE",
  it: "it-IT",
  pt: "pt-PT",
};

const toLangTag = (lang: string) => LANG_TAGS[lang] ?? lang;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionCtor = new () => any;

interface UseVoiceInputReturn {
  isListening: boolean;
  isSupported: boolean;
  startListening: (lang: string, onResult: (text: string) => void) => void;
  stopListening: () => void;
}

export const useVoiceInput = (): UseVoiceInputReturn => {
  const [isListening, setIsListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const startListening = useCallback(
    (lang: string, onResult: (text: string) => void) => {
      if (!isSupported) return;

      const win = window as Window & {
        SpeechRecognition?: SpeechRecognitionCtor;
        webkitSpeechRecognition?: SpeechRecognitionCtor;
      };
      const SpeechRecognitionAPI = win.SpeechRecognition ?? win.webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) return;

      const recognition = new SpeechRecognitionAPI();
      recognition.lang = toLangTag(lang);
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript: string = event.results?.[0]?.[0]?.transcript ?? "";
        onResult(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    },
    [isSupported]
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isListening, isSupported, startListening, stopListening };
};
