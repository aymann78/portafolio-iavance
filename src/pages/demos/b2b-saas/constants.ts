import { ComponentType } from 'react';
import {
  ClipboardList,
  CreditCard,
  Layers3,
  UsersRound,
  Warehouse,
  Workflow,
} from 'lucide-react';
import { ModuleKey, Order, StockItem, Account, Task, ActivityItem } from './types';

export const modules: Array<{
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

export const initialOrders: Order[] = [
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

export const initialStock: StockItem[] = [
  { sku: 'MAT-204', name: 'Adhesivo flexible C2TE', available: 148, reserved: 36, min: 80, location: 'A-12', supplier: 'Kerakoll' },
  { sku: 'BAN-118', name: 'Mampara frontal 120 cm', available: 24, reserved: 18, min: 30, location: 'B-03', supplier: 'Lasser' },
  { sku: 'GRF-077', name: 'Griferia monomando inox', available: 45, reserved: 22, min: 40, location: 'C-18', supplier: 'AquaPro' },
  { sku: 'CER-431', name: 'Porcelanico gris 60x60', available: 188, reserved: 124, min: 180, location: 'D-21', supplier: 'Atlas' },
  { sku: 'FON-552', name: 'Valvula anti-retorno', available: 7, reserved: 9, min: 25, location: 'C-07', supplier: 'Fluxor' },
];

export const initialAccounts: Account[] = [
  { id: 'reformas-norte', name: 'Reformas Norte', health: 'Alta', creditUsed: 12600, creditLimit: 30000, pendingInvoices: 1, openTasks: 2, segment: 'Obra y reforma' },
  { id: 'hotel-arce', name: 'Hotel Arce', health: 'Media', creditUsed: 22400, creditLimit: 45000, pendingInvoices: 0, openTasks: 1, segment: 'Hospitality' },
  { id: 'obra-sur', name: 'Obra Sur', health: 'Riesgo', creditUsed: 31800, creditLimit: 36000, pendingInvoices: 3, openTasks: 4, segment: 'Constructora' },
];

export const initialTasks: Task[] = [
  { id: 'task-1', title: 'Autorizar PED-1046 y documentar excepcion', owner: 'Finanzas', priority: 'Alta', done: false },
  { id: 'task-2', title: 'Lanzar reposicion de FON-552', owner: 'Compras', priority: 'Alta', done: false },
  { id: 'task-3', title: 'Enviar resumen de salida a comercial', owner: 'Ops', priority: 'Media', done: false },
];

export const initialActivity: ActivityItem[] = [
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

export const connectorLabels = ['ERP', 'CRM', 'Logistica', 'Alertas'] as const;
