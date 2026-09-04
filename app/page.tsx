'use client';

import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Bot,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  Clapperboard,
  CircleHelp,
  Copy,
  Clock3,
  Download,
  FileText,
  Heart,
  Home as HomeIcon,
  ImagePlus,
  LayoutGrid,
  BriefcaseBusiness,
  Menu,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  Sparkles,
  Star,
  WandSparkles,
  X,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';

// The landing page is fully client-side and does not depend on request data.
// Marking it static lets GitHub Pages receive a real index.html during export.
export const dynamic = 'force-static';

type View = 'landing' | 'dashboard' | 'wizard' | 'result' | 'content';

type SocialPlatform = 'Instagram' | 'TikTok' | 'LinkedIn';

const socialProfiles = [
  { name: 'Luma Vale', handle: '@lumavale', niche: 'design e rotina criativa' },
  {
    name: 'Norte Studio',
    handle: '@nortestudio.co',
    niche: 'branding para founders',
  },
  {
    name: 'Rafa Bento',
    handle: '@rafabento',
    niche: 'café, livros e slow living',
  },
];

const socialPlatforms: Array<{
  name: SocialPlatform;
  description: string;
  icon: typeof Camera;
}> = [
  { name: 'Instagram', description: 'Carrossel e legenda', icon: Camera },
  { name: 'TikTok', description: 'Roteiro curto', icon: Clapperboard },
  {
    name: 'LinkedIn',
    description: 'Post de autoridade',
    icon: BriefcaseBusiness,
  },
];

const postGoals = ['Engajar', 'Educar', 'Vender'];
const postFormats = ['Carrossel', 'Reel / vídeo', 'Texto curto'];
const postTones = ['Próximo', 'Direto', 'Provocador'];

function buildSocialPost({
  profileName,
  platform,
  goal,
  format,
  tone,
  topic,
  variant,
}: {
  profileName: string;
  platform: SocialPlatform;
  goal: string;
  format: string;
  tone: string;
  topic: string;
  variant: number;
}) {
  const profile = socialProfiles.find(({ name }) => name === profileName);
  const subject = topic.trim() || 'criar com mais consistência';
  const hooks = [
    `O jeito mais simples de melhorar ${subject} sem deixar tudo mais complicado.`,
    `Se ${subject} parece difícil, talvez você esteja começando pelo lugar errado.`,
    `Uma ideia para colocar ${subject} em prática ainda hoje:`,
  ];
  const bodies = [
    `Para ${profile?.niche ?? 'criar com intenção'}, eu volto sempre para três perguntas: o que precisa ficar claro, o que merece a sua voz e qual é o próximo passo possível. Quando a ideia passa por esse filtro, o conteúdo deixa de ser só presença e começa a construir reconhecimento.`,
    `Não é sobre publicar mais. É sobre transformar uma observação real em uma conversa que alguém queira continuar. Escolha um ponto de vista, conte o que mudou na prática e deixe espaço para a pessoa se enxergar nessa história.`,
    `Comece pequeno: uma cena, uma escolha e uma frase que você defenderia mesmo sem aplauso. Esse recorte já é suficiente para criar algo útil, com personalidade e com espaço para evoluir depois.`,
  ];
  const ctas = {
    Engajar:
      'Salve para testar depois e me conte: qual parte faz mais sentido para você?',
    Educar: 'Envie para alguém que está tentando organizar essa mesma ideia.',
    Vender:
      'Se quiser aplicar isso no seu projeto, me chama e eu te mostro o próximo passo.',
  };
  const hashtags = {
    Instagram: '#criatividade #posicionamento #conteudocomproposito',
    TikTok: '#criadores #conteudo #marcaPessoal',
    LinkedIn: '#marcaPessoal #estrategia #comunicacao',
  };
  const formatLine =
    format === 'Reel / vídeo'
      ? 'Roteiro: abra com a frase acima, desenvolva um exemplo e feche com a pergunta.'
      : format === 'Carrossel'
        ? 'Estrutura sugerida: capa com o gancho, três telas com a ideia e uma última tela com o convite.'
        : 'Escreva como quem abre uma conversa: uma ideia clara, um exemplo concreto e um próximo passo.';
  const toneLine =
    tone === 'Direto'
      ? 'Sem rodeios, com clareza e uma opinião que dá para aplicar.'
      : tone === 'Provocador'
        ? 'A provocação aqui não é barulho: é uma pergunta que muda o ângulo de quem lê.'
        : 'Com uma voz próxima, lúcida e humana, sem parecer um anúncio.';

  return `${hooks[variant % hooks.length]}\n\n${bodies[variant % bodies.length]}\n\n${formatLine} ${toneLine}\n\n${ctas[goal as keyof typeof ctas]}\n\n${hashtags[platform]}`;
}

const profileCards = [
  {
    name: 'Luma Vale',
    handle: '@lumavale',
    niche: 'Design + rotina criativa',
    color: 'violet',
    score: '92%',
    updated: 'há 2 min',
    initial: 'LV',
  },
  {
    name: 'Norte Studio',
    handle: '@nortestudio.co',
    niche: 'Branding para founders',
    color: 'orange',
    score: '84%',
    updated: 'ontem',
    initial: 'NS',
  },
  {
    name: 'Rafa Bento',
    handle: '@rafabento',
    niche: 'Café, livros e slow living',
    color: 'blue',
    score: '76%',
    updated: 'há 4 dias',
    initial: 'RB',
  },
];

const presets = [
  {
    name: 'Electric calm',
    description: 'Contraste suave, brilho pontual e uma voz segura.',
    colors: ['#c7f36b', '#9d8bff', '#121a18'],
  },
  {
    name: 'Soft editorial',
    description: 'Clareza de revista com calor humano e ritmo.',
    colors: ['#f6c6a4', '#f9ece4', '#33251f'],
  },
  {
    name: 'Signal / 01',
    description: 'Tech minimal com recortes fortes e precisão.',
    colors: ['#61e6e2', '#2c5cff', '#0e1525'],
  },
];

function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-3" aria-label="PersonaForge">
      <span className={`wordmark-mark ${light ? 'wordmark-mark-light' : ''}`}>
        <span />
        <span />
        <span />
      </span>
      <span
        className={`text-[15px] font-semibold tracking-[-0.02em] ${light ? 'text-[#101510]' : 'text-[#f0f6ed]'}`}
      >
        PersonaForge
      </span>
    </div>
  );
}

function AccentButton({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-11 rounded-xl bg-[#c7f36b] px-5 font-semibold text-[#0b110c] shadow-[0_0_0_1px_rgba(199,243,107,.1),0_8px_30px_rgba(199,243,107,.12)] hover:bg-[#d5fa88] ${className}`}
    >
      {children}
    </button>
  );
}

function Landing({ onOpen }: { onOpen: () => void }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0b100e] text-[#f0f6ed]">
      <div className="landing-grid pointer-events-none absolute inset-0 opacity-40" />
      <header className="relative z-10 mx-auto flex max-w-[1240px] items-center justify-between px-6 py-6 lg:px-8">
        <Wordmark />
        <nav
          className="hidden items-center gap-8 text-[13px] text-[#98a59a] md:flex"
          aria-label="Principal"
        >
          <a
            href="#como-funciona"
            className="transition-colors hover:text-white"
          >
            Como funciona
          </a>
          <a href="#exemplos" className="transition-colors hover:text-white">
            Exemplos
          </a>
          <a href="#planos" className="transition-colors hover:text-white">
            Planos
          </a>
          <button
            onClick={onOpen}
            className="transition-colors hover:text-white"
          >
            Criar conteúdo
          </button>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpen}
            className="hidden text-[13px] font-medium text-[#b8c5b9] hover:text-white sm:block"
          >
            Entrar
          </button>
          <AccentButton onClick={onOpen} className="h-10 px-4 text-[13px]">
            Abrir workspace <ArrowRight className="ml-2 h-4 w-4" />
          </AccentButton>
        </div>
      </header>
      <section className="relative z-10 mx-auto grid max-w-[1240px] gap-14 px-6 pb-20 pt-12 lg:grid-cols-[.92fr_1.08fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-20">
        <div className="max-w-[590px]">
          <Badge className="mb-6 rounded-full border border-[#2c3b2c] bg-[#111a13] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[.17em] text-[#c7f36b]">
            INFLUENCER SINTÉTICO · PRIMEIRO VÍDEO GRÁTIS
          </Badge>
          <h1 className="max-w-[640px] text-[clamp(2.8rem,6vw,5.65rem)] font-semibold leading-[.96] tracking-[-.07em] text-[#f4f8f1]">
            Crie seu influencer{' '}
            <span className="text-[#c7f36b]">sintético.</span>
          </h1>
          <p className="mt-7 max-w-[480px] text-[17px] leading-7 text-[#a2afa3]">
            Voz, imagem e vídeo no mesmo lugar. Crie um personagem consistente,
            gere publicações prontas e mantenha suas redes ativas sem precisar
            aparecer.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <AccentButton onClick={onOpen}>
              Criar meu primeiro vídeo grátis{' '}
              <Sparkles className="ml-2 h-4 w-4" />
            </AccentButton>
            <button
              onClick={onOpen}
              className="group flex h-11 items-center gap-2 rounded-xl px-3 text-[13px] font-medium text-[#a7b4a8] hover:text-white"
            >
              Ver como funciona{' '}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="mt-12 flex items-center gap-4 text-[12px] text-[#78857a]">
            <div className="flex -space-x-2" aria-hidden="true">
              {['LV', 'NS', 'RB', 'AM'].map((initial, index) => (
                <span
                  key={initial}
                  className={`avatar avatar-sm avatar-${index}`}
                >
                  {initial}
                </span>
              ))}
            </div>
            <span>
              <strong className="font-semibold text-[#d5ded4]">250M</strong>{' '}
              views geradas por IA
            </span>
          </div>
        </div>
        <div
          className="relative min-h-[520px] lg:min-h-[600px]"
          aria-label="Prévia do editor PersonaForge"
        >
          <div className="orb orb-lime absolute -right-16 top-0 h-64 w-64" />
          <div className="orb orb-purple absolute bottom-4 left-3 h-40 w-40" />
          <div className="dashboard-preview absolute left-0 right-0 top-7 mx-auto max-w-[590px] rotate-[1.5deg] overflow-hidden rounded-[28px] border border-[#364439] bg-[#121914] shadow-[0_40px_100px_rgba(0,0,0,.45)]">
            <div className="flex items-center justify-between border-b border-[#263127] px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#c7f36b]" />
                <span className="font-mono text-[9px] uppercase tracking-[.2em] text-[#879789]">
                  Influencer / 01
                </span>
              </div>
              <div className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#344336]" />
                <span className="h-2 w-2 rounded-full bg-[#344336]" />
                <span className="h-2 w-2 rounded-full bg-[#344336]" />
              </div>
            </div>
            <div className="grid grid-cols-[.87fr_1.13fr] gap-5 p-5 sm:p-7">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-[.15em] text-[#748276]">
                    Seu personagem
                  </span>
                  <span className="rounded-full bg-[#263326] px-2 py-1 font-mono text-[9px] text-[#c7f36b]">
                    pronto
                  </span>
                </div>
                <div className="rounded-2xl border border-[#344137] bg-[#1a241b] p-4">
                  <p className="font-mono text-[9px] uppercase tracking-[.13em] text-[#7e8e7e]">
                    Nome do influencer
                  </p>
                  <p className="mt-2 text-lg font-semibold tracking-[-.04em] text-white">
                    Luma Vale
                  </p>
                  <p className="mt-1 text-[11px] text-[#9eaca0]">
                    rosto, voz e estilo consistentes
                  </p>
                </div>
                {['Voz', 'Formato', 'Distribuição'].map((label, index) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-[#2b382d] bg-[#151e16] p-4"
                  >
                    <p className="font-mono text-[9px] uppercase tracking-[.13em] text-[#718071]">
                      {label}
                    </p>
                    <p className="mt-2 text-[11px] text-[#d6e0d4]">
                      {
                        [
                          'Natural e reconhecível',
                          'Vídeo curto · vertical',
                          'Instagram · TikTok · YouTube',
                        ][index]
                      }
                    </p>
                  </div>
                ))}
              </div>
              <div className="rounded-[22px] border border-[#384637] bg-[#e8eee2] p-4 text-[#172019] sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#172019] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.14em] text-[#c7f36b]">
                    Preview
                  </span>
                  <span className="font-mono text-[9px] text-[#6d786e]">
                    VÍDEO 01 · PREVIEW
                  </span>
                </div>
                <div className="mt-12 flex items-center gap-3">
                  <span className="avatar avatar-lg avatar-luma">LV</span>
                  <div>
                    <p className="text-[13px] font-semibold">Luma Vale</p>
                    <p className="text-[10px] text-[#6c796d]">@lumavale</p>
                  </div>
                </div>
                <p className="mt-7 max-w-[240px] text-[22px] font-semibold leading-[1.05] tracking-[-.05em]">
                  Um personagem que publica por você.
                </p>
                <p className="mt-3 max-w-[235px] text-[11px] leading-5 text-[#576258]">
                  Roteiro, voz e imagem gerados juntos. Pronto para postar.
                </p>
                <div className="mt-8 flex items-center gap-2 text-[10px] font-semibold">
                  <span className="rounded-full bg-[#d5e4cc] px-2.5 py-1.5">
                    sem edição
                  </span>
                  <span className="rounded-full bg-[#d5e4cc] px-2.5 py-1.5">
                    zero marca d&apos;água
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-[#263127] px-5 py-4 sm:px-7">
              <span className="text-[10px] text-[#7c8a7d]">
                Gerado automaticamente
              </span>
              <button
                onClick={onOpen}
                className="flex items-center gap-1.5 text-[10px] font-semibold text-[#c7f36b]"
              >
                Criar publicação <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 hidden w-[190px] rounded-2xl border border-[#344235] bg-[#151c16]/95 p-4 shadow-2xl backdrop-blur sm:block">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[.12em] text-[#849184]">
                Consistência
              </span>
              <Bot className="h-4 w-4 text-[#c7f36b]" />
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-[-.07em] text-white">
              9.2<span className="text-sm text-[#7d897e]">/10</span>
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#29342a]">
              <div className="h-full w-[92%] rounded-full bg-[#c7f36b]" />
            </div>
            <p className="mt-2 text-[10px] leading-4 text-[#819081]">
              O mesmo personagem em qualquer ângulo.
            </p>
          </div>
        </div>
      </section>
      <section
        id="como-funciona"
        className="relative z-10 mx-auto max-w-[1240px] border-t border-[#202b21] px-6 py-16 lg:px-8"
      >
        <div className="grid gap-8 md:grid-cols-3">
          {[
            [
              '01',
              'Crie o personagem.',
              'Defina rosto, voz e estilo. A mesma identidade aparece em vídeo após vídeo.',
            ],
            [
              '02',
              'Gere o vídeo.',
              'Escreva o roteiro ou peça uma ideia. A plataforma junta imagem, voz e lip-sync.',
            ],
            [
              '03',
              'Publique em escala.',
              'Organize a fila, revise e publique no ritmo que sua audiência espera.',
            ],
          ].map(([number, title, copy]) => (
            <div key={number} className="border-l border-[#334333] pl-5">
              <span className="font-mono text-[11px] text-[#c7f36b]">
                {number}
              </span>
              <h2 className="mt-4 text-lg font-semibold tracking-[-.03em] text-white">
                {title}
              </h2>
              <p className="mt-2 max-w-[280px] text-sm leading-6 text-[#879488]">
                {copy}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section
        id="exemplos"
        className="relative z-10 mx-auto max-w-[1240px] border-t border-[#202b21] px-6 py-16 lg:px-8"
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Casos de uso</p>
            <h2 className="mt-3 max-w-[620px] text-3xl font-semibold tracking-[-.06em] text-white sm:text-4xl">
              Um personagem. Ideias infinitas.
            </h2>
          </div>
          <p className="max-w-[340px] text-sm leading-6 text-[#829083]">
            O pipeline se adapta ao seu nicho: educação, lifestyle, produto ou
            qualquer assunto que mereça uma voz própria.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            {
              name: 'Guto Explica',
              handle: '@gutoexplica',
              description:
                'Um creator sintético para transformar assuntos complexos em vídeos diários.',
              followers: '60,5K',
              views: '+1,7M',
              variant: 'avatar-orange',
            },
            {
              name: 'Monge da Paz',
              handle: '@mongedapaz',
              description:
                'Sabedoria e filosofia em vídeos curtos, sem câmera e sem rosto humano.',
              followers: '120K',
              views: '+1,1M',
              variant: 'avatar-violet',
            },
          ].map((example) => (
            <article key={example.name} className="example-card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={`avatar avatar-lg ${example.variant}`}>
                    AI
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {example.name}
                    </h3>
                    <p className="mt-1 text-[11px] text-[#819081]">
                      {example.handle}
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-[#3a4d38] bg-[#1b291c] px-2 py-1 font-mono text-[9px] text-[#c7f36b]">
                  100% IA
                </span>
              </div>
              <p className="mt-6 max-w-[390px] text-sm leading-6 text-[#a2afa3]">
                {example.description}
              </p>
              <div className="mt-7 flex gap-8 border-t border-[#2a382d] pt-4">
                <div>
                  <strong className="block text-lg font-semibold tracking-[-.05em] text-white">
                    {example.followers}
                  </strong>
                  <span className="font-mono text-[9px] uppercase tracking-[.12em] text-[#718071]">
                    seguidores
                  </span>
                </div>
                <div>
                  <strong className="block text-lg font-semibold tracking-[-.05em] text-white">
                    {example.views}
                  </strong>
                  <span className="font-mono text-[9px] uppercase tracking-[.12em] text-[#718071]">
                    visualizações
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section
        id="planos"
        className="relative z-10 mx-auto max-w-[1240px] border-t border-[#202b21] px-6 py-16 lg:px-8"
      >
        <div className="max-w-[590px]">
          <p className="eyebrow">Planos</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-.06em] text-white sm:text-4xl">
            Escolha o ritmo da sua criação.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#829083]">
            Comece com seu primeiro vídeo grátis. Depois, pague apenas pelo que
            gerar e publique sem marca d&apos;água.
          </p>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {[
            {
              name: 'Starter',
              price: 'R$ 49,90',
              credits: '1.000',
              detail: 'para validar seu personagem e postar com frequência',
            },
            {
              name: 'Pro',
              price: 'R$ 128,00',
              credits: '3.000',
              detail: 'para rodar 1 a 3 influencers em ritmo diário',
              popular: true,
            },
            {
              name: 'Scale',
              price: 'R$ 573,00',
              credits: '15.000',
              detail: 'para agências e operações multi-personagem',
            },
          ].map((plan) => (
            <article
              key={plan.name}
              className={`pricing-card ${plan.popular ? 'pricing-card-featured' : ''}`}
            >
              {plan.popular && (
                <span className="pricing-badge">mais popular</span>
              )}
              <p className="text-sm font-semibold text-white">{plan.name}</p>
              <p className="mt-5 text-3xl font-semibold tracking-[-.07em] text-white">
                {plan.price}
                <span className="ml-1 text-xs font-normal text-[#748174]">
                  /mês
                </span>
              </p>
              <div className="mt-6 space-y-3 text-xs text-[#a5b2a6]">
                <p>
                  <Check className="mr-2 inline h-3.5 w-3.5 text-[#c7f36b]" />
                  {plan.credits} créditos por mês
                </p>
                <p>
                  <Check className="mr-2 inline h-3.5 w-3.5 text-[#c7f36b]" />≈{' '}
                  {plan.name === 'Starter'
                    ? '5'
                    : plan.name === 'Pro'
                      ? '16'
                      : '78'}{' '}
                  min de vídeo
                </p>
                {plan.name !== 'Starter' && (
                  <p>
                    <Check className="mr-2 inline h-3.5 w-3.5 text-[#c7f36b]" />
                    postagem automática em até {plan.name === 'Pro'
                      ? '3'
                      : '8'}{' '}
                    contas
                  </p>
                )}
              </div>
              <p className="mt-5 min-h-10 text-[10px] leading-4 text-[#748174]">
                {plan.detail}
              </p>
              <button
                onClick={onOpen}
                className={`mt-6 flex h-10 w-full items-center justify-center rounded-xl text-xs font-semibold ${plan.popular ? 'bg-[#c7f36b] text-[#101510] hover:bg-[#d5fa88]' : 'border border-[#3a4d38] text-[#c7f36b] hover:bg-[#1b291c]'}`}
              >
                Começar agora
              </button>
            </article>
          ))}
        </div>
      </section>
      <section
        id="faq"
        className="relative z-10 mx-auto max-w-[860px] border-t border-[#202b21] px-6 py-16 lg:px-8"
      >
        <div className="text-center">
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-.06em] text-white sm:text-4xl">
            Perguntas frequentes.
          </h2>
        </div>
        <div className="mt-8 divide-y divide-[#28352b] border-y border-[#28352b]">
          {[
            [
              'Preciso pagar para testar?',
              'Não. O primeiro vídeo é grátis e você não precisa cadastrar cartão.',
            ],
            [
              'Preciso saber programar?',
              'Não. Você cria o personagem, escreve o briefing e organiza as publicações dentro da plataforma.',
            ],
            [
              'Preciso aparecer ou gravar vídeo?',
              'Não. O personagem é sintético: imagem, voz e roteiro são gerados sem ligar uma câmera.',
            ],
            [
              'Funciona em qualquer nicho?',
              'Sim. O pipeline é o mesmo; mudam o personagem, a voz e o roteiro.',
            ],
            [
              'Como funcionam os créditos?',
              'Cada geração consome créditos. Você controla o gasto pelo formato, duração e quantidade de vídeos.',
            ],
            [
              'Posso cancelar quando quiser?',
              'Sim. O cancelamento é feito pelo painel e seus créditos seguem disponíveis até o fim do ciclo.',
            ],
          ].map(([question, answer]) => (
            <details key={question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-medium text-[#dce7d9]">
                {question}
                <ChevronDown className="h-4 w-4 shrink-0 text-[#849184] transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 max-w-[700px] text-xs leading-6 text-[#849184]">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </section>
      <footer className="relative z-10 border-t border-[#202b21] px-6 py-10 lg:px-8">
        <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-5 text-[10px] text-[#718071] sm:flex-row sm:items-center">
          <div>
            <Wordmark />
            <p className="mt-3">
              Death of the internet · crie seu influencer sintético.
            </p>
          </div>
          <p>© 2026 PersonaForge · blog · privacidade · termos</p>
        </div>
      </footer>
    </main>
  );
}

function AppSidebar({
  view,
  onNavigate,
  onClose,
}: {
  view: View;
  onNavigate: (view: View) => void;
  onClose?: () => void;
}) {
  const items = [
    { label: 'Visão geral', icon: HomeIcon, target: 'dashboard' as View },
    { label: 'Meus perfis', icon: LayoutGrid, target: 'dashboard' as View },
    { label: 'Criar conteúdo', icon: Send, target: 'content' as View },
    { label: 'Templates', icon: WandSparkles, target: 'wizard' as View },
    { label: 'Analytics', icon: BarChart3, target: 'dashboard' as View },
  ];
  return (
    <aside
      className="app-sidebar flex h-full w-[246px] flex-col border-r border-[#243026] bg-[#111712] px-4 py-5"
      aria-label="Navegação do workspace"
    >
      <div className="flex items-center justify-between px-2">
        <Wordmark />
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-[#839083] hover:bg-[#1a241b] hover:text-white lg:hidden"
          aria-label="Fechar menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-8 flex items-center justify-between rounded-xl border border-[#2b392d] bg-[#172119] px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#c7f36b] text-[10px] font-bold text-[#101810]">
            MV
          </span>
          <div>
            <p className="text-[11px] font-semibold text-[#e5eee1]">
              Marina Vieira
            </p>
            <p className="font-mono text-[9px] text-[#7e8b7d]">
              Personal workspace
            </p>
          </div>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-[#7d8c7e]" />
      </div>
      <nav className="mt-8 flex-1">
        <p className="mb-3 px-3 font-mono text-[9px] uppercase tracking-[.16em] text-[#647164]">
          Workspace
        </p>
        <div className="space-y-1">
          {items.map(({ label, icon: Icon, target }) => {
            const active =
              (view === 'dashboard' && label === 'Visão geral') ||
              (view === 'content' && label === 'Criar conteúdo') ||
              (view === 'wizard' && label === 'Templates') ||
              (view === 'result' && label === 'Meus perfis');
            return (
              <button
                key={label}
                onClick={() => {
                  onNavigate(target);
                  onClose?.();
                }}
                className={`sidebar-link ${active ? 'sidebar-link-active' : ''}`}
              >
                <Icon className="h-4 w-4" />
                {label}
                {label === 'Templates' && (
                  <span className="ml-auto rounded-full bg-[#263926] px-1.5 py-0.5 font-mono text-[8px] text-[#c7f36b]">
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="mb-3 mt-9 px-3 font-mono text-[9px] uppercase tracking-[.16em] text-[#647164]">
          Conta
        </p>
        <div className="space-y-1">
          <button className="sidebar-link">
            <Settings className="h-4 w-4" />
            Configurações
          </button>
          <button className="sidebar-link">
            <CircleHelp className="h-4 w-4" />
            Ajuda e suporte
          </button>
        </div>
      </nav>
      <div className="rounded-2xl border border-[#3a4d39] bg-[#192319] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-[#c7f36b]" />
            <span className="font-mono text-[9px] uppercase tracking-[.14em] text-[#a7b5a7]">
              Créditos
            </span>
          </div>
          <span className="font-mono text-[10px] font-semibold text-[#c7f36b]">
            124 / 200
          </span>
        </div>
        <Progress
          value={62}
          className="mt-3 h-1.5 bg-[#2a382a] [&>div]:bg-[#c7f36b]"
        />
        <button className="mt-3 text-[11px] font-medium text-[#dce7d9] hover:text-[#c7f36b]">
          Ver detalhes <ArrowRight className="ml-1 inline h-3 w-3" />
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between px-2">
        <span className="font-mono text-[9px] text-[#627063]">v0.9.4 beta</span>
        <button
          className="rounded-lg p-1.5 text-[#778478] hover:bg-[#1c271d] hover:text-white"
          aria-label="Notificações"
        >
          <Bell className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}

function AppShell({
  view,
  onNavigate,
  children,
}: {
  view: View;
  onNavigate: (view: View) => void;
  children: React.ReactNode;
}) {
  const [mobileNav, setMobileNav] = useState(false);
  return (
    <main className="flex min-h-screen bg-[#0b100e] text-[#edf4eb]">
      <div
        className={`mobile-nav-backdrop ${mobileNav ? 'mobile-nav-backdrop-open' : ''}`}
        onClick={() => setMobileNav(false)}
        aria-hidden="true"
      />
      <div className={`mobile-nav ${mobileNav ? 'mobile-nav-open' : ''}`}>
        <AppSidebar
          view={view}
          onNavigate={onNavigate}
          onClose={() => setMobileNav(false)}
        />
      </div>
      <div className="hidden lg:block">
        <AppSidebar view={view} onNavigate={onNavigate} />
      </div>
      <section className="min-w-0 flex-1">
        <header className="flex h-[72px] items-center justify-between border-b border-[#202b22] px-5 lg:px-9">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNav(true)}
              className="rounded-xl border border-[#2a382c] p-2 text-[#a9b5aa] hover:bg-[#182118] lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="hidden items-center gap-2 text-[12px] text-[#78867b] sm:flex">
              <span>Workspace</span>
              <span className="text-[#425045]">/</span>
              <span className="text-[#dbe6d8]">
                {view === 'wizard'
                  ? 'Novo perfil'
                  : view === 'content'
                    ? 'Criar conteúdo'
                    : view === 'result'
                      ? 'Luma Vale'
                      : 'Visão geral'}
              </span>
            </div>
            <div className="sm:hidden">
              <Wordmark />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden items-center gap-2 rounded-xl border border-[#283529] bg-[#131a14] px-3 py-2 text-[11px] text-[#89968b] sm:flex">
              <Search className="h-3.5 w-3.5" /> Buscar{' '}
              <span className="ml-4 rounded-md border border-[#344335] px-1.5 py-0.5 font-mono text-[9px] text-[#637063]">
                ⌘ K
              </span>
            </button>
            <button
              className="relative rounded-xl border border-[#283529] p-2 text-[#88968b] hover:bg-[#182118] hover:text-white"
              aria-label="Notificações"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#c7f36b]" />
            </button>
            <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-[#d6ecbd] text-[10px] font-bold text-[#192319] sm:flex">
              MV
            </div>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}

function ProfileAvatar({
  variant = 'luma',
  size = 'md',
  initial = 'LV',
}: {
  variant?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  initial?: string;
}) {
  return (
    <span className={`avatar avatar-${size} avatar-${variant}`}>{initial}</span>
  );
}

function Dashboard({
  onNew,
  onProfile,
  onContent,
}: {
  onNew: () => void;
  onProfile: () => void;
  onContent: () => void;
}) {
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['Luma Vale']);
  const filtered = profileCards.filter((profile) =>
    `${profile.name} ${profile.handle} ${profile.niche}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <div className="mx-auto max-w-[1400px] p-5 lg:p-9">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Quinta-feira, 04 de setembro</p>
          <h1 className="page-title mt-3">
            Boa tarde, Marina <span className="text-[#c7f36b]">↗</span>
          </h1>
          <p className="mt-2 text-sm text-[#839083]">
            Três ideias estão esperando para ganhar forma.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={onContent} className="secondary-action">
            <Send className="mr-2 h-3.5 w-3.5" /> Criar conteúdo
          </button>
          <AccentButton onClick={onNew}>
            <Plus className="mr-2 h-4 w-4" /> Novo perfil
          </AccentButton>
        </div>
      </div>
      <div className="mt-9 grid gap-4 md:grid-cols-3">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Perfis ativos</span>
            <LayoutGrid className="h-4 w-4 text-[#718071]" />
          </div>
          <p className="stat-value">03</p>
          <p className="stat-note">
            <span className="text-[#c7f36b]">+1</span> este mês
          </p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Consistência média</span>
            <BarChart3 className="h-4 w-4 text-[#718071]" />
          </div>
          <p className="stat-value">
            84<span className="text-base text-[#7c887d]">%</span>
          </p>
          <p className="stat-note">
            <span className="text-[#c7f36b]">+12%</span> desde o último mês
          </p>
        </div>
        <div className="stat-card relative overflow-hidden">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#c7f36b]/10 blur-2xl" />
          <div className="flex items-center justify-between">
            <span className="stat-label">Créditos restantes</span>
            <Zap className="h-4 w-4 text-[#c7f36b]" />
          </div>
          <p className="stat-value">
            124<span className="text-base text-[#7c887d]">/200</span>
          </p>
          <p className="stat-note">
            <span className="text-[#c7f36b]">62%</span> do ciclo atual
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="section-title">Seus perfis</h2>
          <p className="mt-1 text-xs text-[#7f8d81]">
            Uma base viva para cada versão do seu trabalho.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <label htmlFor="profile-search" className="sr-only">
              Buscar perfis
            </label>
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6d7b6e]" />
            <Input
              id="profile-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar perfis"
              className="h-9 w-[190px] rounded-xl border-[#2b392e] bg-[#131a14] pl-9 text-xs text-white placeholder:text-[#687568]"
            />
          </div>
          <button className="flex h-9 items-center gap-2 rounded-xl border border-[#2b392e] px-3 text-xs text-[#9aa69b] hover:bg-[#162018]">
            Recentes <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        {filtered.map((profile) => (
          <article key={profile.name} className="profile-card group">
            <div className="flex items-start justify-between">
              <ProfileAvatar
                variant={profile.color}
                initial={profile.initial}
                size="lg"
              />
              <button
                onClick={() =>
                  setFavorites((current) =>
                    current.includes(profile.name)
                      ? current.filter((name) => name !== profile.name)
                      : [...current, profile.name],
                  )
                }
                className={`rounded-lg p-2 transition-colors ${favorites.includes(profile.name) ? 'text-[#c7f36b]' : 'text-[#657265] hover:text-white'}`}
                aria-label={
                  favorites.includes(profile.name)
                    ? `Remover ${profile.name} dos favoritos`
                    : `Favoritar ${profile.name}`
                }
              >
                <Star
                  className="h-4 w-4"
                  fill={
                    favorites.includes(profile.name) ? 'currentColor' : 'none'
                  }
                />
              </button>
            </div>
            <div className="mt-6">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold tracking-[-.03em] text-[#e9f1e7]">
                  {profile.name}
                </h3>
                <Badge className="rounded-full border-0 bg-[#273328] px-2 py-0.5 text-[9px] font-medium text-[#aab9aa]">
                  Ativo
                </Badge>
              </div>
              <p className="mt-1 text-xs text-[#829084]">
                {profile.handle} · {profile.niche}
              </p>
            </div>
            <div className="mt-6 flex items-end justify-between border-t border-[#28352b] pt-4">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[.13em] text-[#677568]">
                  Voice match
                </p>
                <p className="mt-1 text-lg font-semibold text-[#c7f36b]">
                  {profile.score}
                </p>
              </div>
              <p className="text-[10px] text-[#6f7c71]">
                Atualizado {profile.updated}
              </p>
            </div>
            <button onClick={onProfile} className="profile-card-action">
              Abrir perfil{' '}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </article>
        ))}
        {filtered.length === 0 && (
          <div className="empty-state xl:col-span-3">
            <Search className="h-5 w-5 text-[#c7f36b]" />
            <p className="mt-3 text-sm font-semibold text-white">
              Nenhum perfil encontrado
            </p>
            <p className="mt-1 text-xs text-[#7f8d81]">
              Tente outro termo ou crie um perfil novo.
            </p>
          </div>
        )}
      </div>
      <div className="mt-10 grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
        <div className="panel">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="section-title">Atividade recente</h2>
              <p className="mt-1 text-xs text-[#7f8d81]">
                O ritmo da sua clareza nas últimas semanas.
              </p>
            </div>
            <button className="text-xs font-medium text-[#c7f36b]">
              Ver relatório <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-8 flex h-[150px] items-end gap-2 sm:gap-4">
            {[42, 68, 52, 86, 64, 94, 76, 100, 73, 86, 91, 78, 95, 88].map(
              (height, index) => (
                <div
                  key={index}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div
                    className={`w-full rounded-t-md transition-all ${index === 7 ? 'bg-[#c7f36b]' : 'bg-[#2c3a2e] hover:bg-[#516452]'}`}
                    style={{ height: `${height}%` }}
                  />
                  {[0, 3, 7, 13].includes(index) && (
                    <span className="font-mono text-[9px] text-[#637064]">
                      {
                        ['18/08', '25/08', '01/09', '04/09'][
                          [0, 3, 7, 13].indexOf(index)
                        ]
                      }
                    </span>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
        <div className="panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="section-title">Próximo passo</h2>
              <span className="rounded-full bg-[#2c382e] px-2 py-1 font-mono text-[9px] text-[#c7f36b]">
                02 min
              </span>
            </div>
            <p className="mt-4 text-[15px] font-medium leading-6 text-[#dce7d9]">
              Seu perfil está forte. Falta uma frase que as pessoas consigam
              repetir.
            </p>
          </div>
          <button
            onClick={onProfile}
            className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#1e2b20] py-3 text-xs font-semibold text-[#c7f36b] hover:bg-[#263729]"
          >
            Refinar posicionamento <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

type QueuedPost = {
  id: number;
  platform: SocialPlatform;
  label: string;
  title: string;
  text: string;
};

function ContentStudio({ onBack }: { onBack: () => void }) {
  const [profileName, setProfileName] = useState('Luma Vale');
  const [platform, setPlatform] = useState<SocialPlatform>('Instagram');
  const [goal, setGoal] = useState('Engajar');
  const [format, setFormat] = useState('Carrossel');
  const [tone, setTone] = useState('Próximo');
  const [topic, setTopic] = useState(
    'como manter consistência sem perder a própria voz',
  );
  const [variants, setVariants] = useState<string[]>([]);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [generatedPost, setGeneratedPost] = useState('');
  const [queue, setQueue] = useState<QueuedPost[]>([]);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState('');
  const [scheduleAt, setScheduleAt] = useState('2026-09-05T09:00');

  const profile = socialProfiles.find(({ name }) => name === profileName);
  const activePlatform = socialPlatforms.find(({ name }) => name === platform);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('personaforge-post-queue');
      if (stored) {
        window.setTimeout(() => {
          setQueue(JSON.parse(stored) as QueuedPost[]);
        }, 0);
      }
    } catch {
      /* local storage can be unavailable in restricted previews */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('personaforge-post-queue', JSON.stringify(queue));
    } catch {
      /* local storage can be unavailable in restricted previews */
    }
  }, [queue]);

  const generate = (sequence = false) => {
    setGenerating(true);
    setStatus('');
    window.setTimeout(() => {
      const nextVariants = [0, 1, 2].map((variant) =>
        buildSocialPost({
          profileName,
          platform,
          goal,
          format,
          tone,
          topic,
          variant,
        }),
      );
      setVariants(nextVariants);
      setSelectedVariant(0);
      setGeneratedPost(nextVariants[0]);
      if (sequence) {
        const labels = ['Amanhã · 09:00', 'Quinta · 12:30', 'Sexta · 18:00'];
        setQueue(
          nextVariants.map((text, index) => ({
            id: Date.now() + index,
            platform,
            label: labels[index],
            title: `${topic.trim() || 'Nova ideia'} · V${index + 1}`,
            text,
          })),
        );
        setStatus('Sequência de 3 publicações criada e organizada.');
      } else {
        setStatus(
          '3 variações criadas. Escolha uma e ajuste antes de publicar.',
        );
      }
      setGenerating(false);
    }, 900);
  };

  const chooseVariant = (index: number) => {
    setSelectedVariant(index);
    setGeneratedPost(variants[index]);
  };

  const copyPost = async () => {
    try {
      await navigator.clipboard?.writeText(generatedPost);
    } catch {
      /* clipboard can be unavailable in preview */
    }
    setCopied(true);
    setStatus('Publicação copiada para a área de transferência.');
    window.setTimeout(() => setCopied(false), 1800);
  };

  const downloadPost = () => {
    const file = new Blob([generatedPost], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profileName.toLowerCase().replaceAll(' ', '-')}-post.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setStatus('Arquivo da publicação baixado.');
  };

  const addToQueue = () => {
    if (!generatedPost) {
      setStatus('Gere uma publicação antes de adicionar à fila.');
      return;
    }
    setQueue((current) => [
      ...current,
      {
        id: Date.now(),
        platform,
        label: 'Próxima vaga · 16:30',
        title: topic.trim() || 'Nova ideia de conteúdo',
        text: generatedPost,
      },
    ]);
    setStatus('Publicação adicionada à fila automática.');
  };

  return (
    <div className="mx-auto max-w-[1400px] p-5 lg:p-9">
      <button
        onClick={onBack}
        className="mb-5 flex items-center gap-2 text-xs text-[#7d8b7e] hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Voltar para visão geral
      </button>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Content engine</p>
          <h1 className="page-title mt-3">
            Publique ideias que{' '}
            <span className="text-[#c7f36b]">soam como você.</span>
          </h1>
          <p className="mt-2 max-w-[590px] text-sm leading-6 text-[#839083]">
            Escolha um perfil, conte o que você quer dizer e receba uma
            publicação pronta — com variações, formato e fila de distribuição.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#2c3c2f] bg-[#141e15] px-3 py-2 text-[11px] text-[#9aaa9a]">
          <Zap className="h-3.5 w-3.5 text-[#c7f36b]" />8 créditos por
          publicação
        </div>
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-[.82fr_1.18fr]">
        <section className="panel">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Briefing rápido</p>
              <h2 className="mt-2 section-title">Dê direção para a ideia</h2>
            </div>
            <span className="rounded-full border border-[#334736] bg-[#1d2b1d] px-2.5 py-1 font-mono text-[9px] text-[#c7f36b]">
              01 / 03
            </span>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="content-profile" className="field-label">
                Perfil que vai publicar
              </label>
              <select
                id="content-profile"
                value={profileName}
                onChange={(event) => setProfileName(event.target.value)}
                className="studio-select mt-2"
              >
                {socialProfiles.map((item) => (
                  <option key={item.name}>{item.name}</option>
                ))}
              </select>
              <p className="mt-2 text-[10px] text-[#718071]">
                Voz ativa: {profile?.niche ?? 'conteúdo com intenção'}
              </p>
            </div>

            <div>
              <span className="field-label">Onde publicar</span>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {socialPlatforms.map(({ name, description, icon: Icon }) => (
                  <button
                    key={name}
                    onClick={() => setPlatform(name)}
                    className={`platform-card ${platform === name ? 'platform-card-active' : ''}`}
                    aria-pressed={platform === name}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{name}</span>
                    <small>{description}</small>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="content-topic" className="field-label">
                Sobre o que você quer falar?
              </label>
              <Textarea
                id="content-topic"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                className="mt-2 min-h-[96px] resize-none rounded-xl border-[#2b392e] bg-[#131a14] text-xs leading-5 text-white placeholder:text-[#657366]"
                placeholder="Ex.: como começar a criar conteúdo sem copiar ninguém"
              />
              <p className="mt-2 text-right font-mono text-[9px] text-[#667467]">
                {topic.length} / 180
              </p>
            </div>

            <div>
              <span className="field-label">Objetivo</span>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {postGoals.map((item) => (
                  <button
                    key={item}
                    onClick={() => setGoal(item)}
                    className={`tone-chip ${goal === item ? 'tone-chip-active' : ''}`}
                    aria-pressed={goal === item}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="field-label">Formato</span>
              <div className="mt-2 grid gap-2">
                {postFormats.map((item, index) => (
                  <button
                    key={item}
                    onClick={() => setFormat(item)}
                    className={`select-card min-h-0 py-3 ${format === item ? 'select-card-active' : ''}`}
                    aria-pressed={format === item}
                  >
                    <span className="select-card-icon">
                      {index === 0 ? (
                        <LayoutGrid className="h-4 w-4" />
                      ) : index === 1 ? (
                        <Clapperboard className="h-4 w-4" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                    </span>
                    <span>
                      <strong>{item}</strong>
                      <small>
                        {index === 0
                          ? 'Gancho + desenvolvimento + CTA'
                          : index === 1
                            ? 'Hook + roteiro em 30 segundos'
                            : 'Legenda enxuta e compartilhável'}
                      </small>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="field-label">Tom da sua voz</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {postTones.map((item) => (
                  <button
                    key={item}
                    onClick={() => setTone(item)}
                    className={`tone-chip ${tone === item ? 'tone-chip-active' : ''}`}
                    aria-pressed={tone === item}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#2b392e] bg-[#131a14] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="field-label">Primeira publicação</p>
                  <p className="mt-1 text-[10px] text-[#718071]">
                    Escolha quando a fila começa a rodar.
                  </p>
                </div>
                <Clock3 className="h-4 w-4 text-[#c7f36b]" />
              </div>
              <input
                aria-label="Data e hora da primeira publicação"
                type="datetime-local"
                value={scheduleAt}
                onChange={(event) => setScheduleAt(event.target.value)}
                className="studio-select mt-3"
              />
              <p className="mt-2 text-[10px] text-[#718071]">
                Fuso horário local · revisão antes do envio
              </p>
            </div>
          </div>

          <div className="mt-7 border-t border-[#28352b] pt-5">
            <div className="flex flex-col gap-2 sm:flex-row">
              <AccentButton onClick={() => generate()} className="flex-1">
                {generating ? (
                  <>
                    <span className="spinner mr-2" /> Criando publicação...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" /> Gerar publicação
                  </>
                )}
              </AccentButton>
              <button
                onClick={() => generate(true)}
                disabled={generating}
                className="flex h-11 items-center justify-center rounded-xl border border-[#3a4d38] px-4 text-xs font-semibold text-[#c7f36b] hover:bg-[#1b291c] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CalendarDays className="mr-2 h-4 w-4" /> Gerar 3 para a semana
              </button>
            </div>
            {status && (
              <output
                className="mt-3 block text-[10px] leading-4 text-[#9eb09d]"
                aria-live="polite"
              >
                <Check className="mr-1 inline h-3 w-3 text-[#c7f36b]" />
                {status}
              </output>
            )}
          </div>
        </section>

        <section className="panel">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Editor + preview</p>
              <h2 className="mt-2 section-title">Veja antes de publicar</h2>
            </div>
            {generatedPost && (
              <span className="flex items-center gap-1.5 rounded-full bg-[#203120] px-2.5 py-1 font-mono text-[9px] text-[#c7f36b]">
                <Check className="h-3 w-3" /> pronto para revisar
              </span>
            )}
          </div>

          {!generatedPost ? (
            <div className="content-empty mt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#263825] text-[#c7f36b]">
                <Send className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-white">
                Sua próxima publicação começa aqui
              </h3>
              <p className="mt-2 max-w-[330px] text-center text-xs leading-5 text-[#778578]">
                O motor cruza o briefing com a voz do perfil e cria três
                caminhos diferentes para a mesma ideia.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
                {variants.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => chooseVariant(index)}
                    className={`variant-tab ${selectedVariant === index ? 'variant-tab-active' : ''}`}
                  >
                    Variação {index + 1}
                  </button>
                ))}
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-[.92fr_1.08fr]">
                <div className="post-preview-card">
                  <div className="flex items-center justify-between border-b border-[#d4dfd1] pb-4">
                    <div className="flex items-center gap-2.5">
                      <ProfileAvatar variant="luma" initial="LV" size="sm" />
                      <div>
                        <p className="text-[11px] font-semibold text-[#1b251c]">
                          {profileName}
                        </p>
                        <p className="text-[9px] text-[#758176]">
                          {profile?.handle} · agora
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-semibold uppercase tracking-[.1em] text-[#687568]">
                      {activePlatform?.name}
                    </span>
                  </div>
                  <div className="mt-5 whitespace-pre-line text-[12px] leading-5 text-[#273128]">
                    {generatedPost}
                  </div>
                  <div className="mt-5 flex items-center gap-4 border-t border-[#d4dfd1] pt-4 text-[9px] text-[#758176]">
                    <span>♡ 248</span>
                    <span>◌ 31 comentários</span>
                    <span>↗ compartilhar</span>
                  </div>
                </div>
                <div>
                  <label htmlFor="generated-post" className="field-label">
                    Texto editável
                  </label>
                  <Textarea
                    id="generated-post"
                    value={generatedPost}
                    onChange={(event) => setGeneratedPost(event.target.value)}
                    className="mt-2 min-h-[300px] resize-none rounded-xl border-[#2b392e] bg-[#131a14] text-xs leading-5 text-[#dce8da]"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button onClick={copyPost} className="secondary-action">
                      <Copy className="mr-2 h-3.5 w-3.5" />
                      {copied ? 'Copiado' : 'Copiar texto'}
                    </button>
                    <button onClick={downloadPost} className="secondary-action">
                      <Download className="mr-2 h-3.5 w-3.5" /> Baixar .txt
                    </button>
                    <button
                      onClick={() => generate()}
                      className="secondary-action"
                    >
                      <RefreshCw className="mr-2 h-3.5 w-3.5" /> Nova variação
                    </button>
                  </div>
                  <button
                    onClick={addToQueue}
                    className="mt-3 flex h-10 w-full items-center justify-center rounded-xl bg-[#203120] text-xs font-semibold text-[#c7f36b] hover:bg-[#2a4029]"
                  >
                    <CalendarDays className="mr-2 h-3.5 w-3.5" />
                    Adicionar à fila automática
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      <section className="panel mt-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="eyebrow">Automação</p>
            <h2 className="mt-2 section-title">Fila de publicações</h2>
            <p className="mt-1 text-xs text-[#7f8d81]">
              Organize a semana agora e revise tudo em um só lugar.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-[#7f8d81]">
            <span className="flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-[#c7f36b]" />
              {queue.length} na fila
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-[#c7f36b]" />
              revisão manual
            </span>
          </div>
        </div>
        {queue.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-[#344735] bg-[#131a14] p-5 text-center">
            <p className="text-xs font-medium text-[#c1d0c0]">
              Ainda não há publicações agendadas.
            </p>
            <p className="mt-1 text-[10px] text-[#718071]">
              Use “Gerar 3 para a semana” para criar sua primeira sequência
              automática.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {queue.map((item) => (
              <article key={item.id} className="queue-card">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#c7f36b]">
                    <CalendarDays className="h-3.5 w-3.5" /> {item.label}
                  </span>
                  <span className="rounded-full bg-[#273629] px-2 py-1 text-[9px] text-[#9daf9c]">
                    {item.platform}
                  </span>
                </div>
                <h3 className="mt-4 line-clamp-2 text-xs font-semibold text-[#e2ece0]">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-3 whitespace-pre-line text-[10px] leading-4 text-[#7e8d80]">
                  {item.text}
                </p>
                <div className="mt-4 flex items-center gap-1.5 border-t border-[#2a382d] pt-3 text-[9px] text-[#748174]">
                  <Check className="h-3 w-3 text-[#c7f36b]" /> pronto para
                  revisão
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Wizard({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const [step, setStep] = useState(1);
  const [profileType, setProfileType] = useState('creator');
  const [name, setName] = useState('');
  const [niche, setNiche] = useState('');
  const [preset, setPreset] = useState(0);
  const steps = ['Essencial', 'Posicionamento', 'Estilo', 'Resumo'];
  const canContinue = step === 1 ? name.trim().length > 2 : true;
  return (
    <div className="mx-auto max-w-[1080px] p-5 lg:p-10">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-xs text-[#7d8b7e] hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Voltar para perfis
      </button>
      <div className="grid gap-10 lg:grid-cols-[.3fr_1fr]">
        <div>
          <p className="eyebrow">Novo perfil</p>
          <h1 className="page-title mt-3 max-w-[260px]">
            Vamos dar forma ao que você faz.
          </h1>
          <div className="mt-9 space-y-4">
            {steps.map((label, index) => {
              const number = index + 1;
              return (
                <div
                  key={label}
                  className={`flex items-center gap-3 ${number === step ? 'text-white' : number < step ? 'text-[#c7f36b]' : 'text-[#657166]'}`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[10px] ${number === step ? 'border-[#c7f36b] bg-[#1b291b] text-[#c7f36b]' : number < step ? 'border-[#435943] bg-[#293b29]' : 'border-[#2b392e]'}`}
                  >
                    {number < step ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      `0${number}`
                    )}
                  </span>
                  <span className="text-xs font-medium">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
        <section className="rounded-[26px] border border-[#29362c] bg-[#111812] p-5 sm:p-8">
          <div className="flex items-center justify-between border-b border-[#253127] pb-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#6f7d70]">
                Passo 0{step} de 04
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-.04em] text-white">
                {
                  [
                    'Comece pelo essencial',
                    'Encontre o seu centro',
                    'Escolha um clima',
                    'Tudo pronto para gerar',
                  ][step - 1]
                }
              </h2>
            </div>
            <span className="font-mono text-[10px] text-[#829083]">
              rascunho salvo
            </span>
          </div>
          {step === 1 && (
            <div className="space-y-8 pt-8">
              <div>
                <p className="field-label">Você está criando para</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => setProfileType('creator')}
                    className={`select-card ${profileType === 'creator' ? 'select-card-active' : ''}`}
                  >
                    <span className="select-card-icon">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <span>
                      <strong>Minha marca pessoal</strong>
                      <small>Creator, especialista ou artista</small>
                    </span>
                    {profileType === 'creator' && (
                      <Check className="ml-auto h-4 w-4 text-[#c7f36b]" />
                    )}
                  </button>
                  <button
                    onClick={() => setProfileType('brand')}
                    className={`select-card ${profileType === 'brand' ? 'select-card-active' : ''}`}
                  >
                    <span className="select-card-icon select-card-icon-purple">
                      <LayoutGrid className="h-4 w-4" />
                    </span>
                    <span>
                      <strong>Uma marca</strong>
                      <small>Produto, negócio ou estúdio</small>
                    </span>
                    {profileType === 'brand' && (
                      <Check className="ml-auto h-4 w-4 text-[#c7f36b]" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="profile-name" className="field-label">
                  Como ela se chama?
                </label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ex.: Luma Vale"
                  className="mt-3 h-12 rounded-xl border-[#344336] bg-[#172018] text-sm text-white placeholder:text-[#647265] focus-visible:ring-[#c7f36b]"
                />
                <p className="mt-2 text-[11px] text-[#6f7e70]">
                  Pode ser seu nome, @ ou o nome do projeto.
                </p>
              </div>
              <div>
                <label htmlFor="profile-niche" className="field-label">
                  Em uma frase, o que você faz?
                </label>
                <Textarea
                  id="profile-niche"
                  value={niche}
                  onChange={(event) => setNiche(event.target.value)}
                  placeholder="Ex.: Eu ajudo founders a deixar seus produtos mais fáceis de escolher."
                  className="mt-3 min-h-[104px] resize-none rounded-xl border-[#344336] bg-[#172018] text-sm text-white placeholder:text-[#647265] focus-visible:ring-[#c7f36b]"
                />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-8 pt-8">
              <div>
                <label htmlFor="audience" className="field-label">
                  Quem precisa encontrar você?
                </label>
                <Textarea
                  id="audience"
                  defaultValue="Pessoas criativas que querem comunicar melhor o valor do que fazem."
                  className="mt-3 min-h-[110px] resize-none rounded-xl border-[#344336] bg-[#172018] text-sm text-white focus-visible:ring-[#c7f36b]"
                />
              </div>
              <div>
                <p className="field-label">Como você quer soar?</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    'Próximo',
                    'Lúcido',
                    'Energizante',
                    'Generoso',
                    'Direto',
                    'Curioso',
                  ].map((tone, index) => (
                    <button
                      key={tone}
                      className={`tone-chip ${index < 3 ? 'tone-chip-active' : ''}`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="goal" className="field-label">
                  O que este perfil precisa fazer por você?
                </label>
                <Input
                  id="goal"
                  defaultValue="Ser lembrado por uma forma clara de pensar."
                  className="mt-3 h-12 rounded-xl border-[#344336] bg-[#172018] text-sm text-white focus-visible:ring-[#c7f36b]"
                />
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="pt-8">
              <div className="flex items-end justify-between">
                <div>
                  <p className="field-label">Direção visual</p>
                  <p className="mt-2 max-w-[470px] text-sm leading-6 text-[#89988a]">
                    Escolha um ponto de partida. Você pode ajustar tudo depois.
                  </p>
                </div>
                <span className="font-mono text-[10px] text-[#718071]">
                  3 presets
                </span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {presets.map((item, index) => (
                  <button
                    key={item.name}
                    onClick={() => setPreset(index)}
                    className={`preset-card ${preset === index ? 'preset-card-active' : ''}`}
                  >
                    <div
                      className="preset-swatch"
                      style={{
                        background: `linear-gradient(135deg, ${item.colors[0]} 0 32%, ${item.colors[1]} 32% 68%, ${item.colors[2]} 68%)`,
                      }}
                    />
                    <p className="mt-4 text-sm font-semibold text-white">
                      {item.name}
                    </p>
                    <p className="mt-2 text-[11px] leading-5 text-[#819082]">
                      {item.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex gap-1">
                        {item.colors.map((color) => (
                          <span
                            key={color}
                            className="h-3 w-3 rounded-full border border-white/10"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      {preset === index && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c7f36b] text-[#101710]">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-5 pt-8">
              <div className="rounded-2xl border border-[#354536] bg-[#182319] p-5">
                <div className="flex items-center gap-3">
                  <ProfileAvatar variant="luma" initial="LV" size="md" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {name || 'Seu novo perfil'}
                    </p>
                    <p className="text-xs text-[#8b998c]">
                      {profileType === 'creator' ? 'Marca pessoal' : 'Marca'} ·{' '}
                      {presets[preset].name}
                    </p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="summary-cell">
                    <span>Saída</span>
                    <strong>Bio + voz + tags</strong>
                  </div>
                  <div className="summary-cell">
                    <span>Canais</span>
                    <strong>Instagram · TikTok</strong>
                  </div>
                  <div className="summary-cell">
                    <span>Estimativa</span>
                    <strong className="text-[#c7f36b]">30 créditos</strong>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-[#314030] bg-[#131b14] p-4">
                <Zap className="mt-0.5 h-4 w-4 shrink-0 text-[#c7f36b]" />
                <p className="text-xs leading-5 text-[#91a092]">
                  Você poderá revisar cada bloco, regenerar somente o que quiser
                  e salvar quantas versões precisar.
                </p>
              </div>
            </div>
          )}
          <div className="mt-9 flex items-center justify-between border-t border-[#253127] pt-5">
            <button
              onClick={() => (step > 1 ? setStep(step - 1) : onBack())}
              className="flex items-center gap-2 text-xs font-medium text-[#849184] hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Anterior
            </button>
            {step < 4 ? (
              <AccentButton
                onClick={() => canContinue && setStep(step + 1)}
                className={!canContinue ? 'cursor-not-allowed opacity-40' : ''}
              >
                Continuar <ArrowRight className="ml-2 h-4 w-4" />
              </AccentButton>
            ) : (
              <AccentButton onClick={onComplete}>
                <Sparkles className="mr-2 h-4 w-4" /> Gerar perfil · 30 créditos
              </AccentButton>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function Result({ onBack }: { onBack: () => void }) {
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved] = useState(false);
  const copyBio = async () => {
    setCopied(true);
    try {
      await navigator.clipboard?.writeText(
        'Design que cabe na vida real. Ideias sobre criar com presença, intenção e um pouco menos de ruído.',
      );
    } catch {
      /* clipboard can be unavailable in preview */
    }
    setTimeout(() => setCopied(false), 1800);
  };
  const regenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 1300);
  };
  return (
    <div className="mx-auto max-w-[1400px] p-5 lg:p-9">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <button
            onClick={onBack}
            className="mb-4 flex items-center gap-2 text-xs text-[#7d8b7e] hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Todos os perfis
          </button>
          <div className="flex items-center gap-3">
            <ProfileAvatar variant="luma" initial="LV" size="md" />
            <div>
              <p className="eyebrow">Perfil gerado</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-[-.05em] text-white">
                Luma Vale
              </h1>
            </div>
            <Badge className="ml-1 rounded-full border border-[#40553f] bg-[#1e2e1f] text-[10px] text-[#c7f36b]">
              <Check className="mr-1 h-3 w-3" /> salvo
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={copyBio} className="secondary-action">
            <Copy className="mr-2 h-3.5 w-3.5" />{' '}
            {copied ? 'Copiado' : 'Copiar bio'}
          </button>
          <button onClick={() => setSaved(true)} className="secondary-action">
            <Check className="mr-2 h-3.5 w-3.5" />{' '}
            {saved ? 'Versão salva' : 'Salvar versão'}
          </button>
          <AccentButton className="hidden sm:flex">
            <Download className="mr-2 h-3.5 w-3.5" /> Exportar
          </AccentButton>
          <button
            className="rounded-xl border border-[#2a382d] p-2.5 text-[#819083] hover:bg-[#182118] hover:text-white"
            aria-label="Mais opções"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-9 grid gap-5 xl:grid-cols-[.7fr_1fr_.7fr]">
        <section className="order-2 space-y-4 xl:order-1">
          <div className="panel">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Blocos de voz</p>
                <h2 className="mt-2 section-title">Edite por partes</h2>
              </div>
              <span className="font-mono text-[9px] text-[#718071]">
                4 / 4 prontos
              </span>
            </div>
            <div className="mt-5 space-y-2">
              {[
                ['Nome', 'Luma Vale'],
                ['Posicionamento', 'Design que cabe na vida real.'],
                [
                  'Bio',
                  'Ideias sobre criar com presença, intenção e um pouco menos de ruído.',
                ],
                ['Tags', 'design systems · slow growth'],
              ].map(([label, content], index) => (
                <div key={label} className="edit-block">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-[.12em] text-[#758276]">
                      {label}
                    </span>
                    <button className="text-[10px] text-[#728172] hover:text-[#c7f36b]">
                      Editar
                    </button>
                  </div>
                  <p
                    className={`mt-2 text-xs leading-5 ${index === 1 ? 'font-medium text-[#e3ede0]' : 'text-[#a0aea1]'}`}
                  >
                    {content}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="panel">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Imagem de perfil</p>
                <h2 className="mt-2 section-title">Avatar gerado</h2>
              </div>
              <ImagePlus className="h-4 w-4 text-[#758276]" />
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#2a392d] bg-[#161e17] p-3">
              <ProfileAvatar variant="luma" initial="LV" size="lg" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-white">
                  luma-avatar-v01.png
                </p>
                <p className="mt-1 truncate font-mono text-[9px] text-[#738175]">
                  1024 × 1024 · 1.2 MB
                </p>
              </div>
              <button
                className="ml-auto rounded-lg p-2 text-[#748175] hover:text-white"
                aria-label="Baixar avatar"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              onClick={regenerate}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#3a4d38] py-2.5 text-xs font-medium text-[#c7f36b] hover:bg-[#1b291c]"
            >
              {generating ? (
                <>
                  <span className="spinner" /> Gerando novo avatar...
                </>
              ) : (
                <>
                  <WandSparkles className="h-3.5 w-3.5" /> Regenerar · 12
                  créditos
                </>
              )}
            </button>
          </div>
        </section>
        <section className="order-1 rounded-[26px] border border-[#2b382d] bg-[#151d16] p-5 sm:p-8 xl:order-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Preview ao vivo</p>
              <div className="mt-2 flex items-center gap-2">
                <button className="platform-tab platform-tab-active">
                  Instagram
                </button>
                <button className="platform-tab">TikTok</button>
                <button className="platform-tab">YouTube</button>
              </div>
            </div>
            <button
              className="rounded-lg p-2 text-[#718071] hover:bg-[#202c21] hover:text-white"
              aria-label="Abrir preview em tela cheia"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="preview-stage mt-6">
            <div className="phone-preview">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-[#6d786e]">
                  9:41
                </span>
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#263328]" />
                  <span className="h-1.5 w-2 rounded-full bg-[#263328]" />
                </span>
              </div>
              <div className="mt-10 flex flex-col items-center text-center">
                <ProfileAvatar variant="luma" initial="LV" size="xl" />
                <h3 className="mt-4 text-[15px] font-semibold text-[#19221a]">
                  Luma Vale
                </h3>
                <p className="mt-1 text-[10px] text-[#758176]">@lumavale</p>
                <p className="mt-6 max-w-[210px] text-[20px] font-semibold leading-[1.02] tracking-[-.06em] text-[#19221a]">
                  Design que cabe na vida real.
                </p>
                <p className="mt-3 max-w-[220px] text-[10px] leading-4 text-[#647064]">
                  Ideias sobre criar com presença, intenção e um pouco menos de
                  ruído.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-1.5">
                  <span className="rounded-full bg-[#d7e6cf] px-2.5 py-1 text-[9px] font-medium text-[#40513f]">
                    design systems
                  </span>
                  <span className="rounded-full bg-[#d7e6cf] px-2.5 py-1 text-[9px] font-medium text-[#40513f]">
                    slow growth
                  </span>
                </div>
              </div>
              <div className="mt-10 flex items-center justify-center gap-5 border-t border-[#d3dfcf] pt-4 text-[9px] text-[#697669]">
                <span>
                  <strong className="block text-[13px] text-[#1b251c]">
                    12.4k
                  </strong>
                  seguidores
                </span>
                <span>
                  <strong className="block text-[13px] text-[#1b251c]">
                    248
                  </strong>
                  seguindo
                </span>
                <span>
                  <strong className="block text-[13px] text-[#1b251c]">
                    86
                  </strong>
                  posts
                </span>
              </div>
            </div>
          </div>
        </section>
        <section className="order-3 space-y-4">
          <div className="panel">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Distribuição</p>
                <h2 className="mt-2 section-title">Pronto para sair</h2>
              </div>
              <Check className="h-4 w-4 text-[#c7f36b]" />
            </div>
            <div className="mt-5 space-y-4">
              {[
                ['Instagram', '100%'],
                ['TikTok', '86%'],
                ['YouTube', '74%'],
              ].map(([platform, value]) => (
                <div key={platform}>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#adb9ad]">{platform}</span>
                    <span className="font-mono text-[#c7f36b]">{value}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#2a382b]">
                    <div
                      className="h-full rounded-full bg-[#c7f36b]"
                      style={{ width: value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel border-[#394a37] bg-[#172119]">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#c7f36b]" />
              <p className="text-xs font-semibold text-white">
                Compartilhar resultado
              </p>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-[#839184]">
              Crie um link somente leitura para revisar com alguém.
            </p>
            <button className="mt-4 w-full rounded-xl border border-[#3b5239] py-2.5 text-xs font-semibold text-[#c7f36b] hover:bg-[#223122]">
              Gerar link
            </button>
          </div>
          <output
            className="flex items-center gap-2 rounded-xl border border-[#2a382d] bg-[#121912] p-3 text-[10px] leading-4 text-[#7e8b7e]"
            aria-live="polite"
          >
            <Heart className="h-3.5 w-3.5 shrink-0 text-[#f69d8a]" /> Este
            perfil tem uma voz consistente e reconhecível.
          </output>
        </section>
      </div>
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<View>('landing');
  const [toast, setToast] = useState('');
  const navigate = (next: View) => {
    setView(next);
    if (next === 'result') {
      setToast('Perfil gerado com sucesso.');
      setTimeout(() => setToast(''), 2600);
    }
  };
  useEffect(() => {
    const modelContext = (
      document as Document & {
        modelContext?: {
          registerTool: (
            tool: {
              name: string;
              title?: string;
              description: string;
              inputSchema: Record<string, unknown>;
              annotations?: Record<string, boolean>;
              execute: (input: unknown) => unknown;
            },
            options?: { signal?: AbortSignal },
          ) => void;
        };
      }
    ).modelContext;
    if (!modelContext?.registerTool) return;
    const lifecycle = new AbortController();
    modelContext.registerTool(
      {
        name: 'start_profile_creation',
        title: 'Iniciar criação de perfil',
        description:
          'Abre o briefing para criar um novo perfil social no PersonaForge.',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute: () => {
          setView('wizard');
          return { status: 'ready', view: 'wizard' };
        },
      },
      { signal: lifecycle.signal },
    );
    modelContext.registerTool(
      {
        name: 'complete_profile_generation',
        title: 'Gerar perfil social',
        description:
          'Conclui a geração do perfil social depois que o nome do perfil foi definido.',
        inputSchema: {
          type: 'object',
          properties: { profileName: { type: 'string', minLength: 3 } },
          required: ['profileName'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute: (input) => {
          const profileName =
            typeof input === 'object' &&
            input !== null &&
            'profileName' in input
              ? String((input as { profileName: unknown }).profileName).trim()
              : '';
          if (profileName.length < 3)
            throw new Error(
              'Informe um nome de perfil com pelo menos 3 caracteres.',
            );
          setView('result');
          return {
            status: 'generated',
            profileName,
            creditsUsed: 30,
            view: 'result',
          };
        },
      },
      { signal: lifecycle.signal },
    );
    modelContext.registerTool(
      {
        name: 'read_profile_workspace_state',
        title: 'Ler estado do workspace',
        description:
          'Lê o estado resumido e não sensível do workspace PersonaForge.',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute: () => ({ view, profileCount: 3, creditsRemaining: 124 }),
      },
      { signal: lifecycle.signal },
    );
    modelContext.registerTool(
      {
        name: 'start_social_post_creation',
        title: 'Criar publicação para redes sociais',
        description:
          'Abre o Content Engine para gerar uma publicação social com briefing, variações e fila automática.',
        inputSchema: {
          type: 'object',
          properties: {
            topic: { type: 'string', minLength: 3 },
            platform: {
              type: 'string',
              enum: ['Instagram', 'TikTok', 'LinkedIn'],
            },
          },
          required: ['topic'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute: (input) => {
          const data =
            typeof input === 'object' && input !== null
              ? (input as { topic?: unknown; platform?: unknown })
              : {};
          const topic = typeof data.topic === 'string' ? data.topic.trim() : '';
          if (topic.length < 3)
            throw new Error('Informe um tema com pelo menos 3 caracteres.');
          setView('content');
          return {
            status: 'ready',
            view: 'content',
            topic,
            platform: data.platform ?? 'Instagram',
          };
        },
      },
      { signal: lifecycle.signal },
    );
    return () => lifecycle.abort();
  }, [view]);
  const content =
    view === 'content' ? (
      <ContentStudio onBack={() => navigate('dashboard')} />
    ) : view === 'wizard' ? (
      <Wizard
        onBack={() => navigate('dashboard')}
        onComplete={() => navigate('result')}
      />
    ) : view === 'result' ? (
      <Result onBack={() => navigate('dashboard')} />
    ) : (
      <Dashboard
        onNew={() => navigate('wizard')}
        onProfile={() => navigate('result')}
        onContent={() => navigate('content')}
      />
    );
  if (view === 'landing')
    return <Landing onOpen={() => navigate('dashboard')} />;
  return (
    <>
      <AppShell view={view} onNavigate={navigate}>
        {content}
      </AppShell>
      {toast && (
        <output className="toast-message" aria-live="polite">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c7f36b] text-[#101710]">
            <Check className="h-3.5 w-3.5" />
          </span>
          {toast}
        </output>
      )}
    </>
  );
}
