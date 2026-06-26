import { ReactNode } from 'react';
import { Activity, CheckCircle2, Circle } from 'lucide-react';
import { ActivityItem, Health, OrderStatus, SyncStatus, Task } from '../types';
import { activityToneClass, getStatusPalette, statusToneClass } from '../utils';

export function Panel({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-[28px] border border-zinc-800/80 bg-zinc-900 backdrop-blur-xl p-5 shadow-2xl">
      <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#708488]">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-semibold leading-tight text-white">{title}</h2>
      <div className="mt-4 min-w-0">{children}</div>
    </section>
  );
}

export function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  icon: any;
  accent: 'cyan' | 'emerald' | 'amber' | 'rose';
}) {
  const accentClass =
    accent === 'cyan'
      ? 'border-cyan-300/20 bg-cyan-400/10 text-cyan-200'
      : accent === 'emerald'
        ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
        : accent === 'amber'
          ? 'border-amber-300/20 bg-amber-400/10 text-amber-200'
          : 'border-rose-400/20 bg-rose-400/10 text-rose-200';

  return (
    <div className="rounded-md border border-zinc-800/80 bg-black p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[#8fa4a8]">{label}</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg border ${accentClass}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-xs text-[#6e8286]">{hint}</p>
    </div>
  );
}

export function OutcomeRow({ label, value, tone }: { label: string; value: string; tone: 'cyan' | 'emerald' | 'rose' }) {
  const badgeClass =
    tone === 'cyan'
      ? 'border-cyan-300/25 bg-cyan-400/15 text-cyan-100'
      : tone === 'emerald'
        ? 'border-emerald-400/25 bg-emerald-400/15 text-emerald-100'
        : 'border-rose-400/25 bg-rose-400/15 text-rose-100';

  return (
    <div className="rounded-md border border-zinc-800/80 bg-black/10 p-3 text-sm">
      <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${badgeClass}`}>
        {label}
      </span>
      <p className="mt-2 font-medium leading-6 text-[#d4e0e2]">{value}</p>
    </div>
  );
}

export function CompareStack({ items }: { items: [string, string, 'rose' | 'emerald' | 'cyan'][] }) {
  return (
    <div className="space-y-3">
      {items.map(([label, value, tone]) => {
        const badgeClass =
          tone === 'rose'
            ? 'border-rose-400/25 bg-rose-400/10 text-rose-200'
            : tone === 'emerald'
              ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
              : 'border-cyan-300/25 bg-cyan-400/10 text-cyan-200';

        return (
          <div key={label} className="flex gap-4 rounded-md border border-zinc-800/80 bg-zinc-900 shadow-md shadow-black/40 p-4">
            <span className={`flex h-fit shrink-0 items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest ${badgeClass}`}>
              {label}
            </span>
            <p className="text-sm font-medium leading-6 text-[#e2eaeb]">{value}</p>
          </div>
        );
      })}
    </div>
  );
}

export function LiveCard({ label, value, accent }: { label: string; value: string; accent: 'cyan' | 'emerald' | 'amber' }) {
  const barClass = accent === 'cyan' ? 'bg-cyan-300' : accent === 'emerald' ? 'bg-emerald-400' : 'bg-amber-300';
  return (
    <div className="rounded-md border border-zinc-800/80 bg-zinc-900 shadow-md shadow-black/40 p-4">
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

export function StatusRow({ label, status }: { label: string; status: SyncStatus }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-zinc-800/80 bg-black px-4 py-3">
      <span className="text-sm text-white">{label}</span>
      <span className="flex items-center gap-2 text-xs text-[#8ea3a7]">
        <span className={`h-2.5 w-2.5 rounded-full ${statusToneClass(status)}`} />
        {status === 'live' ? 'Live' : status === 'syncing' ? 'Syncing' : 'Queued'}
      </span>
    </div>
  );
}

export function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusPalette(status)}`}>
      {status}
    </span>
  );
}

export function HealthBadge({ health }: { health: Health }) {
  const healthClass = health === 'Alta' ? 'bg-emerald-400' : health === 'Media' ? 'bg-amber-300' : 'bg-rose-400';
  return (
    <span className="flex items-center gap-2 rounded-full border border-zinc-800/80 bg-[#05080a] px-3 py-1.5 text-xs text-[#a0b2b6]">
      <span className={`h-2 w-2 rounded-full ${healthClass}`} />
      {health}
    </span>
  );
}

export function ConnectorBadge({ status }: { status: SyncStatus }) {
  const badgeClass = status === 'live' ? 'border-emerald-400/20 text-emerald-300' : status === 'syncing' ? 'border-cyan-300/30 text-cyan-300' : 'border-white/10 text-[#7a9094]';
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${badgeClass}`}>
      <span className={`h-2 w-2 rounded-full ${status === 'live' ? 'bg-emerald-400' : status === 'syncing' ? 'bg-cyan-300' : 'bg-[#61767a]'}`} />
      {status === 'live' ? 'Live sync' : status === 'syncing' ? 'Sync in progress...' : 'Queued'}
    </span>
  );
}

export function DetailGrid({ items }: { items: [string, string][] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-md border border-zinc-800/80 bg-black/10 p-3">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">{label}</p>
          <p className="mt-2 text-sm font-medium leading-6 text-white">{value}</p>
        </div>
      ))}
    </div>
  );
}

export function ProgressBar({ value }: { value: number }) {
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

export function ActivityFeed({ items, compact }: { items: ActivityItem[]; compact?: boolean }) {
  return (
    <div className={`space-y-4 ${compact ? '' : 'p-2'}`}>
      {items.map((item, index) => (
        <div key={item.id} className="relative flex items-start gap-4">
          <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#0d1215]">
            <span className={`h-2 w-2 rounded-full ${activityToneClass(item.tone)}`} />
          </div>
          {index < items.length - 1 && <span className="absolute left-3 top-6 -ml-[1px] h-full w-px bg-white/5" />}
          <div className="min-w-0 pt-0.5">
            <p className="text-sm font-medium text-white">{item.title}</p>
            <p className="mt-1 text-xs text-[#82979a]">{item.meta}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TaskList({ tasks, onComplete, compact }: { tasks: Task[]; onComplete: (id: string) => void; compact?: boolean }) {
  return (
    <div className={`space-y-3 ${compact ? '' : 'p-2'}`}>
      {tasks.map((task) => (
        <div key={task.id} className={`flex items-start gap-3 rounded-md border p-3 transition ${task.done ? 'border-emerald-400/20 bg-emerald-400/5' : 'border-zinc-800/80 bg-zinc-900 shadow-md shadow-black/40'}`}>
          <button
            type="button"
            onClick={() => onComplete(task.id)}
            disabled={task.done}
            className={`shrink-0 transition ${task.done ? 'text-emerald-400' : 'text-[#6e8286] hover:text-cyan-300'}`}
          >
            {task.done ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
          </button>
          <div className="min-w-0">
            <p className={`text-sm font-medium ${task.done ? 'text-[#81969a] line-through' : 'text-white'}`}>{task.title}</p>
            <p className="mt-1 text-xs text-[#72878a]">
              {task.owner} · Prioridad {task.priority}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
