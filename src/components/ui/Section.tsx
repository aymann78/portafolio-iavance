import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const spacingClasses = {
  none: 'py-0',
  sm: 'py-12 md:py-16',
  md: 'py-20 md:py-32',
  lg: 'py-32 md:py-48',
  xl: 'py-40 md:py-64',
};

export function Section({ children, className = '', id, spacing = 'md' }: SectionProps) {
  return (
    <section id={id} className={`w-full relative ${spacingClasses[spacing]} ${className}`}>
      {children}
    </section>
  );
}
