import { useState, useMemo, startTransition } from 'react';
import { trackEvent } from '../../../lib/analytics';
import {
  ModuleKey,
  Order,
  StockItem,
  Account,
  Task,
  ActivityItem,
  SyncStatus,
} from './types';
import {
  modules,
  initialOrders,
  initialStock,
  initialAccounts,
  initialTasks,
  initialActivity,
  connectorLabels,
} from './constants';

export function useB2bState() {
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

  return {
    state: {
      activeModule,
      orders,
      stock,
      accounts,
      tasks,
      activity,
      selectedOrderId,
      selectedAccountId,
      connectorState,
    },
    computed: {
      currentModule,
      selectedOrder,
      selectedAccount,
      lowStockItem,
      summary,
    },
    actions: {
      switchModule,
      selectOrder,
      selectAccount,
      approveBlockedOrder,
      replenishStock,
      syncConnector,
      completeTask,
      resetDemo,
    },
  };
}
