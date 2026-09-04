// PersonaForge — /api/personas/[id]/export
// Returns a self-contained Markdown export of the persona.

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { buildMarkdownExport } from "@/lib/persona/prompt-builder";
import { rowToDraft } from "@/lib/persona/serializer";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const url = new URL(req.url);
    const format = url.searchParams.get("format") ?? "markdown";
    const row = await db.persona.findUnique({ where: { id } });
    if (!row) {
      return NextResponse.json({ error: "Persona não encontrada." }, { status: 404 });
    }
    const draft = rowToDraft(row);
    const systemPrompt = row.systemPrompt ?? "";
    const greeting = row.greeting ?? "";
    const quality = row.quality ?? 0;

    if (format === "json") {
      return NextResponse.json({
        draft,
        systemPrompt,
        greeting,
        quality,
      });
    }

    const markdown = buildMarkdownExport(draft, systemPrompt, greeting, quality);
    const safeName = draft.name.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase();
    return new NextResponse(markdown, {
      headers: {
        "content-type": "text/markdown; charset=utf-8",
        "content-disposition": `attachment; filename="personaforge-${safeName}.md"`,
      },
    });
  } catch (error) {
    console.error("[GET /api/personas/[id]/export]", error);
    return NextResponse.json({ error: "Falha ao exportar persona." }, { status: 500 });
  }
}
