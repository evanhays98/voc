---
applyTo: "**/*"
---

# Core Principles

- **No loops** (`for`, `while`). Prefer **`.map` / `.filter` / `.reduce`** or **lodash** utilities.
- **Composition over complexity**: small, single-purpose functions; avoid deep nesting; use **early returns**.
- **Immutability**: don’t use in-place array methods (`push`, `splice`, `sort`); use non-mutating alternatives.
- **Naming**
    - Functions: **verb + complement** (describe behavior).
    - Variables: **meaning + type**.
    - Booleans: prefix with **is/has/can/should**.
- Avoid 'as' and never use 'any'. don't write type when it can be inferred.
- Don't write comments the code should be self-explanatory.

# UX UI Rules

- check package ui for reusable components and use it when possible.
- check the theme and compare with app files to make the design consistent.
- **React components**: always split into subcomponents; **one component per `.tsx` file**.
- **Never define subcomponents inside the main view file**.
- Use named arrow exports (`export const X = () => {}`); **only the main view component may be default export**.
- Prefer **flex** layouts; use **grid** only for tables or genuinely complex layouts.
- Keep styles **shallow and readable**; avoid custom CSS when Tailwind utilities suffice.
- Don’t use hooks inside conditions or loops; use composition instead.
# Motion Design (Framer Motion)

- Always use `motion.*` components instead of plain HTML elements when animation is needed.
- Define animations as **named variants** objects (`const variants = { hidden: {…}, visible: {…} }`) — never inline anonymous objects in props.
- Prefer **layout animations** (`layout` prop) over manually animating `width`/`height`/`position`.
- Use `AnimatePresence` for any enter/exit animation; always provide a stable `key` on the animated child.
- Keep `transition` config (duration, ease, spring) in the variants or a shared `transition` constant — not scattered across JSX.
- Respect the user's motion preference: wrap reduced-motion logic with `useReducedMotion()` and skip or tone down animations when it returns `true`.
- Don't animate properties that trigger layout (e.g. `margin`, `padding`) — animate `transform` and `opacity` only for performance.
- Shared-element transitions must use `layoutId`; keep `layoutId` values unique and descriptive.