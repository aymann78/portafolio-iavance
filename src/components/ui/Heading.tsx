import { ReactNode } from 'react';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface HeadingProps {
  as?: HeadingLevel;
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

const sizeClasses = {
  sm: 'text-lg md:text-xl font-semibold',
  md: 'text-2xl md:text-3xl font-bold tracking-tight',
  lg: 'text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter',
  xl: 'text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter',
  '2xl': 'text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight',
  '3xl': 'text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-tight',
};

export function Heading({ as: Component = 'h2', children, className = '', size = 'md' }: HeadingProps) {
  return (
    <Component className={`font-display text-white text-balance ${sizeClasses[size]} ${className}`}>
      {children}
    </Component>
  );
}
