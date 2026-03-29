import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { LessonsPage } from "./pages/LessonsPage";
import { StudyPage } from "./pages/StudyPage";
import { StatsPage } from "./pages/StatsPage";
import { BuilderPage } from "./pages/BuilderPage";
import { OnboardingModal } from "./components/OnboardingModal";
import { progressStore } from "./store/progressStoreInstance";
import { settingsStore, useSettings, useSettingsFn } from "./store/settingsStoreInstance";
import { customLessonsStore } from "./store/customLessonsStoreInstance";

export default function App() {
  const settings = useSettings();
  const { setHasSeenOnboarding } = useSettingsFn();

  useEffect(() => {
    progressStore.getStore().loadFromDb();
    settingsStore.getStore().loadFromDb();
    customLessonsStore.getStore().loadFromDb();
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
      </Routes>
    </>
  );
}
