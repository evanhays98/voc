type Color = "gray" | "indigo" | "green" | "red" | "yellow";

const colorClasses: Record<Color, string> = {
  gray: "bg-gray-100 text-gray-700",
  indigo: "bg-indigo-100 text-indigo-700",
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
  yellow: "bg-yellow-100 text-yellow-700",
};

interface BadgeProps {
  label: string;
  color?: Color;
}

export function Badge({ label, color = "gray" }: BadgeProps) {
  return (
    <span className={["inline-block rounded-full px-2.5 py-0.5 text-xs font-medium", colorClasses[color]].join(" ")}>
      {label}
    </span>
  );
}
