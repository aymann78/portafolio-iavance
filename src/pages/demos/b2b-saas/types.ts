export type ModuleKey = 'overview' | 'orders' | 'inventory' | 'customers' | 'finance' | 'integrations';
export type OrderStatus = 'Nuevo' | 'Validando' | 'Bloqueado' | 'Listo';
export type SyncStatus = 'live' | 'syncing' | 'queued';
export type Health = 'Alta' | 'Media' | 'Riesgo';

export type Order = {
  id: string;
  account: string;
  value: number;
  channel: string;
  status: OrderStatus;
  due: string;
  progress: number;
  issue: string;
};

export type StockItem = {
  sku: string;
  name: string;
  available: number;
  reserved: number;
  min: number;
  location: string;
  supplier: string;
};

export type Account = {
  id: string;
  name: string;
  health: Health;
  creditUsed: number;
  creditLimit: number;
  pendingInvoices: number;
  openTasks: number;
  segment: string;
};

export type Task = {
  id: string;
  title: string;
  owner: string;
  priority: 'Alta' | 'Media';
  done: boolean;
};

export type ActivityItem = {
  id: string;
  title: string;
  meta: string;
  tone: 'neutral' | 'info' | 'success' | 'alert';
};
