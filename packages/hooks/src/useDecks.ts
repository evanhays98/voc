import type { Deck } from "@vocabulary/utils";
import { useLocalStorage } from "./useLocalStorage";

export function useDecks() {
  const [decks, setDecks] = useLocalStorage<Deck[]>("vocabulary:decks", []);

  function addDeck(deck: Deck) {
    setDecks((prev) => [...prev, deck]);
  }

  function removeDeck(id: string) {
    setDecks((prev) => prev.filter((d) => d.id !== id));
  }

  function updateDeck(updated: Deck) {
    setDecks((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  }

  return { decks, addDeck, removeDeck, updateDeck };
}
