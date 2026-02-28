'use client';

import { useTranslations, useLocale } from 'next-intl';
import HeroSection from '@/components/sections/HeroSection';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { MapPin } from 'lucide-react';
import { loc } from '@/lib/locale-utils';

interface OfficeRow {
  id: number;
  slug: string;
  nameZhCN: string; nameZhTW: string; nameEn: string;
  typeZhCN: string; typeZhTW: string; typeEn: string;
}

function Overview() {
  const t = useTranslations('About');
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
        <AnimatedSection>
          <div className="max-w-3xl">
            <p className="text-[13px] font-medium uppercase tracking-[0.15em] text-gold-500">{t('overviewTitle')}</p>
            <p className="mt-6 text-[clamp(1rem,1.8vw,1.25rem)] font-light leading-relaxed text-[#495057]">{t('overviewP1')}</p>
            <p className="mt-4 text-[clamp(1rem,1.8vw,1.25rem)] font-light leading-relaxed text-[#495057]">{t('overviewP2')}</p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function VisionMission() {
  const t = useTranslations('About');
  return (
    <section className="bg-[#f7f8f9]">
      <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
        <AnimatedSection>
          <p className="text-[13px] font-medium uppercase tracking-[0.15em] text-gold-500">{t('visionTitle')}</p>
        </AnimatedSection>
        <div className="mt-12 grid gap-px bg-[#e5e7eb] md:grid-cols-2">
          <AnimatedSection delay={0.1}>
            <div className="bg-white p-10 lg:p-14">
              <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-gold-500">{t('visionLabel')}</span>
              <p className="mt-4 text-lg font-light leading-relaxed text-[#1a1a2e]">{t('vision')}</p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="bg-white p-10 lg:p-14">
              <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-navy-900">{t('missionLabel')}</span>
              <p className="mt-4 text-lg font-light leading-relaxed text-[#1a1a2e]">{t('mission')}</p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

function Licenses() {
  const t = useTranslations('About');
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
        <AnimatedSection>
          <p className="text-[13px] font-medium uppercase tracking-[0.15em] text-gold-500">{t('licensesTitle')}</p>
        </AnimatedSection>
        <div className="mt-12 grid gap-px bg-[#e5e7eb] md:grid-cols-2">
          <AnimatedSection delay={0.1}>
            <div className="bg-[#fafafa] p-10 lg:p-14">
              <span className="display-number text-gold-400">6</span>
              <h3 className="mt-4 text-xl font-semibold text-[#1a1a2e]">{t('license6Title')}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#6c757d]">{t('license6Desc')}</p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="bg-[#fafafa] p-10 lg:p-14">
              <span className="display-number text-gold-400">9</span>
              <h3 className="mt-4 text-xl font-semibold text-[#1a1a2e]">{t('license9Title')}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#6c757d]">{t('license9Desc')}</p>
            </div>
          </AnimatedSection>
        </div>
        <p className="mt-8 text-[13px] text-[#adb5bd]">{t('licensesNote')}</p>
      </div>
    </section>
  );
}

function GlobalPresenceSection({ offices }: { offices: OfficeRow[] }) {
  const t = useTranslations('About');
  const locale = useLocale();

  return (
    <section className="bg-navy-950">
      <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
        <AnimatedSection>
          <p className="text-[13px] font-medium uppercase tracking-[0.15em] text-gold-400">{t('globalTitle')}</p>
          <p className="mt-4 max-w-2xl text-lg font-light text-white/50">{t('globalSubtitle')}</p>
        </AnimatedSection>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {offices.map((office, i) => (
            <AnimatedSection key={office.id} delay={i * 0.08}>
              <div className="border-l border-white/10 py-2 pl-5">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gold-400" />
                  <span className="text-[15px] font-semibold text-white">
                    {loc(office, 'name', locale)}
                  </span>
                </div>
                <span className="mt-1 block text-[12px] uppercase tracking-wider text-white/40">
                  {loc(office, 'type', locale)}
                </span>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AboutClient({ offices }: { offices: OfficeRow[] }) {
  const t = useTranslations('About');
  return (
    <>
      <HeroSection title={t('heroTitle')} subtitle={t('heroSubtitle')} />
      <Overview />
      <VisionMission />
      <Licenses />
      <GlobalPresenceSection offices={offices} />
    </>
  );
}
