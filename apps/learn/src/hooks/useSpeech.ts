import { useCallback, useEffect, useRef, useState } from "react";

const LANG_MAP: Record<string, string> = {
  fr: "fr-FR",
  en: "en-US",
  es: "es-ES",
  de: "de-DE",
  it: "it-IT",
  pt: "pt-PT",
  ja: "ja-JP",
  zh: "zh-CN",
};

const toLangTag = (lang: string) => LANG_MAP[lang] ?? lang;

interface UseSpeechReturn {
  speak: (text: string, lang: string, onEnd: () => void) => void;
  isSpeaking: boolean;
  skip: () => void;
  isSupported: boolean;
}

export const useSpeech = (): UseSpeechReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const onEndRef = useRef<(() => void) | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    return () => {
      if (isSupported) window.speechSynthesis.cancel();
    };
  }, [isSupported]);

  const speak = useCallback(
    (text: string, lang: string, onEnd: () => void) => {
      if (!isSupported) {
        onEnd();
        return;
      }

      window.speechSynthesis.cancel();
      onEndRef.current = onEnd;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = toLangTag(lang);
      utterance.rate = 0.9;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        onEndRef.current?.();
        onEndRef.current = null;
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        onEndRef.current?.();
        onEndRef.current = null;
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported]
  );

  const skip = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    onEndRef.current?.();
    onEndRef.current = null;
  }, [isSupported]);

  return { speak, isSpeaking, skip, isSupported };
};
