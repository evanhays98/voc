import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={["rounded-2xl border border-gray-200 bg-white p-6 shadow-sm", className].join(" ")}
      {...props}
    />
  );
}
