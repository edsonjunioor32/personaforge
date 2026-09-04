// PersonaForge — Deterministic quality evaluator.
// Inspired by BoostPrompt's PromptQualityEvaluator: coverage, clarity, readiness.
// Pure functions, no IO, safe for both client and server.

import {
  Communication,
  Personality,
  PersonaDraft,
  QualityEvaluation,
} from "./types";

const IDENTITY_FIELDS: (keyof PersonaDraft)[] = [
  "name",
  "role",
  "emoji",
  "ageRange",
];

const NARRATIVE_FIELDS: (keyof PersonaDraft)[] = ["background", "tone", "voiceStyle"];

function hasText(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function listSize(value: unknown): number {
  if (!Array.isArray(value)) return 0;
  return value.filter((v) => hasText(v)).length;
}

function describeTrait(value: number, low: string, high: string): string {
  if (value >= 67) return high;
  if (value <= 33) return low;
  return `balanced between ${low.toLowerCase()} and ${high.toLowerCase()}`;
}

/** Evaluates a draft and returns a deterministic, weighted readiness score. */
export function evaluateQuality(draft: PersonaDraft): QualityEvaluation {
  const missingFields: string[] = [];

  // 1) Coverage — identity completeness (40% of readiness)
  const identityHits = IDENTITY_FIELDS.filter((f) => hasText(draft[f])).length;
  const coverage = Math.round((identityHits / IDENTITY_FIELDS.length) * 100);
  IDENTITY_FIELDS.forEach((f) => {
    if (!hasText(draft[f]) && f !== "ageRange") missingFields.push(String(f));
  });

  // 2) Depth — narrative + personality + communication (35% of readiness)
  const narrativeHits = NARRATIVE_FIELDS.filter((f) => hasText(draft[f])).length;
  const narrativePct = (narrativeHits / NARRATIVE_FIELDS.length) * 100;

  const personality = draft.personality as Personality;
  const communication = draft.communication as Communication;
  // Traits that deviate from the neutral midline show intentional design.
  const personalityVariance =
    1 -
    Object.values(personality).reduce(
      (acc, v) => acc + Math.abs(v - 50) / 50,
      0,
    ) /
      5;
  const communicationVariance =
    1 -
    Object.values(communication).reduce(
      (acc, v) => acc + Math.abs(v - 50) / 50,
      0,
    ) /
      4;
  const variancePct = ((1 - personalityVariance) + (1 - communicationVariance)) / 2 * 100;
  const depth = Math.round(
    0.5 * narrativePct + 0.5 * Math.min(100, variancePct * 2),
  );

  if (!hasText(draft.background)) missingFields.push("background");
  if (variancePct < 25) missingFields.push("personality/communication");

  // 3) Richness — expertise, values, goals lists (25% of readiness)
  const expertiseCount = listSize(draft.expertise);
  const valuesCount = listSize(draft.values);
  const goalsCount = listSize(draft.goals);
  const richness = Math.min(
    100,
    Math.round(
      (expertiseCount * 12) +
        (valuesCount * 14) +
        (goalsCount * 14) +
        (hasText(draft.quirks) ? 16 : 0),
    ),
  );
  if (expertiseCount < 2) missingFields.push("expertise");
  if (valuesCount === 0) missingFields.push("values");
  if (goalsCount === 0) missingFields.push("goals");

  const readiness = Math.round(
    0.4 * coverage + 0.35 * depth + 0.25 * richness,
  );

  const statusText =
    readiness === 0
      ? "Aguardando o primeiro traço da persona."
      : readiness < 40
        ? "Persona em esboço."
        : readiness < 70
          ? "Persona em consolidação."
          : readiness < 90
            ? "Persona pronta para conversar."
            : "Persona afiada e pronta para produção.";

  return {
    coverage,
    depth,
    richness,
    readiness,
    statusText,
    missingFields,
  };
}

/** Human-readable label for a 0-100 trait slider. */
export function traitLabel(value: number, low: string, high: string): string {
  return describeTrait(value, low, high);
}
