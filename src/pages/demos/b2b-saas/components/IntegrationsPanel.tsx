import { Panel, CompareStack, ConnectorBadge } from './Shared';
import { SyncStatus } from '../types';
import { connectorLabels } from '../constants';

export function IntegrationsPanel({
  connectorState,
  syncConnector,
}: {
  connectorState: Record<(typeof connectorLabels)[number], SyncStatus>;
  syncConnector: (name: (typeof connectorLabels)[number]) => void;
}) {
  return (
    <div className="space-y-4">
      <Panel title="Conectores activos" eyebrow="Estado por sistema">
        <div className="grid gap-3 xl:grid-cols-2">
          {connectorLabels.map((connector) => (
            <button
              key={connector}
              type="button"
              onClick={() => syncConnector(connector)}
              className="min-w-0 rounded-md border border-zinc-800 bg-zinc-950 p-4 text-left transition hover:border-cyan-300/20 hover:bg-white/[0.04]"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="min-w-0 break-words font-semibold text-white">{connector}</p>
                <ConnectorBadge status={connectorState[connector]} />
              </div>
              <p className="mt-3 break-words text-sm leading-6 text-[#96a8ac]">
                {connector === 'ERP'
                  ? 'Pedido, credito, stock y salida comparten estado.'
                  : connector === 'CRM'
                    ? 'Comercial recibe contexto y no solo un lead suelto.'
                    : connector === 'Logistica'
                      ? 'Preparacion, seguimiento y aviso al cliente.'
                      : 'Alertas, resumentes y tareas disparadas en tiempo real.'}
              </p>
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Lo que ve el cliente" eyebrow="Resultado visible">
        <CompareStack
          items={[
            ['Antes', 'Sistemas separados y llamadas para saber el estado', 'rose'],
            ['Ahora', 'Una sola vista con estado, responsable y siguiente paso', 'emerald'],
            ['Impacto', 'Se entiende el valor sin explicar la arquitectura', 'cyan'],
          ]}
        />
      </Panel>
    </div>
  );
}
