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

const scoreVoice = (voice: SpeechSynthesisVoice): number => {
  const name = voice.name.toLowerCase();
  let score = 0;
  if (name.includes("google")) score += 10;
  if (name.includes("premium")) score += 8;
  if (name.includes("enhanced")) score += 8;
  if (name.includes("neural")) score += 8;
  if (!name.includes("compact")) score += 4;
  if (voice.localService) score += 1;
  return score;
};

const pickBestVoice = (langTag: string): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  const exactMatch = voices.filter((v) => v.lang === langTag);
  const langPrefix = langTag.split("-")[0];
  const prefixMatch = voices.filter((v) => v.lang.startsWith(langPrefix));
  const candidates = exactMatch.length > 0 ? exactMatch : prefixMatch;
  if (candidates.length === 0) return null;
  return candidates.reduce((best, v) => (scoreVoice(v) >= scoreVoice(best) ? v : best));
};

const estimatePlaybackDuration = (text: string): number => {
  const normalizedText = text.trim();
  const wordCount = normalizedText.split(/\s+/).filter(Boolean).length;
  const characterCount = normalizedText.length;
  return Math.max(900, Math.min(3500, wordCount * 320 + characterCount * 18));
};

interface UseSpeechReturn {
  speak: (text: string, lang: string, onEnd: () => void, isMuted?: boolean) => void;
  isSpeaking: boolean;
  skip: () => void;
  isSupported: boolean;
}

export const useSpeech = (): UseSpeechReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const onEndRef = useRef<(() => void) | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  const clearPlaybackTimeout = useCallback(() => {
    if (timeoutRef.current === null) return;
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);

  const finishPlayback = useCallback(() => {
    clearPlaybackTimeout();
    setIsSpeaking(false);
    onEndRef.current?.();
    onEndRef.current = null;
  }, [clearPlaybackTimeout]);

  useEffect(() => {
    return () => {
      if (isSupported) window.speechSynthesis.cancel();
      clearPlaybackTimeout();
    };
  }, [clearPlaybackTimeout, isSupported]);

  const speak = useCallback(
    (text: string, lang: string, onEnd: () => void, isMuted = false) => {
      if (isSupported) window.speechSynthesis.cancel();
      clearPlaybackTimeout();
      onEndRef.current = onEnd;

      if (isMuted || !isSupported) {
        setIsSpeaking(true);
        timeoutRef.current = window.setTimeout(() => {
          finishPlayback();
        }, estimatePlaybackDuration(text));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const langTag = toLangTag(lang);
      utterance.lang = langTag;
      utterance.rate = 0.85;
      utterance.pitch = 1;

      const bestVoice = pickBestVoice(langTag);
      if (bestVoice) utterance.voice = bestVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = finishPlayback;
      utterance.onerror = finishPlayback;

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [clearPlaybackTimeout, finishPlayback, isSupported]
  );

  const skip = useCallback(() => {
    if (isSupported) window.speechSynthesis.cancel();
    finishPlayback();
  }, [finishPlayback, isSupported]);

  return { speak, isSpeaking, skip, isSupported };
};
