import { SyncStatus, ActivityItem, OrderStatus } from './types';

export function formatCurrency(amount: number) {
  return amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 });
}

export function statusToneClass(status: SyncStatus) {
  return status === 'live' ? 'bg-emerald-400' : status === 'syncing' ? 'bg-cyan-300' : 'bg-amber-300';
}

export function activityToneClass(tone: ActivityItem['tone']) {
  return tone === 'success' ? 'bg-emerald-400' : tone === 'alert' ? 'bg-rose-400' : tone === 'info' ? 'bg-cyan-400' : 'bg-[#61767a]';
}

export function getStatusPalette(status: OrderStatus) {
  if (status === 'Listo') return 'bg-emerald-400/15 text-emerald-100';
  if (status === 'Bloqueado') return 'bg-rose-400/15 text-rose-100';
  if (status === 'Validando') return 'bg-amber-300/15 text-amber-100';
  return 'bg-cyan-400/15 text-cyan-100';
}
