import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className = '', hoverable = false }: CardProps) {
  const hoverStyles = hoverable 
    ? 'hover:border-zinc-700 hover:bg-zinc-900/50 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-300' 
    : '';

  return (
    <div className={`bg-black border border-zinc-800 rounded-lg overflow-hidden flex flex-col relative ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
}

// Subcomponents para estandarizar el card
export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 pt-6 pb-4 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 pb-6 flex-1 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 py-4 border-t border-zinc-900 bg-zinc-950/50 mt-auto ${className}`}>{children}</div>;
}
