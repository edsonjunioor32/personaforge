"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ListEditorProps {
  label: string;
  placeholder?: string;
  items: string[];
  onChange: (items: string[]) => void;
  max?: number;
  hint?: string;
}

export function ListEditor({
  label,
  placeholder = "Adicionar item",
  items,
  onChange,
  max = 8,
  hint,
}: ListEditorProps) {
  const [value, setValue] = useState("");

  const add = () => {
    const v = value.trim();
    if (!v) return;
    if (items.includes(v)) return;
    if (items.length >= max) return;
    onChange([...items, v]);
    setValue("");
  };

  const remove = (item: string) => onChange(items.filter((i) => i !== item));

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold">{label}</label>
        <span className="text-[11px] text-muted-foreground">
          {items.length}/{max}
        </span>
      </div>
      {hint && <p className="mb-2 text-xs text-muted-foreground">{hint}</p>}
      <div className="mt-2 flex gap-2">
        <Input
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={add}
          disabled={!value.trim() || items.length >= max}
          aria-label={`Adicionar ${label}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {items.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-background/40 px-3 py-2 text-sm"
            >
              <span className="min-w-0 truncate">{item}</span>
              <button
                type="button"
                onClick={() => remove(item)}
                className="text-muted-foreground transition-colors hover:text-destructive"
                aria-label={`Remover ${item}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
