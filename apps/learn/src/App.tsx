import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { LessonsPage } from "./pages/LessonsPage";
import { StudyPage } from "./pages/StudyPage";
import { StatsPage } from "./pages/StatsPage";
import { BuilderPage } from "./pages/BuilderPage";
import { WordExtractorPage } from "./pages/WordExtractorPage";
import { OnboardingModal } from "./components/OnboardingModal";
import { progressStore } from "./store/progressStoreInstance";
import { settingsStore, useSettings, useSettingsFn } from "./store/settingsStoreInstance";
import { customLessonsStore } from "./store/customLessonsStoreInstance";
import { getAllLessons } from "./lessons";

export default function App() {
  const settings = useSettings();
  const { setHasSeenOnboarding } = useSettingsFn();

  useEffect(() => {
    const init = async () => {
      await progressStore.getStore().loadFromDb();
      await customLessonsStore.getStore().loadFromDb();
      const builtInLessons = await getAllLessons();
      progressStore.getStore().syncProgressAcrossLessons([
        ...builtInLessons,
        ...customLessonsStore.getStore().lessons,
      ]);
    };
    init();
    settingsStore.getStore().loadFromDb();
  }, []);

  const showOnboarding = settings.isLoaded && !settings.hasSeenOnboarding;

  return (
    <>
      {showOnboarding && (
        <OnboardingModal onDone={() => setHasSeenOnboarding(true)} />
      )}
      <Routes>
        <Route path="/" element={<LessonsPage />} />
        <Route path="/study/:lessonSlug" element={<StudyPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/builder" element={<BuilderPage />} />
        <Route path="/extractor" element={<WordExtractorPage />} />
      </Routes>
    </>
  );
}
