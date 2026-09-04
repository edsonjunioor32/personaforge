"use client";

import { useMemo } from "react";
import { Save, FileDown, MessageSquareText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBuilder } from "@/lib/persona/store/builder";
import { useCreatePersona, useGeneratePrompt } from "@/hooks/use-personas";
import { buildGreeting, buildSystemPrompt } from "@/lib/persona/prompt-builder";
import { evaluateQuality } from "@/lib/persona/quality";
import { accent } from "@/components/pf/accent";
import { toast } from "sonner";

export function StepReview() {
  const draft = useBuilder((s) => s.draft);
  const resetDraft = useBuilder((s) => s.resetDraft);
  const openChat = useBuilder((s) => s.openChat);
  const setLastSavedId = useBuilder((s) => s.setLastSavedId);
  const lastSavedId = useBuilder((s) => s.lastSavedId);

  const createPersona = useCreatePersona();
  const generatePrompt = useGeneratePrompt();
  const accentCls = accent(draft.colorTheme);
  const evaluation = useMemo(() => evaluateQuality(draft), [draft]);

  const systemPrompt = useMemo(() => buildSystemPrompt(draft), [draft]);
  const greeting = useMemo(() => buildGreeting(draft), [draft]);

  const handleSave = () => {
    if (!draft.name.trim() || !draft.role.trim()) {
      toast.error("Dê nome e papel à persona antes de salvar.");
      return;
    }
    createPersona.mutate(draft, {
      onSuccess: (data) => {
        setLastSavedId(data.id);
        toast.success("Persona salva na biblioteca.");
      },
      onError: (err: Error) => toast.error(err.message || "Falha ao salvar."),
    });
  };

  const handleGenerate = () => {
    generatePrompt.mutate(draft, {
      onSuccess: () => toast.success("System prompt refinado pela IA."),
      onError: () => toast.error("IA indisponível — mantivemos o prompt determinístico."),
    });
  };

  const handleExport = () => {
    if (!draft.name.trim()) {
      toast.error("Defina um nome antes de exportar.");
      return;
    }
    // Build a markdown export locally from current draft (no need to be saved).
    const md = `# ${draft.emoji} ${draft.name}\n\n**${draft.role}** · *PersonaForge*\n\n> Exportado com prontidão **${evaluation.readiness}%**.\n\n## System Prompt\n\n\`\`\`\n${systemPrompt}\n\`\`\`\n\n## Saudação\n\n> ${greeting}\n`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `personaforge-${draft.name
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Markdown exportado.");
  };

  const handleChat = () => {
    if (!lastSavedId) {
      toast.error("Salve a persona antes de conversar.");
      return;
    }
    openChat(lastSavedId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold tracking-tight">Revisão & ações</h3>
        <p className="text-sm text-muted-foreground">
          Confira o system prompt, refine com a IA, salve e converse com a persona.
        </p>
      </div>

      <div className={`rounded-xl border p-4 ${accentCls.border} ${accentCls.bg}`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{draft.emoji || "🧩"}</span>
          <div className="min-w-0">
            <div className="truncate text-base font-bold">
              {draft.name || "Persona sem nome"}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {draft.role || "defina um papel"}
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className={`text-2xl font-extrabold ${accentCls.text}`}>
              {evaluation.readiness}%
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              prontidão
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/50 bg-background/40 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            System prompt gerado
          </span>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleGenerate}
            disabled={generatePrompt.isPending}
          >
            {generatePrompt.isPending ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles />
            )}
            Refinar com IA
          </Button>
        </div>
        <pre className="pf-scroll mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border border-border/40 bg-background/60 p-3 text-[11px] leading-relaxed text-foreground/80">
          {systemPrompt}
        </pre>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={handleSave}
          disabled={createPersona.isPending}
          className="bg-gradient-to-r from-[oklch(0.62_0.22_295)] to-[oklch(0.82_0.16_196)] text-white"
        >
          {createPersona.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Salvar persona
        </Button>
        <Button type="button" variant="secondary" onClick={handleExport}>
          <FileDown className="mr-2 h-4 w-4" />
          Exportar Markdown
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleChat}
          disabled={!lastSavedId}
        >
          <MessageSquareText className="mr-2 h-4 w-4" />
          Conversar agora
        </Button>
        <Button type="button" variant="ghost" onClick={() => resetDraft()}>
          Limpar rascunho
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        {lastSavedId
          ? "Persona salva — você pode conversar ou encontrá-la na Biblioteca."
          : "A persona vira um system prompt e uma saudação assim que você salva."}
      </p>
    </div>
  );
}

function Sparkles() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3z" />
    </svg>
  );
}
