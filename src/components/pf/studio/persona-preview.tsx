"use client";

import { useMemo } from "react";
import { useBuilder } from "@/lib/persona/store/builder";
import { accent } from "@/components/pf/accent";
import { buildGreeting, buildSystemPrompt } from "@/lib/persona/prompt-builder";
import { traitLabel } from "@/lib/persona/quality";

export function PersonaPreview() {
  const draft = useBuilder((s) => s.draft);
  const accentCls = accent(draft.colorTheme);

  const greeting = useMemo(() => buildGreeting(draft), [draft]);
  const systemPrompt = useMemo(() => buildSystemPrompt(draft), [draft]);

  const personalityBlurb = [
    traitLabel(draft.personality.openness, "pragmático", "curioso"),
    traitLabel(draft.personality.extraversion, "reservado", "expansivo"),
    traitLabel(draft.personality.agreeableness, "franco", "acolhedor"),
  ].join(", ");

  return (
    <aside className="rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur">
      <div className="flex items-center gap-2">
        <span
          className={`grid h-12 w-12 place-items-center rounded-xl border text-2xl ${accentCls.border} ${accentCls.bg}`}
          aria-hidden
        >
          {draft.emoji || "🧩"}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold tracking-tight">
            {draft.name || "Persona sem nome"}
          </h3>
          <p className="truncate text-xs text-muted-foreground">
            {draft.role || "defina um papel"}
          </p>
        </div>
      </div>

      {draft.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {draft.tags.slice(0, 6).map((t) => (
            <span
              key={t}
              className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${accentCls.border} ${accentCls.text}`}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {draft.background ? (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground line-clamp-4">
          {draft.background}
        </p>
      ) : (
        <p className="mt-4 text-sm italic text-muted-foreground/70">
          O background aparece aqui conforme você descreve a persona.
        </p>
      )}

      <div className="mt-4 rounded-lg border border-border/40 bg-background/40 p-3 text-xs">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Personalidade
        </div>
        <div className="mt-1 text-foreground/80">{personalityBlurb}.</div>
      </div>

      <div className="mt-3 rounded-lg border border-border/40 bg-background/40 p-3 text-xs">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Saudação gerada
        </div>
        <p className="mt-1 leading-relaxed text-foreground/80">{greeting}</p>
      </div>

      <details className="mt-3 group">
        <summary
          className={`cursor-pointer select-none text-xs font-semibold ${accentCls.text}`}
        >
          Ver system prompt ({systemPrompt.length} chars)
        </summary>
        <pre className="pf-scroll mt-2 max-h-60 overflow-auto rounded-lg border border-border/40 bg-background/60 p-3 text-[11px] leading-relaxed whitespace-pre-wrap text-foreground/80">
          {systemPrompt}
        </pre>
      </details>
    </aside>
  );
}
