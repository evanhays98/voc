import { useNavigate } from "react-router-dom";
import { ALL_LESSONS } from "../lessons";
import { useProgress } from "../store/progressStoreInstance";
import { useSettings, useSettingsFn } from "../store/settingsStoreInstance";
import { useCustomLessons } from "../store/customLessonsStoreInstance";
import { LessonCard } from "../components/LessonCard";
import { StreakBadge } from "../components/StreakBadge";
import { DailyGoalRing } from "../components/DailyGoalRing";
import { SrsGraph } from "../components/SrsGraph";
import { LuHand, LuChartColumn, LuPencil, LuPlay, LuFileText } from "react-icons/lu";

export function LessonsPage() {
  const navigate = useNavigate();
  const progress = useProgress();
  const settings = useSettings();
  const { setLastLessonSlug } = useSettingsFn();
  const customLessons = useCustomLessons();

  const allLessons = [...ALL_LESSONS, ...customLessons.lessons];
  const streak = progress.getStreak();
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayDone = progress.dailyActivity[todayKey]?.total ?? 0;

  const lastLesson = settings.lastLessonSlug
    ? allLessons.find((l) => l.slug === settings.lastLessonSlug)
    : null;

  const goToLesson = (slug: string) => {
    setLastLessonSlug(slug);
    navigate(`/study/${slug}`);
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-white/60 px-4 sm:px-6 py-4 sm:py-5 shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-1.5">{greeting} <LuHand className="text-yellow-500" /></h1>
            <p className="text-sm text-gray-500">Que veux-tu apprendre aujourd'hui ?</p>
          </div>
          <div className="flex items-center gap-3">
            <StreakBadge streak={streak} size="sm" />
            <DailyGoalRing done={todayDone} goal={settings.dailyGoal} size={52} />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8">

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {lastLesson && (
            <button
              onClick={() => goToLesson(lastLesson.slug)}
              className="w-full sm:flex-1 rounded-2xl border bg-indigo-600 border-indigo-600 text-white py-3 sm:py-3.5 px-4 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-indigo-500 shadow-lg shadow-indigo-200 active:scale-95 transition-all"
            >
              <LuPlay className="w-4 h-4 shrink-0" />
              <span className="truncate">Continuer — {lastLesson.title}</span>
            </button>
          )}
          <button
            onClick={() => navigate("/stats")}
            className="flex-1 sm:flex-none rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-3 sm:py-3.5 text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
          >
            <span className="flex items-center justify-center gap-1.5"><LuChartColumn className="w-4 h-4" /> Stats</span>
          </button>
          <button
            onClick={() => navigate("/builder")}
            className="flex-1 sm:flex-none rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-3 sm:py-3.5 text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
          >
            <span className="flex items-center justify-center gap-1.5"><LuPencil className="w-4 h-4" /> Créer</span>
          </button>
          <button
            onClick={() => navigate("/extractor")}
            className="flex-1 sm:flex-none rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-3 sm:py-3.5 text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
          >
            <span className="flex items-center justify-center gap-1.5"><LuFileText className="w-4 h-4" /> Extraire</span>
          </button>
        </div>

        {/* Lesson list */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Mes leçons
          </h2>
          {allLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              progressByCard={progress.progressByCard}
              onSelect={() => goToLesson(lesson.slug)}
            />
          ))}
        </div>

        {/* SRS upcoming graph */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <SrsGraph progressByCard={progress.progressByCard} />
        </div>
      </main>
    </div>
  );
}
