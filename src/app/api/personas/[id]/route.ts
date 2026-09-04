// PersonaForge — /api/personas/[id] (get + update + delete)

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { buildGreeting, buildSystemPrompt } from "@/lib/persona/prompt-builder";
import { evaluateQuality } from "@/lib/persona/quality";
import { draftToRow, rowToDraft } from "@/lib/persona/serializer";
import { PersonaDraft } from "@/lib/persona/types";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const row = await db.persona.findUnique({ where: { id } });
    if (!row) {
      return NextResponse.json({ error: "Persona não encontrada." }, { status: 404 });
    }
    return NextResponse.json({
      id: row.id,
      draft: rowToDraft(row),
      systemPrompt: row.systemPrompt ?? "",
      greeting: row.greeting ?? "",
      quality: row.quality ?? 0,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("[GET /api/personas/[id]]", error);
    return NextResponse.json({ error: "Falha ao buscar persona." }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await req.json()) as Partial<PersonaDraft>;
    const existing = await db.persona.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Persona não encontrada." }, { status: 404 });
    }
    const current = rowToDraft(existing);
    const merged: PersonaDraft = {
      ...current,
      ...body,
      personality: { ...current.personality, ...(body.personality ?? {}) },
      communication: { ...current.communication, ...(body.communication ?? {}) },
      expertise: body.expertise ?? current.expertise,
      values: body.values ?? current.values,
      goals: body.goals ?? current.goals,
      tags: body.tags ?? current.tags,
    };
    if (!merged.name.trim() || !merged.role.trim()) {
      return NextResponse.json({ error: "Nome e papel são obrigatórios." }, { status: 400 });
    }
    const quality = evaluateQuality(merged).readiness;
    const systemPrompt = buildSystemPrompt(merged);
    const greeting = buildGreeting(merged);

    const row = await db.persona.update({
      where: { id },
      data: {
        ...draftToRow(merged),
        systemPrompt,
        greeting,
        quality,
      },
    });
    return NextResponse.json({
      id: row.id,
      draft: rowToDraft(row),
      systemPrompt,
      greeting,
      quality,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("[PATCH /api/personas/[id]]", error);
    return NextResponse.json({ error: "Falha ao atualizar persona." }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await db.persona.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/personas/[id]]", error);
    return NextResponse.json({ error: "Falha ao remover persona." }, { status: 500 });
  }
}
