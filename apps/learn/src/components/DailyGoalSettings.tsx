import { LuTarget } from "react-icons/lu";
import { useSettings, useSettingsFn } from "../store/settingsStoreInstance";

const MAX_GOAL = 200;
const PRESETS = [20, 50, 100, 200];
const clampGoal = (goal: number) => Math.max(1, Math.min(MAX_GOAL, goal));

export const DailyGoalSettings = () => {
  const settings = useSettings();
  const { setDailyGoal } = useSettingsFn();

  const updateGoal = (goal: number) => setDailyGoal(clampGoal(goal));

  return (
    <div className="rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
            <LuTarget className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Objectif quotidien</p>
            <p className="text-xs text-gray-400">Cartes à réviser par jour</p>
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <input
            type="number"
            min={1}
            max={MAX_GOAL}
            value={settings.dailyGoal}
            onChange={(e) => updateGoal(Number(e.target.value))}
            className="w-14 text-right text-2xl font-bold text-indigo-600 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-xs text-gray-400 font-medium">/ j</span>
        </div>
      </div>

      <input
        type="range"
        min={1}
        max={MAX_GOAL}
        step={1}
        value={settings.dailyGoal}
        onChange={(e) => updateGoal(Number(e.target.value))}
        className="w-full h-1.5 cursor-pointer appearance-none rounded-full bg-gray-100 accent-indigo-600"
        aria-label="Régler l'objectif quotidien"
      />

      <div className="flex gap-2">
        {PRESETS.map((preset) => {
          const isActive = settings.dailyGoal === preset;
          return (
            <button
              key={preset}
              type="button"
              onClick={() => updateGoal(preset)}
              className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : "bg-gray-50 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              {preset}
            </button>
          );
        })}
      </div>
    </div>
  );
};