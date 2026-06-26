import { ArrowRight, Play, RefreshCw, Mail, Sparkles, Route, CheckCircle2 } from 'lucide-react';
import { trackEvent } from '../../../../lib/analytics';
import { Scenario } from '../types';
import { InsightCard } from './Shared';

export function Header({
  scenario,
  metrics,
  runAutomation,
  resetDemo,
}: {
  scenario: Scenario;
  metrics: {
    incoming: number;
    highPriority: number;
    routedToSales: number;
    estimatedValue: number;
  };
  runAutomation: () => void;
  resetDemo: () => void;
}) {
  return (
    <header className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900  ">
      <div className="flex flex-col gap-4 border-b border-zinc-800 p-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-[0.24em] text-cyan-300">Entrada → criterio → acción</p>
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
            className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-semibold text-[#061014] shadow-sm transition hover:bg-cyan-200 hover:shadow-md"
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
  );
}
