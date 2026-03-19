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
            <p className="text-body-sm font-medium uppercase tracking-[0.15em] text-gold-500">{t('overviewTitle')}</p>
            <p className="mt-6 text-lead font-light leading-relaxed text-[#495057]">{t('overviewP1')}</p>
            <p className="mt-4 text-lead font-light leading-relaxed text-[#495057]">{t('overviewP2')}</p>
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
          <p className="text-body-sm font-medium uppercase tracking-[0.15em] text-gold-500">{t('visionTitle')}</p>
        </AnimatedSection>
        <div className="mt-12 grid gap-px bg-[#e5e7eb] md:grid-cols-2">
          <AnimatedSection delay={0.1}>
            <div className="bg-white p-10 lg:p-14">
              <span className="text-caption font-semibold uppercase tracking-[0.15em] text-gold-500">{t('visionLabel')}</span>
              <p className="mt-4 text-lg font-light leading-relaxed text-[#1a1a2e]">{t('vision')}</p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="bg-white p-10 lg:p-14">
              <span className="text-caption font-semibold uppercase tracking-[0.15em] text-navy-900">{t('missionLabel')}</span>
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

  const licenses = [
    {
      num: '6',
      titleKey: 'license6Title' as const,
      descKey: 'license6Desc' as const,
      color: '#D4AF37',
      tag: 'BBM628',
    },
    {
      num: '9',
      titleKey: 'license9Title' as const,
      descKey: 'license9Desc' as const,
      color: '#D4AF37',
      tag: 'BOP785',
    },
    {
      num: 'P',
      titleKey: 'license3Title' as const,
      descKey: 'license3Desc' as const,
      color: '#1a56db',
      tag: 'P1067569',
    },
    {
      num: 'M',
      titleKey: 'license4Title' as const,
      descKey: 'license4Desc' as const,
      color: '#0891b2',
      tag: 'RLFMC',
    },
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
        <AnimatedSection>
          <p className="text-body-sm font-medium uppercase tracking-[0.15em] text-gold-500">{t('licensesTitle')}</p>
        </AnimatedSection>
        <div className="mt-12 grid gap-px bg-[#e5e7eb] sm:grid-cols-2 lg:grid-cols-4">
          {licenses.map((lic, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="bg-[#fafafa] p-8 lg:p-10 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <span
                    className="text-[3rem] font-extralight leading-none"
                    style={{ color: lic.color }}
                  >
                    {lic.num}
                  </span>
                  <span
                    className="text-[10px] font-semibold px-2 py-1 border tracking-wider"
                    style={{ borderColor: `${lic.color}50`, color: lic.color, background: `${lic.color}08` }}
                  >
                    {lic.tag}
                  </span>
                </div>
                <h3 className="text-[15px] font-semibold text-[#1a1a2e]">{t(lic.titleKey)}</h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-[#6c757d] flex-1">{t(lic.descKey)}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
        <p className="mt-8 text-[12px] text-[#adb5bd]">{t('licensesNote')}</p>
      </div>
    </section>
  );
}

function BackingSection() {
  const t = useTranslations('About');

  const partners = [
    {
      nameKey: 'backing1Name' as const,
      subKey: 'backing1Sub' as const,
      shareholdersKey: 'backing1Shareholders' as const,
      bodyKey: 'backing1Body' as const,
      accentColor: '#D4AF37',
      flag: '🇨🇳',
    },
    {
      nameKey: 'backing2Name' as const,
      subKey: 'backing2Sub' as const,
      shareholdersKey: 'backing2Shareholders' as const,
      bodyKey: 'backing2Body' as const,
      accentColor: '#1e3a5f',
      flag: '🇬🇧',
    },
    {
      nameKey: 'backing3Name' as const,
      subKey: 'backing3Sub' as const,
      shareholdersKey: 'backing3Shareholders' as const,
      bodyKey: 'backing3Body' as const,
      accentColor: '#C41E3A',
      flag: '🇸🇬',
    },
  ];

  return (
    <section className="bg-[#f7f8f9]">
      <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
        <AnimatedSection>
          <p className="text-[13px] font-medium uppercase tracking-[0.15em] text-gold-500">{t('backingTitle')}</p>
          <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-[#6c757d] font-light">{t('backingSubtitle')}</p>
        </AnimatedSection>
        <div className="mt-14 grid gap-px bg-[#e5e7eb] md:grid-cols-3">
          {partners.map((p, i) => (
            <AnimatedSection key={i} delay={i * 0.12}>
              <div className="bg-white p-9 lg:p-10 h-full flex flex-col">
                {/* Name + flag */}
                <div className="flex items-start gap-3 mb-5">
                  <span className="text-2xl leading-none mt-0.5">{p.flag}</span>
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#1a1a2e]">{t(p.nameKey)}</h3>
                    <p className="text-[11.5px] text-[#adb5bd] mt-0.5">{t(p.subKey)}</p>
                  </div>
                </div>

                {/* Shareholder line */}
                <div
                  className="mb-5 pb-5 border-b border-[#e5e7eb] text-[12.5px] font-medium"
                  style={{ color: p.accentColor }}
                >
                  {t(p.shareholdersKey)}
                </div>

                {/* Body */}
                <p className="text-[14px] leading-relaxed text-[#6c757d] flex-1">{t(p.bodyKey)}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
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
          <p className="text-body-sm font-medium uppercase tracking-[0.15em] text-gold-400">{t('globalTitle')}</p>
          <p className="mt-4 max-w-2xl text-lg font-light text-white/50">{t('globalSubtitle')}</p>
        </AnimatedSection>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {offices.map((office, i) => (
            <AnimatedSection key={office.id} delay={i * 0.08}>
              <div className="border-l border-white/10 py-2 pl-5">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gold-400" />
                  <span className="text-body font-semibold text-white">
                    {loc(office, 'name', locale)}
                  </span>
                </div>
                <span className="mt-1 block text-caption uppercase tracking-wider text-white/40">
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
      <BackingSection />
      <GlobalPresenceSection offices={offices} />
    </>
  );
}
