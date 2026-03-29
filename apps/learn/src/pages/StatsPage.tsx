import type React from "react";
import { useNavigate } from "react-router-dom";
import { ALL_LESSONS } from "../lessons";
import { useProgress } from "../store/progressStoreInstance";
import { useSettings } from "../store/settingsStoreInstance";
import { StreakCalendar } from "../components/StreakCalendar";
import { SrsGraph } from "../components/SrsGraph";
import { getLessonColorConfig } from "../lessons/lessonColors";
import { FaFire } from "react-icons/fa";
import { LuTarget } from "react-icons/lu";

export function StatsPage() {
  const navigate = useNavigate();
  const progress = useProgress();
  const settings = useSettings();

  const todayKey = new Date().toISOString().slice(0, 10);
  const todayDone = progress.dailyActivity[todayKey]?.total ?? 0;
  const goalPct = Math.min(Math.round((todayDone / Math.max(settings.dailyGoal, 1)) * 100), 100);

  const totalCards = ALL_LESSONS.reduce((sum, l) => sum + l.cards.length, 0);
  const totalMastered = Object.values(progress.progressByCard).filter(
    (p) => p.level === 5
  ).length;
  const globalPct = Math.round((totalMastered / Math.max(totalCards, 1)) * 100);
  const streak = progress.getStreak();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-6 sm:gap-8">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            ← Retour
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
        </div>

        {/* Global summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <StatCard value={totalMastered} label="Mots maîtrisés" color="text-green-600" bg="bg-green-50" border="border-green-200" />
          <StatCard value={`${globalPct}%`} label="Progression" color="text-indigo-600" bg="bg-indigo-50" border="border-indigo-200" />
          <StatCard value={streak > 0 ? <span className="flex items-center gap-1"><FaFire className="text-orange-500" />{streak}</span> : "–"} label="Jours de suite" color="text-orange-600" bg="bg-orange-50" border="border-orange-200" />
          <StatCard
            value={
              <span className="flex flex-col items-center gap-0.5">
                <span className="flex items-center gap-1"><LuTarget className="h-4 w-4" />{todayDone}<span className="text-xs font-normal text-gray-400">/{settings.dailyGoal}</span></span>
                <div className="w-full h-1 rounded-full bg-gray-200 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${goalPct >= 100 ? "bg-green-400" : "bg-indigo-500"}`} style={{ width: `${goalPct}%` }} />
                </div>
              </span>
            }
            label="Objectif du jour"
            color="text-indigo-600"
            bg="bg-indigo-50"
            border="border-indigo-200"
          />
        </div>

        {/* Per-lesson breakdown */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-gray-900">Par leçon</h2>
          {ALL_LESSONS.map((lesson) => {
            const allIds = lesson.cards.map((c) => c.id);
            const mastered = allIds.filter((id) => progress.progressByCard[id]?.level === 5).length;
            const learning = allIds.filter(
              (id) => id in progress.progressByCard && progress.progressByCard[id].level < 5
            ).length;
            const pct = Math.round((mastered / allIds.length) * 100);
            const colors = getLessonColorConfig(lesson.color);

            return (
              <div key={lesson.id} className="flex flex-col gap-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5">
                  <span className="text-sm font-medium text-gray-700">
                    {lesson.emoji} {lesson.title}
                  </span>
                  <span className="text-xs text-gray-500">
                    {mastered} maîtrisés · {learning} en cours · {allIds.length - mastered - learning} non vus
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${colors.gradient} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* SRS graph */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <SrsGraph progressByCard={progress.progressByCard} />
        </div>

        {/* Activity heatmap */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <StreakCalendar dailyActivity={progress.dailyActivity} dailyGoal={settings.dailyGoal} />
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  value: React.ReactNode;
  label: string;
  color: string;
  bg: string;
  border: string;
}

const StatCard = ({ value, label, color, bg, border }: StatCardProps) => (
  <div className={`rounded-2xl border ${border} ${bg} p-3 sm:p-4 flex flex-col items-center gap-0.5 sm:gap-1 text-center`}>
    <span className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</span>
    <span className="text-xs text-gray-500">{label}</span>
  </div>
);
