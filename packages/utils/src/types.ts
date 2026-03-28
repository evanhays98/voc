export interface Card {
  id: string;
  front: string;
  back: string;
  createdAt: string;
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  cards: Card[];
  createdAt: string;
}
