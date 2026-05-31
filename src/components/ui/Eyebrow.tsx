import { ReactNode } from 'react';

interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

export function Eyebrow({ children, className = '' }: EyebrowProps) {
  return (
    <span className={`block text-brand-500 font-mono text-xs md:text-sm font-semibold uppercase tracking-widest ${className}`}>
      {children}
    </span>
  );
}
