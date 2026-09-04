"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Send,
  Loader2,
  Trash2,
  FileDown,
  MessagesSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBuilder } from "@/lib/persona/store/builder";
import { accent } from "@/components/pf/accent";
import {
  useClearMessages,
  useMessages,
  usePersonas,
  useSendMessage,
  type ChatMessage,
} from "@/hooks/use-personas";
import { toast } from "sonner";

function MessageBubble({
  message,
  accentText,
  accentBg,
  emoji,
}: {
  message: ChatMessage;
  accentText: string;
  accentBg: string;
  emoji: string;
}) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-sm ${
          isUser ? "border-border/50 bg-background/40" : `${accentBg} ${accentText}`
        }`}
        aria-hidden
      >
        {isUser ? "🧑" : emoji}
      </span>
      <div
        className={`max-w-[78%] rounded-2xl border px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "border-border/50 bg-card/70"
            : `border-border/50 bg-background/40`
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
      </div>
    </div>
  );
}

export function Chat() {
  const personasQuery = usePersonas();
  const chatPersonaId = useBuilder((s) => s.chatPersonaId);
  const openChat = useBuilder((s) => s.openChat);
  const setView = useBuilder((s) => s.setView);

  const [selectedId, setSelectedId] = useState<string | null>(chatPersonaId);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const persona = useMemo(
    () => personasQuery.data?.find((p) => p.id === selectedId) ?? null,
    [personasQuery.data, selectedId],
  );

  const messages = useMessages(persona?.id ?? null);
  const sendMessage = useSendMessage(persona?.id ?? null);
  const clearMessages = useClearMessages(persona?.id ?? null);

  const accentCls = accent(persona?.draft.colorTheme ?? "cyan");

  useEffect(() => {
    if (chatPersonaId && !selectedId) setSelectedId(chatPersonaId);
  }, [chatPersonaId, selectedId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.data?.messages.length]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || !persona || sendMessage.isPending) return;
    setInput("");
    sendMessage.mutate(text, {
      onError: (err: Error) => toast.error(err.message),
    });
  };

  const handleClear = () => {
    clearMessages.mutate(undefined, {
      onSuccess: () => toast.success("Conversa limpa."),
      onError: (err: Error) => toast.error(err.message),
    });
  };

  const handleExport = async () => {
    if (!persona) return;
    try {
      const res = await fetch(`/api/personas/${persona.id}/export?format=markdown`);
      if (!res.ok) throw new Error("Falha ao exportar.");
      const md = await res.text();
      const blob = new Blob([md], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `personaforge-${persona.draft.name
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/g, "-")}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Persona exportada.");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <section id="conversa" className="bg-background/40">
      <div className="mx-auto w-[min(1160px,calc(100%-2rem))] py-12 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[oklch(0.82_0.16_196)]">
              Conversa
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Converse com sua persona
            </h2>
            <p className="mt-2 max-w-[520px] text-sm text-muted-foreground">
              As mensagens usam o system prompt gerado. O histórico fica salvo por persona.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur">
          {/* Persona selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 p-4">
            <div className="flex items-center gap-3">
              <span
                className={`grid h-10 w-10 place-items-center rounded-xl border text-xl ${accentCls.border} ${accentCls.bg}`}
                aria-hidden
              >
                {persona?.draft.emoji ?? "🧩"}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-bold">
                  {persona?.draft.name ?? "Nenhuma persona selecionada"}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {persona?.draft.role ?? "Escolha uma persona abaixo para começar."}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={selectedId ?? undefined}
                onValueChange={(v) => {
                  setSelectedId(v);
                  openChat(v);
                }}
              >
                <SelectTrigger className="w-[220px]" aria-label="Selecionar persona">
                  <SelectValue placeholder="Selecionar persona" />
                </SelectTrigger>
                <SelectContent>
                  {personasQuery.data?.length ? (
                    personasQuery.data.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.draft.emoji} {p.draft.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs text-muted-foreground">
                      Crie uma persona no Studio primeiro.
                    </div>
                  )}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                disabled={!persona || clearMessages.isPending}
                aria-label="Limpar conversa"
                title="Limpar conversa"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleExport}
                disabled={!persona}
                aria-label="Exportar persona"
                title="Exportar Markdown"
              >
                <FileDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="pf-scroll max-h-[480px] min-h-[320px] overflow-y-auto p-4 sm:p-6">
            {!persona ? (
              <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 text-center">
                <MessagesSquare className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-semibold">Selecione uma persona para conversar.</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setView("library")}
                >
                  Ver biblioteca
                </Button>
              </div>
            ) : messages.isLoading ? (
              <div className="flex h-full min-h-[280px] items-center justify-center text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Carregando conversa…
              </div>
            ) : (messages.data?.messages.length ?? 0) === 0 ? (
              <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 text-center">
                <p className="max-w-md text-sm text-muted-foreground">
                  {messages.data?.greeting || "Pergunte algo para começar a conversa."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.data?.messages.map((m) => (
                  <MessageBubble
                    key={m.id}
                    message={m}
                    accentText={accentCls.text}
                    accentBg={accentCls.bg}
                    emoji={persona.draft.emoji}
                  />
                ))}
                {sendMessage.isPending && (
                  <div className="flex gap-3">
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-sm ${accentCls.bg} ${accentCls.text}`}
                      aria-hidden
                    >
                      {persona.draft.emoji}
                    </span>
                    <div className="rounded-2xl border border-border/50 bg-background/40 px-4 py-2.5 text-sm text-muted-foreground">
                      <span className="inline-flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.2s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.1s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-border/40 p-4">
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={2}
                placeholder={
                  persona
                    ? `Escreva para ${persona.draft.name.split(" ")[0]}…`
                    : "Selecione uma persona para enviar uma mensagem."
                }
                disabled={!persona}
                className="resize-none"
                aria-label="Mensagem"
              />
              <Button
                type="button"
                onClick={handleSend}
                disabled={!persona || !input.trim() || sendMessage.isPending}
                className="bg-gradient-to-r from-[oklch(0.62_0.22_295)] to-[oklch(0.82_0.16_196)] text-white"
              >
                {sendMessage.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="ml-1.5 hidden sm:inline">Enviar</span>
              </Button>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Enter envia. Shift+Enter pula linha. As mensagens ficam salvas por persona.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
