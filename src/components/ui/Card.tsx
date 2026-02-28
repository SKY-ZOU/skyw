import type { ReactNode } from 'react';

export default function Card({
  children,
  className = '',
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-[var(--radius-card)] border border-[#E9ECEF] bg-white p-6 shadow-[var(--shadow-card)] ${
        hover ? 'transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
