// PersonaForge — /api/personas/[id]/messages (list + clear)

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const persona = await db.persona.findUnique({ where: { id } });
    if (!persona) {
      return NextResponse.json({ error: "Persona não encontrada." }, { status: 404 });
    }
    const rows = await db.message.findMany({
      where: { personaId: id },
      orderBy: { createdAt: "asc" },
      take: 200,
    });
    const messages = rows.map((r) => ({
      id: r.id,
      personaId: r.personaId,
      role: r.role,
      content: r.content,
      createdAt: r.createdAt.toISOString(),
    }));
    return NextResponse.json({ messages, greeting: persona.greeting ?? "" });
  } catch (error) {
    console.error("[GET /api/personas/[id]/messages]", error);
    return NextResponse.json({ error: "Falha ao listar mensagens." }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await db.message.deleteMany({ where: { personaId: id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/personas/[id]/messages]", error);
    return NextResponse.json({ error: "Falha ao limpar mensagens." }, { status: 500 });
  }
}
