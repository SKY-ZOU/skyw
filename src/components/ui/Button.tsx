import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

type Variant = 'primary' | 'secondary' | 'outline';

type ButtonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
};

const variantStyles: Record<Variant, string> = {
  primary: 'bg-gold-400 text-white hover:bg-gold-500 shadow-sm',
  secondary: 'bg-navy-900 text-white hover:bg-navy-800',
  outline: 'border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-white',
};

export default function Button({
  variant = 'primary',
  children,
  className = '',
  href,
  type,
  onClick,
}: ButtonProps) {
  const base = `inline-flex items-center justify-center rounded-[var(--radius-button)] px-6 py-3 text-sm font-semibold transition-colors duration-200 ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button className={base} type={type} onClick={onClick}>
      {children}
    </button>
  );
}
