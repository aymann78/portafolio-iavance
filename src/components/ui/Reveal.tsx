import React from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface RevealProps {
  children: React.ReactNode;
  delay?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

export function Reveal({
  children,
  delay = 'none',
  direction = 'up',
  className = '',
}: RevealProps) {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  const delayClass = {
    none: 'delay-0',
    sm: 'delay-100',
    md: 'delay-200',
    lg: 'delay-300',
    xl: 'delay-500',
  }[delay];

  const directionClass = {
    up: 'translate-y-3',
    down: '-translate-y-3',
    left: 'translate-x-3',
    right: '-translate-x-3',
    none: 'translate-x-0 translate-y-0',
  }[direction];

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${className} ${delayClass} ${
        isVisible ? 'opacity-100 translate-y-0 translate-x-0' : `opacity-100 ${directionClass}`
      }`}
    >
      {children}
    </div>
  );
}
