"use client";

const STEPS = [
  {
    n: "01",
    title: "Descreva em uma frase",
    body:
      "Conte quem a persona é. O Discovery do PersonaForge converte a frase em identidade, papel e background coerentes.",
  },
  {
    n: "02",
    title: "Afine personalidade e voz",
    body:
      "Mova os eixos Big Five e os eixos de comunicação. O preview ao vivo mostra como a persona se posiciona.",
  },
  {
    n: "03",
    title: "Salve e converse",
    body:
      "A persona vira um system prompt e abre a conversa. O painel de qualidade acompanha cada ajuste até a prontidão ideal.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="border-b border-border/40 bg-background/40"
    >
      <div className="mx-auto w-[min(1160px,calc(100%-2rem))] py-16 sm:py-24">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[oklch(0.82_0.16_196)]">
          Como funciona
        </p>
        <h2 className="mt-3 max-w-[640px] text-3xl font-extrabold tracking-tight sm:text-4xl">
          Da frase nebulosa à persona que conversa — em três passos.
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <article
              key={s.n}
              className="group rounded-2xl border border-border/50 bg-card/50 p-6 transition-colors hover:border-[oklch(0.82_0.16_196)]/40"
            >
              <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-[oklch(0.82_0.16_196)]">
                Passo {s.n}
              </div>
              <h3 className="mt-4 text-xl font-bold tracking-tight">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
