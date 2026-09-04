# PersonaForge — Worklog

Projeto: recriação/melhoria do repositório `edsonjunioor32/personaforge` como um
Next.js 16 app imersivo, usando como guias:
- `ring-main` (práticas de engenharia / skills)
- `boostprompt-main` (discovery estruturado, painel de qualidade, landing imersiva)

## Decisões de design
- App single-page na rota `/` com header sticky, hero imersivo (dark, cyan/violet),
  marquee, e abas de studio: **Studio** (builder multi-step), **Biblioteca**
  (personas salvas), **Conversa** (chat com persona).
- Backend via API routes (App Router) + Prisma/SQLite + z-ai-web-dev-sdk (LLM).
- Painel de qualidade determinístico inspirado no `PromptQualityEvaluator` do
  BoostPrompt (cobertura, clareza, prontidão).
- Wizard do Studio cobre 8 etapas: Identidade, Background, Personalidade (Big Five),
  Comunicação, Expertise, Valores, Voz/Tom, Revisão/Gerar prompt.

## Ordem de execução
1. Fundação: schema Prisma, tipos, libs (qualidade + system prompt), tema, layout.
2. Backend: API routes (CRUD personas, chat LLM, discovery IA, geração de prompt,
   templates, export).
3. Frontend: hero + marquee + abas + wizard + library + chat + footer sticky.
4. Validação: lint + dev server + Agent Browser.


---
Task ID: 1
Agent: main (orchestrator)
Task: Fundação — Prisma schema, tipos TS, libs de domínio, tema visual, layout.

Work Log:
- Definido schema Prisma (models Persona + Message) e executado `bun run db:push`.
- Criados tipos de domínio em `src/lib/persona/types.ts` (PersonaDraft, Personality, Communication, ColorTheme, QualityEvaluation, PersonaTemplate, defaults).
- Implementado avaliador de qualidade determinístico em `src/lib/persona/quality.ts` (cobertura/profundidade/riqueza/prontidão), inspirado no PromptQualityEvaluator do BoostPrompt.
- Implementado construtor de system prompt + greeting + export Markdown em `src/lib/persona/prompt-builder.ts`.
- Criados 4 templates de persona (Mentora de Produto, Arquiteto, Copywriter, Coach) em `src/lib/persona/templates.ts`.
- Criado serializer entre PersonaDraft e linha Prisma em `src/lib/persona/serializer.ts`.
- Tema visual dark imersivo em `globals.css` (cyan/violet/emerald/amber/rose, marquee, orbit, grid, radial bg, scrollbar custom).
- Layout atualizado com metadata, ThemeProvider (dark default), Providers (TanStack Query) e Toaster (sonner).

Stage Summary:
- Fundação completa para o frontend e backend. DB sincronizado. Libs de domínio puras (sem IO), reutilizáveis em client e server.

---
Task ID: 2
Agent: main (orchestrator)
Task: Backend API routes (CRUD personas, chat LLM, discovery IA, geração de prompt, templates, export).

Work Log:
- Criado singleton ZAI em `src/lib/zai.ts` com wrapper `chatComplete`.
- `POST/GET /api/personas` (listar + criar, gera systemPrompt + greeting + quality ao salvar).
- `GET/PATCH/DELETE /api/personas/[id]` (buscar, atualizar com merge de sub-objetos, remover com cascade).
- `GET/DELETE /api/personas/[id]/messages` (histórico de chat + limpar).
- `POST /api/personas/[id]/chat` (persiste user message, chama LLM com system prompt, persiste reply, fallback gracioso).
- `POST /api/ai/discover` (LLM devolve rascunho estruturado JSON; parsing tolerante + validação de tipos + clamps).
- `POST /api/ai/generate-prompt` (refina o system prompt determinístico via LLM, com fallback).
- `GET /api/templates` (presets estáticos).
- `GET /api/personas/[id]/export?format=markdown|json` (export self-contained).

Stage Summary:
- Backend completo e validado via curl: discover devolve draft válido; create devolve quality 93% + greeting; chat responde em personagem com quirks.
- Bug corrigido durante a verificação: o arquivo `src/app/api/personas/route.ts` não tinha sido criado (404); reescrito.
- Bug corrigido: hook `useDiscover` empacotava `{ brief }` duas vezes; ajustado para `{ brief }: { brief: string }`.
- Bug corrigido: função `jfetch` vs `jFetch` (case-sensitive) quebrava `usePersonas`; padronizado para `jFetch`.
- Servidor de discover endurecido com `typeof body.brief === "string"` para não 500 em payload inválido.

---
Task ID: 3
Agent: main (orchestrator)
Task: Frontend completo — hero imersivo, marquee, how-it-works, abas, wizard, library, chat, footer sticky.

Work Log:
- Store Zustand do builder em `src/lib/persona/store/builder.ts` (view, draft, step, mutations, openChat, evaluate).
- Hooks TanStack Query em `src/hooks/use-personas.ts` (personas, create/update/delete, templates, discover, generatePrompt, messages, sendMessage com optimistic update, clearMessages).
- Header sticky com nav (Studio/Biblioteca/Conversa) + theme toggle + link GitHub.
- Hero imersivo com orbit cards, gradient text, stats, CTA (framer-motion).
- Marquee de capacidades (CSS animation, pausa no hover).
- HowItWorks com 3 passos.
- Studio: discovery entry (IA + templates colapsáveis), wizard 8 etapas com stepper, painel de qualidade ao vivo, preview da persona ao vivo, ações de salvar/exportar/conversar.
- 8 steps: Identidade (nome, papel, emoji, tema cor, tags), Background, Personalidade (Big Five sliders), Comunicação (4 eixos sliders), Expertise (ListEditor), Valores & Objetivos, Voz & Tom, Revisão.
- Library: grid de cards de persona com busca, dropdown de ações (conversar/editar/remover), badge de qualidade, tags, timestamp relativo.
- Chat: seletor de persona, lista de mensagens com scroll custom, bubbles user/assistant, composer com Enter/Shift+Enter, indicador de digitação animado, limpar e exportar.
- Footer sticky com `mt-auto` em `min-h-screen flex flex-col`.

Stage Summary:
- UI completa e funcional. Lint limpo (apenas 1 warning em arquivo do guia, não do projeto).

---
Task ID: 4
Agent: main (orchestrator)
Task: Validação com Agent Browser — render, interações, responsividade, footer sticky.

Work Log:
- Dev server compila sem erros. Lint passa (0 erros).
- Agent Browser abriu `/` e renderizou: header, hero, marquee, how-it-works, studio completo (8 steps, painel de qualidade, preview).
- Corrigido warning de chave duplicada de emoji 🧭.
- Testado fluxo de discovery pela UI: brief → "Descobrir persona" → LLM preencheu draft completo ("Luciano Ribeiro, Arquiteto de Software", 99% de prontidão).
- Testado fluxo de salvar pela UI: review → "Salvar persona" → persona aparece na Biblioteca.
- Testado chat pela UI: enviada mensagem pelo composer → LLM respondeu em personagem (Helena usou a quirk "a hipótese aqui é...").
- Validação VLM (desktop 1440px): layout limpo, sem sobreposições, rodapé fixado, tema escuro coerente.
- Validação VLM (mobile 390px): sem transbordamento, touch targets adequados, legível — aprovado.
- Console e page errors: limpos após todos os fixes.

Stage Summary:
- PersonaForge está rodando, interativo e validado ponta-a-ponta: discovery IA → wizard → salvar → biblioteca → conversar com LLM.
- Pronto para entrega.
