// PersonaForge — /api/personas/[id]/chat
// Persists the user message, calls the LLM with the persona system prompt,
// persists the assistant reply, and returns it.

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { chatComplete } from "@/lib/zai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface ChatBody {
  message?: string;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await req.json().catch(() => ({}))) as ChatBody;
    const message = body.message?.trim();
    if (!message) {
      return NextResponse.json({ error: "Mensagem vazia." }, { status: 400 });
    }

    const persona = await db.persona.findUnique({ where: { id } });
    if (!persona) {
      return NextResponse.json({ error: "Persona não encontrada." }, { status: 404 });
    }
    if (!persona.systemPrompt) {
      return NextResponse.json(
        { error: "Persona sem system prompt. Gere o prompt no Studio." },
        { status: 400 },
      );
    }

    // Load recent context (last 12 turns) to keep the LLM grounded.
    const history = await db.message.findMany({
      where: { personaId: id },
      orderBy: { createdAt: "desc" },
      take: 12,
    });
    history.reverse();

    await db.message.create({
      data: { personaId: id, role: "user", content: message },
    });

    const conversation = history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));
    conversation.push({ role: "user", content: message });

    let reply: string;
    try {
      reply = await chatComplete(persona.systemPrompt, conversation);
    } catch (llmError) {
      console.error("[chat LLM]", llmError);
      // Fallback message so the UI keeps working even if the LLM is unreachable.
      reply =
        "Não consegui me conectar ao modelo de linguagem agora, mas continuo aqui como " +
        persona.name +
        ". Pode repetir?";
    }

    const saved = await db.message.create({
      data: { personaId: id, role: "assistant", content: reply },
    });

    return NextResponse.json({
      message: {
        id: saved.id,
        personaId: saved.personaId,
        role: saved.role,
        content: saved.content,
        createdAt: saved.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[POST /api/personas/[id]/chat]", error);
    return NextResponse.json({ error: "Falha na conversa." }, { status: 500 });
  }
}
