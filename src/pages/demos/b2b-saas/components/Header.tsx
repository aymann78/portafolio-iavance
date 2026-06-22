import { ArrowRight, RefreshCw, Search } from 'lucide-react';
import { trackEvent } from '../../../../lib/analytics';
import { MetricCard } from './Shared';
import { Database, BellRing, ShieldCheck, Sparkles } from 'lucide-react';

export function Header({
  currentModule,
  summary,
  resetDemo,
}: {
  currentModule: any;
  summary: any;
  resetDemo: () => void;
}) {
  return (
    <header className="overflow-hidden rounded-[32px] border border-white/8 bg-[#101518]">
      <div className="flex flex-col gap-4 border-b border-white/8 p-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-[0.24em] text-cyan-300">{currentModule.eyebrow}</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight text-white md:text-5xl">
            {currentModule.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#a3b2b6] md:text-lg">
            {currentModule.description}
          </p>
        </div>

        <div className="w-full max-w-[420px] space-y-3">
          <div className="flex items-center gap-2 rounded-2xl border border-white/8 bg-[#0b1013] px-4 py-3 text-sm text-[#8ea3a7]">
            <Search className="h-4 w-4 text-cyan-300" />
            Buscar pedido, cuenta, sku o alerta
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={resetDemo}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm font-medium text-[#d6e1e3] transition hover:border-white/20 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
              Reset demo
            </button>
            <a
              href="/contacto?service=software-e-integraciones&problem=Quiero%20un%20panel%20operativo%20tipo%20ERP%20para%20pedidos,%20stock%20y%20aprobaciones"
              onClick={() => trackEvent('demo_cta_click', { demo: 'b2b_autoflow_erp', location: 'header' })}
              className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-semibold text-[#061014] transition hover:bg-cyan-200"
            >
              Hablar del proyecto
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="System health" value={`${summary.liveConnectors}/4 live`} hint="ERP, CRM y alertas" icon={Sparkles} accent="cyan" />
        <MetricCard label="Pending approvals" value={String(summary.blockedOrders + summary.openTasks)} hint="Bloqueos y tareas del dia" icon={ShieldCheck} accent="amber" />
        <MetricCard label="Throughput" value={new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(summary.throughput)} hint="Volumen hoy en operacion" icon={Database} accent="emerald" />
        <MetricCard label="Active alerts" value={String(summary.lowStock)} hint="Productos por debajo de minimo" icon={BellRing} accent="rose" />
      </div>
    </header>
  );
}
