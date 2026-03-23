'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useSiteData } from '@/components/providers/SiteDataProvider';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { ArrowRight } from 'lucide-react';
import { loc } from '@/lib/locale-utils';

interface ArticleRow {
  id: number;
  slug: string;
  category: string;
  date: string;
  titleZhCN: string;
  titleZhTW: string;
  titleEn: string;
  excerptZhCN: string;
  excerptZhTW: string;
  excerptEn: string;
}

interface MetricRow {
  id: number;
  valueZhCN: string;
  valueZhTW: string;
  valueEn: string;
  labelZhCN: string;
  labelZhTW: string;
  labelEn: string;
}

/* ─────────────────────────────────────────
   BRI CORRIDOR MAP SVG
───────────────────────────────────────── */
function BRIMapSVG() {
  return (
    <svg
      viewBox="0 0 660 360"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="hk-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
        <style>{`
          @keyframes briDraw {
            from { stroke-dashoffset: var(--len, 500); }
            to   { stroke-dashoffset: 0; }
          }
          @keyframes briAppear {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes briPulse {
            0%   { r: 10; opacity: 0.45; }
            100% { r: 38; opacity: 0; }
          }
          @keyframes briFloat {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(-4px); }
          }
          .bri-line-main {
            fill: none;
            stroke: rgba(212,175,55,0.55);
            stroke-width: 1.5;
            stroke-linecap: round;
            stroke-dasharray: 420;
            stroke-dashoffset: 420;
            animation: briDraw 2.8s cubic-bezier(.4,0,.2,1) forwards;
          }
          .bri-line-sub {
            fill: none;
            stroke: rgba(212,175,55,0.3);
            stroke-width: 1;
            stroke-linecap: round;
            stroke-dasharray: 280;
            stroke-dashoffset: 280;
            animation: briDraw 2s cubic-bezier(.4,0,.2,1) forwards;
          }
          .bri-line-arc {
            fill: none;
            stroke: rgba(212,175,55,0.1);
            stroke-width: 1;
            stroke-linecap: round;
            stroke-dasharray: 720;
            stroke-dashoffset: 720;
            animation: briDraw 3.5s cubic-bezier(.4,0,.2,1) forwards;
          }
          .bri-dot {
            opacity: 0;
            animation: briAppear 0.4s ease forwards;
          }
          .bri-label {
            opacity: 0;
            animation: briAppear 0.6s ease forwards;
          }
          .hk-ring-1 { animation: briPulse 2.8s ease-out infinite; }
          .hk-ring-2 { animation: briPulse 2.8s ease-out infinite 1.0s; }
          .hk-float  { animation: briFloat 4s ease-in-out infinite; }
        `}</style>
      </defs>

      {/* ── Region blobs ── */}
      <ellipse cx="95"  cy="115" rx="78"  ry="48"  fill="rgba(212,175,55,0.025)" />
      <ellipse cx="255" cy="172" rx="82"  ry="58"  fill="rgba(212,175,55,0.028)" />
      <ellipse cx="400" cy="148" rx="78"  ry="54"  fill="rgba(212,175,55,0.025)" />
      <ellipse cx="545" cy="178" rx="88"  ry="68"  fill="rgba(212,175,55,0.032)" />
      <ellipse cx="530" cy="270" rx="52"  ry="38"  fill="rgba(212,175,55,0.022)" />

      {/* ── Paths ── */}
      {/* London → Dubai */}
      <path className="bri-line-sub"
        d="M 90,110 Q 172,142 255,172"
        style={{ animationDelay: '0.1s' }} />
      {/* Dubai → HK (main east–west BRI axis) */}
      <path className="bri-line-main"
        d="M 255,172 Q 400,162 545,178"
        style={{ animationDelay: '0.5s' }} />
      {/* Central Asia → HK */}
      <path className="bri-line-sub"
        d="M 395,108 Q 470,140 545,178"
        style={{ animationDelay: '0.9s' }} />
      {/* HK → Beijing */}
      <path className="bri-line-sub"
        d="M 545,178 Q 542,148 540,115"
        style={{ animationDelay: '1.2s' }} />
      {/* HK → Singapore */}
      <path className="bri-line-sub"
        d="M 545,178 Q 538,224 530,268"
        style={{ animationDelay: '1.4s' }} />
      {/* Long financial arc: London → HK */}
      <path className="bri-line-arc"
        d="M 90,110 Q 318,32 545,178"
        style={{ animationDelay: '2.2s' }} />

      {/* ── Labels ── */}
      <text x="90"  y="96"  textAnchor="middle" fill="rgba(255,255,255,0.42)" fontSize="8.5" fontFamily="Inter,sans-serif" letterSpacing="1.5" className="bri-label" style={{ animationDelay: '0.6s' }}>LONDON</text>
      <text x="255" y="158" textAnchor="middle" fill="rgba(255,255,255,0.48)" fontSize="8.5" fontFamily="Inter,sans-serif" letterSpacing="1.5" className="bri-label" style={{ animationDelay: '1.0s' }}>DUBAI</text>
      <text x="395" y="94"  textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="7.5" fontFamily="Inter,sans-serif" letterSpacing="1.2" className="bri-label" style={{ animationDelay: '1.2s' }}>CENTRAL ASIA</text>
      <text x="540" y="101" textAnchor="middle" fill="rgba(255,255,255,0.38)" fontSize="8"   fontFamily="Inter,sans-serif" letterSpacing="1.2" className="bri-label" style={{ animationDelay: '1.5s' }}>BEIJING</text>
      <text x="530" y="288" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="8.5" fontFamily="Inter,sans-serif" letterSpacing="1.5" className="bri-label" style={{ animationDelay: '1.8s' }}>SINGAPORE</text>

      {/* ── City dots ── */}
      <circle cx="90"  cy="110" r="3.5"  fill="#D4AF37" fillOpacity="0.65" className="bri-dot" style={{ animationDelay: '0.4s' }} />
      <circle cx="255" cy="172" r="4.5"  fill="#D4AF37" fillOpacity="0.80" className="bri-dot" style={{ animationDelay: '0.8s' }} />
      <circle cx="395" cy="108" r="3"    fill="#D4AF37" fillOpacity="0.50" className="bri-dot" style={{ animationDelay: '1.1s' }} />
      <circle cx="540" cy="115" r="3"    fill="#D4AF37" fillOpacity="0.52" className="bri-dot" style={{ animationDelay: '1.4s' }} />
      <circle cx="530" cy="268" r="3.5"  fill="#D4AF37" fillOpacity="0.65" className="bri-dot" style={{ animationDelay: '1.7s' }} />

      {/* ── Hong Kong — centre node ── */}
      <g className="hk-float">
        <circle cx="545" cy="178" r="55"  fill="url(#hk-glow)" />
        <circle cx="545" cy="178" className="hk-ring-1" fill="none" stroke="#D4AF37" strokeWidth="0.8" />
        <circle cx="545" cy="178" className="hk-ring-2" fill="none" stroke="#D4AF37" strokeWidth="0.8" />
        <circle cx="545" cy="178" r="15"  fill="none" stroke="rgba(212,175,55,0.18)" strokeWidth="1" />
        <circle cx="545" cy="178" r="8"   fill="#D4AF37" />
        <circle cx="545" cy="178" r="3.5" fill="white" />
        <text x="545" y="207" textAnchor="middle" fill="rgba(212,175,55,0.95)" fontSize="10.5" fontFamily="Inter,sans-serif" fontWeight="500" letterSpacing="2.5" className="bri-label" style={{ animationDelay: '0.2s' }}>HONG KONG</text>
        <text x="545" y="220" textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize="7.5"  fontFamily="Inter,sans-serif" letterSpacing="1.2" className="bri-label" style={{ animationDelay: '0.2s' }}>GATEWAY HUB</text>
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────
   HERO
───────────────────────────────────────── */
function BRIHero() {
  const t = useTranslations('Home');

  const kpis = [
    { value: t('kpi1Value'), label: t('kpi1Label') },
    { value: t('kpi2Value'), label: t('kpi2Label') },
    { value: t('kpi3Value'), label: t('kpi3Label') },
    { value: t('kpi4Value'), label: t('kpi4Label') },
  ];

  return (
    <section className="relative min-h-screen flex items-center bg-navy-950 overflow-hidden">
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      {/* Warm radial glow from right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 75% at 75% 50%, rgba(212,175,55,0.045) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-8 pt-36 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: copy */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 border border-gold-400/25 bg-gold-400/5 px-4 py-2 mb-9">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-400">
                {t('heroTagline')}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[clamp(2.2rem,4.8vw,4.2rem)] font-extralight leading-[1.06] tracking-tight text-white">
              {t('heroTitle')}
              <br />
              <span className="font-light text-gold-400">{t('heroTitleLine2')}</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-8 max-w-[500px] text-[1.05rem] font-light leading-relaxed text-white/50">
              {t('heroSubtitle')}
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/business"
                className="group inline-flex items-center gap-2 bg-gold-400 px-7 py-3.5 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-navy-950 transition-colors hover:bg-gold-300"
              >
                {t('heroCta1')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 border border-white/20 px-7 py-3.5 text-[11.5px] font-medium uppercase tracking-[0.1em] text-white/65 transition-colors hover:border-white/45 hover:text-white"
              >
                {t('heroCta2')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* KPI bar */}
            <div className="mt-14 pt-10 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {kpis.map((kpi, i) => (
                <div key={i}>
                  <div className="text-[clamp(1.5rem,2.8vw,2rem)] font-light tracking-tight text-gold-400">
                    {kpi.value}
                  </div>
                  <div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.13em] text-white/32">
                    {kpi.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: BRI map */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-full max-w-[580px]">
              <BRIMapSVG />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   WHY HONG KONG
───────────────────────────────────────── */
function GatewaySection() {
  const t = useTranslations('Home');

  const pillars = [
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
      ),
      titleKey: 'gateway1Title',
      descKey: 'gateway1Desc',
    },
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
      ),
      titleKey: 'gateway2Title',
      descKey: 'gateway2Desc',
    },
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      titleKey: 'gateway3Title',
      descKey: 'gateway3Desc',
    },
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
        </svg>
      ),
      titleKey: 'gateway4Title',
      descKey: 'gateway4Desc',
    },
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-28 lg:py-36">
        <AnimatedSection>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">
            {t('gatewayLabel')}
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.6rem,3vw,2.5rem)] font-light leading-tight text-[#1a1a2e]">
            {t('gatewayTitle')}
          </h2>
          <p className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-[#6c757d] font-light">
            {t('gatewaySubtitle')}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <div className="relative mt-12 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/home/gateway-banner.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070B14]/85 via-[#070B14]/60 to-[#070B14]/30" />
            <div className="relative z-10 flex min-h-[240px] items-end px-8 py-10 lg:px-12">
              <div className="max-w-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-400">
                  {t('gatewayBannerLabel')}
                </p>
                <p className="mt-3 text-[15px] font-light leading-relaxed text-white/80">
                  {t('gatewayBannerDesc')}
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <div className="mt-16 grid gap-px bg-[#e5e7eb] sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="bg-white p-9 lg:p-10 h-full flex flex-col">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#fdf9ec] text-gold-500 mb-6 flex-shrink-0">
                  {pillar.icon}
                </div>
                <h3 className="text-[15.5px] font-semibold text-[#1a1a2e]">
                  {t(pillar.titleKey)}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[#6c757d] flex-1">
                  {t(pillar.descKey)}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   BRI CORRIDORS
───────────────────────────────────────── */
function CorridorSection() {
  const t = useTranslations('Home');

  const corridors = [
    { key: 'corridor1', city: 'Dubai', region: 'GCC · Middle East' },
    { key: 'corridor2', city: 'Singapore', region: 'ASEAN Hub' },
    { key: 'corridor3', city: 'Shenzhen', region: 'Greater Bay Area' },
    { key: 'corridor4', city: 'South Asia', region: 'Pakistan · Bangladesh' },
    { key: 'corridor5', city: 'London', region: 'Europe · UK' },
  ];

  return (
    <section className="bg-[#f7f8f9]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-28 lg:py-36">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left: header */}
          <AnimatedSection>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">
              {t('corridorLabel')}
            </p>
            <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.5rem)] font-light leading-tight text-[#1a1a2e]">
              {t('corridorTitle')}
            </h2>
            <p className="mt-5 text-[1rem] leading-relaxed text-[#6c757d] font-light">
              {t('corridorSubtitle')}
            </p>

            <div className="mt-12 divide-y divide-[#e5e7eb]">
              {corridors.map((c, i) => (
                <AnimatedSection key={c.key} delay={i * 0.09}>
                  <div className="py-5 flex gap-5 items-start">
                    <div className="flex-shrink-0 mt-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                    </div>
                    <div className="flex-1 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-[14.5px] font-semibold text-[#1a1a2e] leading-snug">
                          {t(`${c.key}` as const)}
                        </h3>
                        <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#6c757d]">
                          {t(`${c.key}Desc` as const)}
                        </p>
                      </div>
                      <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#adb5bd] mt-0.5 text-right">
                        {c.region}
                      </span>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>

          {/* Right: corridor images grid */}
          <AnimatedSection delay={0.2}>
            <div className="grid grid-cols-2 gap-px bg-[#e5e7eb]">
              {[
                { img: '/images/home/corridor-dubai.png', label: 'Dubai' },
                { img: '/images/home/corridor-singapore.png', label: 'Singapore' },
                { img: '/images/home/corridor-shenzhen.png', label: 'Shenzhen' },
                { img: '/images/home/corridor-london.png', label: 'London' },
              ].map((item) => (
                <div key={item.label} className="relative overflow-hidden bg-[#e5e7eb]" style={{ aspectRatio: '4/3' }}>
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                    style={{ backgroundImage: `url(${item.img})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/70 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/80">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   INSTITUTIONAL ECOSYSTEM
───────────────────────────────────────── */
function EcosystemSection() {
  const t = useTranslations('Home');

  const partners = [
    {
      logo: '恒邦资本',
      logoEn: 'Hengbang Capital',
      role: 'Mainland China Shareholder',
      badge: 'AMAC P1067569',
      stats: [
        { v: 'RMB 60B+', l: 'AUM' },
        { v: '70+', l: 'Portfolio Companies' },
        { v: '2017', l: 'Established' },
      ],
      highlight: 'CAS Innovation + China Resources Capital',
      descKey: 'ecosystem1Desc' as const,
      accent: '#D4AF37',
      cityImage: '/images/home/ecosystem-beijing.jpg',
    },
    {
      logo: 'AKJ Group',
      logoEn: 'AK Jensen Group',
      role: 'European Hedge Fund Partner',
      badge: 'FCA · Norway · Malta',
      stats: [
        { v: 'USD 24B+', l: 'AUM' },
        { v: '35', l: 'Countries Served' },
        { v: '1995', l: 'Established' },
      ],
      highlight: 'London · Norway · Malta Regulated',
      descKey: 'ecosystem2Desc' as const,
      accent: '#8B9DC3',
      cityImage: '/images/home/ecosystem-london.jpg',
    },
    {
      logo: '中银资管',
      logoEn: 'BOCAM Singapore',
      role: 'Fund Management Partner',
      badge: 'MAS RLFMC · QFII · CIBM',
      stats: [
        { v: 'RMB 745B+', l: 'BOC Fund AUM' },
        { v: '300+', l: 'Institutional Clients' },
        { v: 'MAS', l: 'Licensed' },
      ],
      highlight: 'Bank of China 83.5% + BlackRock 16.5%',
      descKey: 'ecosystem3Desc' as const,
      accent: '#C41E3A',
      cityImage: '/images/home/ecosystem-singapore.jpg',
    },
  ];

  return (
    <section className="bg-navy-950">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-28 lg:py-36">
        <AnimatedSection>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">
            {t('ecosystemLabel')}
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.6rem,3vw,2.5rem)] font-light leading-tight text-white">
            {t('ecosystemTitle')}
          </h2>
          <p className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-white/42 font-light">
            {t('ecosystemSubtitle')}
          </p>
        </AnimatedSection>

        <div className="mt-16 grid gap-px bg-white/[0.08] sm:grid-cols-3">
          {partners.map((p, i) => (
            <AnimatedSection key={i} delay={i * 0.12}>
              <div className="bg-navy-900 p-9 lg:p-10 h-full flex flex-col">
                {/* Accent top bar */}
                <div className="h-[3px] w-10 mb-8" style={{ backgroundColor: p.accent }} />

                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-[21px] font-light tracking-wide text-white">{p.logo}</div>
                    <div className="text-[11px] text-white/50 mt-0.5 tracking-wide">{p.logoEn}</div>
                  </div>
                  <span
                    className="text-[9px] font-semibold uppercase tracking-[0.14em] px-2.5 py-1 border flex-shrink-0 mt-1"
                    style={{ borderColor: `${p.accent}55`, color: p.accent, background: `${p.accent}10` }}
                  >
                    {p.role}
                  </span>
                </div>

                {/* Highlight */}
                <div className="mb-5 pb-5 border-b border-white/[0.1]">
                  <span className="text-[11.5px] font-medium text-white/60">{p.highlight}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {p.stats.map((s, si) => (
                    <div key={si}>
                      <div className="text-[17px] font-light leading-none" style={{ color: p.accent }}>{s.v}</div>
                      <div className="text-[10px] text-white/40 mt-1.5 leading-snug">{s.l}</div>
                    </div>
                  ))}
                </div>

                {/* Desc */}
                <p className="text-[13.5px] leading-relaxed text-white/65 flex-1">
                  {t(p.descKey)}
                </p>

                {/* Badge */}
                <div className="mt-6 pt-5 border-t border-white/[0.08]">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">
                    {p.badge}
                  </span>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   FUND ARCHITECTURE
───────────────────────────────────────── */
function FundArchSection() {
  const t = useTranslations('Home');

  const funds = [
    {
      platform: 'Hong Kong OFC',
      platformCn: '香港开放式基金公司',
      name: 'Eminence Global Master Fund',
      code: 'BUB855 / BWH896',
      license: 'SFC Type 9 · BOP785',
      details: [
        { icon: '◆', text: 'Multi-strategy: cornerstone · anchor · block trades · M&A' },
        { icon: '◆', text: 'Monthly subscription / quarterly redemption' },
        { icon: '◆', text: 'Managed by Zhuogao Asset Management' },
      ],
      sizeLabel: 'AUM ~USD 1B',
      accentColor: '#D4AF37',
    },
    {
      platform: 'Singapore VCC',
      platformCn: '新加坡可变动资本公司',
      name: 'BOCAM-GBA International Select Fund',
      code: '中银-大湾区国际精选投资基金',
      license: 'MAS RLFMC (BOCAM) · QFII · CIBM',
      details: [
        { icon: '◆', text: 'Target AUM: HKD 5B · First close: HKD 500M' },
        { icon: '◆', text: 'HK equities · US equities · China A-shares' },
        { icon: '◆', text: 'Co-managed with Bank of China Asset Management (Singapore)' },
      ],
      sizeLabel: 'Target HKD 5B',
      accentColor: '#C41E3A',
    },
    {
      platform: 'Shenzhen Qianhai QFLP',
      platformCn: '深圳前海合格境外有限合伙人',
      name: 'Shenzhen-HK Global Tech Innovation Fund',
      code: '深港全球科技创新发展基金',
      license: 'AMAC P1067569 · Hengbang Capital',
      details: [
        { icon: '◆', text: 'Total size HKD 500M · First tranche HKD 100M' },
        { icon: '◆', text: 'AI · biotech · cross-border e-commerce · blockchain' },
        { icon: '◆', text: 'Exit via HK listing or M&A (2026–2028)' },
      ],
      sizeLabel: 'Total HKD 500M',
      accentColor: '#3B82F6',
    },
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-28 lg:py-36">
        <AnimatedSection>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">
            {t('fundArchLabel')}
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.6rem,3vw,2.5rem)] font-light leading-tight text-[#1a1a2e]">
            {t('fundArchTitle')}
          </h2>
          <p className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-[#6c757d] font-light">
            {t('fundArchSubtitle')}
          </p>
        </AnimatedSection>

        <div className="mt-16 grid gap-px bg-[#e5e7eb] sm:grid-cols-3">
          {funds.map((f, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="bg-white p-9 lg:p-10 h-full flex flex-col">
                {/* Platform badge */}
                <div
                  className="inline-flex items-center gap-2 mb-6 pb-5 border-b w-full"
                  style={{ borderColor: '#e5e7eb' }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: f.accentColor }}
                  />
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#1a1a2e]">
                      {f.platform}
                    </div>
                    <div className="text-[10px] text-[#adb5bd]">{f.platformCn}</div>
                  </div>
                </div>

                {/* Fund name */}
                <h3 className="text-[15.5px] font-semibold text-[#1a1a2e] leading-snug">
                  {f.name}
                </h3>
                <p className="mt-1 text-[12px] text-[#adb5bd]">{f.code}</p>

                {/* License */}
                <p
                  className="mt-3 text-[11px] font-semibold uppercase tracking-[0.1em]"
                  style={{ color: f.accentColor }}
                >
                  {f.license}
                </p>

                {/* Details */}
                <ul className="mt-5 space-y-2.5 flex-1">
                  {f.details.map((d, di) => (
                    <li key={di} className="flex gap-2.5 items-start">
                      <span className="text-[8px] mt-[5px] text-[#adb5bd] flex-shrink-0">◆</span>
                      <span className="text-[13.5px] leading-relaxed text-[#495057]">{d.text}</span>
                    </li>
                  ))}
                </ul>

                {/* Size */}
                <div
                  className="mt-6 pt-5 border-t border-[#e5e7eb] text-[12px] font-semibold uppercase tracking-[0.12em]"
                  style={{ color: f.accentColor }}
                >
                  {f.sizeLabel}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   TRACK RECORD
───────────────────────────────────────── */
function TrackRecordSection() {
  const t = useTranslations('Home');
  const locale = useLocale();

  const sectorStyle: Record<string, { bg: string; text: string; border: string }> = {
    ai:         { bg: '#fffbeb', text: '#92400e', border: '#fcd34d' },
    robotics:   { bg: '#eff6ff', text: '#1e40af', border: '#93c5fd' },
    health:     { bg: '#f0fdf4', text: '#166534', border: '#86efac' },
    consumer:   { bg: '#faf5ff', text: '#6b21a8', border: '#c4b5fd' },
    industrial: { bg: '#fff7ed', text: '#9a3412', border: '#fdba74' },
  };

  const portfolio = [
    { zh: '寒武纪',        en: 'Cambricon',         sector: 'ai',         exchange: 'HKEX' },
    { zh: '地平线',        en: 'Horizon Robotics',  sector: 'ai',         exchange: 'HKEX' },
    { zh: '天域半导体',    en: 'Tianyue Advanced',  sector: 'ai',         exchange: 'HKEX' },
    { zh: '北京赛目科技',  en: 'Saimo Technology',  sector: 'ai',         exchange: '2571.HK' },
    { zh: '优必选',        en: 'UBTECH',            sector: 'robotics',   exchange: 'HKEX' },
    { zh: '越疆科技',      en: 'Dobot',             sector: 'robotics',   exchange: 'HKEX' },
    { zh: '博雷顿',        en: 'Boruitong',         sector: 'robotics',   exchange: 'HKEX' },
    { zh: '晶泰科技',      en: 'XtalPi',            sector: 'health',     exchange: 'HKEX' },
    { zh: '乐普生物',      en: 'Lupu Bio',          sector: 'health',     exchange: 'HKEX' },
    { zh: '微创机器人',    en: 'MicroPort Surgical',sector: 'health',     exchange: 'HKEX' },
    { zh: '百利天恒',      en: 'Baiily Biopharma',  sector: 'health',     exchange: 'HKEX' },
    { zh: '旺山旺水生物',  en: 'Biomater',          sector: 'health',     exchange: 'HKEX' },
    { zh: '老铺黄金',      en: 'Lao Pu Gold',       sector: 'consumer',   exchange: '6181.HK' },
    { zh: '蜜雪冰城',      en: 'MIXUE',             sector: 'consumer',   exchange: '3800.HK' },
    { zh: '古茗',          en: 'Guming',            sector: 'consumer',   exchange: 'HKEX' },
    { zh: '梦金园',        en: 'Mengjin Gold',      sector: 'consumer',   exchange: 'HKEX' },
    { zh: '优艾智合',      en: 'YouiBot',           sector: 'industrial', exchange: 'HKEX' },
    { zh: '安徽海螺材料',  en: 'Conch Materials',   sector: 'industrial', exchange: '2560.HK' },
    { zh: '升辉清洁能源',  en: 'Shengwei Clean Energy', sector: 'industrial', exchange: '2521.HK' },
    { zh: '晶科电子',      en: 'Jing Ko Electronics', sector: 'ai',       exchange: '2551.HK' },
  ];

  const sectorLabels: Record<string, string> = {
    ai:         t('sectorAI'),
    robotics:   t('sectorRobotics'),
    health:     t('sectorHealth'),
    consumer:   t('sectorConsumer'),
    industrial: t('sectorIndustrial'),
  };

  return (
    <section className="bg-[#f7f8f9]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-28 lg:py-36">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <AnimatedSection>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">
              {t('trackLabel')}
            </p>
            <h2 className="mt-4 max-w-2xl text-[clamp(1.6rem,3vw,2.5rem)] font-light leading-tight text-[#1a1a2e]">
              {t('trackTitle')}
            </h2>
            <p className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-[#6c757d] font-light">
              {t('trackSubtitle')}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.12}>
            <div className="bg-navy-900 border border-navy-800 p-8 lg:p-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-400 mb-6">
                {t('trackStatLabel')}
              </p>
              <div className="space-y-5">
                {[
                  { value: '20+', label: t('trackStat1') },
                  { value: 'HKD 15B+', label: t('trackStat2') },
                  { value: '5', label: t('trackStat3') },
                  { value: '2021–', label: t('trackStat4') },
                ].map((s, i) => (
                  <div key={i} className="flex items-baseline gap-4 pb-5 border-b border-white/[0.07] last:border-0 last:pb-0">
                    <div className="text-[1.7rem] font-light text-gold-400 leading-none w-24 flex-shrink-0">{s.value}</div>
                    <div className="text-[13px] text-white/60 leading-snug">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Sector legend */}
        <div className="mt-10 flex flex-wrap gap-3">
          {Object.entries(sectorLabels).map(([key, label]) => {
            const s = sectorStyle[key];
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold border"
                style={{ background: s.bg, color: s.text, borderColor: s.border }}
              >
                {label}
              </span>
            );
          })}
        </div>

        {/* Portfolio grid */}
        <div className="mt-8 grid gap-px bg-[#e5e7eb] grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {portfolio.map((item, i) => {
            const s = sectorStyle[item.sector];
            return (
              <AnimatedSection key={i} delay={i * 0.04}>
                <div className="bg-white px-6 py-5 h-full flex flex-col justify-between">
                  <div>
                    <div className="text-[15.5px] font-semibold text-[#1a1a2e]">
                      {locale === 'en' ? item.en : item.zh}
                    </div>
                    <div className="text-[12px] text-[#adb5bd] mt-0.5">
                      {locale === 'en' ? item.zh : item.en}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 border"
                      style={{ background: s.bg, color: s.text, borderColor: s.border }}
                    >
                      {sectorLabels[item.sector]}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-[#adb5bd]">
                      {item.exchange}
                    </span>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        <p className="mt-8 text-[12px] text-[#adb5bd]">{t('trackNote')}</p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   INVESTMENT STRATEGIES (Business)
───────────────────────────────────────── */
function BusinessSection() {
  const t = useTranslations('Home');
  const locale = useLocale();
  const { divisions } = useSiteData();

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-28 lg:py-36">
        <AnimatedSection>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">
            {t('businessLabel')}
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.6rem,3vw,2.5rem)] font-light leading-tight text-[#1a1a2e]">
            {t('businessTitle')}
          </h2>
          <p className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-[#6c757d] font-light">
            {t('businessSubtitle')}
          </p>
        </AnimatedSection>

        <div className="mt-16 grid gap-px bg-[#e5e7eb] sm:grid-cols-2 lg:grid-cols-3">
          {divisions.map((div, i) => (
            <AnimatedSection key={div.divisionId} delay={i * 0.07}>
              <Link
                href={`/business/${div.slug}`}
                className="group flex h-full flex-col justify-between bg-white p-9 transition-colors hover:bg-[#fafafa] lg:p-10"
              >
                <div>
                  <h3 className="text-[18px] font-semibold text-[#1a1a2e]">
                    {loc(div, 'title', locale)}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-[#6c757d]">
                    {loc(div, 'shortDesc', locale)}
                  </p>
                </div>
                <div className="mt-7 flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.09em] text-gold-500 transition-colors group-hover:text-navy-900">
                  {t('businessLearnMore')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <div className="mt-10">
          <AnimatedSection>
            <Link
              href="/business"
              className="inline-flex items-center gap-2 text-[11.5px] font-medium uppercase tracking-[0.09em] text-[#1a1a2e] hover:text-gold-500 transition-colors"
            >
              {t('businessViewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   INVESTOR CONNECT
───────────────────────────────────────── */
function InvestorConnectSection() {
  const t = useTranslations('Home');

  const paths = [
    {
      num: '01',
      iconPath: 'M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
      titleKey: 'lpPath1Title' as const,
      descKey: 'lpPath1Desc' as const,
      tagKey: 'lpPath1Tag' as const,
      href: '/contact',
    },
    {
      num: '02',
      iconPath: 'M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6',
      titleKey: 'lpPath2Title' as const,
      descKey: 'lpPath2Desc' as const,
      tagKey: 'lpPath2Tag' as const,
      href: '/contact',
    },
    {
      num: '03',
      iconPath: 'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z',
      titleKey: 'lpPath3Title' as const,
      descKey: 'lpPath3Desc' as const,
      tagKey: 'lpPath3Tag' as const,
      href: '/contact',
    },
  ];

  const requirements = [
    { label: t('lpReq1Label'), value: t('lpReq1Value') },
    { label: t('lpReq2Label'), value: t('lpReq2Value') },
    { label: t('lpReq3Label'), value: t('lpReq3Value') },
    { label: t('lpReq4Label'), value: t('lpReq4Value') },
  ];

  return (
    <section className="bg-navy-950">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-28 lg:py-36">
        {/* Header */}
        <AnimatedSection>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                {t('lpLabel')}
              </p>
              <h2 className="mt-4 max-w-xl text-[clamp(1.6rem,3vw,2.5rem)] font-light leading-tight text-white">
                {t('lpTitle')}
              </h2>
            </div>
            <p className="max-w-sm text-[14px] leading-relaxed text-white/38 font-light lg:text-right">
              {t('lpSubtitle')}
            </p>
          </div>
        </AnimatedSection>

        {/* Three paths */}
        <div className="grid gap-px bg-white/[0.05] sm:grid-cols-3">
          {paths.map((p, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <Link href={p.href} className="group bg-[#070e1f] p-9 lg:p-10 h-full flex flex-col hover:bg-[#0c1628] transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-6">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/20">{p.num}</span>
                  <div className="w-10 h-10 flex items-center justify-center border border-gold-400/25 text-gold-400 flex-shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={p.iconPath} />
                    </svg>
                  </div>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-400 mb-3">
                  {t(p.tagKey)}
                </span>
                <h3 className="text-[16px] font-semibold text-white leading-snug mb-3">
                  {t(p.titleKey)}
                </h3>
                <p className="text-[13.5px] leading-relaxed text-white/38 flex-1">
                  {t(p.descKey)}
                </p>
                <div className="mt-6 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {t('lpGetStarted')}
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        {/* Requirements strip */}
        <AnimatedSection delay={0.3}>
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04]">
            {requirements.map((r, i) => (
              <div key={i} className="bg-[#070e1f] px-6 py-5">
                <div className="text-[11px] uppercase tracking-[0.14em] text-white/25 mb-1">{r.label}</div>
                <div className="text-[14.5px] font-medium text-white/70">{r.value}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   ABOUT PREVIEW
───────────────────────────────────────── */
function AboutPreview() {
  const t = useTranslations('Home');

  const offices = [
    { city: 'Hong Kong', role: 'HQ' },
    { city: 'Shenzhen', role: 'GBA' },
    { city: 'Singapore', role: 'ASEAN' },
    { city: 'Dubai', role: 'GCC' },
    { city: 'London', role: 'EU' },
  ];

  return (
    <section className="bg-[#f7f8f9]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-28 lg:py-36">
        <div className="grid items-start gap-16 lg:grid-cols-2">
          <AnimatedSection>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">
              {t('aboutTitle')}
            </p>
            <p className="mt-6 text-[clamp(1rem,1.8vw,1.2rem)] font-light leading-relaxed text-[#495057]">
              {t('aboutDescription')}
            </p>
            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-2 border-b border-navy-900 pb-1 text-[11.5px] font-medium uppercase tracking-[0.09em] text-navy-900 transition-colors hover:border-gold-500 hover:text-gold-500"
            >
              {t('aboutLearnMore')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#adb5bd] mb-8">
              {t('aboutGlobalPresence')}
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {offices.map((office) => (
                <div key={office.city} className="border-l-2 border-gold-400 py-3 pl-4">
                  <div className="text-[15px] font-semibold text-[#1a1a2e]">{office.city}</div>
                  <div className="text-[11px] uppercase tracking-widest text-[#adb5bd] mt-0.5">{office.role}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   INSIGHTS
───────────────────────────────────────── */
function InsightsSection({ articles }: { articles: ArticleRow[] }) {
  const t = useTranslations('Home');
  const tInsights = useTranslations('Insights');
  const locale = useLocale();
  const latest = articles.slice(0, 3);

  const categoryLabels: Record<string, string> = {
    news: tInsights('categoryNews'),
    market: tInsights('categoryMarket'),
    industry: tInsights('categoryIndustry'),
  };

  return (
    <section className="section-separator bg-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-28 lg:py-36">
        <AnimatedSection>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">
                {t('insightsTitle')}
              </p>
              <h2 className="mt-4 text-[clamp(1.5rem,3vw,2.25rem)] font-light text-[#1a1a2e]">
                {t('insightsSubtitle')}
              </h2>
            </div>
            <Link
              href="/insights"
              className="hidden items-center gap-1.5 text-[11.5px] font-medium uppercase tracking-[0.09em] text-navy-900 hover:text-gold-500 transition-colors sm:flex"
            >
              {t('insightsViewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </AnimatedSection>

        <div className="mt-12 grid gap-px bg-[#e5e7eb] md:grid-cols-3">
          {latest.map((article, i) => (
            <AnimatedSection key={article.slug} delay={i * 0.1}>
              <Link
                href={`/insights/${article.slug}`}
                className="group flex h-full flex-col justify-between bg-white p-8 transition-colors hover:bg-[#fafafa]"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-500">
                      {categoryLabels[article.category]}
                    </span>
                    <span className="text-[11px] text-[#adb5bd]">{article.date}</span>
                  </div>
                  <h3 className="mt-4 text-[17px] font-semibold leading-snug text-[#1a1a2e] group-hover:text-navy-700">
                    {loc(article, 'title', locale)}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-[#6c757d]">
                    {loc(article, 'excerpt', locale)}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.09em] text-gold-500 transition-colors group-hover:text-navy-900">
                  {t('insightsReadMore')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <Link
          href="/insights"
          className="mt-8 flex items-center gap-1.5 text-[11.5px] font-medium uppercase tracking-[0.09em] text-navy-900 hover:text-gold-500 sm:hidden"
        >
          {t('insightsViewAll')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   CTA BANNER
───────────────────────────────────────── */
function CtaBanner() {
  const t = useTranslations('Home');

  return (
    <section className="bg-navy-950">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-24 lg:py-28">
        <div className="relative overflow-hidden border border-white/10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/home/cta-banner.jpg')" }}
          />
          <div className="absolute inset-0 bg-[#07101f]/72" />
          <div className="relative z-10 flex flex-col items-start justify-between gap-8 px-8 py-16 lg:flex-row lg:items-center lg:px-12">
            <div className="max-w-xl">
              <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-light text-white">{t('ctaTitle')}</h2>
              <p className="mt-4 text-[1rem] font-light text-white/52">{t('ctaSubtitle')}</p>
            </div>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 border border-gold-400 px-8 py-4 text-[11.5px] font-medium uppercase tracking-[0.12em] text-gold-400 transition-colors hover:bg-gold-400 hover:text-navy-950 flex-shrink-0"
            >
              {t('ctaButton')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PAGE EXPORT
───────────────────────────────────────── */
export default function HomeClient({
  articles,
  metrics,
}: {
  articles: ArticleRow[];
  metrics: MetricRow[];
}) {
  void metrics; // kept for page.tsx compat; KPIs now driven by i18n keys
  return (
    <>
      <BRIHero />
      <GatewaySection />
      <EcosystemSection />
      <CorridorSection />
      <FundArchSection />
      <BusinessSection />
      <TrackRecordSection />
      <InvestorConnectSection />
      <AboutPreview />
      <InsightsSection articles={articles} />
      <CtaBanner />
    </>
  );
}
