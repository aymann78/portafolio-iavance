import { ArrowRight } from 'lucide-react';
import { trackEvent } from '../../../../lib/analytics';
import { Panel, OutcomeRow, LiveCard, ActivityFeed, TaskList, DetailGrid, StatusRow } from './Shared';
import { ModuleKey, Order, Account, StockItem, SyncStatus, Task, ActivityItem } from '../types';
import { connectorLabels } from '../constants';
import { formatCurrency } from '../utils';

export function InsightSidebar({
  activeModule,
  selectedOrder,
  selectedAccount,
  lowStockItem,
  connectorState,
  orders,
  tasks,
}: {
  activeModule: ModuleKey;
  selectedOrder: Order;
  selectedAccount: Account;
  lowStockItem: StockItem;
  connectorState: Record<(typeof connectorLabels)[number], SyncStatus>;
  orders: Order[];
  tasks: Task[];
  activity: ActivityItem[];
  completeTask: (id: string) => void;
}) {
  const renderInsightPanel = () => {
    switch (activeModule) {
      case 'overview':
        return (
          <div className="space-y-4">
            <DetailGrid
              items={[
                ['Cuenta', selectedOrder.account],
                ['Canal', selectedOrder.channel],
                ['Valor', formatCurrency(selectedOrder.value)],
                ['Estado', selectedOrder.status],
              ]}
            />
            <div className="rounded-md border border-zinc-800/80 bg-zinc-900 shadow-md shadow-black/40 p-4 text-sm leading-6 text-[#9eb0b4]">
              Este pedido esta marcado como <strong className="text-white">{selectedOrder.status}</strong>.
              El bloqueo no viene del operario, sino de las reglas de negocio automaticas.
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="space-y-4">
            <DetailGrid
              items={[
                ['Cuenta', selectedOrder.account],
                ['Problema', selectedOrder.issue],
              ]}
            />
            <div className="rounded-md border border-rose-400/20 bg-rose-400/10 p-4 text-sm leading-6 text-[#d9e5e8]">
              Si este pedido estuviera en un Excel o un correo, el comercial estaria ahora llamando para preguntar. Aqui el bloqueo y la solución son visibles.
            </div>
          </div>
        );
      case 'inventory':
        return (
          <div className="space-y-4">
            <DetailGrid
              items={[
                ['Producto critico', lowStockItem.name],
                ['Disponible', String(lowStockItem.available)],
                ['Minimo vital', String(lowStockItem.min)],
                ['Proveedor', lowStockItem.supplier],
              ]}
            />
            <div className="rounded-md border border-amber-300/20 bg-amber-400/10 p-4 text-sm leading-6 text-[#d9e5e8]">
              El stock se cruza con las ordenes de venta vivas. La rotura se previene antes de bloquear entregas.
            </div>
          </div>
        );
      case 'customers':
        return (
          <div className="space-y-4">
            <DetailGrid
              items={[
                ['Cliente enfocado', selectedAccount.name],
                ['Credito disp.', formatCurrency(selectedAccount.creditLimit - selectedAccount.creditUsed)],
                ['Facturas pdts.', String(selectedAccount.pendingInvoices)],
              ]}
            />
            <div className="rounded-md border border-zinc-800/80 bg-zinc-900 shadow-md shadow-black/40 p-4 text-sm leading-6 text-[#9eb0b4]">
              Al abrir la ficha de cliente en una llamada, el equipo ve el limite de credito y las tareas abiertas. No hay sorpresas financieras post-venta.
            </div>
          </div>
        );
      case 'finance':
        return (
          <div className="space-y-4">
            <DetailGrid
              items={[
                ['Pedidos bloqueados', String(orders.filter((item) => item.status === 'Bloqueado').length)],
                ['Autorizaciones pdts.', String(tasks.filter((item) => !item.done && item.owner === 'Finanzas').length)],
              ]}
            />
            <div className="rounded-md border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm leading-6 text-[#d9e5e8]">
              El departamento de Riesgos autoriza o deniega directamente sobre la cola de pedidos de operaciones, sin duplicar herramientas.
            </div>
          </div>
        );
      case 'integrations':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              {connectorLabels.map((label) => (
                <StatusRow key={label} label={label} status={connectorState[label]} />
              ))}
            </div>
            <div className="rounded-md border border-zinc-800/80 bg-zinc-900 shadow-md shadow-black/40 p-4 text-sm leading-6 text-[#9eb0b4]">
              Si el ERP cae, o el CRM no sincroniza el credito, la plataforma asume un estado degradado seguro pero sigue operando visualmente.
            </div>
          </div>
        );
    }
  };

  return (
    <aside className="min-w-0 space-y-4">
      {/* Primer panel: Dependiente del módulo activo */}
      <Panel title="Insight seleccionado" eyebrow="Lo que se entiende rápido">
        {renderInsightPanel()}
      </Panel>

      <Panel title="Resultado comercial" eyebrow="Demo con gancho">
        <div className="space-y-3">
          <OutcomeRow label="Antes" value="Pedidos, stock y credito van cada uno por su lado." tone="rose" />
          <OutcomeRow label="Ahora" value="Todo aparece como una cola operativa con consecuencias visibles." tone="emerald" />
          <OutcomeRow label="Por qué vende" value="El visitante imagina su operativa dentro de este panel." tone="cyan" />
        </div>
      </Panel>
    </aside>
  );
}

export function RightSidebar({
  orders,
  tasks,
  activity,
  completeTask,
}: {
  orders: Order[];
  tasks: Task[];
  activity: ActivityItem[];
  completeTask: (id: string) => void;
}) {
  return (
    <aside className="min-w-0 space-y-4">
      <Panel title="Live status" eyebrow="Monitor en tiempo real">
        <div className="space-y-3">
          <LiveCard label="System health" value="99.9%" accent="cyan" />
          <LiveCard label="Pedidos listos para salida" value={String(orders.filter((item) => item.status === 'Listo').length)} accent="emerald" />
          <LiveCard label="Aprobaciones pendientes" value={String(tasks.filter((item) => !item.done).length)} accent="amber" />
        </div>
      </Panel>

      <Panel title="Actividad del sistema" eyebrow="Timeline">
        <ActivityFeed items={activity} compact />
      </Panel>

      <Panel title="Approvals & tasks" eyebrow="Trabajo inmediato">
        <TaskList tasks={tasks} onComplete={completeTask} compact />
      </Panel>

      <a
        href="/contacto?service=software-e-integraciones&problem=Quiero%20un%20ERP%20interno%20o%20portal%20operativo%20como%20esta%20demo"
        onClick={() => trackEvent('demo_cta_click', { demo: 'b2b_autoflow_erp', location: 'sidebar' })}
        className="flex items-center justify-between rounded-[28px] border border-cyan-300/25 bg-cyan-400/10 px-5 py-4 text-white transition hover:bg-cyan-400/15"
      >
        <span>
          <span className="block text-sm font-semibold">Pedir diagnóstico de ERP interno</span>
          <span className="mt-1 block text-xs text-cyan-100/75">Pedidos, stock, credito y aprobaciones</span>
        </span>
        <ArrowRight className="h-5 w-5" />
      </a>
    </aside>
  );
}
