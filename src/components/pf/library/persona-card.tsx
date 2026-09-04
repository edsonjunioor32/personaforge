"use client";

import { MoreVertical, MessageSquareText, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { accent } from "@/components/pf/accent";
import { useBuilder } from "@/lib/persona/store/builder";
import { useDeletePersona, type PersonaSummary } from "@/hooks/use-personas";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PersonaCardProps {
  persona: PersonaSummary;
  onEdit?: (persona: PersonaSummary) => void;
}

export function PersonaCard({ persona, onEdit }: PersonaCardProps) {
  const accentCls = accent(persona.draft.colorTheme);
  const openChat = useBuilder((s) => s.openChat);
  const deletePersona = useDeletePersona();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    setOpen(false);
    deletePersona.mutate(persona.id, {
      onSuccess: () => toast.success("Persona removida."),
      onError: (err: Error) => toast.error(err.message),
    });
  };

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-card/60 backdrop-blur transition-transform hover:-translate-y-1 ${accentCls.border}`}
    >
      <div
        className={`h-1 w-full bg-gradient-to-r ${accentCls.gradient}`}
        aria-hidden
      />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start gap-3">
          <span
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border text-2xl ${accentCls.border} ${accentCls.bg}`}
            aria-hidden
          >
            {persona.draft.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold tracking-tight">
              {persona.draft.name}
            </h3>
            <p className="truncate text-xs text-muted-foreground">
              {persona.draft.role}
            </p>
          </div>
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Ações da persona">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setOpen(false);
                  openChat(persona.id);
                }}
              >
                <MessageSquareText className="mr-2 h-4 w-4" />
                Conversar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setOpen(false);
                  onEdit?.(persona);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Editar no Studio
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remover
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {persona.draft.background ? (
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {persona.draft.background}
          </p>
        ) : (
          <p className="text-sm italic text-muted-foreground/70">
            Sem background descrito.
          </p>
        )}

        {persona.draft.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {persona.draft.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${accentCls.border} ${accentCls.text}`}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border/40 pt-3">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-foreground/10">
              <div
                className={`h-full bg-gradient-to-r ${accentCls.gradient}`}
                style={{ width: `${persona.quality}%` }}
              />
            </div>
            <span className="text-[11px] font-semibold text-muted-foreground">
              {persona.quality}%
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            {formatDistanceToNow(new Date(persona.updatedAt), {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-1 w-full"
          onClick={() => openChat(persona.id)}
        >
          <MessageSquareText className="mr-2 h-4 w-4" />
          Conversar com {persona.draft.name.split(" ")[0]}
        </Button>
      </div>
    </article>
  );
}
