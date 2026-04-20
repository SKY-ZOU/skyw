interface SealProps {
  text?: string;
  size?: number;
}

export default function Seal({ text = '天汇', size = 44 }: SealProps) {
  return (
    <div
      className="font-serifSC shrink-0 flex items-center justify-center"
      style={{
        width: size,
        height: size,
        background: 'var(--color-cinnabar)',
        color: 'var(--color-cream)',
        fontWeight: 700,
        fontSize: size * 0.38,
        letterSpacing: '-0.02em',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.08)',
      }}
    >
      {text}
    </div>
  );
}
