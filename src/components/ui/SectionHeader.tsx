export default function SectionHeader({
  title,
  subtitle,
  centered = true,
  light = false,
}: {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}) {
  return (
    <div className={centered ? 'text-center' : ''}>
      <h2
        className={`text-h2 font-bold tracking-tight ${
          light ? 'text-white' : 'text-[#212529]'
        }`}
      >
        {title}
      </h2>
      <div className={`gold-divider mt-4 ${centered ? 'mx-auto' : ''}`} />
      {subtitle && (
        <p
          className={`mt-4 max-w-2xl text-body-lg ${
            light ? 'text-[#ADB5BD]' : 'text-[#6C757D]'
          } ${centered ? 'mx-auto' : ''}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
