import { FormEvent, useState } from 'react';
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Database,
  Mail,
  MessageSquareText,
  Send,
  Sparkles,
  UserRound
} from 'lucide-react';

type Message = {
  id: number;
  sender: 'lead' | 'bot' | 'system';
  text: string;
};

type LeadStage = 'nuevo' | 'calificando' | 'cualificado' | 'agendado';

const initialMessages: Message[] = [
  {
    id: 1,
    sender: 'lead',
    text: 'Hola, tengo una empresa de reformas y estoy perdiendo clientes porque respondo tarde los mensajes.'
  },
  {
    id: 2,
    sender: 'bot',
    text: 'Perfecto. Te hago 3 preguntas rápidas para entender si necesitas automatizar captación, agenda o seguimiento.'
  }
];

const quickReplies = [
  {
    label: 'Recibo leads por Instagram y web',
    bot: 'Entonces el primer punto es centralizar las entradas y responder en segundos, aunque tú no estés disponible.',
    score: 18,
    stage: 'calificando' as LeadStage,
    log: 'Origen detectado: Instagram + formulario web'
  },
  {
    label: 'Tardo horas en responder',
    bot: 'Eso suele costar oportunidades. Podemos montar un flujo que responda, pregunte presupuesto, zona y urgencia, y te deje el lead ordenado.',
    score: 24,
    stage: 'cualificado' as LeadStage,
    log: 'Dolor principal detectado: respuesta lenta'
  },
  {
    label: 'Quiero que se agenden solos',
    bot: 'Tiene sentido. El bot puede filtrar el caso, proponer horarios y crear una cita o tarea comercial automáticamente.',
    score: 28,
    stage: 'agendado' as LeadStage,
    log: 'Acción sugerida: crear cita y tarea comercial'
  }
];

const automationSteps = [
  { label: 'Captura lead', icon: MessageSquareText },
  { label: 'Clasifica intención', icon: Sparkles },
  { label: 'Guarda en CRM', icon: Database },
  { label: 'Envía resumen', icon: Mail },
  { label: 'Agenda seguimiento', icon: CalendarCheck }
];

function stageLabel(stage: LeadStage) {
  const labels: Record<LeadStage, string> = {
    nuevo: 'Nuevo',
    calificando: 'Calificando',
    cualificado: 'Cualificado',
    agendado: 'Seguimiento agendado'
  };

  return labels[stage];
}

export function AutomationChatbot() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [leadScore, setLeadScore] = useState(42);
  const [stage, setStage] = useState<LeadStage>('nuevo');
  const [activeSteps, setActiveSteps] = useState(1);
  const [log, setLog] = useState<string[]>(['Lead creado desde conversación entrante']);
  const [input, setInput] = useState('');

  function addExchange(userText: string, botText: string, scoreBoost: number, nextStage: LeadStage, logItem: string) {
    setMessages((current) => [
      ...current,
      { id: current.length + 1, sender: 'lead', text: userText },
      { id: current.length + 2, sender: 'bot', text: botText }
    ]);
    setLeadScore((current) => Math.min(100, current + scoreBoost));
    setStage(nextStage);
    setActiveSteps((current) => Math.min(automationSteps.length, current + 1));
    setLog((current) => [logItem, ...current].slice(0, 5));
  }

  function handleQuickReply(reply: (typeof quickReplies)[number]) {
    addExchange(reply.label, reply.bot, reply.score, reply.stage, reply.log);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      return;
    }

    addExchange(
      trimmedInput,
      'Lo tengo. Lo registraría como contexto del lead, actualizaría el resumen y avisaría al equipo con la prioridad recomendada.',
      12,
      leadScore > 70 ? 'cualificado' : 'calificando',
      'Mensaje libre añadido al resumen del lead'
    );
    setInput('');
  }

  function resetDemo() {
    setMessages(initialMessages);
    setLeadScore(42);
    setStage('nuevo');
    setActiveSteps(1);
    setLog(['Lead creado desde conversación entrante']);
    setInput('');
  }

  return (
    <div className="min-h-screen bg-[#070707] text-zinc-100">
      <main className="mx-auto grid min-h-screen w-full max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[380px_1fr]">
        <aside className="flex min-h-[540px] flex-col rounded-lg border border-zinc-800 bg-black">
          <div className="border-b border-zinc-800 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">Demo automatización</p>
                <h1 className="mt-2 text-2xl font-semibold tracking-normal text-white">Chatbot que cualifica leads</h1>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-300">
                <Bot className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              Simula una conversación real: el bot pregunta, puntúa el lead, actualiza CRM y prepara seguimiento.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 border-b border-zinc-800 p-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
              <p className="text-xs text-zinc-500">Estado</p>
              <p className="mt-1 text-sm font-semibold text-white">{stageLabel(stage)}</p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
              <p className="text-xs text-zinc-500">Score</p>
              <p className="mt-1 text-sm font-semibold text-emerald-300">{leadScore}/100</p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'lead' ? 'justify-start' : 'justify-end'}`}
              >
                {message.sender === 'lead' && (
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-zinc-400">
                    <UserRound className="h-4 w-4" />
                  </span>
                )}
                <p
                  className={`max-w-[82%] rounded-lg px-4 py-3 text-sm leading-6 ${
                    message.sender === 'lead'
                      ? 'bg-zinc-900 text-zinc-200'
                      : 'bg-emerald-500/10 text-emerald-100 ring-1 ring-emerald-500/20'
                  }`}
                >
                  {message.text}
                </p>
                {message.sender === 'bot' && (
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-300">
                    <Bot className="h-4 w-4" />
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-800 p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <button
                  key={reply.label}
                  type="button"
                  onClick={() => handleQuickReply(reply)}
                  className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-left text-xs text-zinc-300 transition hover:border-emerald-500/40 hover:text-white"
                >
                  {reply.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Escribe una respuesta del lead"
                className="h-11 min-w-0 flex-1 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-white outline-none transition focus:border-emerald-500/40"
              />
              <button
                type="submit"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-emerald-500 text-black transition hover:bg-emerald-400"
                aria-label="Enviar respuesta"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </aside>

        <section className="grid gap-5 lg:grid-rows-[auto_1fr]">
          <div className="grid gap-5 md:grid-cols-3">
            <Metric label="Respuesta automática" value="< 3s" />
            <Metric label="Lead score" value={`${leadScore}%`} />
            <Metric label="Estado CRM" value={stageLabel(stage)} />
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-lg border border-zinc-800 bg-black p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">Pipeline</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Automatización en ejecución</h2>
                </div>
                <button
                  type="button"
                  onClick={resetDemo}
                  className="rounded-md border border-zinc-800 px-3 py-2 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
                >
                  Reiniciar
                </button>
              </div>

              <div className="mt-8 space-y-4">
                {automationSteps.map((step, index) => {
                  const Icon = step.icon;
                  const active = index < activeSteps;

                  return (
                    <div key={step.label} className="flex items-center gap-4">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border ${
                          active
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                            : 'border-zinc-800 bg-zinc-950 text-zinc-600'
                        }`}
                      >
                        {active ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className={`text-sm font-medium ${active ? 'text-white' : 'text-zinc-500'}`}>
                            {step.label}
                          </p>
                          <span className="text-xs text-zinc-500">{active ? 'completado' : 'pendiente'}</span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-900">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              active ? 'w-full bg-emerald-400' : 'w-0 bg-zinc-700'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-5">
              <div className="rounded-lg border border-zinc-800 bg-black p-5">
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">Ficha CRM</p>
                <div className="mt-5 space-y-4">
                  <CrmRow label="Nombre" value="Lead reformas Madrid" />
                  <CrmRow label="Origen" value="Instagram + web" />
                  <CrmRow label="Necesidad" value="Responder antes y agendar visitas" />
                  <CrmRow label="Prioridad" value={leadScore >= 70 ? 'Alta' : 'Media'} />
                  <CrmRow label="Siguiente acción" value={stage === 'agendado' ? 'Crear cita comercial' : 'Enviar resumen al equipo'} />
                </div>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-black p-5">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-zinc-500" />
                  <p className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">Registro</p>
                </div>
                <div className="mt-4 space-y-3">
                  {log.map((item) => (
                    <div key={item} className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="/contacto?service=automatizaciones-e-ia&problem=Quiero%20un%20chatbot%20o%20automatizacion%20de%20leads"
                className="flex items-center justify-between rounded-lg bg-white px-5 py-4 font-semibold text-black transition hover:bg-zinc-200"
              >
                Llevar esta automatización a mi negocio
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-black p-5">
      <p className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

function CrmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-zinc-900 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-zinc-500">{label}</span>
      <span className="max-w-[62%] text-right text-sm font-medium text-zinc-200">{value}</span>
    </div>
  );
}
