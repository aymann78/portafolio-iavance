interface MetricProps {
  value: string | number;
  label: string;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function Metric({ value, label, trend, trendUp = true, className = '' }: MetricProps) {
  return (
    <div className={`flex flex-col gap-1 border-l-2 border-brand-500/30 pl-4 py-1 ${className}`}>
      <span className="text-3xl md:text-4xl font-extrabold tracking-normal text-white">
        {value}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-zinc-500">{label}</span>
        {trend && (
          <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
    </div>
  );
}
