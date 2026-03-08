import { useTranslations } from 'next-intl';
import HeroSection from '@/components/sections/HeroSection';

export default function PrivacyPage() {
  const t = useTranslations('Legal');
  const sections = t.raw('privacySections') as Array<{ heading: string; body: string }>;

  return (
    <>
      <HeroSection title={t('privacyTitle')} subtitle={`${t('lastUpdated')}: 2026-03-01`} />
      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-3xl space-y-10">
            {sections.map((s, i) => (
              <div key={i}>
                <h2 className="mb-3 text-base font-semibold text-[#1a1a2e]">{s.heading}</h2>
                <p className="text-[clamp(0.9rem,1.6vw,1rem)] font-light leading-relaxed text-[#495057]">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
