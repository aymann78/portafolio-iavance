import { ReactNode, ComponentType } from 'react';
import { ActivityItem, Destination, RunStatus } from '../types';

export function InsightCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.01] backdrop-blur-md p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">{label}</p>
        <Icon className="h-4 w-4 text-cyan-300" />
      </div>
      <p className="mt-3 text-sm leading-6 text-[#d8e4e6]">{value}</p>
    </div>
  );
}

export function Panel({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-5 shadow-2xl">
      <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#708488]">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-semibold leading-tight text-white">{title}</h2>
      <div className="mt-4 min-w-0">{children}</div>
    </section>
  );
}

export function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.01] backdrop-blur-md p-4">
      <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

export function DecisionRow({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-white/8 pb-3 last:border-0 last:pb-0">
      <div className="flex items-center gap-2 text-[#8ea3a7]">
        <Icon className="h-4 w-4 shrink-0 text-cyan-300" />
        <span className="text-xs font-mono uppercase tracking-[0.1em]">{label}</span>
      </div>
      <p className="text-sm leading-6 text-white" style={{ overflowWrap: 'anywhere' }}>{value}</p>
    </div>
  );
}

export function RuleCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.01] backdrop-blur-md p-4">
      <div className="flex items-center gap-2 text-cyan-200">
        <Icon className="h-4 w-4" />
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#8adfeb]">{label}</p>
      </div>
      <p className="mt-3 text-sm leading-6 text-[#d8e4e6]">{value}</p>
    </div>
  );
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-2xl border border-white/[0.05] bg-white/[0.01] backdrop-blur-md px-4 py-3">
          <div className="flex items-start gap-3">
            <span className={`mt-1 h-2.5 w-2.5 rounded-full ${item.tone === 'success' ? 'bg-emerald-400' : item.tone === 'info' ? 'bg-cyan-300' : 'bg-white/35'}`} />
            <div className="min-w-0">
              <p className="text-sm leading-6 text-white">{item.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#708488]">{item.meta}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function OutcomeRow({
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

export function RouteBadge({ destination }: { destination: Destination }) {
  const palette =
    destination === 'Ventas'
      ? 'bg-cyan-400/15 text-cyan-100'
      : destination === 'Operaciones'
        ? 'bg-emerald-400/15 text-emerald-100'
        : destination === 'Finanzas'
          ? 'bg-amber-300/15 text-amber-100'
          : 'bg-white/10 text-white';

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${palette}`}>{destination}</span>;
}

export function RunBadge({
  label,
  status,
}: {
  label: string;
  status: RunStatus;
}) {
  const palette =
    status === 'done'
      ? 'bg-emerald-400/15 text-emerald-100'
      : status === 'processing'
        ? 'bg-cyan-400/15 text-cyan-100'
        : 'bg-white/10 text-white';

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${palette}`}>{label}</span>;
}
