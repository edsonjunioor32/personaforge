"use client";

export function Footer() {
  return (
    <footer
      id="rodape"
      className="mt-auto border-t border-border/40 bg-card/30 backdrop-blur"
    >
      <div className="mx-auto flex w-[min(1160px,calc(100%-2rem))] flex-col items-start justify-between gap-4 py-8 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-sm">
          <span className="grid h-6 w-6 place-items-center rounded-md border border-[oklch(0.82_0.16_196)]/50 bg-gradient-to-br from-[oklch(0.62_0.22_295)]/40 to-[oklch(0.82_0.16_196)]/40 text-[10px]">
            ⚙
          </span>
          <span className="font-bold">PersonaForge</span>
          <span className="text-muted-foreground">— forje personas de IA que conversam.</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <a href="#topo" className="hover:text-foreground">
            Topo
          </a>
          <a href="#como-funciona" className="hover:text-foreground">
            Como funciona
          </a>
          <a
            href="https://github.com/edsonjunioor32/personaforge"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            Repositório
          </a>
          <span>
            Inspirado em <span className="text-foreground">Ring</span> e{" "}
            <span className="text-foreground">BoostPrompt</span>.
          </span>
        </div>
      </div>
    </footer>
  );
}
