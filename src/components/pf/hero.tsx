"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageSquareText } from "lucide-react";
import { useBuilder } from "@/lib/persona/store/builder";

export function Hero() {
  const setView = useBuilder((s) => s.setView);

  return (
    <section
      id="topo"
      className="relative isolate overflow-hidden border-b border-border/40 pf-radial-bg"
    >
      <div className="pf-grid-bg pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <div className="relative mx-auto grid w-[min(1160px,calc(100%-2rem))] gap-10 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-32">
        <div className="flex flex-col justify-center">
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[oklch(0.82_0.16_196)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.82_0.16_196)] shadow-[0_0_14px_oklch(0.82_0.16_196)]" />
            Forje personas. Converse com elas.
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 max-w-[640px] text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Personagens que <span className="pf-text-gradient">pensam</span>,
            falam e decidem.
          </motion.h1>
          <p className="mt-6 max-w-[520px] text-base leading-relaxed text-muted-foreground sm:text-lg">
            O PersonaForge conduz um discovery estruturado — identidade,
            personalidade, voz e expertise — e devolve uma persona pronta para
            conversar em tempo real, com painel de qualidade e export em Markdown.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setView("studio")}
              className="group inline-flex items-center gap-2 rounded-xl border border-border/60 bg-gradient-to-r from-[oklch(0.62_0.22_295)] to-[oklch(0.82_0.16_196)] px-5 py-3 text-sm font-bold text-white shadow-[0_16px_34px_oklch(0.62_0.22_295_/_0.35)] transition-transform hover:-translate-y-0.5"
            >
              Abrir o Studio
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={() => setView("library")}
              className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/60 px-5 py-3 text-sm font-bold backdrop-blur transition-colors hover:border-[oklch(0.82_0.16_196)]/50"
            >
              Ver biblioteca
            </button>
          </div>
          <div className="mt-8 grid max-w-[520px] grid-cols-3 gap-3 text-center sm:gap-4">
            {[
              { n: "8", l: "etapas guiadas" },
              { n: "5", l: "eixos de personalidade" },
              { n: "100%", l: "exportável" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-xl border border-border/50 bg-card/50 px-3 py-3 backdrop-blur"
              >
                <div className="pf-text-gradient text-2xl font-extrabold sm:text-3xl">
                  {s.n}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden min-h-[460px] lg:block" aria-hidden>
          <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2">
            <div className="pf-orbit left-1/2 top-1/2 h-full w-full" />
            <div
              className="pf-orbit pf-orbit--slow left-1/2 top-1/2 h-[300px] w-[300px]"
              style={{ left: "50%", top: "50%" }}
            />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="absolute left-1/2 top-1/2 w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-[27px] border border-[oklch(0.82_0.16_196)]/40 bg-gradient-to-br from-[oklch(0.3_0.1_265)]/90 to-[oklch(0.13_0.02_265)]/95 p-6 shadow-[0_25px_55px_rgb(0_0_0_/_0.4)]"
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[oklch(0.82_0.16_196)]">
              STUDIO / ETAPA 4 DE 8
            </div>
            <div className="mt-3 text-2xl font-extrabold leading-tight">
              Como essa persona fala?
            </div>
            <div className="mt-4 rounded-r-lg border-l-2 border-[oklch(0.82_0.16_196)] bg-[oklch(0.62_0.22_295_/_0.18)] p-3 text-xs leading-relaxed text-foreground/80">
              Formal quando discute arquitetura. Leve quando mostra um exemplo.
              Nunca fala por falar.
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                <span>Prontidão</span>
                <span className="text-[oklch(0.82_0.16_196)]">84%</span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-foreground/10">
                <div className="h-full w-[84%] bg-gradient-to-r from-[oklch(0.82_0.16_196)] to-[oklch(0.62_0.22_295)] shadow-[0_0_12px_oklch(0.82_0.16_196)]" />
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="absolute right-2 top-10 rounded-xl border border-border/50 bg-card/70 px-3 py-2 text-xs backdrop-blur"
          >
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <MessageSquareText className="h-3 w-3 text-[oklch(0.82_0.16_196)]" />
              contexto consolidado
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="absolute bottom-12 left-2 rounded-xl border border-border/50 bg-card/70 px-3 py-2 text-xs backdrop-blur"
          >
            <span className="text-muted-foreground">decisões </span>
            <span className="font-semibold text-foreground">registradas</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
