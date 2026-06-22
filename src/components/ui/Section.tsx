import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const spacingClasses = {
  none: 'py-0',
  sm: 'py-8 md:py-10',
  md: 'py-10 md:py-14',
  lg: 'py-14 md:py-18',
  xl: 'py-18 md:py-24',
};

export function Section({ children, className = '', id, spacing = 'md' }: SectionProps) {
  return (
    <section id={id} className={`w-full relative ${spacingClasses[spacing]} ${className}`}>
      {children}
    </section>
  );
}
