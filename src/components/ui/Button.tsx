import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, LinkProps } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-white text-black hover:bg-zinc-200 border border-transparent font-semibold shadow-lg hover:shadow-xl',
  secondary: 'bg-brand-500 text-white hover:bg-brand-400 border border-transparent font-semibold shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)]',
  outline: 'bg-transparent text-white border border-zinc-700 hover:border-zinc-400 hover:bg-zinc-900',
  ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] hover:-translate-y-0.5';

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

type ButtonAsButton = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' };
type ButtonAsAnchor = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a' };
type ButtonAsLink = BaseProps & LinkProps & { as: 'Link' };

type ButtonProps = ButtonAsButton | ButtonAsAnchor | ButtonAsLink;

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  fullWidth = false,
  children, 
  ...props 
}: ButtonProps) {
  const compClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  if (props.as === 'Link') {
    const { as, ...linkProps } = props;
    void as;
    return <Link className={compClasses} {...linkProps}>{children}</Link>;
  }

  if (props.as === 'a') {
    const { as, ...aProps } = props;
    void as;
    return <a className={compClasses} {...aProps}>{children}</a>;
  }

  const { as, ...buttonProps } = props as ButtonAsButton;
  void as;
  return (
    <button className={compClasses} {...buttonProps}>
      {children}
    </button>
  );
}
