import { useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardList,
  Database,
  FileText,
  Layers,
  Minus,
  PackageCheck,
  Plus,
  RefreshCw,
  Search,
  Send,
  Truck,
  UsersRound,
  Warehouse,
  Workflow
} from 'lucide-react';

type SyncState = 'draft' | 'validating' | 'synced';
type OrderStatus = 'Nuevo' | 'Validando' | 'Bloqueado' | 'Listo';
type ModuleKey = 'orders' | 'inventory' | 'customers' | 'finance' | 'integrations';

type Product = {
  id: string;
  sku: string;
  name: string;
  family: string;
  stock: number;
  reserved: number;
  min: number;
  location: string;
  unit: string;
};

type Customer = {
  id: string;
  name: string;
  tier: string;
  terms: string;
  creditUsed: number;
  creditLimit: number;
  pendingInvoices: number;
};

type Order = {
  id: string;
  customerId: string;
  status: OrderStatus;
  channel: string;
  value: number;
  lines: number;
  due: string;
};

const customers: Customer[] = [
  { id: 'reformas-norte', name: 'Reformas Norte', tier: 'Cliente recurrente', terms: 'Entrega 48h', creditUsed: 12600, creditLimit: 30000, pendingInvoices: 1 },
  { id: 'hotel-arce', name: 'Hotel Arce', tier: 'Cuenta corporativa', terms: 'Prioridad alta', creditUsed: 22400, creditLimit: 45000, pendingInvoices: 0 },
  { id: 'obra-sur', name: 'Obra Sur', tier: 'Distribuidor', terms: 'Pedido semanal', creditUsed: 31800, creditLimit: 36000, pendingInvoices: 3 }
];

const products: Product[] = [
  { id: 'adhesive', sku: 'MAT-204', name: 'Adhesivo flexible C2TE', family: 'Material obra', stock: 184, reserved: 36, min: 80, location: 'A-12', unit: 'sacos' },
  { id: 'screen', sku: 'BAN-118', name: 'Mampara frontal 120 cm', family: 'Baño', stock: 42, reserved: 18, min: 30, location: 'B-03', unit: 'uds' },
  { id: 'tap', sku: 'GRF-077', name: 'Grifería monomando inox', family: 'Fontanería', stock: 67, reserved: 22, min: 40, location: 'C-18', unit: 'uds' },
  { id: 'tile', sku: 'CER-431', name: 'Porcelánico gris 60x60', family: 'Cerámica', stock: 312, reserved: 124, min: 180, location: 'D-21', unit: 'm²' },
  { id: 'valve', sku: 'FON-552', name: 'Válvula anti-retorno', family: 'Fontanería', stock: 16, reserved: 9, min: 25, location: 'C-07', unit: 'uds' }
];

const initialOrders: Order[] = [
  { id: 'PED-1048', customerId: 'reformas-norte', status: 'Nuevo', channel: 'Portal B2B', value: 4280, lines: 3, due: 'Hoy 16:30' },
  { id: 'PED-1047', customerId: 'hotel-arce', status: 'Listo', channel: 'Comercial', value: 12600, lines: 8, due: 'Mañana' },
  { id: 'PED-1046', customerId: 'obra-sur', status: 'Bloqueado', channel: 'CSV semanal', value: 8900, lines: 6, due: 'Pendiente crédito' },
  { id: 'PED-1045', customerId: 'reformas-norte', status: 'Validando', channel: 'WhatsApp', value: 1650, lines: 2, due: 'Hoy 18:00' }
];

const baseLog = [
  'Inventario actualizado desde almacén central',
  'Pedidos pendientes importados del portal B2B',
  'Reglas de crédito cargadas desde ERP'
];

const modules: Array<{ key: ModuleKey; label: string; icon: ComponentType<{ className?: string }> }> = [
  { key: 'orders', label: 'Pedidos', icon: ClipboardList },
  { key: 'inventory', label: 'Inventario', icon: Warehouse },
  { key: 'customers', label: 'Clientes', icon: UsersRound },
  { key: 'finance', label: 'Finanzas', icon: FileText },
  { key: 'integrations', label: 'Integraciones', icon: Workflow }
];

const moduleCopy: Record<ModuleKey, { eyebrow: string; title: string }> = {
  orders: {
    eyebrow: 'Demo ERP / SaaS operativo',
    title: 'Centro de pedidos, inventario y crédito B2B'
  },
  inventory: {
    eyebrow: 'Inventario inteligente',
    title: 'Stock, reservas, mínimos y reposición conectada'
  },
  customers: {
    eyebrow: 'CRM operativo',
    title: 'Clientes, riesgo, histórico y prioridad comercial'
  },
  finance: {
    eyebrow: 'Control financiero',
    title: 'Crédito, facturas pendientes y pedidos bloqueados'
  },
  integrations: {
    eyebrow: 'Integraciones',
    title: 'ERP, CRM, logística y automatizaciones sincronizadas'
  }
};

function statusClass(status: OrderStatus) {
  const classes: Record<OrderStatus, string> = {
    Nuevo: 'border-blue-500/20 bg-blue-500/10 text-blue-300',
    Validando: 'border-amber-500/20 bg-amber-500/10 text-amber-200',
    Bloqueado: 'border-red-500/20 bg-red-500/10 text-red-300',
    Listo: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
  };

  return classes[status];
}

function formatCurrency(value: number) {
  return `${value.toLocaleString('es-ES')}€`;
}

export function B2bSaasLanding() {
  const [activeModule, setActiveModule] = useState<ModuleKey>('orders');
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrderId, setSelectedOrderId] = useState(initialOrders[0].id);
  const [selectedCustomerId, setSelectedCustomerId] = useState(initialOrders[0].customerId);
  const [quantities, setQuantities] = useState<Record<string, number>>({
    adhesive: 0,
    screen: 0,
    tap: 0,
    tile: 0,
    valve: 0
  });
  const [syncState, setSyncState] = useState<SyncState>('draft');
  const [erpSynced, setErpSynced] = useState(12497);
  const [log, setLog] = useState(baseLog);

  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId) ?? customers[0];
  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? orders[0];

  const selectedLines = useMemo(
    () =>
      products
        .map((product) => ({ ...product, quantity: quantities[product.id] ?? 0 }))
        .filter((product) => product.quantity > 0),
    [quantities]
  );

  const draftValue = selectedLines.reduce((sum, line) => sum + line.quantity * (line.id === 'tile' ? 18 : line.id === 'screen' ? 210 : 42), 0);
  const lowStock = products.filter((product) => product.stock - product.reserved <= product.min);
  const blockedOrders = orders.filter((order) => order.status === 'Bloqueado').length;
  const totalPipeline = orders.reduce((sum, order) => sum + order.value, 0) + draftValue;
  const creditRatio = Math.round((selectedCustomer.creditUsed / selectedCustomer.creditLimit) * 100);
  const selectedCustomerOrders = orders.filter((order) => order.customerId === selectedCustomer.id);
  const currentModule = moduleCopy[activeModule];

  function addLog(item: string) {
    setLog((current) => [item, ...current].slice(0, 8));
  }

  function selectOrder(order: Order) {
    setSelectedOrderId(order.id);
    setSelectedCustomerId(order.customerId);
    setSyncState('draft');
    setActiveModule('orders');
    addLog(`Pedido abierto: ${order.id}`);
  }

  function selectCustomer(customer: Customer) {
    const firstOrder = orders.find((order) => order.customerId === customer.id);

    setSelectedCustomerId(customer.id);
    if (firstOrder) {
      setSelectedOrderId(firstOrder.id);
    }
    setActiveModule('customers');
    addLog(`Ficha de cliente abierta: ${customer.name}`);
  }

  function changeQuantity(productId: string, delta: number) {
    setSyncState('draft');
    setQuantities((current) => {
      const product = products.find((item) => item.id === productId);
      const currentQuantity = current[productId] ?? 0;
      const available = Math.max(0, (product?.stock ?? 0) - (product?.reserved ?? 0));
      const nextQuantity = Math.max(0, Math.min(available, currentQuantity + delta));
      return { ...current, [productId]: nextQuantity };
    });
    addLog(delta > 0 ? 'Línea añadida al borrador' : 'Cantidad ajustada en borrador');
  }

  function validateOrder() {
    if (selectedLines.length === 0) {
      addLog('No hay líneas nuevas para validar');
      return;
    }

    setSyncState('validating');
    addLog('Validando stock, crédito y condiciones comerciales');

    window.setTimeout(() => {
      const newOrder: Order = {
        id: `PED-${1050 + orders.length}`,
        customerId: selectedCustomer.id,
        status: creditRatio > 85 ? 'Bloqueado' : 'Listo',
        channel: 'Portal B2B',
        value: draftValue,
        lines: selectedLines.length,
        due: creditRatio > 85 ? 'Revisar crédito' : 'Salida 24h'
      };

      setOrders((current) => [newOrder, ...current]);
      setSelectedOrderId(newOrder.id);
      setSyncState('synced');
      setErpSynced((current) => current + 1);
      setQuantities({ adhesive: 0, screen: 0, tap: 0, tile: 0, valve: 0 });
      addLog(creditRatio > 85 ? 'Pedido creado con bloqueo de crédito' : 'Pedido creado y enviado a preparación');
    }, 800);
  }

  function approveSelectedOrder(orderId = selectedOrderId) {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status: 'Listo', due: 'Salida autorizada' } : order
      )
    );
    setSelectedOrderId(orderId);
    setSyncState('synced');
    addLog(`Pedido ${orderId} autorizado manualmente`);
  }

  function createReplenishment(product: Product) {
    setSyncState('validating');
    addLog(`Reposición sugerida para ${product.sku}`);

    window.setTimeout(() => {
      setSyncState('synced');
      addLog(`Orden de compra creada para ${product.name}`);
    }, 600);
  }

  function runIntegrationSync(label: string) {
    setSyncState('validating');
    addLog(`Sincronizando ${label}`);

    window.setTimeout(() => {
      setSyncState('synced');
      setErpSynced((current) => current + 1);
      addLog(`${label} sincronizado sin errores`);
    }, 650);
  }

  function resetDemo() {
    setActiveModule('orders');
    setOrders(initialOrders);
    setSelectedOrderId(initialOrders[0].id);
    setSelectedCustomerId(initialOrders[0].customerId);
    setQuantities({ adhesive: 0, screen: 0, tap: 0, tile: 0, valve: 0 });
    setSyncState('draft');
    setLog(baseLog);
    setErpSynced(12497);
  }

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-200">
      <main className="mx-auto grid min-h-screen w-full max-w-[1500px] grid-cols-1 gap-0 lg:grid-cols-[236px_1fr]">
        <aside className="border-b border-zinc-800 bg-black lg:border-b-0 lg:border-r">
          <div className="flex h-16 items-center gap-3 border-b border-zinc-800 px-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-300">
              <Layers className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">SyncBase ERP</p>
              <p className="text-xs text-zinc-500">Operaciones B2B</p>
            </div>
          </div>

          <nav className="grid gap-1 p-3">
            {modules.map((module) => {
              const Icon = module.icon;
              const active = module.key === activeModule;

              return (
                <button
                  key={module.label}
                  type="button"
                  onClick={() => setActiveModule(module.key)}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition ${
                    active ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-950 hover:text-zinc-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {module.label}
                </button>
              );
            })}
          </nav>

          <div className="m-3 rounded-md border border-zinc-800 bg-zinc-950 p-3">
            <p className="text-xs font-mono uppercase tracking-[0.14em] text-zinc-500">Estado sistema</p>
            <div className="mt-3 space-y-2 text-sm">
              <StatusDot label="ERP" active />
              <StatusDot label="CRM" active={syncState === 'synced'} />
              <StatusDot label="Logística" active={syncState === 'synced'} />
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="flex min-h-16 flex-col gap-3 border-b border-zinc-800 bg-black px-4 py-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">{currentModule.eyebrow}</p>
              <h1 className="mt-1 text-2xl font-semibold text-white">{currentModule.title}</h1>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={resetDemo}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-800 px-3 py-2 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </button>
              <a
                href="/contacto?service=software-e-integraciones&problem=Quiero%20un%20ERP%20SaaS%20o%20portal%20B2B%20a%20medida"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                Hablar del proyecto
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </header>

          <div className="grid gap-4 p-4">
            <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <Kpi label="Pipeline pedidos" value={formatCurrency(totalPipeline)} icon={BarChart3} />
              <Kpi label="Pedidos bloqueados" value={String(blockedOrders)} icon={AlertTriangle} tone={blockedOrders ? 'warning' : 'default'} />
              <Kpi label="Stock bajo" value={String(lowStock.length)} icon={Warehouse} tone={lowStock.length ? 'warning' : 'default'} />
              <Kpi label="Sync ERP" value={String(erpSynced)} icon={Database} />
            </section>

            {activeModule === 'orders' && (
              <section className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
              <div className="grid gap-4">
                <Panel
                  title="Cola de pedidos"
                  eyebrow="Operación"
                  action={
                    <div className="relative hidden sm:block">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                      <input
                        value=""
                        readOnly
                        placeholder="Buscar pedido"
                        className="h-9 w-48 rounded-md border border-zinc-800 bg-zinc-950 pl-9 pr-3 text-sm text-zinc-500 outline-none"
                      />
                    </div>
                  }
                >
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left text-sm">
                      <thead className="border-b border-zinc-800 text-xs uppercase tracking-[0.12em] text-zinc-500">
                        <tr>
                          <th className="px-4 py-3">Pedido</th>
                          <th className="px-4 py-3">Cliente</th>
                          <th className="px-4 py-3">Canal</th>
                          <th className="px-4 py-3">Valor</th>
                          <th className="px-4 py-3">Estado</th>
                          <th className="px-4 py-3">SLA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => {
                          const customer = customers.find((item) => item.id === order.customerId) ?? customers[0];
                          const selected = order.id === selectedOrderId;

                          return (
                            <tr
                              key={order.id}
                              onClick={() => selectOrder(order)}
                              className={`cursor-pointer border-b border-zinc-900 transition last:border-0 ${
                                selected ? 'bg-indigo-500/8' : 'hover:bg-zinc-950'
                              }`}
                            >
                              <td className="px-4 py-3 font-medium text-white">{order.id}</td>
                              <td className="px-4 py-3">
                                <p className="text-zinc-200">{customer.name}</p>
                                <p className="text-xs text-zinc-500">{customer.tier}</p>
                              </td>
                              <td className="px-4 py-3 text-zinc-400">{order.channel}</td>
                              <td className="px-4 py-3 text-zinc-200">{formatCurrency(order.value)}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex rounded-md border px-2 py-1 text-xs ${statusClass(order.status)}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-zinc-400">{order.due}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Panel>

                <Panel title="Inventario y borrador de pedido" eyebrow="Productos">
                  <div className="grid gap-3 lg:grid-cols-2">
                    {products.map((product) => {
                      const available = product.stock - product.reserved;
                      const quantity = quantities[product.id] ?? 0;
                      const stockWarning = available <= product.min;

                      return (
                        <div key={product.id} className="rounded-md border border-zinc-800 bg-zinc-950 p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-mono uppercase tracking-[0.12em] text-zinc-500">{product.sku}</p>
                              <p className="mt-1 text-sm font-semibold text-white">{product.name}</p>
                              <p className="mt-1 text-xs text-zinc-500">
                                {product.family} · Ubicación {product.location}
                              </p>
                            </div>
                            <span
                              className={`rounded-md px-2 py-1 text-xs ${
                                stockWarning ? 'bg-amber-500/10 text-amber-200' : 'bg-emerald-500/10 text-emerald-300'
                              }`}
                            >
                              {available} disp.
                            </span>
                          </div>

                          <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-zinc-500">
                            <span>Stock {product.stock}</span>
                            <span>Reserv. {product.reserved}</span>
                            <span>Mín. {product.min}</span>
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <IconButton label={`Quitar ${product.name}`} onClick={() => changeQuantity(product.id, -1)} icon={Minus} />
                              <span className="flex h-9 w-12 items-center justify-center rounded-md bg-black text-sm font-semibold text-white">
                                {quantity}
                              </span>
                              <IconButton label={`Añadir ${product.name}`} onClick={() => changeQuantity(product.id, 1)} icon={Plus} primary />
                            </div>
                            <button
                              type="button"
                              onClick={() => changeQuantity(product.id, 5)}
                              className="rounded-md border border-zinc-800 px-3 py-2 text-xs text-zinc-300 transition hover:border-zinc-600 hover:text-white"
                            >
                              +5
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Panel>
              </div>

              <div className="grid gap-4">
                <Panel title="Detalle operativo" eyebrow={selectedOrder.id}>
                  <div className="grid gap-3">
                    <DataRow label="Cliente" value={selectedCustomer.name} />
                    <DataRow label="Condiciones" value={selectedCustomer.terms} />
                    <DataRow label="Crédito usado" value={`${formatCurrency(selectedCustomer.creditUsed)} / ${formatCurrency(selectedCustomer.creditLimit)}`} />
                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
                        <span>Riesgo crédito</span>
                        <span>{creditRatio}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-zinc-900">
                        <div
                          className={`h-full rounded-full ${creditRatio > 85 ? 'bg-red-400' : creditRatio > 70 ? 'bg-amber-300' : 'bg-emerald-400'}`}
                          style={{ width: `${Math.min(100, creditRatio)}%` }}
                        />
                      </div>
                    </div>
                    <DataRow label="Facturas pendientes" value={String(selectedCustomer.pendingInvoices)} />
                    <DataRow label="Nuevo borrador" value={selectedLines.length ? `${selectedLines.length} líneas · ${formatCurrency(draftValue)}` : 'Sin líneas'} />
                  </div>

                  <div className="mt-5 grid gap-2">
                    <button
                      type="button"
                      onClick={validateOrder}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
                    >
                      <Send className="h-4 w-4" />
                      Validar y enviar a ERP
                    </button>
                    {selectedOrder.status === 'Bloqueado' && (
                      <button
                        type="button"
                        onClick={() => approveSelectedOrder()}
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-800 px-4 py-3 text-sm text-zinc-300 transition hover:border-emerald-500/40 hover:text-white"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Autorizar bloqueo
                      </button>
                    )}
                  </div>
                </Panel>

                <Panel title="Sincronización" eyebrow="Integraciones">
                  <div className="space-y-2">
                    <SyncRow icon={PackageCheck} label="Inventario" active={syncState !== 'draft'} detail="Reserva de stock" />
                    <SyncRow icon={Database} label="ERP" active={syncState === 'synced'} detail="Pedido y crédito" />
                    <SyncRow icon={Building2} label="CRM" active={syncState === 'synced'} detail="Cuenta y oportunidad" />
                    <SyncRow icon={Truck} label="Logística" active={syncState === 'synced'} detail="Preparación y ruta" />
                  </div>
                </Panel>

                <Panel title="Actividad" eyebrow="Registro">
                  <div className="space-y-2">
                    {log.map((item) => (
                      <div key={item} className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-300">
                        {item}
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
              </section>
            )}

            {activeModule === 'inventory' && (
              <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                <Panel title="Mapa de inventario" eyebrow="Almacén">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                      <thead className="border-b border-zinc-800 text-xs uppercase tracking-[0.12em] text-zinc-500">
                        <tr>
                          <th className="px-4 py-3">SKU</th>
                          <th className="px-4 py-3">Producto</th>
                          <th className="px-4 py-3">Ubicación</th>
                          <th className="px-4 py-3">Disponible</th>
                          <th className="px-4 py-3">Mínimo</th>
                          <th className="px-4 py-3">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => {
                          const available = product.stock - product.reserved;
                          const stockWarning = available <= product.min;

                          return (
                            <tr key={product.id} className="border-b border-zinc-900 last:border-0">
                              <td className="px-4 py-3 font-mono text-xs text-zinc-500">{product.sku}</td>
                              <td className="px-4 py-3">
                                <p className="font-medium text-white">{product.name}</p>
                                <p className="text-xs text-zinc-500">{product.family}</p>
                              </td>
                              <td className="px-4 py-3 text-zinc-300">{product.location}</td>
                              <td className="px-4 py-3">
                                <span className={stockWarning ? 'text-amber-200' : 'text-emerald-300'}>
                                  {available} {product.unit}
                                </span>
                                <p className="text-xs text-zinc-600">Stock {product.stock} · Reservado {product.reserved}</p>
                              </td>
                              <td className="px-4 py-3 text-zinc-400">{product.min} {product.unit}</td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => changeQuantity(product.id, 1)}
                                    className="rounded-md border border-zinc-800 px-3 py-2 text-xs text-zinc-300 transition hover:border-indigo-400 hover:text-white"
                                  >
                                    Añadir a pedido
                                  </button>
                                  {stockWarning && (
                                    <button
                                      type="button"
                                      onClick={() => createReplenishment(product)}
                                      className="rounded-md bg-amber-300 px-3 py-2 text-xs font-semibold text-black transition hover:bg-amber-200"
                                    >
                                      Reponer
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Panel>

                <div className="grid gap-4">
                  <Panel title="Alertas automáticas" eyebrow="Reposición">
                    <div className="space-y-3">
                      {lowStock.map((product) => {
                        const available = product.stock - product.reserved;

                        return (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => createReplenishment(product)}
                            className="w-full rounded-md border border-amber-500/20 bg-amber-500/10 p-3 text-left transition hover:border-amber-300/50"
                          >
                            <p className="text-sm font-semibold text-amber-100">{product.name}</p>
                            <p className="mt-1 text-xs text-amber-200/70">
                              Disponible {available} {product.unit}. Mínimo recomendado {product.min}.
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </Panel>

                  <Panel title="Borrador conectado" eyebrow="Pedido actual">
                    <div className="space-y-3">
                      <DataRow label="Cliente activo" value={selectedCustomer.name} />
                      <DataRow label="Líneas añadidas" value={selectedLines.length ? String(selectedLines.length) : '0'} />
                      <DataRow label="Importe estimado" value={formatCurrency(draftValue)} />
                      <button
                        type="button"
                        onClick={validateOrder}
                        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
                      >
                        <Send className="h-4 w-4" />
                        Validar stock y enviar
                      </button>
                    </div>
                  </Panel>
                </div>
              </section>
            )}

            {activeModule === 'customers' && (
              <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                <Panel title="Cartera de clientes" eyebrow="CRM">
                  <div className="grid gap-3">
                    {customers.map((customer) => {
                      const selected = customer.id === selectedCustomer.id;
                      const ratio = Math.round((customer.creditUsed / customer.creditLimit) * 100);

                      return (
                        <button
                          key={customer.id}
                          type="button"
                          onClick={() => selectCustomer(customer)}
                          className={`rounded-md border p-4 text-left transition ${
                            selected ? 'border-indigo-400/60 bg-indigo-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-white">{customer.name}</p>
                              <p className="mt-1 text-sm text-zinc-500">{customer.tier} · {customer.terms}</p>
                            </div>
                            <span className={ratio > 85 ? 'text-sm text-red-300' : 'text-sm text-emerald-300'}>{ratio}% crédito</span>
                          </div>
                          <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-900">
                            <div
                              className={`h-full rounded-full ${ratio > 85 ? 'bg-red-400' : ratio > 70 ? 'bg-amber-300' : 'bg-emerald-400'}`}
                              style={{ width: `${Math.min(100, ratio)}%` }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </Panel>

                <div className="grid gap-4">
                  <Panel title={selectedCustomer.name} eyebrow="Ficha operativa">
                    <div className="grid gap-3 md:grid-cols-2">
                      <DataRow label="Condiciones" value={selectedCustomer.terms} />
                      <DataRow label="Facturas pendientes" value={String(selectedCustomer.pendingInvoices)} />
                      <DataRow label="Crédito usado" value={formatCurrency(selectedCustomer.creditUsed)} />
                      <DataRow label="Límite aprobado" value={formatCurrency(selectedCustomer.creditLimit)} />
                    </div>
                  </Panel>

                  <Panel title="Histórico y pedidos vivos" eyebrow="Actividad cliente">
                    <div className="space-y-2">
                      {selectedCustomerOrders.map((order) => (
                        <button
                          key={order.id}
                          type="button"
                          onClick={() => selectOrder(order)}
                          className="flex w-full items-center justify-between gap-3 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-3 text-left transition hover:border-indigo-400/40"
                        >
                          <span>
                            <span className="block text-sm font-semibold text-white">{order.id}</span>
                            <span className="block text-xs text-zinc-500">{order.channel} · {order.lines} líneas</span>
                          </span>
                          <span className="text-right">
                            <span className="block text-sm text-zinc-200">{formatCurrency(order.value)}</span>
                            <span className={`mt-1 inline-flex rounded-md border px-2 py-1 text-xs ${statusClass(order.status)}`}>
                              {order.status}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </Panel>
                </div>
              </section>
            )}

            {activeModule === 'finance' && (
              <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
                <Panel title="Riesgo de crédito por cliente" eyebrow="Finanzas">
                  <div className="space-y-4">
                    {customers.map((customer) => {
                      const ratio = Math.round((customer.creditUsed / customer.creditLimit) * 100);

                      return (
                        <div key={customer.id} className="rounded-md border border-zinc-800 bg-zinc-950 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-white">{customer.name}</p>
                              <p className="text-xs text-zinc-500">{customer.pendingInvoices} facturas pendientes</p>
                            </div>
                            <p className={ratio > 85 ? 'font-semibold text-red-300' : 'font-semibold text-zinc-200'}>{ratio}%</p>
                          </div>
                          <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-900">
                            <div
                              className={`h-full rounded-full ${ratio > 85 ? 'bg-red-400' : ratio > 70 ? 'bg-amber-300' : 'bg-emerald-400'}`}
                              style={{ width: `${Math.min(100, ratio)}%` }}
                            />
                          </div>
                          <p className="mt-2 text-xs text-zinc-500">
                            {formatCurrency(customer.creditUsed)} usado de {formatCurrency(customer.creditLimit)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </Panel>

                <div className="grid gap-4">
                  <Panel title="Pedidos bloqueados" eyebrow="Control automático">
                    <div className="space-y-3">
                      {orders.filter((order) => order.status === 'Bloqueado').map((order) => {
                        const customer = customers.find((item) => item.id === order.customerId) ?? customers[0];

                        return (
                          <div key={order.id} className="rounded-md border border-red-500/20 bg-red-500/10 p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold text-white">{order.id}</p>
                                <p className="mt-1 text-sm text-red-200/70">{customer.name} · {order.due}</p>
                              </div>
                              <p className="font-semibold text-red-100">{formatCurrency(order.value)}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => approveSelectedOrder(order.id)}
                              className="mt-3 rounded-md border border-red-300/30 px-3 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-300 hover:text-black"
                            >
                              Autorizar manualmente
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </Panel>

                  <Panel title="Reglas configurables" eyebrow="Motor de decisión">
                    <div className="grid gap-2 text-sm text-zinc-300">
                      <SyncRow icon={FileText} label="Bloqueo por crédito" active detail="Límite superior al 85%" />
                      <SyncRow icon={AlertTriangle} label="Aviso de morosidad" active={selectedCustomer.pendingInvoices > 0} detail="Facturas pendientes" />
                      <SyncRow icon={CheckCircle2} label="Autorización comercial" active={syncState === 'synced'} detail="Permisos y trazabilidad" />
                    </div>
                  </Panel>
                </div>
              </section>
            )}

            {activeModule === 'integrations' && (
              <section className="grid gap-4 xl:grid-cols-[1fr_0.85fr]">
                <Panel title="Arquitectura conectada" eyebrow="Flujos">
                  <div className="grid gap-3 md:grid-cols-2">
                    {[
                      { label: 'Portal B2B → ERP', detail: 'Pedidos, precios, crédito y estado', icon: Database },
                      { label: 'ERP → Inventario', detail: 'Stock, reservas y reposición', icon: PackageCheck },
                      { label: 'CRM → Comercial', detail: 'Cuenta, prioridad y oportunidades', icon: Building2 },
                      { label: 'Logística → Cliente', detail: 'Preparación, ruta y notificaciones', icon: Truck }
                    ].map((item) => {
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => runIntegrationSync(item.label)}
                          className="rounded-md border border-zinc-800 bg-zinc-950 p-4 text-left transition hover:border-indigo-400/50"
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-300">
                            <Icon className="h-5 w-5" />
                          </span>
                          <p className="mt-4 font-semibold text-white">{item.label}</p>
                          <p className="mt-1 text-sm text-zinc-500">{item.detail}</p>
                          <p className="mt-4 text-xs font-semibold text-indigo-200">Lanzar sync →</p>
                        </button>
                      );
                    })}
                  </div>
                </Panel>

                <div className="grid gap-4">
                  <Panel title="Estado de sincronización" eyebrow="Conectores">
                    <div className="space-y-2">
                      <SyncRow icon={PackageCheck} label="Inventario" active={syncState !== 'draft'} detail="Reservas y stock" />
                      <SyncRow icon={Database} label="ERP" active={syncState === 'synced'} detail="Pedidos y crédito" />
                      <SyncRow icon={Building2} label="CRM" active={syncState === 'synced'} detail="Cuenta comercial" />
                      <SyncRow icon={Truck} label="Logística" active={syncState === 'synced'} detail="Ruta y tracking" />
                    </div>
                  </Panel>

                  <Panel title="Registro técnico" eyebrow="Webhooks">
                    <div className="space-y-2">
                      {log.map((item) => (
                        <div key={item} className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-300">
                          {item}
                        </div>
                      ))}
                    </div>
                  </Panel>
                </div>
              </section>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function Panel({
  title,
  eyebrow,
  action,
  children
}: {
  title: string;
  eyebrow: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-zinc-800 bg-black">
      <div className="flex min-h-14 items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.16em] text-zinc-500">{eyebrow}</p>
          <h2 className="mt-1 text-base font-semibold text-white">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function Kpi({
  label,
  value,
  icon: Icon,
  tone = 'default'
}: {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  tone?: 'default' | 'warning';
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-black p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-mono uppercase tracking-[0.14em] text-zinc-500">{label}</p>
        <Icon className={tone === 'warning' ? 'h-4 w-4 text-amber-300' : 'h-4 w-4 text-zinc-500'} />
      </div>
      <p className={tone === 'warning' ? 'mt-3 text-2xl font-semibold text-amber-200' : 'mt-3 text-2xl font-semibold text-white'}>
        {value}
      </p>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-zinc-900 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-zinc-500">{label}</span>
      <span className="max-w-[62%] text-right text-sm font-medium text-zinc-200">{value}</span>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  icon: Icon,
  primary = false
}: {
  label: string;
  onClick: () => void;
  icon: ComponentType<{ className?: string }>;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={
        primary
          ? 'flex h-9 w-9 items-center justify-center rounded-md bg-indigo-500 text-white transition hover:bg-indigo-400'
          : 'flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 text-zinc-300 transition hover:border-zinc-600 hover:text-white'
      }
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function SyncRow({
  icon: Icon,
  label,
  detail,
  active
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  detail: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2">
      <span className="flex min-w-0 items-center gap-3">
        <Icon className={active ? 'h-4 w-4 shrink-0 text-emerald-300' : 'h-4 w-4 shrink-0 text-zinc-600'} />
        <span className="min-w-0">
          <span className="block text-sm text-zinc-200">{label}</span>
          <span className="block truncate text-xs text-zinc-500">{detail}</span>
        </span>
      </span>
      {active ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
      ) : (
        <span className="text-xs text-zinc-600">pendiente</span>
      )}
    </div>
  );
}

function StatusDot({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-zinc-400">{label}</span>
      <span className={active ? 'h-2 w-2 rounded-full bg-emerald-400' : 'h-2 w-2 rounded-full bg-zinc-700'} />
    </div>
  );
}
