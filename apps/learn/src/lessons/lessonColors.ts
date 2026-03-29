import type { LessonColor } from "@vocabulary/utils";

interface ColorConfig {
  gradient: string;
  gradientFrom: string;
  text: string;
  bg: string;
  border: string;
  hoverBorder: string;
  bar: string;
  dot: string;
  light: string;
}

export const LESSON_COLORS: Record<LessonColor, ColorConfig> = {
  sky: {
    gradient: "from-sky-400 to-blue-500",
    gradientFrom: "from-sky-400",
    text: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
    hoverBorder: "hover:border-sky-400",
    bar: "bg-sky-500",
    dot: "bg-sky-400",
    light: "bg-sky-100",
  },
  orange: {
    gradient: "from-orange-400 to-rose-500",
    gradientFrom: "from-orange-400",
    text: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    hoverBorder: "hover:border-orange-400",
    bar: "bg-orange-500",
    dot: "bg-orange-400",
    light: "bg-orange-100",
  },
  violet: {
    gradient: "from-violet-400 to-purple-600",
    gradientFrom: "from-violet-400",
    text: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    hoverBorder: "hover:border-violet-400",
    bar: "bg-violet-500",
    dot: "bg-violet-400",
    light: "bg-violet-100",
  },
  emerald: {
    gradient: "from-emerald-400 to-teal-500",
    gradientFrom: "from-emerald-400",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    hoverBorder: "hover:border-emerald-400",
    bar: "bg-emerald-500",
    dot: "bg-emerald-400",
    light: "bg-emerald-100",
  },
  rose: {
    gradient: "from-rose-400 to-pink-600",
    gradientFrom: "from-rose-400",
    text: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    hoverBorder: "hover:border-rose-400",
    bar: "bg-rose-500",
    dot: "bg-rose-400",
    light: "bg-rose-100",
  },
  amber: {
    gradient: "from-amber-400 to-yellow-500",
    gradientFrom: "from-amber-400",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    hoverBorder: "hover:border-amber-400",
    bar: "bg-amber-500",
    dot: "bg-amber-400",
    light: "bg-amber-100",
  },
};

export const getLessonColorConfig = (color?: LessonColor) =>
  LESSON_COLORS[color ?? "violet"];
