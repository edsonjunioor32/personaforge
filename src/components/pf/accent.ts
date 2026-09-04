// Maps a ColorTheme to concrete Tailwind utility classes for accents.

import { ColorTheme } from "@/lib/persona/types";

export interface ThemeAccent {
  text: string;
  textSoft: string;
  bg: string;
  border: string;
  ring: string;
  gradient: string;
  shadow: string;
  dot: string;
  hex: string;
}

export const THEME_ACCENTS: Record<ColorTheme, ThemeAccent> = {
  cyan: {
    text: "text-[oklch(0.82_0.16_196)]",
    textSoft: "text-[oklch(0.82_0.16_196)]/80",
    bg: "bg-[oklch(0.82_0.16_196)]/12",
    border: "border-[oklch(0.82_0.16_196)]/40",
    ring: "ring-[oklch(0.82_0.16_196)]/50",
    gradient: "from-[oklch(0.82_0.16_196)] to-[oklch(0.62_0.22_295)]",
    shadow: "shadow-[0_0_24px_oklch(0.82_0.16_196_/_0.45)]",
    dot: "bg-[oklch(0.82_0.16_196)]",
    hex: "#45e3ee",
  },
  violet: {
    text: "text-[oklch(0.62_0.22_295)]",
    textSoft: "text-[oklch(0.72_0.22_295)]/80",
    bg: "bg-[oklch(0.62_0.22_295)]/12",
    border: "border-[oklch(0.62_0.22_295)]/40",
    ring: "ring-[oklch(0.62_0.22_295)]/50",
    gradient: "from-[oklch(0.62_0.22_295)] to-[oklch(0.7_0.2_17)]",
    shadow: "shadow-[0_0_24px_oklch(0.62_0.22_295_/_0.5)]",
    dot: "bg-[oklch(0.62_0.22_295)]",
    hex: "#8451ff",
  },
  emerald: {
    text: "text-[oklch(0.78_0.16_162)]",
    textSoft: "text-[oklch(0.78_0.16_162)]/80",
    bg: "bg-[oklch(0.78_0.16_162)]/12",
    border: "border-[oklch(0.78_0.16_162)]/40",
    ring: "ring-[oklch(0.78_0.16_162)]/50",
    gradient: "from-[oklch(0.78_0.16_162)] to-[oklch(0.82_0.16_196)]",
    shadow: "shadow-[0_0_24px_oklch(0.78_0.16_162_/_0.45)]",
    dot: "bg-[oklch(0.78_0.16_162)]",
    hex: "#45e3a0",
  },
  amber: {
    text: "text-[oklch(0.82_0.16_75)]",
    textSoft: "text-[oklch(0.82_0.16_75)]/80",
    bg: "bg-[oklch(0.82_0.16_75)]/12",
    border: "border-[oklch(0.82_0.16_75)]/40",
    ring: "ring-[oklch(0.82_0.16_75)]/50",
    gradient: "from-[oklch(0.82_0.16_75)] to-[oklch(0.7_0.2_17)]",
    shadow: "shadow-[0_0_24px_oklch(0.82_0.16_75_/_0.45)]",
    dot: "bg-[oklch(0.82_0.16_75)]",
    hex: "#ffb347",
  },
  rose: {
    text: "text-[oklch(0.7_0.2_17)]",
    textSoft: "text-[oklch(0.7_0.2_17)]/80",
    bg: "bg-[oklch(0.7_0.2_17)]/12",
    border: "border-[oklch(0.7_0.2_17)]/40",
    ring: "ring-[oklch(0.7_0.2_17)]/50",
    gradient: "from-[oklch(0.7_0.2_17)] to-[oklch(0.62_0.22_295)]",
    shadow: "shadow-[0_0_24px_oklch(0.7_0.2_17_/_0.45)]",
    dot: "bg-[oklch(0.7_0.2_17)]",
    hex: "#ff6b9d",
  },
};

export function accent(theme: ColorTheme): ThemeAccent {
  return THEME_ACCENTS[theme] ?? THEME_ACCENTS.cyan;
}

export const COLOR_THEMES: ColorTheme[] = [
  "cyan",
  "violet",
  "emerald",
  "amber",
  "rose",
];
