"use client";

const CAPABILITIES = [
  "DISCOVERY ESTRUTURADO",
  "PERSONALIDADE BIG FIVE",
  "VOZ & TOM CALIBRADOS",
  "PAINEL DE QUALIDADE",
  "CHAT EM TEMPO REAL",
  "EXPORT MARKDOWN",
];

export function Marquee() {
  return (
    <div
      className="pf-marquee-pause overflow-hidden border-y border-border/40 bg-card/40 py-3 backdrop-blur"
      aria-hidden
    >
      <div className="pf-marquee">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center gap-8 pr-8">
            {CAPABILITIES.map((c) => (
              <span
                key={`${dup}-${c}`}
                className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground"
              >
                {c}
                <i className="text-[oklch(0.82_0.16_196)] not-italic">✦</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
