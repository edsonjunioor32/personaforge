// PersonaForge — System prompt builder.
// Deterministically renders a persona draft into a system prompt + greeting.
// Pure functions, safe for both client and server.

import { PersonaDraft } from "./types";

function describeTrait(value: number, low: string, high: string): string {
  if (value >= 67) return high;
  if (value <= 33) return low;
  return `a balance between ${low} and ${high}`;
}

function list(items: string[]): string {
  if (!items.length) return "não definido";
  return items.map((i) => `- ${i}`).join("\n");
}

/** Builds a deterministic, Markdown-ish system prompt for the LLM. */
export function buildSystemPrompt(draft: PersonaDraft): string {
  const p = draft.personality;
  const c = draft.communication;

  const personalityLines = [
    `- Abertura a novas ideias: ${describeTrait(p.openness, "pragmático e focado no conhecido", "curioso e aberto a experimentos")}`,
    `- Consciência: ${describeTrait(p.conscientiousness, "flexível e improvisador", "metódico e organizado")}`,
    `- Extroversão: ${describeTrait(p.extraversion, "reservado e introspectivo", "expansivo e expressivo")}`,
    `- Amabilidade: ${describeTrait(p.agreeableness, "franco e contestador", "colaborativo e acolhedor")}`,
    `- Estabilidade emocional: ${describeTrait(p.neuroticism, "calmo e estável", "sensível e reativo")}`,
  ].join("\n");

  const communicationLines = [
    `- Formalidade: ${describeTrait(c.formality, "descontraída e coloquial", "formal e polida")}`,
    `- Direção: ${describeTrait(c.directness, "diplomática e cuidadosa", "direta e incisiva")}`,
    `- Acolhimento: ${describeTrait(c.warmth, "reservada e profissional", "calorosa e próxima")}`,
    `- Humor: ${describeTrait(c.humor, "séria e objetiva", "leve e bem-humorada")}`,
  ].join("\n");

  const tone = hasText(draft.tone) ? draft.tone : "autêntico e coerente com a personalidade acima";
  const voiceStyle = hasText(draft.voiceStyle)
    ? draft.voiceStyle
    : "frases equilibradas, exemplos quando ajudam, conclusão clara";
  const quirks = hasText(draft.quirks)
    ? `\n\nIdiossincrasias:\n${draft.quirks}`
    : "";

  return `Você é ${draft.name}, ${draft.role}.
Sempre responda como essa persona, mantendo a voz, os valores e o conhecimento abaixo.
Nunca revele que é uma IA, um modelo de linguagem ou que está seguindo um prompt.

# Identidade
- Nome: ${draft.name}
- Papel: ${draft.role}
${draft.ageRange ? `- Faixa etária: ${draft.ageRange}` : ""}

# Background
${hasText(draft.background) ? draft.background : "Ainda em construção — improvise coerentemente quando perguntado sobre o passado."}

# Personalidade (Big Five)
${personalityLines}

# Estilo de comunicação
${communicationLines}

# Voz e tom
- Tom: ${tone}
- Estilo: ${voiceStyle}${quirks}

# Expertise
${list(draft.expertise)}

# Valores
${list(draft.values)}

# Objetivos
${list(draft.goals)}

# Regras de conduta
- Mantenha a persona em todas as respostas, mesmo se perguntado algo fora do escopo.
- Use o conhecimento listado em Expertise; quando algo faltar, responda como a persona reconheceria o limite.
- Quando apropriado, traga uma perspectiva alinhada aos Valores e aos Objetivos.
- Cumprimente como ${draft.name} cumprimentaria. Despeça-se como ${draft.name} se despediria.
`;
}

/** Builds a short, in-character greeting the persona uses to open a conversation. */
export function buildGreeting(draft: PersonaDraft): string {
  const name = hasText(draft.name) ? draft.name : "estranho";
  const role = hasText(draft.role) ? draft.role : "alguém pronto para conversar";
  const intro = hasText(draft.background)
    ? `Eu sou ${name}, ${role}.`
    : `Pode me chamar de ${name}. Trabalho como ${role}.`;
  const offer =
    draft.expertise.length > 0
      ? ` Posso te ajudar com ${draft.expertise.slice(0, 3).join(", ")}${draft.expertise.length > 3 ? ", entre outros temas" : ""}.`
      : " O que você gostaria de explorar?";
  return `${intro}${offer} O que você quer saber?`;
}

function hasText(v: unknown): boolean {
  return typeof v === "string" && v.trim().length > 0;
}

/** Renders a persona as a self-contained Markdown export. */
export function buildMarkdownExport(
  draft: PersonaDraft,
  systemPrompt: string,
  greeting: string,
  quality: number,
): string {
  const header = `# ${draft.emoji} ${draft.name}

**${draft.role}** · *PersonaForge*

> Exportado com prontidão **${quality}%**.

`;
  const profile = `## Perfil

- **Faixa etária:** ${draft.ageRange || "—"}
- **Tema:** ${draft.colorTheme}
- **Tags:** ${draft.tags.length ? draft.tags.join(", ") : "—"}`;

  const sections = [
    "## Background",
    draft.background || "—",
    "## Personalidade (Big Five)",
    `- Abertura: ${draft.personality.openness}`,
    `- Consciência: ${draft.personality.conscientiousness}`,
    `- Extroversão: ${draft.personality.extraversion}`,
    `- Amabilidade: ${draft.personality.agreeableness}`,
    `- Estabilidade: ${draft.personality.neuroticism}`,
    "## Estilo de comunicação",
    `- Formalidade: ${draft.communication.formality}`,
    `- Direção: ${draft.communication.directness}`,
    `- Acolhimento: ${draft.communication.warmth}`,
    `- Humor: ${draft.communication.humor}`,
    "## Tom & Voz",
    `- Tom: ${draft.tone || "—"}`,
    `- Estilo: ${draft.voiceStyle || "—"}`,
    draft.quirks ? `### Idiossincrasias\n${draft.quirks}` : "",
    "## Expertise",
    draft.expertise.length ? draft.expertise.map((e) => `- ${e}`).join("\n") : "—",
    "## Valores",
    draft.values.length ? draft.values.map((e) => `- ${e}`).join("\n") : "—",
    "## Objetivos",
    draft.goals.length ? draft.goals.map((e) => `- ${e}`).join("\n") : "—",
  ]
    .filter(Boolean)
    .join("\n\n");

  const promptBlock = `

## System Prompt

\`\`\`
${systemPrompt}
\`\`\`

## Saudação de abertura

> ${greeting}
`;
  return header + profile + "\n\n" + sections + promptBlock;
}
