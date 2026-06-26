import { Bot, MessageSquareText, ScanSearch, ShieldAlert, Route, Database } from 'lucide-react';
import { Scenario, InputItem, RunStatus, Destination } from '../types';
import { stageCopy } from '../constants';
import { Panel, DecisionRow, RouteBadge, RunBadge } from './Shared';

function CsvAutomationFlow({
  items,
  selectedItemId,
  onSelectItem,
}: {
  items: InputItem[];
  selectedItemId: string;
  onSelectItem: (itemId: string) => void;
}) {
  const grouped = items.reduce<Record<Destination, number>>(
    (accumulator, item) => {
      accumulator[item.destination] += 1;
      return accumulator;
    },
    { Ventas: 0, Soporte: 0, Finanzas: 0, Operaciones: 0 }
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="min-w-0 rounded-md border border-zinc-800/80 bg-zinc-900 shadow-md shadow-black/40  p-4">
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
            <thead className="border-b border-zinc-800/80 text-xs uppercase tracking-[0.18em] text-[#708488]">
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

      <div className="rounded-md border border-zinc-800/80 bg-zinc-900 shadow-md shadow-black/40  p-4">
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">Salida por destino</p>
        <p className="mt-2 text-lg font-semibold text-white">Resultado del lote</p>
        <div className="mt-4 space-y-3">
          {(Object.entries(grouped) as Array<[Destination, number]>).map(([destination, total]) => (
            <div key={destination} className="rounded-md border border-zinc-800/80 bg-zinc-900 shadow-md shadow-black/40  p-3">
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

export function ProcessPanel({
  scenario,
  selectedItem,
  selectedItemId,
  activeStageIndex,
  runStatus,
  selectItem,
}: {
  scenario: Scenario;
  selectedItem: InputItem;
  selectedItemId: string;
  activeStageIndex: number;
  runStatus: RunStatus;
  selectItem: (itemId: string) => void;
}) {
  return (
    <>
      <div className={`grid gap-4 ${scenario.id === 'csv' ? 'grid-cols-1' : 'xl:grid-cols-2'}`}>
        <Panel title="Flujo de Operación" eyebrow="Operación en curso">
          {scenario.id === 'csv' ? (
            <CsvAutomationFlow
              items={scenario.items}
              selectedItemId={selectedItemId}
              onSelectItem={selectItem}
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
                    className={`min-w-0 rounded-md border p-3 transition ${
                      active
                        ? 'border-cyan-300/30 bg-cyan-400/10 motion-safe:animate-pulse'
                        : complete
                          ? 'border-emerald-400/18 bg-emerald-400/10'
                          : 'border-zinc-800/80 bg-zinc-900 shadow-md shadow-black/40'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-cyan-400/20' : complete ? 'bg-emerald-400/15' : 'bg-white/5'}`}>
                        <Icon className={`h-4 w-4 ${active ? 'text-cyan-200' : complete ? 'text-emerald-100' : 'text-[#7a9094]'}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">{stage.label}</p>
                        <p className="mt-1 break-words whitespace-normal text-sm font-semibold text-white">{stage.description}</p>
                        <p className="mt-2 text-xs leading-5 text-[#9ab0b4]" style={{ overflowWrap: 'anywhere' }}>
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

          <div className="mt-4 rounded-md border border-zinc-800/80 bg-zinc-900 shadow-md shadow-black/40 p-4">
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

        <Panel title="Criterio de Negocio" eyebrow="Reglas de procesamiento">
          <div className="rounded-md border border-cyan-400/20 bg-cyan-400/10 p-4">
            <div className="flex items-center gap-2 text-cyan-200">
              <Bot className="h-4 w-4" />
              <p className="text-sm font-semibold">Asistente operativo</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-cyan-50">{scenario.assistantPrompt}</p>
          </div>

          <div className="mt-4 space-y-3 rounded-md border border-zinc-800/80 bg-zinc-900 shadow-md shadow-black/40  p-4">
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
            <thead className="border-b border-zinc-800/80 text-xs uppercase tracking-[0.2em] text-[#708488]">
              <tr>
                <th className="px-4 py-3">Entrada</th>
                <th className="px-4 py-3">Intento detectado</th>
                <th className="px-4 py-3">Destino</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acción</th>
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
    </>
  );
}
