import Mono from './Mono';
import VerticalCN from './VerticalCN';

interface SectionHeadProps {
  cn: string;
  en: string;
  title: string;
  subtitle: string;
  inverse?: boolean;
}

export default function SectionHead({ cn, en, title, subtitle, inverse }: SectionHeadProps) {
  const titleColor = inverse ? 'var(--color-cream)' : 'var(--color-ink)';
  const mutedColor = inverse ? 'rgba(245,241,230,.55)' : 'var(--color-muted-warm)';
  const goldColor = inverse ? 'var(--color-gold-soft)' : 'var(--color-gold-antique)';
  const railColor = inverse ? 'rgba(245,241,230,.5)' : 'rgba(11,17,30,.55)';
  const railLine = inverse ? 'rgba(245,241,230,.3)' : 'rgba(11,17,30,.25)';

  return (
    <div className="grid gap-10 items-start grid-cols-1 lg:grid-cols-[minmax(60px,80px)_1fr_minmax(140px,200px)]">
      {/* Left rail: vertical CN + ornament (hidden on small screens) */}
      <div className="hidden lg:flex flex-col items-start gap-4">
        <div style={{ width: 1, height: 28, background: railLine }} />
        <VerticalCN color={railColor} size={12}>{cn}</VerticalCN>
        <div
          className="mt-2"
          style={{
            width: 6,
            height: 6,
            background: 'var(--color-gold-antique)',
            transform: 'rotate(45deg)',
          }}
        />
      </div>

      {/* Title block */}
      <div>
        <Mono color={goldColor}>{en}</Mono>
        <h2
          className="font-serifSC mt-3.5 max-w-[880px]"
          style={{
            fontSize: 'clamp(30px, 3.6vw, 52px)',
            fontWeight: 500,
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
            color: titleColor,
            margin: '14px 0 0',
          }}
        >
          {title}
        </h2>
        <p
          className="mt-5 max-w-[700px]"
          style={{
            fontSize: 15.5,
            lineHeight: 1.85,
            color: mutedColor,
            fontWeight: 300,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Right meta (hidden on small screens) */}
      <div className="hidden lg:block text-right pt-2.5">
        <div
          className="font-monoDisp"
          style={{
            fontSize: 10.5,
            color: inverse ? 'rgba(245,241,230,.4)' : 'var(--color-muted-warm)',
            letterSpacing: '.18em',
          }}
        >
          — · — · — · —
        </div>
      </div>
    </div>
  );
}
