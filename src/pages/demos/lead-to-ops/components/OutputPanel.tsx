import { ArrowRight, Mail, Sparkles, Route, Send } from 'lucide-react';
import { trackEvent } from '../../../../lib/analytics';
import { Scenario, InputItem, RunStatus, ActivityItem } from '../types';
import { Panel, MiniMetric, OutcomeRow, ActivityFeed, RuleCard } from './Shared';

export function BusinessSummaryPanel({
  selectedItem,
  metrics,
  runStatus,
}: {
  scenario: Scenario;
  selectedItem: InputItem;
  metrics: {
    incoming: number;
    highPriority: number;
    routedToSales: number;
    estimatedValue: number;
  };
  runStatus: RunStatus;
}) {
  return (
    <aside className={`min-w-0 space-y-4 transition-all duration-1000 ${runStatus === 'idle' ? 'opacity-30 blur-sm grayscale pointer-events-none' : 'opacity-100 blur-none grayscale-0'}`}>
      <Panel title="Resumen de negocio" eyebrow="Lo que ve el equipo">
        <div className="grid gap-3 sm:grid-cols-2">
          <MiniMetric label="Entradas" value={String(metrics.incoming)} />
          <MiniMetric label="Alta prioridad" value={String(metrics.highPriority)} />
          <MiniMetric label="A ventas" value={String(metrics.routedToSales)} />
          <MiniMetric label="Valor detectado" value={metrics.estimatedValue ? `${metrics.estimatedValue.toLocaleString('es-ES')}€` : 'N/A'} />
        </div>
      </Panel>

      <Panel title="Salida visible" eyebrow="Qué recibe el negocio">
        <div className="space-y-3">
          {[
            `CRM actualizado para ${selectedItem.company}.`,
            `Resumen listo para ${selectedItem.destination.toLowerCase()}.`,
            'Tarea creada con contexto, prioridad y responsable.',
            'Actividad guardada para seguimiento y auditoria.',
          ].map((item) => (
            <div key={item} className="rounded-md border border-zinc-800 bg-zinc-950  px-4 py-3 text-sm leading-6 text-[#d8e4e6]">
              {item}
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Antes / despues" eyebrow="Porque se entiende mejor">
        <div className="space-y-3">
          <OutcomeRow label="Antes" value="Mensajes mezclados y decisiones lentas, dependientes de una persona." tone="rose" />
          <OutcomeRow label="Ahora" value="El sistema muestra entrada, criterio, ruta y acción sin esconder el proceso." tone="emerald" />
          <OutcomeRow label="Impacto" value="El visitante entiende en segundos que entra, que decide y que sale." tone="cyan" />
        </div>
      </Panel>
    </aside>
  );
}

export function LiveRunSidebar({
  scenario,
  selectedItem,
  activity,
}: {
  scenario: Scenario;
  selectedItem: InputItem;
  activity: ActivityItem[];
}) {
  return (
    <aside className="min-w-0 space-y-4">
      <Panel title="Live run" eyebrow="Timeline del proceso">
        <ActivityFeed items={activity} />
      </Panel>

      <Panel title="Reglas aplicadas" eyebrow="Decisión visible">
        <div className="space-y-3">
          <RuleCard label="Input" value={scenario.inputLabel} icon={Mail} />
          <RuleCard label="Lectura" value={selectedItem.intent} icon={Sparkles} />
          <RuleCard label="Ruta" value={selectedItem.destination} icon={Route} />
          <RuleCard label="Acción" value={selectedItem.action} icon={Send} />
        </div>
      </Panel>

      <a
        href="/contacto?service=automatizaciones-e-ia&problem=Quiero%20una%20automatizacion%20operativa%20que%20muestre%20entrada,%20decision%20y%20salida"
        onClick={() => trackEvent('demo_cta_click', { demo: 'lead_to_ops', location: 'sidebar' })}
        className="flex items-center justify-between rounded-[28px] border border-cyan-300/25 bg-cyan-400/10 px-5 py-4 text-white transition hover:bg-cyan-400/15"
      >
        <span>
          <span className="block text-sm font-semibold">Pedir diagnóstico de automatización</span>
          <span className="mt-1 block text-xs text-cyan-100/75">Entrada, reglas, acciones e integración</span>
        </span>
        <ArrowRight className="h-5 w-5" />
      </a>
    </aside>
  );
}
