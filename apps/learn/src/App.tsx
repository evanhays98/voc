import { Routes, Route } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { StudyPage } from "./pages/StudyPage";
import { DecksPage } from "./pages/DecksPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/decks" element={<DecksPage />} />
      <Route path="/study/:deckId" element={<StudyPage />} />
    </Routes>
  );
}
