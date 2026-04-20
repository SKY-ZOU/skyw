import { CSSProperties, ReactNode } from 'react';

interface VerticalCNProps {
  children: ReactNode;
  color?: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

export default function VerticalCN({
  children,
  color = 'rgba(11,17,30,.5)',
  size = 11,
  className = '',
  style,
}: VerticalCNProps) {
  return (
    <span
      className={`font-serifSC cn-vertical ${className}`}
      style={{ fontSize: size, color, ...style }}
    >
      {children}
    </span>
  );
}
