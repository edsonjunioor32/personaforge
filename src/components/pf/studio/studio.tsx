"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBuilder, BUILDER_STEPS } from "@/lib/persona/store/builder";
import { DiscoveryEntry } from "./discovery-entry";
import { QualityPanel } from "./quality-panel";
import { PersonaPreview } from "./persona-preview";
import {
  StepBackground,
  StepCommunication,
  StepExpertise,
  StepIdentity,
  StepPersonality,
  StepValuesGoals,
  StepVoice,
} from "./steps";
import { StepReview } from "./step-review";

const STEP_META = [
  { label: "Identidade", short: "Identidade" },
  { label: "Background", short: "Background" },
  { label: "Personalidade", short: "Personalidade" },
  { label: "Comunicação", short: "Comunicação" },
  { label: "Expertise", short: "Expertise" },
  { label: "Valores & Objetivos", short: "Valores" },
  { label: "Voz & Tom", short: "Voz" },
  { label: "Revisão", short: "Revisão" },
];

function StepContent({ step }: { step: number }) {
  switch (step) {
    case 0:
      return <StepIdentity />;
    case 1:
      return <StepBackground />;
    case 2:
      return <StepPersonality />;
    case 3:
      return <StepCommunication />;
    case 4:
      return <StepExpertise />;
    case 5:
      return <StepValuesGoals />;
    case 6:
      return <StepVoice />;
    case 7:
      return <StepReview />;
    default:
      return null;
  }
}

export function Studio() {
  const step = useBuilder((s) => s.step);
  const nextStep = useBuilder((s) => s.nextStep);
  const prevStep = useBuilder((s) => s.prevStep);
  const setStep = useBuilder((s) => s.setStep);

  return (
    <section id="studio" className="bg-background/40">
      <div className="mx-auto w-[min(1160px,calc(100%-2rem))] py-12 sm:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[oklch(0.82_0.16_196)]">
              Studio
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Forje sua persona
            </h2>
            <p className="mt-2 max-w-[520px] text-sm text-muted-foreground">
              Oito etapas guiadas, com painel de qualidade e preview ao vivo.
              Comece com a IA, escolha um template ou ajuste manual.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <DiscoveryEntry />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur sm:p-6">
            {/* Stepper */}
            <ol className="flex flex-wrap items-center gap-1.5">
              {STEP_META.map((m, i) => {
                const active = i === step;
                const done = i < step;
                return (
                  <li key={m.label} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setStep(i)}
                      aria-current={active ? "step" : undefined}
                      className={
                        "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors " +
                        (active
                          ? "border-[oklch(0.82_0.16_196)]/60 bg-[oklch(0.82_0.16_196)]/12 text-[oklch(0.82_0.16_196)]"
                          : done
                            ? "border-[oklch(0.78_0.16_162)]/40 bg-[oklch(0.78_0.16_162)]/8 text-[oklch(0.78_0.16_162)]"
                            : "border-border/50 bg-background/30 text-muted-foreground hover:text-foreground")
                      }
                    >
                      <span
                        className={
                          "grid h-5 w-5 place-items-center rounded-full text-[10px] " +
                          (active
                            ? "bg-[oklch(0.82_0.16_196)] text-background"
                            : done
                              ? "bg-[oklch(0.78_0.16_162)] text-background"
                              : "bg-foreground/10")
                        }
                      >
                        {done ? "✓" : i + 1}
                      </span>
                      <span className="hidden sm:inline">{m.short}</span>
                    </button>
                    {i < STEP_META.length - 1 && (
                      <span className="mx-0.5 hidden h-px w-4 bg-border/50 sm:inline-block" />
                    )}
                  </li>
                );
              })}
            </ol>

            <div className="mt-6">
              <StepContent step={step} />
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                disabled={step === 0}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Anterior
              </Button>
              <span className="text-xs text-muted-foreground">
                Etapa {step + 1} de {BUILDER_STEPS}
              </span>
              <Button
                type="button"
                onClick={nextStep}
                disabled={step === BUILDER_STEPS - 1}
                className="bg-gradient-to-r from-[oklch(0.62_0.22_295)] to-[oklch(0.82_0.16_196)] text-white"
              >
                Próxima
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-5 lg:sticky lg:top-20 lg:self-start">
            <QualityPanel />
            <PersonaPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
