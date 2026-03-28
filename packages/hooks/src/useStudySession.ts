import { useState } from "react";
import type { Card } from "@vocabulary/utils";

export function useStudySession(cards: Card[]) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = cards[index] ?? null;
  const isFinished = index >= cards.length;

  function flip() {
    setFlipped((f) => !f);
  }

  function next() {
    setFlipped(false);
    setIndex((i) => i + 1);
  }

  function restart() {
    setIndex(0);
    setFlipped(false);
  }

  return { current, index, flipped, isFinished, flip, next, restart };
}
