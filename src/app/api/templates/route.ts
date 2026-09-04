// PersonaForge — /api/templates
// Static preset personas that seed the builder with a coherent starting point.

import { NextResponse } from "next/server";
import { PERSONA_TEMPLATES } from "@/lib/persona/templates";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ templates: PERSONA_TEMPLATES });
}
