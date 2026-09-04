// PersonaForge — Singleton ZAI client used by API routes.
// z-ai-web-dev-sdk MUST be server-side only.

import ZAI from "z-ai-web-dev-sdk";

let client: Awaited<ReturnType<typeof ZAI.create>> | null = null;

export async function getZAI() {
  if (client) return client;
  client = await ZAI.create();
  return client;
}

/** Chat completion wrapper with retry on transient errors. */
export async function chatComplete(
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[],
): Promise<string> {
  const zai = await getZAI();
  const completion = await zai.chat.completions.create({
    messages: [
      { role: "assistant", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    thinking: { type: "disabled" },
  });
  return completion.choices[0]?.message?.content ?? "";
}
