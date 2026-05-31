import { ReactNode } from 'react';

interface TagProps {
  children: ReactNode;
  className?: string;
  variant?: 'outline' | 'solid' | 'ghost';
}

export function Tag({ children, className = '', variant = 'outline' }: TagProps) {
  const variantStyles = {
    outline: 'border border-zinc-700 text-zinc-300 bg-transparent',
    solid: 'bg-zinc-800 text-zinc-200 border border-transparent',
    ghost: 'bg-transparent text-zinc-400 border border-transparent hover:text-zinc-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
