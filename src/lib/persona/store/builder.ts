"use client";

import { create } from "zustand";
import {
  EMPTY_DRAFT,
  PersonaDraft,
  QualityEvaluation,
} from "@/lib/persona/types";
import { evaluateQuality } from "@/lib/persona/quality";

export type AppView = "studio" | "library" | "chat";

export interface BuilderState {
  view: AppView;
  draft: PersonaDraft;
  step: number;
  isDiscovering: boolean;
  isSaving: boolean;
  lastSavedId: string | null;
  chatPersonaId: string | null;
  setView: (v: AppView) => void;
  setDraft: (patch: Partial<PersonaDraft>) => void;
  setPersonality: (patch: Partial<PersonaDraft["personality"]>) => void;
  setCommunication: (patch: Partial<PersonaDraft["communication"]>) => void;
  setListField: (field: "expertise" | "values" | "goals" | "tags", items: string[]) => void;
  resetDraft: (draft?: PersonaDraft) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setDiscovering: (v: boolean) => void;
  setSaving: (v: boolean) => void;
  setLastSavedId: (id: string | null) => void;
  openChat: (personaId: string) => void;
  evaluate: () => QualityEvaluation;
}

export const BUILDER_STEPS = 8;

export const useBuilder = create<BuilderState>((set, get) => ({
  view: "studio",
  draft: { ...EMPTY_DRAFT },
  step: 0,
  isDiscovering: false,
  isSaving: false,
  lastSavedId: null,
  chatPersonaId: null,

  setView: (v) => set({ view: v }),
  setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
  setPersonality: (patch) =>
    set((s) => ({
      draft: { ...s.draft, personality: { ...s.draft.personality, ...patch } },
    })),
  setCommunication: (patch) =>
    set((s) => ({
      draft: { ...s.draft, communication: { ...s.draft.communication, ...patch } },
    })),
  setListField: (field, items) =>
    set((s) => ({ draft: { ...s.draft, [field]: items } })),
  resetDraft: (draft) => set({ draft: draft ?? { ...EMPTY_DRAFT }, step: 0, lastSavedId: null }),
  setStep: (step) => set({ step: Math.max(0, Math.min(BUILDER_STEPS - 1, step)) }),
  nextStep: () => set((s) => ({ step: Math.min(BUILDER_STEPS - 1, s.step + 1) })),
  prevStep: () => set((s) => ({ step: Math.max(0, s.step - 1) })),
  setDiscovering: (v) => set({ isDiscovering: v }),
  setSaving: (v) => set({ isSaving: v }),
  setLastSavedId: (id) => set({ lastSavedId: id }),
  openChat: (personaId) => set({ chatPersonaId: personaId, view: "chat" }),
  evaluate: () => evaluateQuality(get().draft),
}));
