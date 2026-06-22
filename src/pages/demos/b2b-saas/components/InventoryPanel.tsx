import { PackageCheck } from 'lucide-react';
import { Panel, CompareStack } from './Shared';
import { StockItem } from '../types';

export function InventoryPanel({
  stock,
  replenishStock,
}: {
  stock: StockItem[];
  replenishStock: (sku: string) => void;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)]">
      <Panel title="Stock sincronizado" eyebrow="Disponibilidad y riesgo">
        <div className="space-y-3">
          {stock.map((item) => {
            const ratio = Math.max(0, Math.min(100, Math.round((item.available / Math.max(item.min, 1)) * 100)));
            const needsAction = item.available <= item.min;

            return (
              <div key={item.sku} className="rounded-2xl border border-white/8 bg-[#0b1013] p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      <span className="rounded-full border border-white/8 px-2 py-1 text-[11px] text-[#90a4a8]">{item.sku}</span>
                    </div>
                    <p className="mt-2 text-sm text-[#8fa4a8]">
                      {item.location} · proveedor {item.supplier} · reservado {item.reserved}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${needsAction ? 'bg-amber-300/15 text-amber-100' : 'bg-emerald-400/15 text-emerald-100'}`}>
                      {item.available} uds
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[#708488]">
                    <span>Cobertura</span>
                    <span>Min {item.min}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/[0.06]">
                    <div
                      className={`h-full rounded-full ${needsAction ? 'bg-amber-300' : 'bg-cyan-300'}`}
                      style={{ width: `${Math.max(8, Math.min(100, ratio))}%` }}
                    />
                  </div>
                </div>
                {needsAction ? (
                  <button
                    type="button"
                    onClick={() => replenishStock(item.sku)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-[#061014] transition hover:bg-cyan-200"
                  >
                    <PackageCheck className="h-4 w-4" />
                    Lanzar reposicion
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel title="Impacto visible" eyebrow="Antes / ahora">
        <CompareStack
          items={[
            ['Antes', 'Stock en hoja y roturas detectadas tarde', 'rose'],
            ['Ahora', 'Cobertura, minimo y accion en la misma tarjeta', 'emerald'],
            ['Siguiente paso', 'Reposicion generada sin perseguir a compras', 'cyan'],
          ]}
        />
      </Panel>
    </div>
  );
}
