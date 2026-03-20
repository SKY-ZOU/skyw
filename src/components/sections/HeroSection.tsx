export default function HeroSection({
  title,
  subtitle,
  children,
  backgroundImage,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  backgroundImage?: string;
}) {
  return (
    <section
      className="relative bg-navy-950 pt-32 pb-20 lg:pt-40 lg:pb-24 min-h-[400px]"
      style={backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      } : undefined}
    >
      {/* Dark overlay for readability */}
      {backgroundImage && (
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(7, 11, 20, 0.55)' }} />
      )}
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <h1 className="max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-extralight leading-[1.1] tracking-tight text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 max-w-2xl text-lg font-light text-white/50">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
