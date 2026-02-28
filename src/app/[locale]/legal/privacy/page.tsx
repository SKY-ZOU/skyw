import { useTranslations } from 'next-intl';
import HeroSection from '@/components/sections/HeroSection';

export default function PrivacyPage() {
  const t = useTranslations('Legal');
  return (
    <>
      <HeroSection title={t('privacyTitle')} subtitle={`${t('lastUpdated')}: 2026-01-01`} />
      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <p className="text-[clamp(1rem,1.8vw,1.125rem)] font-light leading-relaxed text-[#495057]">
              {t('privacyContent')}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
