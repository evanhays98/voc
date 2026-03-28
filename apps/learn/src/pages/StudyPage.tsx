import { useParams } from "react-router-dom";

export function StudyPage() {
  const { deckId } = useParams<{ deckId: string }>();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Study — deck {deckId}</h1>
    </div>
  );
}
