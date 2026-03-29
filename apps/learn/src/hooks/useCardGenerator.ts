import { useState } from "react";
import { generateId } from "@vocabulary/utils";
import type { LessonCard } from "@vocabulary/utils";

export type ModelId = "gpt-5.4" | "claude-opus-4-6" | "claude-sonnet-4-6";

export interface GenerateConfig {
  words: string[];
  targetLanguage: string;
  nativeLanguage: string;
  model: ModelId;
  apiKey: string;
  batchSize: number;
}

const isAnthropicModel = (model: ModelId) => model.startsWith("claude");

type RawCard = Omit<LessonCard, "id">;

interface OpenAIResponse {
  choices: Array<{ message: { content: string } }>;
}

interface AnthropicResponse {
  content: Array<{ text: string }>;
}

const chunkArray = <T>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

const buildPrompt = (words: string[], targetLanguage: string, nativeLanguage: string): string =>
  `You are a language learning expert creating vocabulary flashcard data.

Create one flashcard per word for learning ${targetLanguage} as a foreign language by a ${nativeLanguage} speaker.

CRITICAL RULE: "targetWord" MUST be the EXACT word from the input list, character for character. Do NOT conjugate, inflect, or change the form. The sentence must be constructed so that the word fits naturally in EXACTLY the form given.

For each word return:
- "targetWord": the EXACT word from the input list (copy it verbatim, no changes)
- "sentence": a natural contextual sentence in ${targetLanguage} where "____" can be replaced by targetWord as-is
- "translation": the full sentence translated into ${nativeLanguage}
- "nativeWord": the translation of targetWord alone in ${nativeLanguage}
- "hint": short grammatical note in English (e.g. "verb, infinitive", "noun, feminine plural")
- "wordType": one of: verb, noun, adjective, adverb, preposition, pronoun, conjunction, other

Example: if the input word is "manger", targetWord must be "manger" and the sentence must use "manger" (e.g. "Il faut ____ des légumes chaque jour."), NOT a conjugated form like "mange" or "mangent".

Words: ${words.join(", ")}

Return ONLY a valid JSON array, no markdown, no commentary:
[{"targetWord":"...","sentence":"...","translation":"...","nativeWord":"...","hint":"...","wordType":"..."}]`;

const extractJsonArray = (text: string): RawCard[] => {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("No JSON array found in AI response");
  return JSON.parse(match[0]) as RawCard[];
};

const callOpenAI = async (prompt: string, apiKey: string, model: ModelId): Promise<RawCard[]> => {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI error ${res.status}`);
  const data: OpenAIResponse = await res.json();
  return extractJsonArray(data.choices[0].message.content);
};

const callAnthropic = async (prompt: string, apiKey: string, model: ModelId): Promise<RawCard[]> => {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic error ${res.status}`);
  const data: AnthropicResponse = await res.json();
  return extractJsonArray(data.content[0].text);
};

const generateBatch = async (
  words: string[],
  targetLanguage: string,
  nativeLanguage: string,
  model: ModelId,
  apiKey: string
): Promise<LessonCard[]> => {
  const prompt = buildPrompt(words, targetLanguage, nativeLanguage);
  const raw = isAnthropicModel(model)
    ? await callAnthropic(prompt, apiKey, model)
    : await callOpenAI(prompt, apiKey, model);
  return raw.map((c) => ({ ...c, id: generateId() }));
};

export const useCardGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [completedBatches, setCompletedBatches] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);
  const [cards, setCards] = useState<LessonCard[]>([]);
  const [failedBatches, setFailedBatches] = useState(0);

  const generate = async (config: GenerateConfig) => {
    const batches = chunkArray(config.words, config.batchSize);
    setIsGenerating(true);
    setCompletedBatches(0);
    setTotalBatches(batches.length);
    setCards([]);
    setFailedBatches(0);

    const results = await Promise.allSettled(
      batches.map(async (batch) => {
        const batchCards = await generateBatch(
          batch,
          config.targetLanguage,
          config.nativeLanguage,
          config.model,
          config.apiKey
        );
        setCompletedBatches((n) => n + 1);
        return batchCards;
      })
    );

    const allCards = results
      .filter((r): r is PromiseFulfilledResult<LessonCard[]> => r.status === "fulfilled")
      .flatMap((r) => r.value);

    setCards(allCards);
    setFailedBatches(results.filter((r) => r.status === "rejected").length);
    setIsGenerating(false);
  };

  const removeCard = (id: string) => {
    setCards((cs) => cs.filter((c) => c.id !== id));
  };

  const reset = () => {
    setIsGenerating(false);
    setCompletedBatches(0);
    setTotalBatches(0);
    setCards([]);
    setFailedBatches(0);
  };

  return {
    isGenerating,
    completedBatches,
    totalBatches,
    cards,
    failedBatches,
    generate,
    removeCard,
    reset,
  };
};
