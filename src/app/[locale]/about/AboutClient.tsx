'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { MapPin, Shield, Globe, Award, TrendingUp } from 'lucide-react';
import { loc } from '@/lib/locale-utils';
import { motion, useScroll, useTransform } from 'framer-motion';

interface OfficeRow {
  id: number;
  slug: string;
  nameZhCN: string; nameZhTW: string; nameEn: string;
  typeZhCN: string; typeZhTW: string; typeEn: string;
}

function AboutHero() {
  const t = useTranslations('About');
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center bg-navy-950 overflow-hidden pt-20">
      {/* Immersive Background */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-110"
          style={{ backgroundImage: "url('/images/home/hero-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-950/20 to-white" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-400 mb-6">
            {t('heroTitle')}
          </p>
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-extralight tracking-tight text-white leading-[1.1]">
            {t('heroSubtitle')}
          </h1>
          <div className="mt-12 mx-auto w-px h-24 bg-gradient-to-b from-gold-400 to-transparent opacity-50" />
        </motion.div>
      </div>
    </section>
  );
}

function Overview() {
  const t = useTranslations('About');
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section ref={ref} className="bg-white relative overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
        <div className="grid lg:grid-cols-[1fr_450px] gap-16 lg:gap-24 items-center">
          <AnimatedSection>
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-8 bg-gold-400" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">{t('overviewTitle')}</p>
              </div>
              <p className="text-[clamp(1.1rem,2vw,1.4rem)] font-light leading-relaxed text-navy-950 mb-8">{t('overviewP1')}</p>
              <div className="h-px w-full bg-[#f0f0f0] mb-8" />
              <p className="text-[1.05rem] font-light leading-relaxed text-[#6c757d]">{t('overviewP2')}</p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="relative">
              <motion.div style={{ y }} className="relative z-10 shadow-2xl overflow-hidden aspect-[3/4]">
                <div 
                  className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-1000"
                  style={{ backgroundImage: "url('/images/home/corridor-london.png')" }}
                />
                <div className="absolute inset-0 bg-navy-950/10 mix-blend-multiply" />
              </motion.div>
              {/* Decorative background element */}
              <div className="absolute -bottom-10 -right-10 w-64 h-64 border border-gold-400/20 -z-10" />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

function VisionMission() {
  const t = useTranslations('About');
  return (
    <section className="bg-[#f7f8f9] relative overflow-hidden">
      {/* Subtle Typography Background */}
      <div className="absolute top-10 right-0 text-[10vw] font-black text-navy-900/[0.02] select-none uppercase pointer-events-none">
        Future Vision
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
        <AnimatedSection>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500 mb-12">{t('visionTitle')}</p>
        </AnimatedSection>
        <div className="grid gap-px bg-[#e5e7eb] md:grid-cols-2 shadow-2xl shadow-navy-900/5">
          <AnimatedSection delay={0.1}>
            <div className="group bg-white p-12 lg:p-20 relative overflow-hidden h-full">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gold-400 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 flex items-center justify-center bg-gold-400/10 text-gold-500 mb-8 rounded-full">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 block mb-4">{t('visionLabel')}</span>
                <p className="text-[1.25rem] font-light leading-relaxed text-[#1a1a2e]">{t('vision')}</p>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="group bg-white p-12 lg:p-20 relative overflow-hidden h-full">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-navy-900 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 flex items-center justify-center bg-navy-900/10 text-navy-900 mb-8 rounded-full">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy-900 block mb-4">{t('missionLabel')}</span>
                <p className="text-[1.25rem] font-light leading-relaxed text-[#1a1a2e]">{t('mission')}</p>
              </div>
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
      icon: <Shield className="w-5 h-5" />,
    },
    {
      num: '9',
      titleKey: 'license9Title' as const,
      descKey: 'license9Desc' as const,
      color: '#D4AF37',
      tag: 'BOP785',
      icon: <Award className="w-5 h-5" />,
    },
    {
      num: 'P',
      titleKey: 'license3Title' as const,
      descKey: 'license3Desc' as const,
      color: '#1a56db',
      tag: 'P1067569',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      num: 'M',
      titleKey: 'license4Title' as const,
      descKey: 'license4Desc' as const,
      color: '#0891b2',
      tag: 'RLFMC',
      icon: <Globe className="w-5 h-5" />,
    },
  ];

  return (
    <section className="bg-white relative overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
        <AnimatedSection>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500 mb-12">{t('licensesTitle')}</p>
        </AnimatedSection>
        <div className="grid gap-px bg-[#e5e7eb] sm:grid-cols-2 lg:grid-cols-4 border border-[#e5e7eb]">
          {licenses.map((lic, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="group bg-white p-10 h-full flex flex-col transition-all hover:bg-[#fafafa]">
                <div className="flex items-start justify-between mb-8">
                  <span
                    className="text-[3.5rem] font-extralight leading-none transition-transform group-hover:scale-110 duration-700"
                    style={{ color: lic.color }}
                  >
                    {lic.num}
                  </span>
                  <div className="p-3 bg-[#fdf9ec] text-gold-500 rounded-sm">
                    {lic.icon}
                  </div>
                </div>
                <div className="mb-4">
                  <span
                    className="text-[9px] font-bold px-2 py-1 border tracking-widest uppercase"
                    style={{ borderColor: `${lic.color}50`, color: lic.color, background: `${lic.color}08` }}
                  >
                    {lic.tag}
                  </span>
                </div>
                <h3 className="text-[16px] font-semibold text-[#1a1a2e] leading-snug">{t(lic.titleKey)}</h3>
                <p className="mt-4 text-[13.5px] leading-relaxed text-[#6c757d] flex-1 font-light">{t(lic.descKey)}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
        <p className="mt-8 text-[11px] text-[#adb5bd] uppercase tracking-wider">{t('licensesNote')}</p>
      </div>
    </section>
  );
}

function GlobalPresenceSection({ offices }: { offices: OfficeRow[] }) {
  const t = useTranslations('About');
  const locale = useLocale();

  return (
    <section className="bg-navy-950 relative overflow-hidden">
      {/* Professional Dot Matrix Overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
           style={{ 
             backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }} />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
        <AnimatedSection>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">{t('globalTitle')}</p>
              <h2 className="mt-4 text-[clamp(1.8rem,3vw,2.5rem)] font-light text-white leading-tight">{t('globalSubtitle')}</h2>
            </div>
            <div className="h-px flex-1 bg-white/10 hidden lg:block mx-12 mb-4" />
          </div>
        </AnimatedSection>
        
        <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-5 border border-white/10 shadow-2xl">
          {offices.map((office, i) => (
            <AnimatedSection key={office.id} delay={i * 0.08}>
              <div className="group bg-[#070B14] p-8 lg:p-10 transition-all hover:bg-gold-400/5 cursor-default h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 flex items-center justify-center bg-gold-400/10 text-gold-400 group-hover:bg-gold-400 group-hover:text-navy-950 transition-colors">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="text-[17px] font-light text-white group-hover:text-gold-400 transition-colors">
                    {loc(office, 'name', locale)}
                  </span>
                </div>
                <div className="h-px w-8 bg-white/10 mb-6 group-hover:w-full transition-all duration-700" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 group-hover:text-white/60 transition-colors">
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
      <AboutHero />
      <Overview />
      <VisionMission />
      <Licenses />
      <GlobalPresenceSection offices={offices} />
    </>
  );
}
