import { formatCurrency } from '../utils';
import { Panel, OutcomeRow, StatusPill, ProgressBar } from './Shared';
import { Order } from '../types';

export function OperationalBoard({
  orders,
  selectedOrderId,
  selectOrder,
}: {
  orders: Order[];
  selectedOrderId: string;
  selectOrder: (id: string) => void;
}) {
  return (
    <>
      <Panel title="Operational board" eyebrow="Lo que esta pasando ahora">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-zinc-800 text-xs uppercase tracking-[0.2em] text-[#708488]">
              <tr>
                <th className="px-3 py-3">Pedido</th>
                <th className="px-3 py-3">Cuenta</th>
                <th className="px-3 py-3">Estado</th>
                <th className="min-w-[140px] px-3 py-3">Progreso</th>
                <th className="px-3 py-3">Valor</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => selectOrder(order.id)}
                  className={`cursor-pointer border-b border-white/5 transition last:border-0 ${
                    order.id === selectedOrderId ? 'bg-cyan-400/7' : 'hover:bg-white/[0.03]'
                  }`}
                >
                  <td className="px-3 py-4">
                    <p className="font-semibold text-white">{order.id}</p>
                    <p className="mt-1 text-xs text-[#81969a]">{order.channel}</p>
                  </td>
                  <td className="px-3 py-4 text-sm text-[#d4e0e2]">{order.account}</td>
                  <td className="px-3 py-4">
                    <StatusPill status={order.status} />
                  </td>
                  <td className="px-3 py-4">
                    <ProgressBar value={order.progress} />
                  </td>
                  <td className="px-3 py-4 text-sm font-medium text-white">{formatCurrency(order.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <Panel title="Qué hace wow en 10 segundos" eyebrow="Valor visible">
        <div className="grid gap-3 md:grid-cols-3">
          <OutcomeRow label="Pedido" value="La cola ya no es correo: tiene progreso, riesgo y responsable." tone="cyan" />
          <OutcomeRow label="Stock" value="Las roturas se ven antes y disparan una acción clara." tone="emerald" />
          <OutcomeRow label="Credito" value="Los bloqueos aparecen dentro del flujo y no fuera de sistema." tone="rose" />
        </div>
      </Panel>
    </>
  );
}
