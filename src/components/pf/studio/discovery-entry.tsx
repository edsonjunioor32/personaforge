"use client";

import { useState } from "react";
import { Sparkles, Wand2, Loader2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useDiscover,
  useTemplates,
} from "@/hooks/use-personas";
import { useBuilder } from "@/lib/persona/store/builder";
import { accent } from "@/components/pf/accent";
import { toast } from "sonner";

export function DiscoveryEntry() {
  const [brief, setBrief] = useState("");
  const [open, setOpen] = useState(false);
  const resetDraft = useBuilder((s) => s.resetDraft);
  const discover = useDiscover();
  const templatesQuery = useTemplates();

  const runDiscovery = async () => {
    if (brief.trim().length < 6) {
      toast.error("Descreva a persona em pelo menos uma frase curta.");
      return;
    }
    discover.mutate(
      { brief },
      {
        onSuccess: (draft) => {
          resetDraft(draft);
          toast.success("Discovery preencheu o rascunho. Ajuste os sliders à vontade.");
        },
        onError: (err: Error) => {
          toast.error(err.message || "Falha no discovery assistido.");
        },
      },
    );
  };

  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[oklch(0.82_0.16_196)]/50 bg-[oklch(0.82_0.16_196)]/10 text-[oklch(0.82_0.16_196)]">
          <Sparkles className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold tracking-tight">
            Discovery assistido por IA
          </h3>
          <p className="text-sm text-muted-foreground">
            Descreva a persona em uma frase. A IA preenche identidade, personalidade e listas.
          </p>
        </div>
      </div>

      <Textarea
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
        rows={3}
        placeholder="Ex: uma mentora de produto que já liderou três startups e prioriza descoberta antes de roadmap."
        className="mt-4"
        maxLength={600}
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={runDiscovery}
          disabled={discover.isPending}
          className="bg-gradient-to-r from-[oklch(0.62_0.22_295)] to-[oklch(0.82_0.16_196)] text-white"
        >
          {discover.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Descobrindo…
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Descobrir persona
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={() => setOpen((v) => !v)}
          className="text-muted-foreground"
        >
          Começar de um template
          <ChevronDown
            className={`ml-1 h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {templatesQuery.isLoading && (
                <p className="text-sm text-muted-foreground">Carregando templates…</p>
              )}
              {templatesQuery.data?.map((t) => {
                const a = accent(t.colorTheme);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      resetDraft(t.draft);
                      setOpen(false);
                      toast.success(`Template "${t.label}" carregado.`);
                    }}
                    className={`group flex items-start gap-3 rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 ${a.border} bg-background/40 hover:${a.bg}`}
                  >
                    <span className="text-2xl">{t.emoji}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold">{t.label}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {t.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
