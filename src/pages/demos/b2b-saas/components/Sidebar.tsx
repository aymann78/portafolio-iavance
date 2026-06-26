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
    <aside className="overflow-hidden rounded-[30px] border border-white/8 bg-[#0d1215]">
      <div className="border-b border-white/8 px-5 py-5">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/12 text-cyan-200">
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
              className={`group flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                active
                  ? 'border-cyan-300/30 bg-cyan-400/10 text-white'
                  : 'border-transparent bg-[#0a0f12] text-[#96a4a8] hover:border-cyan-300/20 hover:bg-[#11181d] hover:text-white'
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

      <div className="border-t border-white/8 px-4 py-4">
        <p className="text-xs font-mono uppercase tracking-[0.24em] text-[#708488]">Estado sistema</p>
        <div className="mt-3 space-y-2">
          {connectorLabels.map((label) => (
            <StatusRow key={label} label={label} status={connectorState[label]} />
          ))}
        </div>
      </div>

      <div className="border-t border-white/8 px-4 py-4">
        <p className="text-xs font-mono uppercase tracking-[0.24em] text-[#708488]">Valor visible</p>
        <div className="mt-3 rounded-2xl border border-cyan-400/15 bg-cyan-400/8 p-4">
          <p className="text-sm font-semibold text-white">Menos perseguir estados</p>
          <p className="mt-2 text-sm leading-6 text-[#a9bbbf]">
            El visitante ve cola, riesgo, credito y stock sin imaginar el backend.
          </p>
        </div>
        <div className="mt-3 rounded-2xl border border-white/8 bg-[#0b1013] p-4">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">Tecnologia a medida</p>
          <p className="mt-2 text-sm leading-6 text-[#a9bbbf]">
            No solo ERP: también portales, dashboards, integraciones, IA aplicada, herramientas internas y piezas a medida.
          </p>
        </div>
      </div>
    </aside>
  );
}
