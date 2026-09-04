"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export interface PersonaSummary {
  id: string;
  draft: import("@/lib/persona/types").PersonaDraft;
  systemPrompt: string;
  greeting: string;
  quality: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  personaId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

async function jFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    let message = `Erro ${res.status}`;
    try {
      const data = await res.json();
      message = data.error ?? message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export function usePersonas() {
  return useQuery({
    queryKey: ["personas"],
    queryFn: () =>
      jFetchPersonas().then((d) => d.personas as PersonaSummary[]),
  });
}

function jFetchPersonas() {
  return jFetch<{ personas: PersonaSummary[] }>("/api/personas");
}

export function useCreatePersona() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (draft: import("@/lib/persona/types").PersonaDraft) =>
      jFetch<{ id: string }>("/api/personas", {
        method: "POST",
        body: JSON.stringify(draft),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["personas"] });
    },
  });
}

export function useUpdatePersona() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: Partial<import("@/lib/persona/types").PersonaDraft>;
    }) =>
      jFetch<{ id: string }>(`/api/personas/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["personas"] });
      qc.invalidateQueries({ queryKey: ["persona"] });
    },
  });
}

export function useDeletePersona() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      jFetch<{ ok: boolean }>(`/api/personas/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["personas"] });
    },
  });
}

export function useTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: () =>
      jFetch<{ templates: import("@/lib/persona/types").PersonaTemplate[] }>(
        "/api/templates",
      ).then((d) => d.templates),
    staleTime: Infinity,
  });
}

export function useDiscover() {
  return useMutation({
    mutationFn: ({ brief }: { brief: string }) =>
      jFetch<{ draft: import("@/lib/persona/types").PersonaDraft }>(
        "/api/ai/discover",
        { method: "POST", body: JSON.stringify({ brief }) },
      ).then((d) => d.draft),
  });
}

export function useGeneratePrompt() {
  return useMutation({
    mutationFn: (draft: import("@/lib/persona/types").PersonaDraft) =>
      jFetch<{ systemPrompt: string; greeting: string }>(
        "/api/ai/generate-prompt",
        { method: "POST", body: JSON.stringify({ draft }) },
      ),
  });
}

export function useMessages(personaId: string | null) {
  return useQuery({
    queryKey: ["messages", personaId],
    queryFn: async () => {
      if (!personaId) return { messages: [] as ChatMessage[], greeting: "" };
      const data = await jFetch<{ messages: ChatMessage[]; greeting: string }>(
        `/api/personas/${personaId}/messages`,
      );
      return data;
    },
    enabled: !!personaId,
  });
}

export function useSendMessage(personaId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (message: string) => {
      if (!personaId) throw new Error("Persona ausente.");
      const data = await jFetch<{ message: ChatMessage }>(
        `/api/personas/${personaId}/chat`,
        { method: "POST", body: JSON.stringify({ message }) },
      );
      return data.message;
    },
    onMutate: async (message) => {
      if (!personaId) return;
      await qc.cancelQueries({ queryKey: ["messages", personaId] });
      const previous = qc.getQueryData<{ messages: ChatMessage[]; greeting: string }>([
        "messages",
        personaId,
      ]);
      const optimistic: ChatMessage = {
        id: `temp-${Date.now()}`,
        personaId,
        role: "user",
        content: message,
        createdAt: new Date().toISOString(),
      };
      qc.setQueryData<{ messages: ChatMessage[]; greeting: string }>(
        ["messages", personaId],
        (old) => ({
          messages: [...(old?.messages ?? []), optimistic],
          greeting: old?.greeting ?? "",
        }),
      );
      return { previous };
    },
    onError: (_err, _msg, ctx) => {
      if (personaId && ctx?.previous) {
        qc.setQueryData(["messages", personaId], ctx.previous);
      }
    },
    onSuccess: (assistant) => {
      if (!personaId) return;
      qc.setQueryData<{ messages: ChatMessage[]; greeting: string }>(
        ["messages", personaId],
        (old) => ({
          messages: [
            ...(old?.messages ?? []).filter((m) => !m.id.startsWith("temp-")),
            assistant,
          ],
          greeting: old?.greeting ?? "",
        }),
      );
    },
  });
}

export function useClearMessages(personaId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!personaId) return;
      await jFetch<{ ok: boolean }>(`/api/personas/${personaId}/messages`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      if (personaId) qc.invalidateQueries({ queryKey: ["messages", personaId] });
    },
  });
}
