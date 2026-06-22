import { startTransition, useEffect, useMemo, useState } from 'react';
import type { ComponentType, ReactNode } from 'react';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Database,
  Mail,
  MessageSquareText,
  Play,
  RefreshCw,
  Route,
  ScanSearch,
  Send,
  ShieldAlert,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

type ScenarioId = 'leads' | 'incidents' | 'csv';
type Destination = 'Ventas' | 'Soporte' | 'Finanzas' | 'Operaciones';
type RunStatus = 'idle' | 'processing' | 'done';

type InputItem = {
  id: string;
  source: string;
  company: string;
  contact: string;
  payload: string;
  amount?: number;
  priority: 'Alta' | 'Media' | 'Baja';
  destination: Destination;
  action: string;
  intent: string;
};

type Scenario = {
  id: ScenarioId;
  title: string;
  subtitle: string;
  problem: string;
  inputLabel: string;
  outputLabel: string;
  impact: string;
  assistantPrompt: string;
  sampleInput: string;
  items: InputItem[];
};

type ActivityItem = {
  id: string;
  title: string;
  meta: string;
  tone: 'neutral' | 'info' | 'success';
};

const scenarios: Scenario[] = [
  {
    id: 'leads',
    title: 'Leads sin seguimiento',
    subtitle: 'Formulario, email e Instagram entrando por separado',
    problem: 'El equipo tarda horas en contestar y nadie sabe que oportunidad merece prioridad comercial.',
    inputLabel: 'Mensajes web, email e Instagram',
    outputLabel: 'Lead score, resumen y tarea comercial',
    impact: 'Reduce tiempo de respuesta y evita que las oportunidades buenas se queden en una cola opaca.',
    assistantPrompt: 'Leo intencion, presupuesto, urgencia y canal para decidir si esto va a ventas o a una cola operativa.',
    sampleInput:
      'Web: "Necesito presupuesto esta semana para automatizar seguimiento de clientes"\nInstagram: "¿Podeis integrar formularios, WhatsApp y CRM?"\nEmail: "Tenemos 3 comerciales y estamos perdiendo leads por respuesta lenta"',
    items: [
      {
        id: 'lead-1',
        source: 'Formulario web',
        company: 'Reformas Norte',
        contact: 'Lucia Gomez',
        payload: 'Necesito presupuesto esta semana para automatizar seguimiento de clientes.',
        amount: 8200,
        priority: 'Alta',
        destination: 'Ventas',
        action: 'Crear oportunidad, asignar llamada y avisar en Slack.',
        intent: 'Presupuesto urgente con intencion comercial clara',
      },
      {
        id: 'lead-2',
        source: 'Instagram',
        company: 'Clinica Lumen',
        contact: 'David Serra',
        payload: '¿Podeis integrar formularios, WhatsApp y CRM sin cambiar el sistema actual?',
        amount: 4600,
        priority: 'Media',
        destination: 'Ventas',
        action: 'Responder, pedir contexto y abrir oportunidad cualificada.',
        intent: 'Consulta comercial con dependencia de integracion',
      },
      {
        id: 'lead-3',
        source: 'Email',
        company: 'Hotel Arce',
        contact: 'Marta Prat',
        payload: 'Estamos perdiendo leads por tardar en responder fuera de horario.',
        amount: 5200,
        priority: 'Alta',
        destination: 'Operaciones',
        action: 'Crear diagnostico operativo y preparar propuesta automatizada.',
        intent: 'Dolor operativo con impacto directo en ventas',
      },
    ],
  },
  {
    id: 'incidents',
    title: 'Incidencias mezcladas con pedidos',
    subtitle: 'Soporte, pedidos y facturacion viviendo en la misma bandeja',
    problem: 'Todo entra por email y el equipo pierde tiempo reenviando, aclarando y persiguiendo al responsable correcto.',
    inputLabel: 'Correos, incidencias y mensajes de clientes',
    outputLabel: 'Ruta operativa, prioridad y siguiente responsable',
    impact: 'Ahorra reenvios manuales y evita que incidencias sensibles se queden sin contexto.',
    assistantPrompt: 'Detecto si el mensaje es queja, soporte, pedido o facturacion para enrutarlo con contexto y urgencia.',
    sampleInput:
      'Email: "Pedido duplicado y error de stock en ERP"\nEmail: "Cancelacion y posible reclamacion por cargos"\nEmail: "Necesito copia de facturas pendientes"',
    items: [
      {
        id: 'incident-1',
        source: 'Email',
        company: 'Distribuciones Soler',
        contact: 'Ivan Soler',
        payload: 'Pedido duplicado y error de stock en ERP. Cliente molesto.',
        priority: 'Alta',
        destination: 'Operaciones',
        action: 'Abrir incidencia critica y notificar al responsable de pedidos.',
        intent: 'Incidencia operativa con impacto en servicio',
      },
      {
        id: 'incident-2',
        source: 'Email',
        company: 'Obra10',
        contact: 'Andres Mora',
        payload: 'Cancelacion de servicio y posible reclamacion por cargos.',
        priority: 'Alta',
        destination: 'Finanzas',
        action: 'Escalar a facturacion y crear alerta de churn/riesgo.',
        intent: 'Riesgo financiero y de retencion',
      },
      {
        id: 'incident-3',
        source: 'Email',
        company: 'Taller Norte',
        contact: 'Carlos Ruiz',
        payload: 'Necesito copia de facturas pendientes y estado de cobros.',
        priority: 'Media',
        destination: 'Finanzas',
        action: 'Preparar resumen de facturas y tarea para administracion.',
        intent: 'Consulta de cobro y documentacion',
      },
    ],
  },
  {
    id: 'csv',
    title: 'CSV y exportaciones operativas',
    subtitle: 'Un lote con leads, incidencias y solicitudes mezcladas',
    problem: 'Nadie quiere revisar fila por fila un CSV para decidir que va a ventas, soporte o facturacion.',
    inputLabel: 'CSV / exportaciones periodicas',
    outputLabel: 'Clasificacion, prioridad y acciones por lote',
    impact: 'Convierte un archivo plano en una cola priorizada y en tareas claras para el equipo.',
    assistantPrompt: 'Limpio el lote, leo el contenido de cada fila y preparo ruta, prioridad y accion visible.',
    sampleInput:
      'CSV: empresa, canal, mensaje, importe\nReformas Luna, web, presupuesto urgente para seguimiento, 8500\nTaller Norte, email, 120 facturas por revisar, 4200\nDistribuciones Soler, csv, pedido duplicado y queja, 1800',
    items: [
      {
        id: 'csv-1',
        source: 'CSV semanal',
        company: 'Reformas Luna',
        contact: 'Laura Gomez',
        payload: 'Presupuesto urgente para automatizar seguimiento de clientes.',
        amount: 8500,
        priority: 'Alta',
        destination: 'Ventas',
        action: 'Crear oportunidad de alto valor y respuesta prioritaria.',
        intent: 'Nueva demanda comercial con potencial alto',
      },
      {
        id: 'csv-2',
        source: 'CSV semanal',
        company: 'Taller Norte',
        contact: 'Carlos Ruiz',
        payload: '120 facturas pendientes por revisar y clasificar.',
        amount: 4200,
        priority: 'Media',
        destination: 'Finanzas',
        action: 'Generar lote para administracion con resumen de facturas.',
        intent: 'Trabajo administrativo repetitivo',
      },
      {
        id: 'csv-3',
        source: 'CSV semanal',
        company: 'Distribuciones Soler',
        contact: 'Ivan Soler',
        payload: 'Pedido duplicado y queja por error de stock.',
        amount: 1800,
        priority: 'Alta',
        destination: 'Operaciones',
        action: 'Crear incidencia prioritaria y resumen de contexto.',
        intent: 'Incidencia operativa urgente',
      },
    ],
  },
];

const stageCopy = [
  { key: 'ingest', label: 'Entra', description: 'Normaliza canales y lote', icon: Mail },
  { key: 'interpret', label: 'Interpreta', description: 'Lee intencion, importe y urgencia', icon: ScanSearch },
  { key: 'route', label: 'Decide', description: 'Elige destino, prioridad y responsable', icon: Route },
  { key: 'action', label: 'Actua', description: 'Crea resumen, tarea y actualizacion', icon: Workflow },
] as const;

export function LeadToOpsCommandCenter() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>('leads');
  const [selectedItemId, setSelectedItemId] = useState('lead-1');
  const [runStatus, setRunStatus] = useState<RunStatus>('idle');
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [activity, setActivity] = useState<ActivityItem[]>([
    { id: 'activity-1', title: 'Flujo listo para clasificar entradas.', meta: 'Motor de automatizacion', tone: 'info' },
    { id: 'activity-2', title: 'Plantillas de salida preparadas para CRM y equipo.', meta: 'Salida visible', tone: 'neutral' },
    { id: 'activity-3', title: 'Reglas de prioridad cargadas por destino y urgencia.', meta: 'Decision engine', tone: 'neutral' },
  ]);

  const scenario = scenarios.find((item) => item.id === scenarioId) ?? scenarios[0];
  const selectedItem = scenario.items.find((item) => item.id === selectedItemId) ?? scenario.items[0];

  const metrics = useMemo(() => {
    const highPriority = scenario.items.filter((item) => item.priority === 'Alta').length;
    const routedToSales = scenario.items.filter((item) => item.destination === 'Ventas').length;
    const estimatedValue = scenario.items.reduce((sum, item) => sum + (item.amount ?? 0), 0);

    return {
      incoming: scenario.items.length,
      highPriority,
      routedToSales,
      estimatedValue,
    };
  }, [scenario]);

  useEffect(() => {
    trackEvent('demo_open', { demo: 'lead_to_ops' });
  }, []);

  useEffect(() => {
    if (runStatus !== 'processing') {
      return undefined;
    }

    if (activeStageIndex >= stageCopy.length - 1) {
      setRunStatus('done');
      setActivity((current) => [
        {
          id: `done-${Date.now()}`,
          title: `Salida creada para ${selectedItem.company}`,
          meta: `${selectedItem.destination} · ${selectedItem.action}`,
          tone: 'success' as const,
        },
        ...current,
      ].slice(0, 8));
      return undefined;
    }

    const nextStage = activeStageIndex + 1;
    const timer = window.setTimeout(() => {
      setActiveStageIndex(nextStage);
      setActivity((current) => [
        {
          id: `${scenario.id}-${nextStage}-${Date.now()}`,
          title: stageMessage(nextStage, selectedItem),
          meta: stageCopy[nextStage].label,
          tone: (nextStage === stageCopy.length - 1 ? 'success' : 'info') as ActivityItem['tone'],
        },
        ...current,
      ].slice(0, 8));
    }, 700);

    return () => window.clearTimeout(timer);
  }, [activeStageIndex, runStatus, scenario.id, selectedItem]);

  function switchScenario(nextScenarioId: ScenarioId) {
    startTransition(() => {
      const nextScenario = scenarios.find((item) => item.id === nextScenarioId) ?? scenarios[0];
      setScenarioId(nextScenarioId);
      setSelectedItemId(nextScenario.items[0]?.id ?? '');
      setRunStatus('idle');
      setActiveStageIndex(0);
      setActivity([
        {
          id: `scenario-${nextScenarioId}-1`,
          title: `Escenario cargado: ${nextScenario.title}`,
          meta: nextScenario.inputLabel,
          tone: 'info',
        },
        {
          id: `scenario-${nextScenarioId}-2`,
          title: 'Flujo listo para clasificar y enrutar.',
          meta: 'Motor de automatizacion',
          tone: 'neutral',
        },
        {
          id: `scenario-${nextScenarioId}-3`,
          title: 'La salida se enviara al equipo correcto con contexto.',
          meta: nextScenario.outputLabel,
          tone: 'neutral',
        },
      ]);
    });

    trackEvent('demo_module_change', { demo: 'lead_to_ops', scenario: nextScenarioId });
  }

  function selectItem(itemId: string) {
    setSelectedItemId(itemId);
    setRunStatus('idle');
    setActiveStageIndex(0);
    setActivity((current) => [
      {
        id: `select-${itemId}-${Date.now()}`,
        title: `Entrada abierta: ${itemId}`,
        meta: 'Contexto listo para decision',
        tone: 'info' as const,
      },
      ...current,
    ].slice(0, 8));
    trackEvent('demo_action_triggered', { demo: 'lead_to_ops', action: 'select_item', item: itemId });
  }

  function runAutomation() {
    setRunStatus('processing');
    setActiveStageIndex(0);
    setActivity([
      {
        id: `run-start-${Date.now()}`,
        title: `Entrada normalizada desde ${selectedItem.source}`,
        meta: stageCopy[0].label,
        tone: 'info' as const,
      },
      {
        id: `run-ready-${Date.now() + 1}`,
        title: `Preparando salida para ${selectedItem.destination.toLowerCase()}`,
        meta: 'Proceso visible',
        tone: 'neutral' as const,
      },
      ...activity,
    ].slice(0, 8));
    trackEvent('demo_action_triggered', { demo: 'lead_to_ops', action: 'run_automation', scenario: scenarioId });
  }

  function resetDemo() {
    setScenarioId('leads');
    setSelectedItemId(scenarios[0].items[0].id);
    setRunStatus('idle');
    setActiveStageIndex(0);
    setActivity([
      { id: 'activity-1', title: 'Flujo listo para clasificar entradas.', meta: 'Motor de automatizacion', tone: 'info' },
      { id: 'activity-2', title: 'Plantillas de salida preparadas para CRM y equipo.', meta: 'Salida visible', tone: 'neutral' },
      { id: 'activity-3', title: 'Reglas de prioridad cargadas por destino y urgencia.', meta: 'Decision engine', tone: 'neutral' },
    ]);
    trackEvent('demo_action_triggered', { demo: 'lead_to_ops', action: 'reset' });
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#090b0d] text-[#eef5f5]">
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_18%_6%,rgba(0,245,255,0.12),transparent_30%),radial-gradient(circle_at_80%_2%,rgba(16,185,129,0.10),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent)]" />
      <main className="relative mx-auto grid w-full max-w-[1580px] gap-4 px-4 py-4 xl:grid-cols-[260px_minmax(0,1fr)_340px]">
        <aside className="overflow-hidden rounded-[30px] border border-white/8 bg-[#0d1215]">
          <div className="border-b border-white/8 px-5 py-5">
            <p className="text-xs font-mono uppercase tracking-[0.24em] text-cyan-300">Automatizacion operativa</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-white">Lead-to-Ops</h1>
            <p className="mt-3 text-sm leading-7 text-[#97a9ad]">
              Una sola demo para entender que entra, que decide el sistema y que sale hacia ventas, soporte o finanzas.
            </p>
          </div>

          <div className="space-y-3 px-4 py-4">
            {scenarios.map((item) => {
              const active = item.id === scenarioId;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => switchScenario(item.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    active
                      ? 'border-cyan-300/30 bg-cyan-400/10'
                      : 'border-white/8 bg-[#0b1013] hover:border-cyan-300/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <p className="text-lg font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#9ab0b4]">{item.subtitle}</p>
                </button>
              );
            })}
          </div>

          <div className="border-t border-white/8 px-4 py-4">
            <p className="text-xs font-mono uppercase tracking-[0.24em] text-[#708488]">Input realista</p>
            <pre className="mt-3 whitespace-pre-wrap rounded-2xl border border-white/8 bg-[#0b1013] p-4 text-xs leading-6 text-[#d8e4e6]">
              {scenario.sampleInput}
            </pre>
            <div className="mt-3 rounded-2xl border border-white/8 bg-[#0b1013] p-4">
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">Tecnologia a medida</p>
              <p className="mt-2 text-sm leading-6 text-[#a9bbbf]">
                No hacemos solo automatizacion: tambien producto digital, portales, paneles, integraciones, IA y software a medida.
              </p>
            </div>
          </div>
        </aside>

        <section className="min-w-0 space-y-4">
          <header className="overflow-hidden rounded-[32px] border border-white/8 bg-[#101518]">
            <div className="flex flex-col gap-4 border-b border-white/8 p-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-mono uppercase tracking-[0.24em] text-cyan-300">Entrada → criterio → accion</p>
                <h2 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight text-white md:text-5xl">
                  {scenario.title}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#a3b2b6] md:text-lg">
                  {scenario.problem}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 xl:justify-end">
                <button
                  type="button"
                  onClick={runAutomation}
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-semibold text-[#061014] shadow-[0_0_24px_rgba(0,245,255,0.35)] transition hover:bg-cyan-200 hover:shadow-[0_0_32px_rgba(0,245,255,0.5)]"
                >
                  <Play className="h-4 w-4" />
                  Procesar flujo
                </button>
                <button
                  type="button"
                  onClick={resetDemo}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm font-medium text-[#d6e1e3] transition hover:border-white/20 hover:text-white"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reiniciar
                </button>
                <a
                  href="/contacto?service=automatizaciones-e-ia&problem=Quiero%20automatizar%20entradas,%20clasificacion,%20rutas%20y%20acciones%20operativas"
                  onClick={() => trackEvent('demo_cta_click', { demo: 'lead_to_ops', location: 'header' })}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/10"
                >
                  Llevar esto a mi caso
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-4">
              <InsightCard label="Que entra" value={scenario.inputLabel} icon={Mail} />
              <InsightCard label="Que interpreta" value="Intencion, urgencia, importe y destino" icon={Sparkles} />
              <InsightCard label="Que decide" value={`${metrics.highPriority} prioridades altas y ${metrics.routedToSales} rutas a ventas`} icon={Route} />
              <InsightCard label="Que gana el cliente" value={scenario.impact} icon={CheckCircle2} />
            </div>
          </header>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)]">
            <div className="min-w-0 space-y-4">
              <div className={`grid gap-4 ${scenario.id === 'csv' ? 'grid-cols-1' : 'xl:grid-cols-2'}`}>
                <Panel title="Pipeline interactivo" eyebrow="Proceso visible">
                  {scenario.id === 'csv' ? (
                    <CsvAutomationFlow
                      items={scenario.items}
                      selectedItemId={selectedItemId}
                      onSelectItem={selectItem}
                      activeStageIndex={activeStageIndex}
                      runStatus={runStatus}
                    />
                  ) : (
                    <div className="grid gap-3">
                      {stageCopy.map((stage, index) => {
                        const Icon = stage.icon;
                        const active = index === activeStageIndex;
                        const complete = runStatus === 'done' ? index <= activeStageIndex : index < activeStageIndex;

                        return (
                          <div
                            key={stage.key}
                            className={`min-w-0 rounded-2xl border p-3 transition ${
                              active
                                ? 'border-cyan-300/30 bg-cyan-400/10 motion-safe:animate-pulse'
                                : complete
                                  ? 'border-emerald-400/18 bg-emerald-400/10'
                                  : 'border-white/8 bg-[#0b1013]'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-cyan-400/20' : complete ? 'bg-emerald-400/15' : 'bg-white/5'}`}>
                                <Icon className={`h-4 w-4 ${active ? 'text-cyan-200' : complete ? 'text-emerald-100' : 'text-[#7a9094]'}`} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">{stage.label}</p>
                                  <span className="text-xs text-white/60">—</span>
                                  <p className="break-words whitespace-normal text-xs font-semibold text-white">{stage.description}</p>
                                </div>
                                <p className="mt-1 text-xs leading-5 text-[#9ab0b4]" style={{ overflowWrap: 'anywhere' }}>
                                  {stage.key === 'ingest'
                                    ? scenario.inputLabel
                                    : stage.key === 'interpret'
                                      ? selectedItem.intent
                                      : stage.key === 'route'
                                        ? `Ruta recomendada: ${selectedItem.destination}`
                                        : selectedItem.action}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-4 rounded-2xl border border-white/8 bg-[#0b1013] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">Estado del run</p>
                        <p className="mt-2 text-lg font-semibold text-white">
                          {runStatus === 'processing'
                            ? `Procesando etapa ${activeStageIndex + 1} de ${stageCopy.length}`
                            : runStatus === 'done'
                              ? 'Flujo completado con salida visible'
                              : 'Listo para procesar'}
                        </p>
                      </div>
                      <div className="w-40">
                        <div className="h-2 rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-cyan-300"
                            style={{
                              width: `${runStatus === 'done' ? 100 : ((activeStageIndex + (runStatus === 'processing' ? 1 : 0)) / stageCopy.length) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Panel>

                <Panel title="Decision engine" eyebrow="Que criterio aplica">
                  <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                    <div className="flex items-center gap-2 text-cyan-200">
                      <Bot className="h-4 w-4" />
                      <p className="text-sm font-semibold">Asistente operativo</p>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-cyan-50">{scenario.assistantPrompt}</p>
                  </div>

                  <div className="mt-4 space-y-3 rounded-2xl border border-white/8 bg-[#0b1013] p-4">
                    <DecisionRow icon={MessageSquareText} label="Entrada elegida" value={selectedItem.source} />
                    <DecisionRow icon={ScanSearch} label="Lectura" value={selectedItem.intent} />
                    <DecisionRow icon={ShieldAlert} label="Prioridad" value={selectedItem.priority} />
                    <DecisionRow icon={Route} label="Ruta" value={selectedItem.destination} />
                    <DecisionRow icon={Database} label="Salida" value={selectedItem.action} />
                  </div>
                </Panel>
              </div>

              <Panel title="Operational board" eyebrow="Que esta procesando el sistema">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[740px] text-left">
                    <thead className="border-b border-white/8 text-xs uppercase tracking-[0.2em] text-[#708488]">
                      <tr>
                        <th className="px-4 py-3">Entrada</th>
                        <th className="px-4 py-3">Intento detectado</th>
                        <th className="px-4 py-3">Destino</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3">Accion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scenario.items.map((item) => {
                        const active = item.id === selectedItemId;
                        const itemStatus = runStatus === 'done' && active ? 'Hecho' : runStatus === 'processing' && active ? stageCopy[activeStageIndex].label : 'Listo';

                        return (
                          <tr
                            key={item.id}
                            onClick={() => selectItem(item.id)}
                            className={`cursor-pointer border-b border-white/5 transition last:border-0 ${
                              active ? 'bg-cyan-400/7' : 'hover:bg-white/[0.03]'
                            }`}
                          >
                            <td className="px-4 py-4">
                              <p className="font-semibold text-white">{item.source}</p>
                              <p className="mt-1 text-xs text-[#83979b]">{item.company}</p>
                            </td>
                            <td className="px-4 py-4 text-sm text-[#d5e0e2]">{item.intent}</td>
                            <td className="px-4 py-4">
                              <RouteBadge destination={item.destination} />
                            </td>
                            <td className="px-4 py-4">
                              <RunBadge label={itemStatus} status={active ? runStatus : 'idle'} />
                            </td>
                            <td className="px-4 py-4 text-sm text-[#97a9ad]">{item.action}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Panel>
            </div>

            <aside className="min-w-0 space-y-4">
              <Panel title="Resumen de negocio" eyebrow="Lo que ve el equipo">
                <div className="grid gap-3 sm:grid-cols-2">
                  <MiniMetric label="Entradas" value={String(metrics.incoming)} />
                  <MiniMetric label="Alta prioridad" value={String(metrics.highPriority)} />
                  <MiniMetric label="A ventas" value={String(metrics.routedToSales)} />
                  <MiniMetric label="Valor detectado" value={metrics.estimatedValue ? `${metrics.estimatedValue.toLocaleString('es-ES')}€` : 'N/A'} />
                </div>
              </Panel>

              <Panel title="Salida visible" eyebrow="Que recibe el negocio">
                <div className="space-y-3">
                  {[
                    `CRM actualizado para ${selectedItem.company}.`,
                    `Resumen listo para ${selectedItem.destination.toLowerCase()}.`,
                    'Tarea creada con contexto, prioridad y responsable.',
                    'Actividad guardada para seguimiento y auditoria.',
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/8 bg-[#0b1013] px-4 py-3 text-sm leading-6 text-[#d8e4e6]">
                      {item}
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Antes / despues" eyebrow="Porque se entiende mejor">
                <div className="space-y-3">
                  <OutcomeRow label="Antes" value="Mensajes mezclados y decisiones lentas, dependientes de una persona." tone="rose" />
                  <OutcomeRow label="Ahora" value="El sistema muestra entrada, criterio, ruta y accion sin esconder el proceso." tone="emerald" />
                  <OutcomeRow label="Impacto" value="El visitante entiende en segundos que entra, que decide y que sale." tone="cyan" />
                </div>
              </Panel>
            </aside>
          </div>
        </section>

        <aside className="min-w-0 space-y-4">
          <Panel title="Live run" eyebrow="Timeline del proceso">
            <ActivityFeed items={activity} />
          </Panel>

          <Panel title="Reglas aplicadas" eyebrow="Decision visible">
            <div className="space-y-3">
              <RuleCard label="Input" value={scenario.inputLabel} icon={Mail} />
              <RuleCard label="Lectura" value={selectedItem.intent} icon={Sparkles} />
              <RuleCard label="Ruta" value={selectedItem.destination} icon={Route} />
              <RuleCard label="Accion" value={selectedItem.action} icon={Send} />
            </div>
          </Panel>

          <a
            href="/contacto?service=automatizaciones-e-ia&problem=Quiero%20una%20automatizacion%20operativa%20que%20muestre%20entrada,%20decision%20y%20salida"
            onClick={() => trackEvent('demo_cta_click', { demo: 'lead_to_ops', location: 'sidebar' })}
            className="flex items-center justify-between rounded-[28px] border border-cyan-300/25 bg-cyan-400/10 px-5 py-4 text-white transition hover:bg-cyan-400/15"
          >
            <span>
              <span className="block text-sm font-semibold">Pedir diagnostico de automatizacion</span>
              <span className="mt-1 block text-xs text-cyan-100/75">Entrada, reglas, acciones e integracion</span>
            </span>
            <ArrowRight className="h-5 w-5" />
          </a>
        </aside>
      </main>
    </div>
  );
}

function stageMessage(stageIndex: number, item: InputItem) {
  if (stageIndex === 1) {
    return `Intento detectado: ${item.intent}`;
  }

  if (stageIndex === 2) {
    return `Ruta asignada a ${item.destination.toLowerCase()}`;
  }

  return `Salida preparada: ${item.action}`;
}

function CsvAutomationFlow({
  items,
  selectedItemId,
  onSelectItem,
  activeStageIndex,
  runStatus,
}: {
  items: InputItem[];
  selectedItemId: string;
  onSelectItem: (itemId: string) => void;
  activeStageIndex: number;
  runStatus: RunStatus;
}) {
  const grouped = items.reduce<Record<Destination, number>>(
    (accumulator, item) => {
      accumulator[item.destination] += 1;
      return accumulator;
    },
    { Ventas: 0, Soporte: 0, Finanzas: 0, Operaciones: 0 }
  );

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(240px,0.72fr)_minmax(0,0.92fr)]">
      <div className="min-w-0 rounded-2xl border border-white/8 bg-[#0b1013] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">CSV de entrada</p>
            <p className="mt-2 text-lg font-semibold text-white">Lote cargado y listo para interpretar</p>
          </div>
          <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
            {items.length} filas
          </span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="border-b border-white/8 text-xs uppercase tracking-[0.18em] text-[#708488]">
              <tr>
                <th className="px-3 py-3">Empresa</th>
                <th className="px-3 py-3">Canal</th>
                <th className="px-3 py-3">Mensaje</th>
                <th className="px-3 py-3">Importe</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const active = item.id === selectedItemId;
                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectItem(item.id)}
                    className={`cursor-pointer border-b border-white/5 transition last:border-0 ${
                      active ? 'bg-cyan-400/8' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <td className="px-3 py-3 font-medium text-white">{item.company}</td>
                    <td className="px-3 py-3 text-[#8ea3a7]">{item.source}</td>
                    <td className="px-3 py-3 text-[#cfdadc]">{item.payload}</td>
                    <td className="px-3 py-3 text-white">{item.amount ? `${item.amount.toLocaleString('es-ES')}€` : 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-[#0b1013] p-4">
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">Motor</p>
        <p className="mt-2 text-lg font-semibold text-white">Como se procesa</p>
        <div className="mt-4 space-y-3">
          {stageCopy.map((stage, index) => {
            const active = index === activeStageIndex;
            const complete = runStatus === 'done' ? index <= activeStageIndex : index < activeStageIndex;
            const Icon = stage.icon;
            return (
              <div key={stage.key} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${
                      active
                        ? 'border-cyan-300/30 bg-cyan-400/12 text-cyan-100 motion-safe:animate-pulse'
                        : complete
                          ? 'border-emerald-400/20 bg-emerald-400/12 text-emerald-100'
                          : 'border-white/8 bg-black/10 text-[#7a9094]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  {index < stageCopy.length - 1 ? <span className="my-1 h-8 w-px bg-white/10" /> : null}
                </div>
                <div className="min-w-0 pt-1">
                  <p className="text-sm font-semibold text-white">{stage.label}</p>
                  <p className="mt-1 text-sm leading-6 text-[#9ab0b4]">{stage.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-[#0b1013] p-4">
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">Salida por destino</p>
        <p className="mt-2 text-lg font-semibold text-white">Resultado del lote</p>
        <div className="mt-4 space-y-3">
          {(Object.entries(grouped) as Array<[Destination, number]>).map(([destination, total]) => (
            <div key={destination} className="rounded-2xl border border-white/8 bg-black/10 p-3">
              <div className="flex items-center justify-between gap-3">
                <RouteBadge destination={destination} />
                <span className="text-sm font-semibold text-white">{total}</span>
              </div>
              <p className="mt-2 text-sm text-[#a0b2b6]">
                {destination === 'Ventas'
                  ? 'Oportunidades y respuestas comerciales'
                  : destination === 'Finanzas'
                    ? 'Facturas, cobros y reclamaciones'
                    : destination === 'Operaciones'
                      ? 'Incidencias y cola operativa'
                      : 'Soporte y seguimiento al cliente'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InsightCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#0b1013] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">{label}</p>
        <Icon className="h-4 w-4 text-cyan-300" />
      </div>
      <p className="mt-3 text-sm leading-6 text-[#d8e4e6]">{value}</p>
    </div>
  );
}

function Panel({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-[28px] border border-white/8 bg-[#101518] p-5">
      <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#708488]">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-semibold leading-tight text-white">{title}</h2>
      <div className="mt-4 min-w-0">{children}</div>
    </section>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#0b1013] p-4">
      <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function DecisionRow({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-3 last:border-0 last:pb-0">
      <div className="flex min-w-0 items-center gap-2 text-[#8ea3a7]">
        <Icon className="h-4 w-4 shrink-0 text-cyan-300" />
        <span className="text-sm">{label}</span>
      </div>
      <p className="min-w-0 flex-1 text-right text-sm leading-6 text-white" style={{ overflowWrap: 'anywhere' }}>{value}</p>
    </div>
  );
}

function RuleCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#0b1013] p-4">
      <div className="flex items-center gap-2 text-cyan-200">
        <Icon className="h-4 w-4" />
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#8adfeb]">{label}</p>
      </div>
      <p className="mt-3 text-sm leading-6 text-[#d8e4e6]">{value}</p>
    </div>
  );
}

function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-2xl border border-white/8 bg-[#0b1013] px-4 py-3">
          <div className="flex items-start gap-3">
            <span className={`mt-1 h-2.5 w-2.5 rounded-full ${item.tone === 'success' ? 'bg-emerald-400' : item.tone === 'info' ? 'bg-cyan-300' : 'bg-white/35'}`} />
            <div className="min-w-0">
              <p className="text-sm leading-6 text-white">{item.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#708488]">{item.meta}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function OutcomeRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'rose' | 'emerald' | 'cyan';
}) {
  const palette =
    tone === 'rose'
      ? 'border-rose-400/20 bg-rose-400/10 text-rose-100'
      : tone === 'emerald'
        ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
        : 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100';

  return (
    <div className={`rounded-2xl border p-4 ${palette}`}>
      <p className="text-xs font-mono uppercase tracking-[0.18em] opacity-80">{label}</p>
      <p className="mt-2 text-sm leading-6">{value}</p>
    </div>
  );
}

function RouteBadge({ destination }: { destination: Destination }) {
  const palette =
    destination === 'Ventas'
      ? 'bg-cyan-400/15 text-cyan-100'
      : destination === 'Operaciones'
        ? 'bg-emerald-400/15 text-emerald-100'
        : destination === 'Finanzas'
          ? 'bg-amber-300/15 text-amber-100'
          : 'bg-white/10 text-white';

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${palette}`}>{destination}</span>;
}

function RunBadge({
  label,
  status,
}: {
  label: string;
  status: RunStatus;
}) {
  const palette =
    status === 'done'
      ? 'bg-emerald-400/15 text-emerald-100'
      : status === 'processing'
        ? 'bg-cyan-400/15 text-cyan-100'
        : 'bg-white/10 text-white';

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${palette}`}>{label}</span>;
}
