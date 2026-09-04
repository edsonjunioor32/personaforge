// PersonaForge — Domain types shared between client, server, and API.

export type ColorTheme = "cyan" | "violet" | "emerald" | "amber" | "rose";

/** Big Five personality traits, each 0-100. */
export interface Personality {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

/** Communication style axes, each 0-100. */
export interface Communication {
  formality: number; // 0 casual → 100 formal
  directness: number; // 0 diplomatic → 100 blunt
  warmth: number; // 0 reserved → 100 warm
  humor: number; // 0 serious → 100 playful
}

/** Shape used by the builder wizard and the API. */
export interface PersonaDraft {
  name: string;
  emoji: string;
  role: string;
  ageRange?: string;
  background?: string;
  personality: Personality;
  communication: Communication;
  expertise: string[];
  values: string[];
  goals: string[];
  tone?: string;
  voiceStyle?: string;
  quirks?: string;
  colorTheme: ColorTheme;
  tags: string[];
}

export interface Persona extends PersonaDraft {
  id: string;
  systemPrompt: string;
  greeting: string;
  quality: number;
  createdAt: string;
  updatedAt: string;
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  personaId: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface QualityEvaluation {
  /** Identity & background completeness % */
  coverage: number;
  /** Personality & communication depth % */
  depth: number;
  /** Richness of expertise/values/goals % */
  richness: number;
  /** 0-100 weighted readiness for a usable persona */
  readiness: number;
  statusText: string;
  missingFields: string[];
}

export interface PersonaTemplate {
  id: string;
  label: string;
  emoji: string;
  role: string;
  description: string;
  colorTheme: ColorTheme;
  draft: PersonaDraft;
}

export const DEFAULT_PERSONALITY: Personality = {
  openness: 70,
  conscientiousness: 65,
  extraversion: 50,
  agreeableness: 60,
  neuroticism: 35,
};

export const DEFAULT_COMMUNICATION: Communication = {
  formality: 45,
  directness: 50,
  warmth: 65,
  humor: 40,
};

export const EMPTY_DRAFT: PersonaDraft = {
  name: "",
  emoji: "🧩",
  role: "",
  ageRange: "",
  background: "",
  personality: { ...DEFAULT_PERSONALITY },
  communication: { ...DEFAULT_COMMUNICATION },
  expertise: [],
  values: [],
  goals: [],
  tone: "",
  voiceStyle: "",
  quirks: "",
  colorTheme: "cyan",
  tags: [],
};
