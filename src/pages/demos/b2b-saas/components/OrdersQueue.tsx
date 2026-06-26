import { ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../utils';
import { Panel, DetailGrid } from './Shared';
import { Order, OrderStatus } from '../types';

export function OrdersQueue({
  orders,
  selectedOrder,
  selectedOrderId,
  selectOrder,
  approveBlockedOrder,
}: {
  orders: Order[];
  selectedOrder: Order;
  selectedOrderId: string;
  selectOrder: (id: string) => void;
  approveBlockedOrder: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <Panel title="Pedidos por estado" eyebrow="Cola de trabajo">
        <div className="grid gap-3 xl:grid-cols-2">
          {(['Nuevo', 'Validando', 'Bloqueado', 'Listo'] as OrderStatus[]).map((status) => (
            <div key={status} className="min-w-0 rounded-md border border-zinc-800 bg-zinc-950 p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">{status}</p>
                <span className="rounded-full border border-zinc-800 px-2 py-1 text-xs text-[#a9bbbf]">
                  {orders.filter((item) => item.status === status).length}
                </span>
              </div>
              <div className="space-y-3">
                {orders
                  .filter((item) => item.status === status)
                  .map((order) => (
                    <button
                      key={order.id}
                      type="button"
                      onClick={() => selectOrder(order.id)}
                      className={`w-full rounded-md border p-3 text-left transition ${
                        order.id === selectedOrderId
                          ? 'border-cyan-300/25 bg-cyan-400/10'
                          : 'border-zinc-800 bg-zinc-900 hover:border-cyan-300/20 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="break-words font-semibold text-white">{order.id}</p>
                        <span className="text-xs text-[#8ea3a7]">{formatCurrency(order.value)}</span>
                      </div>
                      <p className="mt-2 break-words text-sm text-[#cdd8da]">{order.account}</p>
                      <p className="mt-2 break-words text-xs leading-5 text-[#7f9498]">{order.issue}</p>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Detalle del pedido" eyebrow="Orden seleccionada">
        <div className="space-y-4">
          <DetailGrid
            items={[
              ['Cuenta', selectedOrder.account],
              ['Canal', selectedOrder.channel],
              ['Valor', formatCurrency(selectedOrder.value)],
              ['Siguiente hito', selectedOrder.due],
            ]}
          />
          <div className="rounded-md border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">Riesgo visible</p>
            <p className="mt-3 text-lg font-semibold text-white">{selectedOrder.issue}</p>
            <p className="mt-2 text-sm leading-6 text-[#9eb0b4]">
              La decisión operativa aparece dentro del flujo, no como una nota suelta fuera de sistema.
            </p>
          </div>
          {selectedOrder.status === 'Bloqueado' ? (
            <button
              type="button"
              onClick={() => approveBlockedOrder(selectedOrder.id)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-amber-300 px-4 py-3 text-sm font-semibold text-[#221607] transition hover:bg-amber-200"
            >
              <ShieldCheck className="h-4 w-4" />
              Autorizar y liberar pedido
            </button>
          ) : (
            <div className="rounded-md border border-emerald-400/18 bg-emerald-400/8 px-4 py-3 text-sm text-emerald-50">
              Pedido sin bloqueo critico. El sistema ya muestra el siguiente paso con contexto.
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
