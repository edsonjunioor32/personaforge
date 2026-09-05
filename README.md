# ⚙️ PersonaForge

> Forje personas de IA que pensam, falam e decidem — e converse com elas em tempo real.

PersonaForge é um studio para criar, refinar e conversar com personas de IA detalhadas. Ele conduz um discovery estruturado (identidade, personalidade Big Five, voz, expertise) e devolve uma persona pronta para conversar via LLM, com painel de qualidade determinístico e export em Markdown.

Inspirado nas práticas de engenharia do [Ring](https://github.com/edsonjunioor32/ring) e no discovery estruturado do [BoostPrompt](https://github.com/AirtonLira/boostprompt).

## ✨ Destaques

- **Discovery assistido por IA** — descreva a persona em uma frase e o LLM preenche identidade, personalidade, comunicação e listas.
- **Builder multi-step** — 8 etapas guiadas com sliders de personalidade Big Five e eixos de comunicação.
- **Painel de qualidade ao vivo** — cobertura, profundidade e riqueza combinam em uma prontidão 0-100.
- **Preview da persona em tempo real** — saudação gerada e system prompt atualizam a cada ajuste.
- **Chat real com LLM** — converse com a persona usando o system prompt gerado; histórico persistido.
- **Biblioteca** — personas salvas com busca, ações de conversar/editar/exportar/remover.
- **Export Markdown** — cada persona vira um documento self-contained.
- **4 templates prontos** — Mentora de Produto, Arquiteto de Software, Copywriter Criativo, Coach de Carreira.
- **Tema imersivo** — dark mode com 5 paletas de acento (cyan, violet, emerald, amber, rose), animações orbit/marquee.

## 🧱 Stack

- **Framework**: Next.js 16 (App Router) + TypeScript 5
- **Estilo**: Tailwind CSS 4 + shadcn/ui (New York) + framer-motion
- **Estado**: Zustand (client) + TanStack Query (server)
- **Banco**: Prisma ORM + SQLite (dev local)
- **IA**: `z-ai-web-dev-sdk` (chat completions no backend)

## 🚀 Como rodar localmente

Pré-requisitos: [Node.js 18+](https://nodejs.org/) e [Bun](https://bun.sh/) (ou npm/pnpm).

```bash
# 1. Instale dependências
bun install   # ou: npm install

# 2. Configure o banco (SQLite local, criado automaticamente)
cp .env.example .env          # ajuste DATABASE_URL se quiser outro caminho
bun run db:push               # cria as tabelas no SQLite

# 3. Suba o dev server
bun run dev
```

Abra [http://localhost:3000](http://localhost:3000). A rota `/` é a única rota pública (single-page app).

### Variáveis de ambiente

| Variável | Descrição |
| --- | --- |
| `DATABASE_URL` | Caminho do SQLite. Ex: `file:./db/personaforge.db` |

As credenciais do LLM são gerenciadas pelo `z-ai-web-dev-sdk` — não há variáveis extras a configurar neste repositório.

## 📜 Scripts

| Script | Ação |
| --- | --- |
| `bun run dev` | Dev server na porta 3000 com hot reload |
| `bun run lint` | ESLint + regras do Next.js |
| `bun run db:push` | Sincroniza o schema Prisma com o banco |
| `bun run db:generate` | Regenera o Prisma Client |
| `bun run db:migrate` | Cria e aplica uma migration |
| `bun run build` | Build de produção (não usar em dev) |

## 🗂️ Estrutura do projeto

```
src/
├── app/
│   ├── api/
│   │   ├── personas/            # CRUD + chat + export
│   │   │   ├── route.ts         # GET / POST
│   │   │   └── [id]/
│   │   │       ├── route.ts     # GET / PATCH / DELETE
│   │   │       ├── chat/        # POST — conversa com LLM
│   │   │       ├── messages/    # GET / DELETE histórico
│   │   │       └── export/      # GET markdown/json
│   │   ├── ai/
│   │   │   ├── discover/        # POST — discovery assistido por IA
│   │   │   └── generate-prompt/ # POST — refina o system prompt
│   │   └── templates/          # GET — templates de persona
│   ├── layout.tsx              # Root layout + ThemeProvider + QueryClient
│   └── page.tsx                 # Single-page: Hero + Marquee + Studio/Library/Chat
├── components/
│   ├── pf/                     # Componentes do PersonaForge
│   │   ├── studio/             # Wizard 8 etapas + discovery + preview + qualidade
│   │   ├── library/            # Grid de personas
│   │   └── chat/               # Interface de chat
│   └── ui/                     # shadcn/ui components
├── hooks/
│   └── use-personas.ts         # Hooks TanStack Query (personas, chat, discovery)
└── lib/
    ├── db.ts                   # Prisma client singleton
    ├── zai.ts                  # ZAI client singleton (chat completions)
    └── persona/
        ├── types.ts            # PersonaDraft, Personality, Communication, etc.
        ├── quality.ts          # Avaliador determinístico de prontidão
        ├── prompt-builder.ts   # Construtor de system prompt + greeting + export
        ├── serializer.ts       # (De)serialização PersonaDraft ↔ linha Prisma
        ├── templates.ts        # 4 templates de persona
        └── store/
            └── builder.ts      # Store Zustand do wizard
prisma/
└── schema.prisma               # Models Persona + Message
```

## 🌐 Deploy

Este app usa **API routes** (server runtime) e **Prisma/SQLite**, então **GitHub Pages não serve** — Pages só hospeda arquivos estáticos. As opções recomendadas:

### Vercel (recomendado para Next.js)

1. Faça push do repositório para o GitHub.
2. Importe o repo em [vercel.com/new](https://vercel.com/new).
3. Configure a variável `DATABASE_URL`. Para produção, troque o provider do Prisma de `sqlite` para `postgresql` e use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres), [Neon](https://neon.tech/) ou [Supabase](https://supabase.com/).
4. Deploy. A Vercel roda `prisma generate` + `next build` automaticamente.

> ⚠️ SQLite não persiste em ambientes serverless (filesystem efêmero). Para produção, use Postgres.

### Railway / Render / Fly.io

Alternativas que suportam Next.js + disco persistente (SQLite funciona) ou Postgres gerenciado. Siga a documentação de cada provedor para Next.js.

## 🧠 Como funciona o painel de qualidade

O `evaluateQuality` em `src/lib/persona/quality.ts` é determinístico (sem chamadas de IA):

- **Cobertura (40%)** — identidade preenchida (nome, papel, emoji, idade)
- **Profundidade (35%)** — narrativa (background, tom, voz) + variância dos traços em relação ao neutro
- **Riqueza (25%)** — expertise, valores, objetivos, quirks

A prontidão final é a soma ponderada e gera um status textual ("Persona em esboço" → "Persona afiada e pronta para produção").

## 📝 Licença

[MIT](./LICENSE) — use, fork e adapte livremente.

## 🙏 Agradecimentos

- [Ring](https://github.com/edsonjunioor32/ring) — práticas de engenharia para agentes de IA
- [BoostPrompt](https://github.com/AirtonLira/boostprompt) — discovery estruturado e painel de qualidade
