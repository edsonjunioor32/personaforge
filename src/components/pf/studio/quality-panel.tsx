"use client";

import { CheckCircle2, TriangleAlert, Circle } from "lucide-react";
import { useMemo } from "react";
import { useBuilder } from "@/lib/persona/store/builder";
import { evaluateQuality } from "@/lib/persona/quality";

const FIELD_LABELS: Record<string, string> = {
  name: "Nome",
  role: "Papel",
  emoji: "Emoji",
  background: "Background",
  "personality/communication": "Personalidade e comunicação",
  expertise: "Expertise",
  values: "Valores",
  goals: "Objetivos",
};

export function QualityPanel() {
  const draft = useBuilder((s) => s.draft);
  const evaluation = useMemo(() => evaluateQuality(draft), [draft]);

  const bars = [
    { label: "Cobertura", value: evaluation.coverage },
    { label: "Profundidade", value: evaluation.depth },
    { label: "Riqueza", value: evaluation.richness },
  ];

  const readinessTone =
    evaluation.readiness >= 70
      ? "text-[oklch(0.78_0.16_162)]"
      : evaluation.readiness >= 40
        ? "text-[oklch(0.82_0.16_75)]"
        : "text-[oklch(0.7_0.2_17)]";

  return (
    <aside className="rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold tracking-tight">Painel de qualidade</h3>
          <p className="text-xs text-muted-foreground">Avaliação determinística</p>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-extrabold ${readinessTone}`}>
            {evaluation.readiness}%
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            prontidão
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {bars.map((b) => (
          <div key={b.label}>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">{b.label}</span>
              <span className="font-semibold">{b.value}%</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-foreground/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[oklch(0.82_0.16_196)] to-[oklch(0.62_0.22_295)] transition-all"
                style={{ width: `${b.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{evaluation.statusText}</p>

      {evaluation.missingFields.length > 0 ? (
        <div className="mt-4 rounded-lg border border-border/40 bg-background/40 p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <TriangleAlert className="h-3.5 w-3.5 text-[oklch(0.82_0.16_75)]" />
            Falta ajustar
          </p>
          <ul className="mt-2 space-y-1.5">
            {evaluation.missingFields.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <Circle className="h-3 w-3 text-[oklch(0.82_0.16_75)]/70" />
                {FIELD_LABELS[f] ?? f}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-[oklch(0.78_0.16_162)]/40 bg-[oklch(0.78_0.16_162)]/10 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-[oklch(0.78_0.16_162)]">
            <CheckCircle2 className="h-4 w-4" />
            Persona afiada e pronta para conversar.
          </p>
        </div>
      )}
    </aside>
  );
}
