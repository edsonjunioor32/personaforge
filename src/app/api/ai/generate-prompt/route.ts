// PersonaForge — /api/ai/generate-prompt
// Polishes the deterministic system prompt using the LLM, while keeping
// the deterministic version as fallback so the UI always has something.

import { NextResponse } from "next/server";
import { getZAI } from "@/lib/zai";
import { buildGreeting, buildSystemPrompt } from "@/lib/persona/prompt-builder";
import { PersonaDraft } from "@/lib/persona/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface Body {
  draft?: PersonaDraft;
}

const SYSTEM_PROMPT = `Você é o editor de prompt do PersonaForge. Refatore o system prompt recebido mantendo todos os fatos e regras, mas torne-o mais nítido, direto e teatralmente coerente com a persona.
Responda SOMENTE com o novo system prompt em Markdown, sem comentários, sem cercas de código, sem explicação.`;

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Body;
    const draft = body.draft;
    if (!draft || typeof draft !== "object" || !draft.name || !draft.role) {
      return NextResponse.json(
        { error: "Envie um PersonaDraft com nome e papel." },
        { status: 400 },
      );
    }

    const deterministic = buildSystemPrompt(draft);
    const greeting = buildGreeting(draft);

    let polished: string;
    try {
      const zai = await getZAI();
      const completion = await zai.chat.completions.create({
        messages: [
          { role: "assistant", content: SYSTEM_PROMPT },
          { role: "user", content: deterministic },
        ],
        thinking: { type: "disabled" },
      });
      polished = (completion.choices[0]?.message?.content ?? "").trim();
      if (polished.length < 60) polished = deterministic;
    } catch (err) {
      console.error("[generate-prompt LLM]", err);
      polished = deterministic;
    }

    return NextResponse.json({ systemPrompt: polished, greeting });
  } catch (error) {
    console.error("[POST /api/ai/generate-prompt]", error);
    return NextResponse.json({ error: "Falha ao refinar o prompt." }, { status: 500 });
  }
}
