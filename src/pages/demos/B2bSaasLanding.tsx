import { startTransition, useEffect, useMemo, useState } from 'react';
import type { ComponentType, ReactNode } from 'react';
import {
  Activity,
  ArrowRight,
  BellRing,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Database,
  Layers3,
  PackageCheck,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Warehouse,
  Workflow,
} from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

type ModuleKey = 'overview' | 'orders' | 'inventory' | 'customers' | 'finance' | 'integrations';
type OrderStatus = 'Nuevo' | 'Validando' | 'Bloqueado' | 'Listo';
type SyncStatus = 'live' | 'syncing' | 'queued';
type Health = 'Alta' | 'Media' | 'Riesgo';

type Order = {
  id: string;
  account: string;
  value: number;
  channel: string;
  status: OrderStatus;
  due: string;
  progress: number;
  issue: string;
};

type StockItem = {
  sku: string;
  name: string;
  available: number;
  reserved: number;
  min: number;
  location: string;
  supplier: string;
};

type Account = {
  id: string;
  name: string;
  health: Health;
  creditUsed: number;
  creditLimit: number;
  pendingInvoices: number;
  openTasks: number;
  segment: string;
};

type Task = {
  id: string;
  title: string;
  owner: string;
  priority: 'Alta' | 'Media';
  done: boolean;
};

type ActivityItem = {
  id: string;
  title: string;
  meta: string;
  tone: 'neutral' | 'info' | 'success' | 'alert';
};

const modules: Array<{
  key: ModuleKey;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  {
    key: 'overview',
    label: 'Executive',
    eyebrow: 'Command center',
    title: 'Panel ejecutivo para operaciones B2B',
    description: 'Resumen, bloqueos, tareas y decisiones que hoy mueven pedidos, stock y cuentas.',
    icon: Layers3,
  },
  {
    key: 'orders',
    label: 'Pedidos',
    eyebrow: 'Order desk',
    title: 'Pedidos con aprobacion y salida visibles',
    description: 'La cola deja de vivir en correo y pasa a una vista con progreso, riesgo y accion.',
    icon: ClipboardList,
  },
  {
    key: 'inventory',
    label: 'Stock',
    eyebrow: 'Stock sync',
    title: 'Stock conectado con reposicion y riesgo',
    description: 'Minimos, reservas y roturas aparecen antes de bloquear una entrega importante.',
    icon: Warehouse,
  },
  {
    key: 'customers',
    label: 'Clientes',
    eyebrow: 'Account health',
    title: 'Cuentas y salud operativa del cliente',
    description: 'Cada cuenta muestra credito, incidencias y carga operativa sin salir del panel.',
    icon: UsersRound,
  },
  {
    key: 'finance',
    label: 'Finanzas',
    eyebrow: 'Credit control',
    title: 'Credito, bloqueos y aprobaciones documentadas',
    description: 'Finanzas deja de llegar tarde porque el riesgo se muestra en el flujo, no despues.',
    icon: CreditCard,
  },
  {
    key: 'integrations',
    label: 'Integraciones',
    eyebrow: 'System sync',
    title: 'ERP, CRM y alertas en una misma capa',
    description: 'Cada conector enseña estado real y consecuencia visible para operaciones.',
    icon: Workflow,
  },
];

const initialOrders: Order[] = [
  {
    id: 'PED-1048',
    account: 'Reformas Norte',
    value: 4280,
    channel: 'Portal B2B',
    status: 'Nuevo',
    due: 'Hoy 16:30',
    progress: 28,
    issue: 'Esperando validacion comercial',
  },
  {
    id: 'PED-1047',
    account: 'Hotel Arce',
    value: 12600,
    channel: 'Comercial',
    status: 'Listo',
    due: 'Salida 18:20',
    progress: 100,
    issue: 'Preparacion cerrada y aviso enviado',
  },
  {
    id: 'PED-1046',
    account: 'Obra Sur',
    value: 8900,
    channel: 'CSV semanal',
    status: 'Bloqueado',
    due: 'Revision de credito',
    progress: 54,
    issue: 'Credito fuera de politica y stock sensible',
  },
  {
    id: 'PED-1045',
    account: 'Reformas Norte',
    value: 1650,
    channel: 'WhatsApp',
    status: 'Validando',
    due: 'Hoy 18:00',
    progress: 62,
    issue: 'Asignado a compras para confirmar disponibilidad',
  },
];

const initialStock: StockItem[] = [
  { sku: 'MAT-204', name: 'Adhesivo flexible C2TE', available: 148, reserved: 36, min: 80, location: 'A-12', supplier: 'Kerakoll' },
  { sku: 'BAN-118', name: 'Mampara frontal 120 cm', available: 24, reserved: 18, min: 30, location: 'B-03', supplier: 'Lasser' },
  { sku: 'GRF-077', name: 'Griferia monomando inox', available: 45, reserved: 22, min: 40, location: 'C-18', supplier: 'AquaPro' },
  { sku: 'CER-431', name: 'Porcelanico gris 60x60', available: 188, reserved: 124, min: 180, location: 'D-21', supplier: 'Atlas' },
  { sku: 'FON-552', name: 'Valvula anti-retorno', available: 7, reserved: 9, min: 25, location: 'C-07', supplier: 'Fluxor' },
];

const initialAccounts: Account[] = [
  { id: 'reformas-norte', name: 'Reformas Norte', health: 'Alta', creditUsed: 12600, creditLimit: 30000, pendingInvoices: 1, openTasks: 2, segment: 'Obra y reforma' },
  { id: 'hotel-arce', name: 'Hotel Arce', health: 'Media', creditUsed: 22400, creditLimit: 45000, pendingInvoices: 0, openTasks: 1, segment: 'Hospitality' },
  { id: 'obra-sur', name: 'Obra Sur', health: 'Riesgo', creditUsed: 31800, creditLimit: 36000, pendingInvoices: 3, openTasks: 4, segment: 'Constructora' },
];

const initialTasks: Task[] = [
  { id: 'task-1', title: 'Autorizar PED-1046 y documentar excepcion', owner: 'Finanzas', priority: 'Alta', done: false },
  { id: 'task-2', title: 'Lanzar reposicion de FON-552', owner: 'Compras', priority: 'Alta', done: false },
  { id: 'task-3', title: 'Enviar resumen de salida a comercial', owner: 'Ops', priority: 'Media', done: false },
];

const initialActivity: ActivityItem[] = [
  {
    id: 'activity-1',
    title: 'Credito de Obra Sur sincronizado',
    meta: 'ERP · hace 1 min',
    tone: 'info',
  },
  {
    id: 'activity-2',
    title: 'Stock minimo detectado en FON-552',
    meta: 'Alerta preventiva · hace 3 min',
    tone: 'alert',
  },
  {
    id: 'activity-3',
    title: 'Hotel Arce preparado para salida',
    meta: 'Logistica · hace 5 min',
    tone: 'success',
  },
];

const connectorLabels = ['ERP', 'CRM', 'Logistica', 'Alertas'] as const;

export function B2bSaasLanding() {
  const [activeModule, setActiveModule] = useState<ModuleKey>('overview');
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [stock, setStock] = useState<StockItem[]>(initialStock);
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activity, setActivity] = useState<ActivityItem[]>(initialActivity);
  const [selectedOrderId, setSelectedOrderId] = useState(initialOrders[2].id);
  const [selectedAccountId, setSelectedAccountId] = useState(initialAccounts[2].id);
  const [connectorState, setConnectorState] = useState<Record<(typeof connectorLabels)[number], SyncStatus>>({
    ERP: 'live',
    CRM: 'queued',
    Logistica: 'live',
    Alertas: 'live',
  });

  const currentModule = modules.find((item) => item.key === activeModule) ?? modules[0];
  const selectedOrder = orders.find((item) => item.id === selectedOrderId) ?? orders[0];
  const selectedAccount = accounts.find((item) => item.id === selectedAccountId) ?? accounts[0];
  const lowStockItem = [...stock].sort((left, right) => (left.available - left.min) - (right.available - right.min))[0] ?? stock[0];

  const summary = useMemo(() => {
    const liveConnectors = Object.values(connectorState).filter((item) => item === 'live').length;
    const blockedOrders = orders.filter((item) => item.status === 'Bloqueado').length;
    const openTasks = tasks.filter((item) => !item.done).length;
    const lowStock = stock.filter((item) => item.available <= item.min).length;
    const throughput = orders.reduce((sum, item) => sum + item.value, 0);

    return {
      liveConnectors,
      blockedOrders,
      openTasks,
      lowStock,
      throughput,
    };
  }, [connectorState, orders, stock, tasks]);

  useEffect(() => {
    trackEvent('demo_open', { demo: 'b2b_autoflow_erp' });
  }, []);

  function addActivity(title: string, meta: string, tone: ActivityItem['tone']) {
    setActivity((current) => [
      { id: `${title}-${Date.now()}-${current.length}`, title, meta, tone },
      ...current,
    ].slice(0, 8));
  }

  function switchModule(nextModule: ModuleKey) {
    startTransition(() => setActiveModule(nextModule));
    trackEvent('demo_module_change', { demo: 'b2b_autoflow_erp', module: nextModule });
  }

  function selectOrder(orderId: string) {
    const nextOrder = orders.find((item) => item.id === orderId);
    setSelectedOrderId(orderId);
    if (nextOrder) {
      const linkedAccount = accounts.find((item) => item.name === nextOrder.account);
      if (linkedAccount) {
        setSelectedAccountId(linkedAccount.id);
      }
      addActivity(`Pedido abierto: ${orderId}`, `${nextOrder.account} · ${nextOrder.channel}`, 'info');
    }
    trackEvent('demo_action_triggered', { demo: 'b2b_autoflow_erp', action: 'select_order', order: orderId });
  }

  function selectAccount(accountId: string) {
    const nextAccount = accounts.find((item) => item.id === accountId);
    if (!nextAccount) {
      return;
    }

    setSelectedAccountId(accountId);
    addActivity(`Cuenta abierta: ${nextAccount.name}`, `${nextAccount.segment} · ${nextAccount.health}`, 'info');
    trackEvent('demo_action_triggered', { demo: 'b2b_autoflow_erp', action: 'select_account', account: accountId });
  }

  function approveBlockedOrder(orderId: string) {
    const approvedOrder = orders.find((item) => item.id === orderId);
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? { ...order, status: 'Listo', due: 'Salida autorizada', progress: 100, issue: 'Credito validado y pedido liberado' }
          : order
      )
    );
    setTasks((current) => current.map((task) => (task.id === 'task-1' ? { ...task, done: true } : task)));
    addActivity(`Bloqueo resuelto: ${orderId}`, `${approvedOrder?.account ?? 'Cuenta'} · salida autorizada`, 'success');
    trackEvent('demo_action_triggered', { demo: 'b2b_autoflow_erp', action: 'approve_block', order: orderId });
  }

  function replenishStock(sku: string) {
    const product = stock.find((item) => item.sku === sku);
    setStock((current) => current.map((item) => (item.sku === sku ? { ...item, available: item.available + 24 } : item)));
    setTasks((current) => current.map((task) => (task.id === 'task-2' ? { ...task, done: true } : task)));
    addActivity(`Reposicion lanzada: ${sku}`, `${product?.name ?? sku} · pedido al proveedor`, 'success');
    trackEvent('demo_action_triggered', { demo: 'b2b_autoflow_erp', action: 'replenish_stock', sku });
  }

  function syncConnector(name: (typeof connectorLabels)[number]) {
    setConnectorState((current) => ({ ...current, [name]: 'syncing' }));
    addActivity(`Sincronizando ${name}`, 'Latencia estimada 0.4s', 'info');
    trackEvent('demo_action_triggered', { demo: 'b2b_autoflow_erp', action: 'sync_connector', connector: name });

    window.setTimeout(() => {
      setConnectorState((current) => ({ ...current, [name]: 'live' }));
      addActivity(`${name} en estado live`, 'Sin errores ni colas pendientes', 'success');
    }, 650);
  }

  function completeTask(taskId: string) {
    const task = tasks.find((item) => item.id === taskId);
    setTasks((current) => current.map((item) => (item.id === taskId ? { ...item, done: true } : item)));
    addActivity(`Tarea completada: ${task?.title ?? taskId}`, `${task?.owner ?? 'Equipo'} · prioridad ${task?.priority ?? 'Media'}`, 'success');
    trackEvent('demo_action_triggered', { demo: 'b2b_autoflow_erp', action: 'complete_task', task: taskId });
  }

  function resetDemo() {
    setActiveModule('overview');
    setOrders(initialOrders);
    setStock(initialStock);
    setAccounts(initialAccounts);
    setTasks(initialTasks);
    setActivity(initialActivity);
    setSelectedOrderId(initialOrders[2].id);
    setSelectedAccountId(initialAccounts[2].id);
    setConnectorState({
      ERP: 'live',
      CRM: 'queued',
      Logistica: 'live',
      Alertas: 'live',
    });
    trackEvent('demo_action_triggered', { demo: 'b2b_autoflow_erp', action: 'reset' });
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#090b0d] text-[#eef5f5]">
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_18%_4%,rgba(0,245,255,0.12),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(20,184,166,0.12),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent)]" />
      <main className="relative mx-auto grid w-full max-w-[1580px] gap-4 px-4 py-4 xl:grid-cols-[236px_minmax(0,1fr)_336px]">
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
                No solo ERP: tambien portales, dashboards, integraciones, IA aplicada, herramientas internas y piezas a medida.
              </p>
            </div>
          </div>
        </aside>

        <section className="min-w-0 space-y-4">
          <header className="overflow-hidden rounded-[32px] border border-white/8 bg-[#101518]">
            <div className="flex flex-col gap-4 border-b border-white/8 p-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-mono uppercase tracking-[0.24em] text-cyan-300">{currentModule.eyebrow}</p>
                <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight text-white md:text-5xl">
                  {currentModule.title}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#a3b2b6] md:text-lg">
                  {currentModule.description}
                </p>
              </div>

              <div className="w-full max-w-[420px] space-y-3">
                <div className="flex items-center gap-2 rounded-2xl border border-white/8 bg-[#0b1013] px-4 py-3 text-sm text-[#8ea3a7]">
                  <Search className="h-4 w-4 text-cyan-300" />
                  Buscar pedido, cuenta, sku o alerta
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={resetDemo}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm font-medium text-[#d6e1e3] transition hover:border-white/20 hover:text-white"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset demo
                  </button>
                  <a
                    href="/contacto?service=software-e-integraciones&problem=Quiero%20un%20panel%20operativo%20tipo%20ERP%20para%20pedidos,%20stock%20y%20aprobaciones"
                    onClick={() => trackEvent('demo_cta_click', { demo: 'b2b_autoflow_erp', location: 'header' })}
                    className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-semibold text-[#061014] transition hover:bg-cyan-200"
                  >
                    Hablar del proyecto
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="System health" value={`${summary.liveConnectors}/4 live`} hint="ERP, CRM y alertas" icon={Sparkles} accent="cyan" />
              <MetricCard label="Pending approvals" value={String(summary.blockedOrders + summary.openTasks)} hint="Bloqueos y tareas del dia" icon={ShieldCheck} accent="amber" />
              <MetricCard label="Throughput" value={formatCurrency(summary.throughput)} hint="Volumen hoy en operacion" icon={Database} accent="emerald" />
              <MetricCard label="Active alerts" value={String(summary.lowStock)} hint="Productos por debajo de minimo" icon={BellRing} accent="rose" />
            </div>
          </header>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
            <div className="min-w-0 space-y-4">
              {activeModule === 'overview' ? (
                <>
                  <Panel title="Operational board" eyebrow="Lo que esta pasando ahora">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="border-b border-white/8 text-xs uppercase tracking-[0.2em] text-[#708488]">
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
                  <Panel title="Que hace wow en 10 segundos" eyebrow="Valor visible">
                    <div className="grid gap-3 md:grid-cols-3">
                      <OutcomeRow label="Pedido" value="La cola ya no es correo: tiene progreso, riesgo y responsable." tone="cyan" />
                      <OutcomeRow label="Stock" value="Las roturas se ven antes y disparan una accion clara." tone="emerald" />
                      <OutcomeRow label="Credito" value="Los bloqueos aparecen dentro del flujo y no fuera de sistema." tone="rose" />
                    </div>
                  </Panel>
                </>
              ) : null}

              {activeModule === 'orders' ? (
                <div className="space-y-4">
                  <Panel title="Pedidos por estado" eyebrow="Cola de trabajo">
                    <div className="grid gap-3 xl:grid-cols-2">
                      {(['Nuevo', 'Validando', 'Bloqueado', 'Listo'] as OrderStatus[]).map((status) => (
                        <div key={status} className="min-w-0 rounded-2xl border border-white/8 bg-[#0b1013] p-3">
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">{status}</p>
                            <span className="rounded-full border border-white/8 px-2 py-1 text-xs text-[#a9bbbf]">
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
                                  className={`w-full rounded-2xl border p-3 text-left transition ${
                                    order.id === selectedOrderId
                                      ? 'border-cyan-300/25 bg-cyan-400/10'
                                      : 'border-white/8 bg-white/[0.02] hover:border-cyan-300/20 hover:bg-white/[0.04]'
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
                      <div className="rounded-2xl border border-white/8 bg-[#0b1013] p-4">
                        <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">Riesgo visible</p>
                        <p className="mt-3 text-lg font-semibold text-white">{selectedOrder.issue}</p>
                        <p className="mt-2 text-sm leading-6 text-[#9eb0b4]">
                          La decision operativa aparece dentro del flujo, no como una nota suelta fuera de sistema.
                        </p>
                      </div>
                      {selectedOrder.status === 'Bloqueado' ? (
                        <button
                          type="button"
                          onClick={() => approveBlockedOrder(selectedOrder.id)}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-300 px-4 py-3 text-sm font-semibold text-[#221607] transition hover:bg-amber-200"
                        >
                          <ShieldCheck className="h-4 w-4" />
                          Autorizar y liberar pedido
                        </button>
                      ) : (
                        <div className="rounded-2xl border border-emerald-400/18 bg-emerald-400/8 px-4 py-3 text-sm text-emerald-50">
                          Pedido sin bloqueo critico. El sistema ya muestra el siguiente paso con contexto.
                        </div>
                      )}
                    </div>
                  </Panel>
                </div>
              ) : null}

              {activeModule === 'inventory' ? (
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
              ) : null}

              {activeModule === 'customers' ? (
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.02fr)_minmax(320px,0.98fr)]">
                  <Panel title="Cartera operativa" eyebrow="Health view">
                    <div className="space-y-3">
                      {accounts.map((account) => (
                        <button
                          key={account.id}
                          type="button"
                          onClick={() => selectAccount(account.id)}
                          className={`w-full rounded-2xl border p-4 text-left transition ${
                            account.id === selectedAccountId
                              ? 'border-cyan-300/25 bg-cyan-400/10'
                              : 'border-white/8 bg-[#0b1013] hover:border-cyan-300/20 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-white">{account.name}</p>
                              <p className="mt-2 text-sm text-[#8ea3a7]">
                                {account.segment} · tareas {account.openTasks} · facturas {account.pendingInvoices}
                              </p>
                            </div>
                            <HealthBadge health={account.health} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </Panel>

                  <Panel title="Cuenta seleccionada" eyebrow="Ficha accionable">
                    <DetailGrid
                      items={[
                        ['Cliente', selectedAccount.name],
                        ['Segmento', selectedAccount.segment],
                        ['Credito', `${formatCurrency(selectedAccount.creditUsed)} / ${formatCurrency(selectedAccount.creditLimit)}`],
                        ['Facturas', String(selectedAccount.pendingInvoices)],
                        ['Salud', selectedAccount.health],
                      ]}
                    />
                    <div className="mt-4 rounded-2xl border border-white/8 bg-[#0b1013] p-4">
                      <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">Que gana comercial</p>
                      <p className="mt-3 text-sm leading-6 text-[#d5e0e2]">
                        En una demo comercial se entiende que la cuenta no es solo CRM: es operativa, credito y seguimiento.
                      </p>
                    </div>
                  </Panel>
                </div>
              ) : null}

              {activeModule === 'finance' ? (
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
              ) : null}

              {activeModule === 'integrations' ? (
                <div className="space-y-4">
                  <Panel title="Conectores activos" eyebrow="Estado por sistema">
                    <div className="grid gap-3 xl:grid-cols-2">
                      {connectorLabels.map((connector) => (
                        <button
                          key={connector}
                          type="button"
                          onClick={() => syncConnector(connector)}
                          className="min-w-0 rounded-2xl border border-white/8 bg-[#0b1013] p-4 text-left transition hover:border-cyan-300/20 hover:bg-white/[0.04]"
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
              ) : null}
            </div>

            <aside className="min-w-0 space-y-4">
              <Panel title="Insight seleccionado" eyebrow="Lo que se entiende rapido">
                {renderInsightPanel({
                  activeModule,
                  selectedOrder,
                  selectedAccount,
                  lowStockItem,
                  connectorState,
                })}
              </Panel>

              <Panel title="Resultado comercial" eyebrow="Demo con gancho">
                <div className="space-y-3">
                  <OutcomeRow label="Antes" value="Pedidos, stock y credito van cada uno por su lado." tone="rose" />
                  <OutcomeRow label="Ahora" value="Todo aparece como una cola operativa con consecuencias visibles." tone="emerald" />
                  <OutcomeRow label="Por que vende" value="El visitante imagina su operativa dentro de este panel." tone="cyan" />
                </div>
              </Panel>
            </aside>
          </div>
        </section>

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
              <span className="block text-sm font-semibold">Pedir diagnostico de ERP interno</span>
              <span className="mt-1 block text-xs text-cyan-100/75">Pedidos, stock, credito y aprobaciones</span>
            </span>
            <ArrowRight className="h-5 w-5" />
          </a>
        </aside>
      </main>
    </div>
  );
}

function renderInsightPanel({
  activeModule,
  selectedOrder,
  selectedAccount,
  lowStockItem,
  connectorState,
}: {
  activeModule: ModuleKey;
  selectedOrder: Order;
  selectedAccount: Account;
  lowStockItem: StockItem;
  connectorState: Record<(typeof connectorLabels)[number], SyncStatus>;
}) {
  if (activeModule === 'overview' || activeModule === 'orders') {
    return (
      <div className="space-y-4">
        <DetailGrid
          items={[
            ['Pedido', selectedOrder.id],
            ['Cuenta', selectedOrder.account],
            ['Estado', selectedOrder.status],
            ['Progreso', `${selectedOrder.progress}%`],
          ]}
        />
        <div className="rounded-2xl border border-white/8 bg-[#0b1013] p-4">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">Consecuencia visible</p>
          <p className="mt-3 text-sm leading-6 text-[#d4dfe1]">{selectedOrder.issue}</p>
        </div>
      </div>
    );
  }

  if (activeModule === 'inventory') {
    return (
      <div className="space-y-4">
        <DetailGrid
          items={[
            ['SKU', lowStockItem.sku],
            ['Producto', lowStockItem.name],
            ['Disponible', String(lowStockItem.available)],
            ['Minimo', String(lowStockItem.min)],
          ]}
        />
        <div className="rounded-2xl border border-amber-300/18 bg-amber-300/8 p-4 text-sm leading-6 text-amber-50">
          Si esto no se ve antes, un pedido grande se rompe despues. Aqui el riesgo ya es accion.
        </div>
      </div>
    );
  }

  if (activeModule === 'customers' || activeModule === 'finance') {
    return (
      <div className="space-y-4">
        <DetailGrid
          items={[
            ['Cliente', selectedAccount.name],
            ['Segmento', selectedAccount.segment],
            ['Salud', selectedAccount.health],
            ['Credito usado', formatCurrency(selectedAccount.creditUsed)],
          ]}
        />
        <div className="rounded-2xl border border-white/8 bg-[#0b1013] p-4">
          <p className="text-sm leading-6 text-[#d4dfe1]">
            En una reunion comercial se entiende rapido que la cuenta tiene contexto operativo, no solo ficha.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {connectorLabels.map((connector) => (
        <div key={connector} className="flex items-center justify-between rounded-2xl border border-white/8 bg-[#0b1013] px-4 py-3">
          <span className="text-sm text-white">{connector}</span>
          <ConnectorBadge status={connectorState[connector]} />
        </div>
      ))}
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  icon: ComponentType<{ className?: string }>;
  accent: 'cyan' | 'amber' | 'emerald' | 'rose';
}) {
  const palette =
    accent === 'cyan'
      ? 'bg-cyan-400/12 text-cyan-200'
      : accent === 'amber'
        ? 'bg-amber-300/12 text-amber-100'
        : accent === 'emerald'
          ? 'bg-emerald-400/12 text-emerald-100'
          : 'bg-rose-400/12 text-rose-100';

  return (
    <div className="rounded-2xl border border-white/8 bg-[#0b1013] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-2xl ${palette}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-[#8ea3a7]">{hint}</p>
    </div>
  );
}

function Panel({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-[28px] border border-white/8 bg-[#101518] p-5">
      <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#708488]">{eyebrow}</p>
      <h2 className="mt-2 text-[1.65rem] font-semibold leading-tight text-white">{title}</h2>
      <div className="mt-4 min-w-0">{children}</div>
    </section>
  );
}

function TaskList({
  tasks,
  onComplete,
  compact = false,
}: {
  tasks: Task[];
  onComplete: (taskId: string) => void;
  compact?: boolean;
}) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <button
          key={task.id}
          type="button"
          onClick={() => onComplete(task.id)}
          className={`w-full rounded-2xl border p-4 text-left transition ${
            task.done
              ? 'border-emerald-400/18 bg-emerald-400/8'
              : 'border-white/8 bg-[#0b1013] hover:border-cyan-300/20 hover:bg-white/[0.04]'
          } ${compact ? 'px-4 py-3' : ''}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-6 text-white">{task.title}</p>
              <p className="mt-1 text-sm text-[#8ea3a7]">{task.owner} · prioridad {task.priority}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                task.done ? 'bg-emerald-400/15 text-emerald-100' : 'bg-amber-300/15 text-amber-100'
              }`}
            >
              {task.done ? 'Hecha' : task.priority}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

function ActivityFeed({
  items,
  compact = false,
}: {
  items: ActivityItem[];
  compact?: boolean;
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-2xl border border-white/8 bg-[#0b1013] px-4 py-3">
          <div className="flex items-start gap-3">
            <span className={`mt-1 h-2.5 w-2.5 rounded-full ${activityToneClass(item.tone)}`} />
            <div className="min-w-0">
              <p className={`text-sm leading-6 ${compact ? 'text-[#d8e4e6]' : 'font-medium text-white'}`}>{item.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#708488]">{item.meta}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function OutcomeRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'rose' | 'emerald' | 'cyan';
}) {
  const palette =
    tone === 'rose'
      ? 'border-rose-400/20 bg-rose-400/10 text-rose-100'
      : tone === 'emerald'
        ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
        : 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100';

  return (
    <div className={`rounded-2xl border p-4 ${palette}`}>
      <p className="text-xs font-mono uppercase tracking-[0.18em] opacity-80">{label}</p>
      <p className="mt-2 text-sm leading-6">{value}</p>
    </div>
  );
}

function CompareStack({
  items,
}: {
  items: Array<[string, string, 'rose' | 'emerald' | 'cyan']>;
}) {
  return (
    <div className="space-y-3">
      {items.map(([label, value, tone]) => (
        <OutcomeRow key={label} label={label} value={value} tone={tone} />
      ))}
    </div>
  );
}

function LiveCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: 'cyan' | 'emerald' | 'amber';
}) {
  const barClass =
    accent === 'cyan'
      ? 'bg-cyan-300'
      : accent === 'emerald'
        ? 'bg-emerald-400'
        : 'bg-amber-300';

  return (
    <div className="rounded-2xl border border-white/8 bg-[#0b1013] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">{label}</p>
        <Activity className="h-4 w-4 text-cyan-300" />
      </div>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      <div className="mt-3 h-1.5 rounded-full bg-white/[0.06]">
        <div className={`h-full rounded-full ${barClass}`} style={{ width: accent === 'cyan' ? '92%' : accent === 'emerald' ? '78%' : '55%' }} />
      </div>
    </div>
  );
}

function StatusRow({
  label,
  status,
}: {
  label: string;
  status: SyncStatus;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-[#0a0f12] px-4 py-3">
      <span className="text-sm text-white">{label}</span>
      <span className="flex items-center gap-2 text-xs text-[#8ea3a7]">
        <span className={`h-2.5 w-2.5 rounded-full ${statusToneClass(status)}`} />
        {status === 'live' ? 'Live' : status === 'syncing' ? 'Syncing' : 'Queued'}
      </span>
    </div>
  );
}

function StatusPill({ status }: { status: OrderStatus }) {
  const palette =
    status === 'Listo'
      ? 'bg-emerald-400/15 text-emerald-100'
      : status === 'Bloqueado'
        ? 'bg-rose-400/15 text-rose-100'
        : status === 'Validando'
          ? 'bg-amber-300/15 text-amber-100'
          : 'bg-cyan-400/15 text-cyan-100';

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${palette}`}>{status}</span>;
}

function HealthBadge({ health }: { health: Health }) {
  const palette =
    health === 'Alta'
      ? 'bg-emerald-400/15 text-emerald-100'
      : health === 'Media'
        ? 'bg-amber-300/15 text-amber-100'
        : 'bg-rose-400/15 text-rose-100';

  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${palette}`}>{health}</span>;
}

function ConnectorBadge({ status }: { status: SyncStatus }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${status === 'live' ? 'bg-emerald-400/15 text-emerald-100' : status === 'syncing' ? 'bg-cyan-400/15 text-cyan-100' : 'bg-amber-300/15 text-amber-100'}`}>
      <span className={`h-2 w-2 rounded-full ${statusToneClass(status)}`} />
      {status === 'live' ? 'Live' : status === 'syncing' ? 'Syncing' : 'Queued'}
    </span>
  );
}

function DetailGrid({ items }: { items: string[][] }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#0b1013] p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/8 bg-black/10 p-3">
            <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">{label}</p>
            <p className="mt-2 text-sm font-medium leading-6 text-white">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full">
      <div className="h-2 rounded-full bg-white/[0.06]">
        <div
          className={`h-full rounded-full ${value >= 100 ? 'bg-emerald-400' : value >= 60 ? 'bg-cyan-300' : value >= 40 ? 'bg-amber-300' : 'bg-[#61767a]'}`}
          style={{ width: `${Math.max(8, value)}%` }}
        />
      </div>
      <p className="mt-2 whitespace-nowrap text-xs text-[#708488]">{value}% completado</p>
    </div>
  );
}

function statusToneClass(status: SyncStatus) {
  return status === 'live' ? 'bg-emerald-400' : status === 'syncing' ? 'bg-cyan-300' : 'bg-amber-300';
}

function activityToneClass(tone: ActivityItem['tone']) {
  if (tone === 'success') {
    return 'bg-emerald-400';
  }

  if (tone === 'alert') {
    return 'bg-amber-300';
  }

  if (tone === 'info') {
    return 'bg-cyan-300';
  }

  return 'bg-white/40';
}

function formatCurrency(value: number) {
  return `${value.toLocaleString('es-ES')}€`;
}
