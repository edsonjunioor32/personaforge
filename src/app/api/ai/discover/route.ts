// PersonaForge — /api/ai/discover
// Given a free-text brief, the LLM suggests a structured PersonaDraft skeleton.
// Returns JSON parsed strictly so the builder can prefill safely.

import { NextResponse } from "next/server";
import { getZAI } from "@/lib/zai";
import {
  DEFAULT_COMMUNICATION,
  DEFAULT_PERSONALITY,
  type ColorTheme,
  type PersonaDraft,
} from "@/lib/persona/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface DiscoverBody {
  brief?: string;
}

const SYSTEM_PROMPT = `Você é o Discovery do PersonaForge. A partir de uma descrição curta, você devolve um rascunho estruturado de persona em JSON.
Responda SOMENTE com JSON válido, sem texto fora do objeto. Campos:
- name (string, nome próprio coerente)
- emoji (1 emoji que represente a persona)
- role (string, papel/profissão)
- ageRange (string curta, ex: "30-40")
- background (string, 1-2 frases)
- tone (string curta)
- voiceStyle (string curta)
- quirks (string curta, opcional)
- colorTheme (um de: cyan | violet | emerald | amber | rose)
- expertise (array de 3-5 strings)
- values (array de 3 strings)
- goals (array de 2-3 strings)
- personality (objeto com openness, conscientiousness, extraversion, agreeableness, neuroticism; cada um 0-100 inteiro)
- communication (objeto com formality, directness, warmth, humor; cada um 0-100 inteiro)
- tags (array de 2-4 strings curtas)
Toda a persona deve ser em português do Brasil, coerente com a descrição recebida.`;

const VALID_THEMES: ColorTheme[] = ["cyan", "violet", "emerald", "amber", "rose"];

function clamp(n: unknown, lo = 0, hi = 100): number {
  const num = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(num)) return Math.round((lo + hi) / 2);
  return Math.max(lo, Math.min(hi, Math.round(num)));
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => (typeof x === "string" ? x.trim() : String(x)))
    .filter((s) => s.length > 0);
}

function safeDraft(raw: unknown): PersonaDraft | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const draft: PersonaDraft = {
    name: typeof o.name === "string" ? o.name.slice(0, 80) : "",
    emoji: typeof o.emoji === "string" ? o.emoji.slice(0, 4) : "🧩",
    role: typeof o.role === "string" ? o.role.slice(0, 120) : "",
    ageRange: typeof o.ageRange === "string" ? o.ageRange.slice(0, 24) : "",
    background: typeof o.background === "string" ? o.background.slice(0, 600) : "",
    tone: typeof o.tone === "string" ? o.tone.slice(0, 120) : "",
    voiceStyle: typeof o.voiceStyle === "string" ? o.voiceStyle.slice(0, 240) : "",
    quirks: typeof o.quirks === "string" ? o.quirks.slice(0, 240) : "",
    colorTheme: VALID_THEMES.includes(o.colorTheme as ColorTheme)
      ? (o.colorTheme as ColorTheme)
      : "cyan",
    expertise: asStringArray(o.expertise).slice(0, 8),
    values: asStringArray(o.values).slice(0, 8),
    goals: asStringArray(o.goals).slice(0, 6),
    tags: asStringArray(o.tags).slice(0, 6),
    personality: {
      openness: clamp((o.personality as { openness?: number })?.openness ?? DEFAULT_PERSONALITY.openness),
      conscientiousness: clamp(
        (o.personality as { conscientiousness?: number })?.conscientiousness ?? DEFAULT_PERSONALITY.conscientiousness,
      ),
      extraversion: clamp((o.personality as { extraversion?: number })?.extraversion ?? DEFAULT_PERSONALITY.extraversion),
      agreeableness: clamp((o.personality as { agreeableness?: number })?.agreeableness ?? DEFAULT_PERSONALITY.agreeableness),
      neuroticism: clamp((o.personality as { neuroticism?: number })?.neuroticism ?? DEFAULT_PERSONALITY.neuroticism),
    },
    communication: {
      formality: clamp((o.communication as { formality?: number })?.formality ?? DEFAULT_COMMUNICATION.formality),
      directness: clamp((o.communication as { directness?: number })?.directness ?? DEFAULT_COMMUNICATION.directness),
      warmth: clamp((o.communication as { warmth?: number })?.warmth ?? DEFAULT_COMMUNICATION.warmth),
      humor: clamp((o.communication as { humor?: number })?.humor ?? DEFAULT_COMMUNICATION.humor),
    },
  };
  if (!draft.name || !draft.role) return null;
  return draft;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as DiscoverBody;
    const brief = typeof body.brief === "string" ? body.brief.trim() : "";
    if (!brief || brief.length < 6) {
      return NextResponse.json(
        { error: "Descreva a persona em pelo menos uma frase curta." },
        { status: 400 },
      );
    }

    const zai = await getZAI();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Descrição: """${brief.slice(0, 1200)}"""\n\nDevolva o JSON da persona.`,
        },
      ],
      thinking: { type: "disabled" },
    });
    const raw = completion.choices[0]?.message?.content ?? "";
    // Tolerant JSON extraction.
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      return NextResponse.json(
        { error: "Não consegui interpretar a persona sugerida." },
        { status: 502 },
      );
    }
    const jsonText = raw.slice(start, end + 1);
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      return NextResponse.json(
        { error: "Resposta do modelo não estava em JSON válido." },
        { status: 502 },
      );
    }
    const draft = safeDraft(parsed);
    if (!draft) {
      return NextResponse.json(
        { error: "Persona sugerida estava incompleta." },
        { status: 502 },
      );
    }
    return NextResponse.json({ draft });
  } catch (error) {
    console.error("[POST /api/ai/discover]", error);
    return NextResponse.json({ error: "Falha no discovery assistido." }, { status: 500 });
  }
}
