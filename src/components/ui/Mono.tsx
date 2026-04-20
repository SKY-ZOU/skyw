import { CSSProperties, ReactNode } from 'react';

interface MonoProps {
  children: ReactNode;
  color?: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

export default function Mono({ children, color, size = 10.5, className = '', style }: MonoProps) {
  return (
    <span
      className={`font-monoDisp ${className}`}
      style={{
        fontSize: size,
        fontWeight: 500,
        letterSpacing: '.22em',
        textTransform: 'uppercase',
        ...(color ? { color } : {}),
        ...style,
      }}
    >
      {children}
    </span>
  );
}
