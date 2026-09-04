"use client";

import { useMemo, useState } from "react";
import { Search, Loader2, Inbox } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useBuilder } from "@/lib/persona/store/builder";
import { usePersonas, type PersonaSummary } from "@/hooks/use-personas";
import { PersonaCard } from "./persona-card";
import { toast } from "sonner";

export function Library() {
  const personasQuery = usePersonas();
  const setView = useBuilder((s) => s.setView);
  const resetDraft = useBuilder((s) => s.resetDraft);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!personasQuery.data) return [];
    const q = query.trim().toLowerCase();
    if (!q) return personasQuery.data;
    return personasQuery.data.filter((p) => {
      const hay = [
        p.draft.name,
        p.draft.role,
        p.draft.background ?? "",
        ...p.draft.tags,
        ...p.draft.expertise,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [personasQuery.data, query]);

  const handleEdit = (persona: PersonaSummary) => {
    resetDraft(persona.draft);
    setView("studio");
    toast.success("Persona carregada no Studio para edição.");
  };

  return (
    <section id="biblioteca" className="bg-background/40">
      <div className="mx-auto w-[min(1160px,calc(100%-2rem))] py-12 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[oklch(0.82_0.16_196)]">
              Biblioteca
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Suas personas
            </h2>
            <p className="mt-2 max-w-[520px] text-sm text-muted-foreground">
              Toda persona salva aparece aqui. Clique para conversar, editar ou exportar.
            </p>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome, papel, tag…"
              className="pl-9"
              aria-label="Buscar personas"
            />
          </div>
        </div>

        <div className="mt-8">
          {personasQuery.isLoading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Carregando personas…
            </div>
          ) : personasQuery.isError ? (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-center text-sm text-destructive">
              {personasQuery.error?.message ?? "Falha ao carregar personas."}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/60 bg-card/40 py-16 text-center">
              <Inbox className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-semibold">Nenhuma persona por aqui ainda.</p>
              <p className="max-w-xs text-xs text-muted-foreground">
                Crie sua primeira persona no Studio. Em 2 minutos ela já conversa.
              </p>
              <Button
                type="button"
                onClick={() => setView("studio")}
                className="mt-2 bg-gradient-to-r from-[oklch(0.62_0.22_295)] to-[oklch(0.82_0.16_196)] text-white"
              >
                Abrir o Studio
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <PersonaCard key={p.id} persona={p} onEdit={handleEdit} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
