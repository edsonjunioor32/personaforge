"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Github, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBuilder, type AppView } from "@/lib/persona/store/builder";

const NAV_ITEMS: { id: AppView; label: string }[] = [
  { id: "studio", label: "Studio" },
  { id: "library", label: "Biblioteca" },
  { id: "chat", label: "Conversa" },
];

export function Header() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const view = useBuilder((s) => s.view);
  const setView = useBuilder((s) => s.setView);

  useEffect(() => {
    // Mount flag avoids hydration mismatch with next-themes; setState here is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-3 z-40 mx-auto flex w-[min(1160px,calc(100%-1.5rem))] items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/70 px-3 py-2 backdrop-blur-xl sm:px-4">
      <a
        href="#topo"
        className="flex items-center gap-2 text-sm font-extrabold tracking-tight"
        aria-label="PersonaForge — início"
      >
        <span className="grid h-7 w-7 place-items-center rounded-lg border border-[oklch(0.82_0.16_196)]/50 bg-gradient-to-br from-[oklch(0.62_0.22_295)]/40 to-[oklch(0.82_0.16_196)]/40 text-xs">
          ⚙
        </span>
        <span>
          Persona<span className="text-[oklch(0.82_0.16_196)]">Forge</span>
        </span>
      </a>

      <nav className="hidden items-center gap-1 sm:flex" aria-label="Seções do studio">
        {NAV_ITEMS.map((item) => {
          const active = view === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              aria-current={active ? "page" : undefined}
              className={
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors " +
                (active
                  ? "bg-[oklch(0.82_0.16_196)]/15 text-[oklch(0.82_0.16_196)]"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <span className="hidden items-center gap-1 rounded-lg border border-border/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-[oklch(0.82_0.16_196)] sm:inline-flex">
          <Sparkles className="h-3 w-3" /> discovery v1
        </span>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Alternar tema"
          onClick={() => setTheme((resolvedTheme === "dark" ? "light" : "dark"))}
        >
          {mounted && resolvedTheme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
        <a
          href="https://github.com/edsonjunioor32/personaforge"
          target="_blank"
          rel="noreferrer"
          aria-label="Repositório no GitHub"
        >
          <Button variant="ghost" size="icon">
            <Github className="h-4 w-4" />
          </Button>
        </a>
      </div>
    </header>
  );
}
