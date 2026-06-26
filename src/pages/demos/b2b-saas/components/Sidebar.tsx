import { ChevronRight, Layers3 } from 'lucide-react';
import { ModuleKey, SyncStatus } from '../types';
import { connectorLabels, modules } from '../constants';
import { StatusRow } from './Shared';

export function Sidebar({
  activeModule,
  switchModule,
  connectorState,
}: {
  activeModule: ModuleKey;
  switchModule: (module: ModuleKey) => void;
  connectorState: Record<(typeof connectorLabels)[number], SyncStatus>;
}) {
  return (
    <aside className="overflow-hidden rounded-[30px] border border-zinc-800/80 bg-[#0d1215]">
      <div className="border-b border-zinc-800/80 px-5 py-5">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-md bg-cyan-400/12 text-cyan-200">
            <Layers3 className="h-6 w-6" />
          </span>
          <div>
            <p className="text-lg font-semibold text-white">B2B Autoflow ERP</p>
            <p className="text-sm text-[#8ea3a7]">Command center operativo</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 px-3 py-3">
        {modules.map((module) => {
          const Icon = module.icon;
          const active = module.key === activeModule;

          return (
            <button
              key={module.key}
              type="button"
              onClick={() => switchModule(module.key)}
              className={`group flex w-full items-center justify-between rounded-md border px-4 py-3 text-left transition ${
                active
                  ? 'border-cyan-300/30 bg-cyan-400/10 text-white'
                  : 'border-transparent bg-black text-[#96a4a8] hover:border-cyan-300/20 hover:bg-[#11181d] hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${active ? 'text-cyan-200' : 'text-[#6d7f84] group-hover:text-cyan-200'}`} />
                <span className="text-sm font-medium">{module.label}</span>
              </span>
              <ChevronRight className="h-4 w-4 text-[#6d7f84]" />
            </button>
          );
        })}
      </div>

      <div className="border-t border-zinc-800/80 px-4 py-4">
        <p className="text-xs font-mono uppercase tracking-[0.24em] text-[#708488]">Estado sistema</p>
        <div className="mt-3 space-y-2">
          {connectorLabels.map((label) => (
            <StatusRow key={label} label={label} status={connectorState[label]} />
          ))}
        </div>
      </div>

      <div className="border-t border-zinc-800/80 px-4 py-4">
        <div className="rounded-md border border-amber-500/20 bg-amber-500/10 p-4 text-amber-200">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-amber-400">Demo conceptual</p>
          <p className="mt-2 text-sm leading-6 text-amber-200/80">
            Esta interfaz ilustra un portal B2B conectado. En un entorno real, se integraría con tu ERP, CRM o pasarela de pago para leer estados reales. Los datos aquí mostrados son ficticios.
          </p>
        </div>
        <div className="mt-4">
          <a
            href="/contacto?service=software-interno"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Aterrizar software interno
          </a>
        </div>
      </div>
    </aside>
  );
}
