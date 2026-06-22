import { formatCurrency } from '../utils';
import { Panel, CompareStack, StatusPill } from './Shared';
import { Order } from '../types';

export function FinancePanel({
  orders,
  approveBlockedOrder,
}: {
  orders: Order[];
  approveBlockedOrder: (id: string) => void;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
      <Panel title="Bloqueos y credito" eyebrow="Riesgo con contexto">
        <div className="space-y-3">
          {orders
            .filter((item) => item.status === 'Bloqueado' || item.status === 'Validando')
            .map((order) => (
              <div key={order.id} className="rounded-2xl border border-white/8 bg-[#0b1013] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{order.id}</p>
                    <p className="mt-2 text-sm text-[#97a9ad]">{order.account} · {order.issue}</p>
                  </div>
                  <StatusPill status={order.status} />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-white/8 px-3 py-1 text-xs text-[#a9bbbf]">{formatCurrency(order.value)}</span>
                  <span className="rounded-full border border-white/8 px-3 py-1 text-xs text-[#a9bbbf]">{order.due}</span>
                </div>
                {order.status === 'Bloqueado' ? (
                  <button
                    type="button"
                    onClick={() => approveBlockedOrder(order.id)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-300/25 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-300 hover:text-[#2a1800]"
                  >
                    Liberar pedido
                  </button>
                ) : null}
              </div>
            ))}
        </div>
      </Panel>

      <Panel title="Cambio comercial" eyebrow="Antes / despues">
        <CompareStack
          items={[
            ['Antes', 'Bloqueos ocultos en correo y aprobaciones verbales', 'rose'],
            ['Ahora', 'Riesgo documentado dentro del panel y del pedido', 'emerald'],
            ['Resultado', 'Menos retrasos y menos llamadas para aclarar', 'cyan'],
          ]}
        />
      </Panel>
    </div>
  );
}
