import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { LessonsPage } from "./pages/LessonsPage";
import { StudyPage } from "./pages/StudyPage";
import { progressStore } from "./store/progressStoreInstance";

export default function App() {
  useEffect(() => {
    progressStore.getStore().loadFromDb();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LessonsPage />} />
      <Route path="/study/:lessonSlug" element={<StudyPage />} />
    </Routes>
  );
}
