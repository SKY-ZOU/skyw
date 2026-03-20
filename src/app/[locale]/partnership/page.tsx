import { useTranslations } from 'next-intl';
import HeroSection from '@/components/sections/HeroSection';
import AnimatedSection from '@/components/ui/AnimatedSection';
import SectionHeader from '@/components/ui/SectionHeader';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

const TYPES = [
  { titleKey: 'type1Title', descKey: 'type1Desc', tagKey: 'type1Tag' },
  { titleKey: 'type2Title', descKey: 'type2Desc', tagKey: 'type2Tag' },
  { titleKey: 'type3Title', descKey: 'type3Desc', tagKey: 'type3Tag' },
  { titleKey: 'type4Title', descKey: 'type4Desc', tagKey: 'type4Tag' },
  { titleKey: 'type5Title', descKey: 'type5Desc', tagKey: 'type5Tag' },
] as const;

const STEPS = [
  { titleKey: 'step1Title', descKey: 'step1Desc' },
  { titleKey: 'step2Title', descKey: 'step2Desc' },
  { titleKey: 'step3Title', descKey: 'step3Desc' },
  { titleKey: 'step4Title', descKey: 'step4Desc' },
  { titleKey: 'step5Title', descKey: 'step5Desc' },
] as const;

export default function PartnershipPage() {
  const t = useTranslations('Partnership');

  return (
    <>
      <HeroSection title={t('heroTitle')} subtitle={t('heroSubtitle')} />

      {/* Partnership Types */}
      <section className="bg-white">
        <Container className="py-24 lg:py-32">
          <AnimatedSection>
            <SectionHeader title={t('typesTitle')} subtitle={t('typesSubtitle')} />
          </AnimatedSection>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TYPES.map(({ titleKey, descKey, tagKey }, i) => (
              <AnimatedSection key={titleKey} delay={i * 0.08}>
                <div className="group flex h-full flex-col border border-[#e9ecef] bg-white p-8 transition-shadow hover:shadow-md">
                  <span className="inline-block self-start border border-gold-400 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-600">
                    {t(tagKey)}
                  </span>
                  <h3 className="mt-5 text-[1.05rem] font-semibold text-[#1a1a2e]">
                    {t(titleKey)}
                  </h3>
                  <p className="mt-3 flex-1 text-[14px] font-light leading-relaxed text-[#6c757d]">
                    {t(descKey)}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="bg-[#f8f9fa]">
        <Container className="py-24 lg:py-32">
          <AnimatedSection>
            <SectionHeader title={t('processTitle')} subtitle={t('processSubtitle')} />
          </AnimatedSection>

          <div className="relative mt-16">
            {/* Connector line */}
            <div className="absolute top-6 left-0 hidden h-px w-full bg-gold-300/40 lg:block" />

            <div className="grid gap-8 lg:grid-cols-5">
              {STEPS.map(({ titleKey, descKey }, i) => (
                <AnimatedSection key={titleKey} delay={i * 0.1}>
                  <div className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
                    {/* Step number */}
                    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center border-2 border-gold-400 bg-white text-[13px] font-bold text-gold-600">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <h4 className="mt-5 text-[0.95rem] font-semibold text-[#1a1a2e]">
                      {t(titleKey)}
                    </h4>
                    <p className="mt-2 text-[13px] font-light leading-relaxed text-[#6c757d]">
                      {t(descKey)}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-b from-navy-900 to-navy-950">
        <Container className="py-24 text-center lg:py-32">
          <AnimatedSection>
            <h2 className="text-h2 font-bold text-white">{t('ctaTitle')}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-body-lg text-[#adb5bd]">
              {t('ctaSubtitle')}
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button href="/contact" variant="primary">
                {t('ctaButton')}
              </Button>
              <a
                href={`mailto:${t('ctaEmail')}`}
                className="text-[14px] text-gold-400 underline-offset-4 hover:underline"
              >
                {t('ctaEmail')}
              </a>
            </div>
          </AnimatedSection>
        </Container>
      </section>
    </>
  );
}
