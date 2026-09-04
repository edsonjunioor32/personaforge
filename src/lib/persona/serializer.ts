// PersonaForge — (de)serialization between PersonaDraft and the Prisma row.
// SQLite cannot store lists/objects directly, so we keep them as JSON strings.

import { PersonaDraft } from "./types";
import {
  DEFAULT_COMMUNICATION,
  DEFAULT_PERSONALITY,
} from "./types";

type PersonaRow = {
  id: string;
  name: string;
  emoji: string;
  role: string;
  ageRange: string | null;
  background: string | null;
  personality: string | null;
  communication: string | null;
  expertise: string | null;
  values: string | null;
  goals: string | null;
  tone: string | null;
  voiceStyle: string | null;
  quirks: string | null;
  systemPrompt: string | null;
  greeting: string | null;
  colorTheme: string | null;
  tags: string | null;
  quality: number | null;
  createdAt: Date;
  updatedAt: Date;
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeList(raw: string | null): string[] {
  const parsed = safeParse<string[] | null>(raw, null);
  if (Array.isArray(parsed)) {
    return parsed.filter((s) => typeof s === "string" && s.trim().length > 0);
  }
  return [];
}

function safeTags(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

/** Converts a Prisma persona row into a full PersonaDraft. */
export function rowToDraft(row: PersonaRow): PersonaDraft {
  return {
    name: row.name,
    emoji: row.emoji,
    role: row.role,
    ageRange: row.ageRange ?? "",
    background: row.background ?? "",
    personality: {
      ...DEFAULT_PERSONALITY,
      ...safeParse<Partial<typeof DEFAULT_PERSONALITY>>(row.personality, {}),
    },
    communication: {
      ...DEFAULT_COMMUNICATION,
      ...safeParse<Partial<typeof DEFAULT_COMMUNICATION>>(row.communication, {}),
    },
    expertise: safeList(row.expertise),
    values: safeList(row.values),
    goals: safeList(row.goals),
    tone: row.tone ?? "",
    voiceStyle: row.voiceStyle ?? "",
    quirks: row.quirks ?? "",
    colorTheme: (row.colorTheme as PersonaDraft["colorTheme"]) ?? "cyan",
    tags: safeTags(row.tags),
  };
}

/** Converts a PersonaDraft into the payload Prisma expects (JSON strings). */
export function draftToRow(draft: PersonaDraft) {
  return {
    name: draft.name,
    emoji: draft.emoji,
    role: draft.role,
    ageRange: draft.ageRange?.trim() || null,
    background: draft.background?.trim() || null,
    personality: JSON.stringify(draft.personality),
    communication: JSON.stringify(draft.communication),
    expertise: JSON.stringify(draft.expertise),
    values: JSON.stringify(draft.values),
    goals: JSON.stringify(draft.goals),
    tone: draft.tone?.trim() || null,
    voiceStyle: draft.voiceStyle?.trim() || null,
    quirks: draft.quirks?.trim() || null,
    colorTheme: draft.colorTheme,
    tags: draft.tags.length ? draft.tags.join(",") : null,
  };
}
