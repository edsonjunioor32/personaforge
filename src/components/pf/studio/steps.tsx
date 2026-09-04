"use client";

import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useBuilder } from "@/lib/persona/store/builder";
import { COLOR_THEMES, accent } from "@/components/pf/accent";
import { ListEditor } from "./list-editor";

const EMOJI_CHOICES = [
  "🧩","🧭","🛠️","✍️","🌱","🧠","🦊","🦉","🐉","🤖","🎭","🎨","📚","🔬","⚡","🌙","🔥","🌊","🎯","🪄","🧷","🪶","🧿",
];

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold">{label}</Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}

function TraitSlider({
  label,
  leftLabel,
  rightLabel,
  value,
  onChange,
}: {
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-background/40 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-sm font-bold text-[oklch(0.82_0.16_196)]">{value}</span>
      </div>
      <div className="mt-3">
        <Slider
          value={[value]}
          min={0}
          max={100}
          step={1}
          onValueChange={(v) => onChange(v[0])}
          aria-label={label}
        />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}

export function StepIdentity() {
  const draft = useBuilder((s) => s.draft);
  const setDraft = useBuilder((s) => s.setDraft);
  const accentCls = accent(draft.colorTheme);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold tracking-tight">Identidade</h3>
        <p className="text-sm text-muted-foreground">
          Quem é essa persona? Dê nome, papel e um emoji que a represente.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nome" hint="Como a persona se apresenta">
          <Input
            value={draft.name}
            placeholder="Ex: Helena Marçal"
            onChange={(e) => setDraft({ name: e.target.value })}
            maxLength={80}
          />
        </Field>
        <Field label="Papel / profissão" hint="O que ela faz no mundo">
          <Input
            value={draft.role}
            placeholder="Ex: Mentora de Produto Sênior"
            onChange={(e) => setDraft({ role: e.target.value })}
            maxLength={120}
          />
        </Field>
        <Field label="Faixa etária" hint="Opcional — ajuda o tom">
          <Input
            value={draft.ageRange ?? ""}
            placeholder="Ex: 40-50"
            onChange={(e) => setDraft({ ageRange: e.target.value })}
            maxLength={24}
          />
        </Field>
        <Field label="Tema de cor" hint="Acento visual da persona">
          <div className="flex flex-wrap gap-2">
            {COLOR_THEMES.map((t) => {
              const a = accent(t);
              const active = draft.colorTheme === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setDraft({ colorTheme: t })}
                  className={`h-9 w-9 rounded-lg border-2 transition-transform ${
                    active
                      ? `scale-110 ${a.border} ${a.bg}`
                      : "border-border/50 hover:scale-105"
                  }`}
                  style={{ boxShadow: active ? `0 0 12px ${a.hex}` : undefined }}
                  aria-label={`Tema ${t}`}
                >
                  <span className={`block h-2 w-2 mx-auto rounded-full ${a.dot}`} />
                </button>
              );
            })}
          </div>
        </Field>
      </div>

      <Field label="Emoji" hint="Um único emoji que resume a persona">
        <div className="flex flex-wrap gap-1.5">
          {EMOJI_CHOICES.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setDraft({ emoji: e })}
              className={`grid h-10 w-10 place-items-center rounded-lg border text-xl transition-all ${
                draft.emoji === e
                  ? `${accentCls.border} ${accentCls.bg} scale-110`
                  : "border-border/50 hover:border-border"
              }`}
              aria-label={`Emoji ${e}`}
            >
              {e}
            </button>
          ))}
        </div>
      </Field>

      <ListEditor
        label="Tags"
        placeholder="Ex: mentoria, produto"
        items={draft.tags}
        onChange={(items) => useBuilder.getState().setListField("tags", items)}
        max={6}
        hint="Rótulos curtos para organizar a biblioteca"
      />
    </div>
  );
}

export function StepBackground() {
  const draft = useBuilder((s) => s.draft);
  const setDraft = useBuilder((s) => s.setDraft);
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold tracking-tight">Background</h3>
        <p className="text-sm text-muted-foreground">
          De onde essa persona veio? Um parágrafo basta para ancorar a voz.
        </p>
      </div>
      <Field label="História" hint="2-4 frases com experiências e contexto">
        <Textarea
          value={draft.background ?? ""}
          placeholder="Ex: Liderou produto em três startups de marketplace e hoje mentora fundadores. Acostumada a traduzir dor de cliente em roadmap com baixo orçamento."
          onChange={(e) => setDraft({ background: e.target.value })}
          rows={7}
          maxLength={800}
        />
      </Field>
    </div>
  );
}

export function StepPersonality() {
  const personality = useBuilder((s) => s.draft.personality);
  const setPersonality = useBuilder((s) => s.setPersonality);
  const traits: {
    key: keyof typeof personality;
    label: string;
    left: string;
    right: string;
  }[] = [
    { key: "openness", label: "Abertura a novas ideias", left: "Pragmático", right: "Curioso" },
    { key: "conscientiousness", label: "Consciência", left: "Improvisador", right: "Metódico" },
    { key: "extraversion", label: "Extroversão", left: "Reservado", right: "Expansivo" },
    { key: "agreeableness", label: "Amabilidade", left: "Franco", right: "Acolhedor" },
    { key: "neuroticism", label: "Estabilidade emocional", left: "Calmo", right: "Sensível" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold tracking-tight">Personalidade (Big Five)</h3>
        <p className="text-sm text-muted-foreground">
          Cada eixo descreve um traço psicológico. Mova os sliders para esculpir a persona.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {traits.map((t) => (
          <TraitSlider
            key={t.key}
            label={t.label}
            leftLabel={t.left}
            rightLabel={t.right}
            value={personality[t.key]}
            onChange={(v) => setPersonality({ [t.key]: v })}
          />
        ))}
      </div>
    </div>
  );
}

export function StepCommunication() {
  const comm = useBuilder((s) => s.draft.communication);
  const setComm = useBuilder((s) => s.setCommunication);
  const axes: { key: keyof typeof comm; label: string; left: string; right: string }[] = [
    { key: "formality", label: "Formalidade", left: "Descontraída", right: "Formal" },
    { key: "directness", label: "Direção", left: "Diplomática", right: "Direta" },
    { key: "warmth", label: "Acolhimento", left: "Reservada", right: "Calorosa" },
    { key: "humor", label: "Humor", left: "Séria", right: "Leve" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold tracking-tight">Estilo de comunicação</h3>
        <p className="text-sm text-muted-foreground">
          Como a persona fala? Esses eixos guiam o tom de cada resposta.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {axes.map((a) => (
          <TraitSlider
            key={a.key}
            label={a.label}
            leftLabel={a.left}
            rightLabel={a.right}
            value={comm[a.key]}
            onChange={(v) => setComm({ [a.key]: v })}
          />
        ))}
      </div>
    </div>
  );
}

export function StepExpertise() {
  const expertise = useBuilder((s) => s.draft.expertise);
  const setList = useBuilder((s) => s.setListField);
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold tracking-tight">Expertise</h3>
        <p className="text-sm text-muted-foreground">
          Onde a persona é autoridade? Liste 3-5 áreas de conhecimento.
        </p>
      </div>
      <ListEditor
        label="Áreas de expertise"
        placeholder="Ex: Descoberta de produto"
        items={expertise}
        onChange={(items) => setList("expertise", items)}
        max={8}
        hint="Cada vira um pilar do que a persona sabe"
      />
    </div>
  );
}

export function StepValuesGoals() {
  const values = useBuilder((s) => s.draft.values);
  const goals = useBuilder((s) => s.draft.goals);
  const setList = useBuilder((s) => s.setListField);
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold tracking-tight">Valores & Objetivos</h3>
        <p className="text-sm text-muted-foreground">
          O que a persona defende e o que ela persegue? Isso guia as decisões dela.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <ListEditor
          label="Valores"
          placeholder="Ex: Decisão com evidência"
          items={values}
          onChange={(items) => setList("values", items)}
          max={8}
        />
        <ListEditor
          label="Objetivos"
          placeholder="Ex: Ajudar a enxergar o problema certo"
          items={goals}
          onChange={(items) => setList("goals", items)}
          max={6}
        />
      </div>
    </div>
  );
}

export function StepVoice() {
  const draft = useBuilder((s) => s.draft);
  const setDraft = useBuilder((s) => s.setDraft);
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold tracking-tight">Voz & Tom</h3>
        <p className="text-sm text-muted-foreground">
          Os detalhes que tornam a voz única. Opcional, mas valioso.
        </p>
      </div>
      <div className="grid gap-5">
        <Field label="Tom" hint="2-3 palavras que resumem o tom">
          <Input
            value={draft.tone ?? ""}
            placeholder="Ex: pragmática e encorajadora"
            onChange={(e) => setDraft({ tone: e.target.value })}
            maxLength={120}
          />
        </Field>
        <Field
          label="Estilo de fala"
          hint="Como a persona estrutura as respostas"
        >
          <Textarea
            value={draft.voiceStyle ?? ""}
            placeholder="Ex: perguntas antes de respostas, exemplos de startup, conclusão com próximos passos"
            onChange={(e) => setDraft({ voiceStyle: e.target.value })}
            rows={4}
            maxLength={300}
          />
        </Field>
        <Field
          label="Idiossincrasias"
          hint="Pequenos tiques que tornam a persona reconhecível"
        >
          <Textarea
            value={draft.quirks ?? ""}
            placeholder="Ex: repete 'qual é a hipótese?' antes de opinar"
            onChange={(e) => setDraft({ quirks: e.target.value })}
            rows={3}
            maxLength={240}
          />
        </Field>
      </div>
    </div>
  );
}
