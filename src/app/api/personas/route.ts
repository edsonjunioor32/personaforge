// PersonaForge — /api/personas (list + create)

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { buildGreeting, buildSystemPrompt } from "@/lib/persona/prompt-builder";
import { evaluateQuality } from "@/lib/persona/quality";
import { draftToRow, rowToDraft } from "@/lib/persona/serializer";
import { PersonaDraft } from "@/lib/persona/types";

export const dynamic = "force-dynamic";

function isDraft(value: unknown): value is PersonaDraft {
  if (!value || typeof value !== "object") return false;
  const d = value as Record<string, unknown>;
  return typeof d.name === "string" && typeof d.role === "string";
}

export async function GET() {
  try {
    const rows = await db.persona.findMany({
      orderBy: { updatedAt: "desc" },
      take: 100,
    });
    const personas = rows.map((row) => ({
      id: row.id,
      draft: rowToDraft(row),
      systemPrompt: row.systemPrompt ?? "",
      greeting: row.greeting ?? "",
      quality: row.quality ?? 0,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }));
    return NextResponse.json({ personas });
  } catch (error) {
    console.error("[GET /api/personas]", error);
    return NextResponse.json(
      { error: "Falha ao listar personas." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!isDraft(body)) {
      return NextResponse.json(
        { error: "Payload inválido. Envie um PersonaDraft." },
        { status: 400 },
      );
    }
    if (!body.name.trim() || !body.role.trim()) {
      return NextResponse.json(
        { error: "Nome e papel são obrigatórios." },
        { status: 400 },
      );
    }
    const quality = evaluateQuality(body).readiness;
    const systemPrompt = buildSystemPrompt(body);
    const greeting = buildGreeting(body);

    const row = await db.persona.create({
      data: {
        ...draftToRow(body),
        systemPrompt,
        greeting,
        quality,
      },
    });

    return NextResponse.json(
      {
        id: row.id,
        draft: rowToDraft(row),
        systemPrompt,
        greeting,
        quality,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/personas]", error);
    return NextResponse.json(
      { error: "Falha ao criar persona." },
      { status: 500 },
    );
  }
}
