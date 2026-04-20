'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useSiteData } from '@/components/providers/SiteDataProvider';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Mono from '@/components/ui/Mono';
import VerticalCN from '@/components/ui/VerticalCN';
import Seal from '@/components/ui/Seal';
import SectionHead from '@/components/ui/SectionHead';
import dynamic from 'next/dynamic';

// Globe is WebGL — client-only, no SSR
const Globe = dynamic(() => import('@/components/ui/Globe'), { ssr: false });
import { ArrowRight } from 'lucide-react';
import { loc } from '@/lib/locale-utils';
import {
  CN_NUM,
  PORTFOLIO,
  SECTOR_LABELS,
  SECTOR_STYLES,
  CORRIDORS,
  REGULATORY_TIMELINE,
  TRACK_STATS,
  INSTITUTIONAL_UNITS,
  EUROPEAN_DISTRIBUTION,
  type Sector,
} from '@/lib/home-data';

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

/* Helpers */
const WRAP = 'mx-auto w-full max-w-[1400px] px-6 lg:px-8';

/* Globe geography — [lng, lat] for d3-geo. Order matches CORRIDORS (home-data.ts). */
const HK_HQ: [number, number] = [114.17, 22.32];
const HUB_LNGLAT: [number, number][] = [
  [55.27, 25.2],    // Dubai
  [103.82, 1.35],   // Singapore
  [114.06, 22.54],  // Shenzhen
  [67.01, 24.86],   // Karachi (South Asia hub)
  [-0.12, 51.5],    // London
];
const HUB_LABELS = ['DUBAI', 'SINGAPORE', 'SHENZHEN', 'KARACHI', 'LONDON'];

function pickL(obj: { zh: string; en: string }, locale: string): string {
  return locale.startsWith('en') ? obj.en : obj.zh;
}

/* ─────────────────────────────────────────
   HERO — BC dashboard hero on ink + video
───────────────────────────────────────── */
function BRIHero() {
  const t = useTranslations('Home');
  const locale = useLocale();
  const isZh = !locale.startsWith('en');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setTime(new Date()));
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.defaultMuted = true;
      v.volume = 0;
    }
  }, []);

  const kpis = [
    { value: t('kpi1Value'), label: t('kpi1Label') },
    { value: t('kpi2Value'), label: t('kpi2Label') },
    { value: t('kpi3Value'), label: t('kpi3Label') },
    { value: t('kpi4Value'), label: t('kpi4Label') },
  ];

  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: '100vh', background: 'var(--color-ink)', color: 'var(--color-cream)' }}
    >
      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/videos/hero-skyline-poster.jpg"
        className="absolute inset-0 w-full h-full"
        style={{
          objectFit: 'cover',
          objectPosition: 'center 40%',
          filter: 'saturate(0.85) contrast(1.08) brightness(0.78)',
          zIndex: 0,
        }}
      >
        <source src="/videos/hero-skyline.mp4" type="video/mp4" />
      </video>

      {/* Overlays */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1]"
        style={{ background: 'linear-gradient(180deg, rgba(11,17,30,.72) 0%, rgba(11,17,30,.55) 35%, rgba(11,17,30,.78) 100%)' }}
      />
      <div
        aria-hidden
        className="absolute inset-0 z-[1]"
        style={{ background: 'linear-gradient(90deg, rgba(11,17,30,.82) 0%, rgba(11,17,30,.45) 45%, rgba(11,17,30,.35) 75%, rgba(11,17,30,.55) 100%)' }}
      />
      <div
        aria-hidden
        className="absolute inset-0 z-[1]"
        style={{
          background: 'radial-gradient(ellipse 60% 70% at 80% 45%, rgba(184,134,43,.22) 0%, transparent 65%)',
          mixBlendMode: 'screen',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 z-[1] opacity-[.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(245,241,230,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,241,230,.5) 1px, transparent 1px)',
          backgroundSize: '96px 96px',
        }}
      />

      {/* Ticker bar */}
      <div
        className="absolute left-0 right-0 z-[3]"
        style={{
          top: 72,
          borderTop: '1px solid rgba(245,241,230,.1)',
          borderBottom: '1px solid rgba(245,241,230,.1)',
          background: 'rgba(11,17,30,.6)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className={`${WRAP} flex flex-wrap items-center justify-between gap-3 font-monoDisp`} style={{ padding: '12px 24px', fontSize: 11, color: 'rgba(245,241,230,.55)' }}>
          <div className="flex flex-wrap gap-6">
            <span>
              <span style={{ color: '#6EE7B7' }}>●</span> HKT {time ? time.toLocaleTimeString('en-GB') : '—'}
            </span>
            <span>HSI 19,847.23 <span style={{ color: '#6EE7B7' }}>+0.84%</span></span>
            <span>USD/HKD 7.7812</span>
            <span>XAU/USD 2,418.50 <span style={{ color: '#6EE7B7' }}>+0.32%</span></span>
          </div>
          <div style={{ letterSpacing: '.15em', color: 'var(--color-gold-soft)' }}>SFC · AMAC · MAS · FCA</div>
        </div>
      </div>

      {/* Vertical CN ornament left */}
      <div className="hidden lg:flex absolute z-[3] flex-col gap-5" style={{ top: 170, left: 32 }}>
        <VerticalCN color="rgba(212,175,95,.55)" size={13}>東方資本 · 卓越門戶</VerticalCN>
        <div style={{ width: 1, height: 60, background: 'linear-gradient(to bottom, rgba(212,175,95,.5), transparent)' }} />
      </div>

      {/* Large 壹 watermark right */}
      <div
        aria-hidden
        className="hidden lg:block pointer-events-none select-none absolute z-[2] font-serifSC"
        style={{
          top: 150,
          right: -30,
          fontSize: 420,
          fontWeight: 400,
          lineHeight: 1,
          color: 'rgba(212,175,95,.09)',
        }}
      >
        壹
      </div>

      <div className={`${WRAP} relative z-[3]`} style={{ paddingTop: 'clamp(120px, 15vw, 160px)', paddingBottom: 60 }}>
        <div className="grid gap-12 lg:gap-20 items-start lg:grid-cols-[1.4fr_1fr]">
          {/* Left editorial */}
          <AnimatedSection>
            <div className="flex items-start gap-3.5">
              <Seal size={44} />
              <div className="flex flex-col gap-0.5">
                <div className="font-serifSC" style={{ fontSize: 16, letterSpacing: '.15em', color: 'var(--color-cream)' }}>
                  {isZh ? '天際控股集團 · 開曼' : 'SKYW Group · Cayman Holding'}
                </div>
                <Mono color="rgba(212,175,95,.75)" size={10}>
                  {isZh ? '旗下 · 天汇基金 香港 SFC Type 4 · 9 · BOP785' : 'Subsidiary · SKYW Fund HK · SFC Type 4 & 9 · BOP785'}
                </Mono>
                <Mono color="rgba(245,241,230,.35)" size={9}>
                  HK OFC · SG VCC · CAYMAN SPC · CN QFLP
                </Mono>
              </div>
            </div>

            <h1
              className="font-serifSC"
              style={{
                marginTop: 44,
                fontSize: 'clamp(34px, 7.5vw, 96px)',
                fontWeight: 500,
                lineHeight: 1.02,
                letterSpacing: '-0.025em',
                color: 'var(--color-cream)',
              }}
            >
              {t('heroTitle')}
              <br />
              <span style={{ color: 'var(--color-gold-soft)', fontStyle: isZh ? 'normal' : 'italic' }}>
                {t('heroTitleLine2')}
              </span>
            </h1>

            <p
              className="mt-8 font-light"
              style={{ maxWidth: 540, fontSize: 16, lineHeight: 1.85, color: 'rgba(245,241,230,.6)' }}
            >
              {t('heroSubtitle')}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3.5">
              <Link href="/contact" className="btn-gold">
                {t('heroCta1')} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/about" className="btn-ghost-cream">
                {t('heroCta2')} →
              </Link>
            </div>

            <div
              className="mt-14 pt-7 flex flex-wrap gap-9 font-monoDisp uppercase"
              style={{ borderTop: '1px solid rgba(245,241,230,.1)', fontSize: 10.5, color: 'rgba(245,241,230,.4)', letterSpacing: '.2em' }}
            >
              <span><span style={{ color: 'var(--color-gold-soft)' }}>●</span> SFC Licensed</span>
              <span><span style={{ color: 'var(--color-gold-soft)' }}>●</span> AMAC Filed</span>
              <span><span style={{ color: 'var(--color-gold-soft)' }}>●</span> MAS RLFMC</span>
            </div>
          </AnimatedSection>

          {/* Right data panel */}
          <AnimatedSection delay={0.2}>
            <div
              className="relative gold-corners"
              style={{
                background: 'rgba(245,241,230,.03)',
                border: '1px solid rgba(245,241,230,.12)',
                padding: 32,
              }}
            >
              <div
                className="flex items-center justify-between pb-4.5"
                style={{ paddingBottom: 18, borderBottom: '1px solid rgba(245,241,230,.1)' }}
              >
                <div className="flex items-center gap-2.5">
                  <VerticalCN color="var(--color-gold-soft)" size={10}>平臺</VerticalCN>
                  <Mono color="var(--color-gold-soft)">Platform at a Glance</Mono>
                </div>
                <span className="font-monoDisp" style={{ fontSize: 10, color: 'rgba(245,241,230,.4)' }}>Q1 · 2026</span>
              </div>
              {kpis.map((k, i) => (
                <div
                  key={i}
                  className="flex justify-between items-baseline gap-4"
                  style={{
                    padding: '22px 0',
                    borderBottom: i < 3 ? '1px solid rgba(245,241,230,.06)' : 'none',
                  }}
                >
                  <div>
                    <div className="font-monoDisp" style={{ fontSize: 10, color: 'var(--color-gold-soft)', letterSpacing: '.15em' }}>
                      {CN_NUM[i]} · 0{i + 1}
                    </div>
                    <div className="font-serifSC" style={{ marginTop: 6, fontSize: 13, color: 'rgba(245,241,230,.7)' }}>
                      {k.label}
                    </div>
                  </div>
                  <span
                    className="font-serifSC"
                    style={{ fontSize: 36, fontWeight: 500, color: 'var(--color-gold-soft)', letterSpacing: '-0.01em' }}
                  >
                    {k.value}
                  </span>
                </div>
              ))}
              <div
                className="mt-3.5 pt-3.5 font-monoDisp"
                style={{ borderTop: '1px dashed rgba(245,241,230,.12)', fontSize: 10, color: 'rgba(245,241,230,.4)', lineHeight: 1.8, letterSpacing: '.1em' }}
              >
                04 JURISDICTIONS · 03 FUND PLATFORMS · 06 STRATEGIES
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Portfolio ticker */}
        <div
          className="flex items-center gap-10 overflow-hidden"
          style={{ marginTop: 80, paddingTop: 28, paddingBottom: 28, borderTop: '1px solid rgba(245,241,230,.12)', borderBottom: '1px solid rgba(245,241,230,.12)' }}
        >
          <Mono color="var(--color-gold-soft)" size={10}>PORTFOLIO</Mono>
          <div
            className="flex-1 overflow-hidden"
            style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}
          >
            <div className="ticker">
              {[...PORTFOLIO, ...PORTFOLIO].map((p, i) => (
                <span key={i} className="font-serifSC" style={{ fontSize: 13.5, color: 'rgba(245,241,230,.65)' }}>
                  <span style={{ color: 'var(--color-gold-soft)', marginRight: 8 }}>◆</span>
                  {isZh ? p.zh : p.en}
                  <span className="font-monoDisp" style={{ color: 'rgba(245,241,230,.3)', marginLeft: 10, fontSize: 11 }}>
                    {p.ex}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PHILOSOPHY — ink quote strip
───────────────────────────────────────── */
function PhilosophySection() {
  const locale = useLocale();
  const isZh = !locale.startsWith('en');
  return (
    <section style={{ background: 'var(--color-ink)', color: 'var(--color-cream)', padding: 'clamp(64px, 8vw, 100px) 0 clamp(88px, 11vw, 140px)', borderBottom: '1px solid rgba(245,241,230,.08)' }}>
      <div className={WRAP}>
        <AnimatedSection>
          <div className="grid gap-10 items-start grid-cols-1 lg:grid-cols-[120px_1fr_180px]">
            <div className="font-serifSC italic" style={{ fontSize: 120, color: 'var(--color-gold-antique)', lineHeight: 0.8, fontWeight: 400 }}>
              &ldquo;
            </div>
            <div>
              <p
                className="font-serifSC m-0"
                style={{ fontSize: 'clamp(22px, 2.4vw, 36px)', fontWeight: 400, lineHeight: 1.5, color: 'var(--color-cream)', letterSpacing: '.01em' }}
              >
                {isZh
                  ? '以香港為橋,以合規為舟。我們為一帶一路投資人,搭建通往中國最具活力資本市場的唯一航道。'
                  : 'Hong Kong is the bridge. Compliance is the vessel. We build the only regulated channel for Belt & Road capital into China\'s most vital markets.'}
              </p>
              <div className="mt-7 flex items-center gap-3.5">
                <span className="gold-line" />
                <Mono color="var(--color-gold-soft)">{isZh ? '投資哲學 · 二〇二六' : 'Investment Philosophy · 2026'}</Mono>
              </div>
            </div>
            <div className="hidden lg:block text-right">
              <VerticalCN color="rgba(212,175,95,.55)" size={14}>投 · 資 · 哲 · 學</VerticalCN>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   GATEWAY — cream pillars + ink regulatory timeline
───────────────────────────────────────── */
function GatewaySection() {
  const t = useTranslations('Home');
  const locale = useLocale();
  const isZh = !locale.startsWith('en');

  const pillars = [
    { titleKey: 'gateway1Title' as const, descKey: 'gateway1Desc' as const },
    { titleKey: 'gateway2Title' as const, descKey: 'gateway2Desc' as const },
    { titleKey: 'gateway3Title' as const, descKey: 'gateway3Desc' as const },
    { titleKey: 'gateway4Title' as const, descKey: 'gateway4Desc' as const },
  ];

  return (
    <section className="relative paper-grain" style={{ background: 'var(--color-cream)', padding: 'clamp(80px, 11vw, 140px) 0' }}>
      <div className={`${WRAP} relative`}>
        <SectionHead
          cn={t('gatewayLabel')}
          en="Why Hong Kong"
          title={t('gatewayTitle')}
          subtitle={t('gatewaySubtitle')}
        />

        {/* Pillars grid */}
        <div
          className="grid mt-18 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ marginTop: 72, border: '1px solid rgba(11,17,30,.12)', background: 'rgba(255,255,255,.6)' }}
        >
          {pillars.map((p, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <div
                className="relative"
                style={{
                  padding: '40px 32px',
                  borderRight: i < 3 ? '1px solid rgba(11,17,30,.1)' : 'none',
                  borderBottom: '1px solid rgba(11,17,30,.05)',
                }}
              >
                {/* Large CN numeral watermark */}
                <div
                  className="font-serifSC pointer-events-none"
                  style={{
                    position: 'absolute',
                    top: 24,
                    right: 20,
                    fontSize: 80,
                    fontWeight: 500,
                    color: 'rgba(139,42,26,.08)',
                    lineHeight: 1,
                  }}
                >
                  {CN_NUM[i]}
                </div>
                <div className="relative">
                  <div className="flex items-baseline gap-2.5">
                    <Mono color="var(--color-cinnabar)" size={10}>P.{String(i + 1).padStart(2, '0')}</Mono>
                    <span className="font-serifSC" style={{ fontSize: 22, color: 'var(--color-cinnabar)', fontWeight: 500 }}>
                      {CN_NUM[i]}
                    </span>
                  </div>
                  <h3 className="font-serifSC" style={{ marginTop: 24, fontSize: 19, fontWeight: 600, color: 'var(--color-ink)' }}>
                    {t(p.titleKey)}
                  </h3>
                  <p className="mt-3 font-light" style={{ fontSize: 13.5, lineHeight: 1.8, color: '#5A5547' }}>
                    {t(p.descKey)}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Regulatory timeline */}
        <AnimatedSection delay={0.2}>
          <div
            className="relative overflow-hidden gold-corners"
            style={{ marginTop: 48, background: 'var(--color-ink)', color: 'var(--color-cream)', padding: '48px 44px' }}
          >
            <div className="flex items-center gap-3.5 mb-8">
              <VerticalCN color="var(--color-gold-soft)" size={11}>監管紀年</VerticalCN>
              <div>
                <Mono color="var(--color-gold-soft)">Regulatory Timeline</Mono>
                <div className="font-serifSC mt-1" style={{ fontSize: 22, color: 'var(--color-cream)', fontWeight: 500 }}>
                  {isZh ? '八載耕耘 · 四重牌照' : 'Eight Years. Four Licenses.'}
                </div>
              </div>
            </div>
            <div className="relative">
              <div aria-hidden className="hidden lg:block absolute" style={{ top: 11, left: 6, right: 6, height: 1, background: 'rgba(245,241,230,.1)' }} />
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {REGULATORY_TIMELINE.map((s, i) => (
                  <div key={i} className="relative" style={{ paddingTop: 36 }}>
                    <div
                      aria-hidden
                      style={{
                        position: 'absolute',
                        top: 5,
                        left: 0,
                        width: 13,
                        height: 13,
                        background: 'var(--color-gold-soft)',
                        border: '3px solid var(--color-ink)',
                      }}
                    />
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-serifSC" style={{ fontSize: 26, color: 'var(--color-gold-soft)', fontWeight: 500 }}>
                        {s.cn}
                      </span>
                      <span className="font-monoDisp" style={{ fontSize: 22, color: 'var(--color-gold-soft)', fontWeight: 400 }}>
                        {s.year}
                      </span>
                    </div>
                    <div className="font-serifSC mt-2" style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-cream)' }}>
                      {s.title}
                    </div>
                    <div className="mt-1.5" style={{ fontSize: 12, color: 'rgba(245,241,230,.55)', lineHeight: 1.65 }}>
                      {pickL(s.desc, locale)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   CORRIDOR — Eurasia dot-grid map + hub selector
───────────────────────────────────────── */
function CorridorSection() {
  const t = useTranslations('Home');
  const locale = useLocale();
  const isZh = !locale.startsWith('en');
  const [active, setActive] = useState(0);
  const GOLD_SOFT = '#D4AF5F';
  const CINNABAR = '#8B2A1A';
  const CREAM = '#F5F1E6';

  const globeHubs = useMemo(
    () =>
      HUB_LNGLAT.map((loc, i) => ({
        key: String(i),
        location: loc,
        active: active === i,
        label: HUB_LABELS[i],
      })),
    [active],
  );

  return (
    <section className="relative overflow-hidden" style={{ background: 'var(--color-ink)', color: 'var(--color-cream)', padding: 'clamp(80px, 11vw, 140px) 0' }}>
      <div className="hidden lg:block absolute" style={{ top: 80, left: 24 }}>
        <VerticalCN color="rgba(212,175,95,.35)" size={12}>五方通衢</VerticalCN>
      </div>
      <div className={WRAP}>
        <SectionHead
          inverse
          cn={t('corridorLabel')}
          en="Global Network"
          title={t('corridorTitle')}
          subtitle={t('corridorSubtitle')}
        />

        <div className="mt-16">
          {/* Map — square on mobile (full globe), 2:1 banner on desktop */}
          <div
            className="relative overflow-hidden aspect-square lg:aspect-[2/1]"
            style={{
              background: 'linear-gradient(180deg, #0E1626 0%, #0A0F1C 100%)',
              border: '1px solid rgba(245,241,230,.1)',
            }}
          >
            {/* Corner ornaments */}
            {(['tl', 'tr', 'bl', 'br'] as const).map((k) => (
              <div
                key={k}
                aria-hidden
                className="absolute z-[3]"
                style={{
                  width: 36,
                  height: 36,
                  top: k.startsWith('t') ? 0 : undefined,
                  bottom: k.startsWith('b') ? 0 : undefined,
                  left: k.endsWith('l') ? 0 : undefined,
                  right: k.endsWith('r') ? 0 : undefined,
                  borderTop: k.startsWith('t') ? `1px solid ${GOLD_SOFT}` : undefined,
                  borderBottom: k.startsWith('b') ? `1px solid ${GOLD_SOFT}` : undefined,
                  borderLeft: k.endsWith('l') ? `1px solid ${GOLD_SOFT}` : undefined,
                  borderRight: k.endsWith('r') ? `1px solid ${GOLD_SOFT}` : undefined,
                }}
              />
            ))}

            {/* ── Faint background watermark: 環 (connectivity / global) ── */}
            <div
              aria-hidden
              className="hidden md:block absolute font-serifSC pointer-events-none select-none z-[1]"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -52%)',
                fontSize: 'clamp(260px, 40vw, 520px)',
                fontWeight: 400,
                color: 'rgba(212,175,95,.035)',
                lineHeight: 1,
                letterSpacing: '-0.04em',
              }}
            >
              環
            </div>

            {/* ── Vertical CN rail on left edge ── */}
            <div
              aria-hidden
              className="hidden lg:flex absolute z-[2] flex-col gap-5"
              style={{ top: 72, left: 28 }}
            >
              <VerticalCN color="rgba(212,175,95,.55)" size={14}>
                絲綢之路
              </VerticalCN>
              <div style={{ width: 1, height: 44, background: 'linear-gradient(to bottom, rgba(212,175,95,.4), transparent)' }} />
              <VerticalCN color="rgba(212,175,95,.35)" size={11}>
                海陸通衢
              </VerticalCN>
            </div>

            {/* ── Vertical CN rail on right edge ── */}
            <div
              aria-hidden
              className="hidden lg:flex absolute z-[2] flex-col items-end gap-5"
              style={{ top: 72, right: 28 }}
            >
              <VerticalCN color="rgba(212,175,95,.45)" size={13}>
                東方資本 · 五方通衢
              </VerticalCN>
              <div style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, rgba(212,175,95,.3), transparent)' }} />
            </div>

            {/* ── Top-left: network identifier + sub-mono (subs hidden on mobile) ── */}
            <div className="absolute z-[3]" style={{ top: 14, left: 14 }}>
              <div className="flex items-center gap-3.5">
                <Mono color={GOLD_SOFT} size={10}>EURASIA NETWORK</Mono>
              </div>
              <div className="hidden md:block mt-1.5 font-monoDisp" style={{ fontSize: 9, color: 'rgba(245,241,230,.35)', letterSpacing: '.18em' }}>
                B&R CORRIDOR · 26,000 KM · 5 HUBS
              </div>
              <div className="hidden md:block mt-0.5 font-monoDisp" style={{ fontSize: 8.5, color: 'rgba(212,175,95,.3)', letterSpacing: '.22em' }}>
                LAT 22°19′N · LNG 114°10′E · HK HQ
              </div>
            </div>

            {/* ── Top-right: HQ / HUB legend + active bearing (bearing hidden on mobile) ── */}
            <div className="absolute z-[3] flex flex-col items-end gap-1.5" style={{ top: 14, right: 14 }}>
              <div className="flex items-center gap-2.5 sm:gap-3.5 font-monoDisp" style={{ fontSize: 9, color: 'rgba(245,241,230,.55)', letterSpacing: '.12em' }}>
                <span className="inline-flex items-center gap-1.5">
                  <span style={{ width: 8, height: 8, background: CINNABAR, transform: 'rotate(45deg)' }} /> HQ
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span style={{ width: 7, height: 7, border: `1px solid ${GOLD_SOFT}`, borderRadius: '50%' }} /> HUB
                </span>
              </div>
              <div className="hidden md:block font-monoDisp" style={{ fontSize: 8.5, color: 'rgba(212,175,95,.32)', letterSpacing: '.2em' }}>
                SIGNAL · ACTIVE · Q1 2026
              </div>
            </div>

            {/* ── Bottom-left: hub codes (sub hidden on mobile) ── */}
            <div className="absolute z-[3] font-monoDisp" style={{ bottom: 14, left: 14, fontSize: 9, color: 'rgba(245,241,230,.4)', letterSpacing: '.15em' }}>
              <div>LON · DXB · KHI · SZX · HK · SGP</div>
              <div className="hidden md:block mt-1" style={{ color: 'rgba(212,175,95,.3)', fontSize: 8.5, letterSpacing: '.22em' }}>
                GREAT-CIRCLE ROUTES · AZIMUTHAL
              </div>
            </div>

            {/* ── Bottom-right: frame identifier (sub hidden on mobile) ── */}
            <div className="absolute z-[3] flex flex-col items-end gap-1" style={{ bottom: 14, right: 14 }}>
              <Mono color="rgba(245,241,230,.35)" size={9}>MAP · Q1 2026</Mono>
              <div className="hidden md:block font-monoDisp" style={{ fontSize: 8.5, color: 'rgba(212,175,95,.3)', letterSpacing: '.22em' }}>
                PROJECTION · ORTHOGRAPHIC
              </div>
            </div>

            {/* 3D dot-globe — cobe WebGL canvas, centered in frame */}
            <div className="absolute inset-0 flex items-center justify-center z-[2]">
              <div
                className="relative"
                style={{ height: '100%', aspectRatio: '1 / 1', maxWidth: '100%' }}
              >
                <Globe
                  hq={HK_HQ}
                  hqLabel={isZh ? '香港 · 總部' : 'HK · HQ'}
                  hubs={globeHubs}
                  initialRotation={[-70, -22, 0]}
                />
              </div>
            </div>
          </div>

          {/* Hub selector strip */}
          <div
            className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
            style={{ border: '1px solid rgba(245,241,230,.12)' }}
          >
            {CORRIDORS.map((h, i) => {
              const isActive = active === i;
              return (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="text-left flex flex-col gap-2 transition-all"
                  style={{
                    padding: '20px 18px',
                    background: isActive ? 'rgba(212,175,95,.08)' : 'transparent',
                    borderRight: i < CORRIDORS.length - 1 ? '1px solid rgba(245,241,230,.1)' : undefined,
                    borderTop: isActive ? `2px solid var(--color-gold-antique)` : '2px solid transparent',
                    color: 'var(--color-cream)',
                    fontFamily: 'inherit',
                  }}
                >
                  <div className="flex items-baseline gap-2.5">
                    <span
                      className="font-serifSC"
                      style={{ fontSize: 22, color: isActive ? GOLD_SOFT : 'rgba(212,175,95,.45)', fontWeight: 500, lineHeight: 1 }}
                    >
                      {CN_NUM[i]}
                    </span>
                    <Mono color={isActive ? GOLD_SOFT : 'rgba(245,241,230,.4)'} size={9.5}>
                      HUB {String(i + 1).padStart(2, '0')}
                    </Mono>
                  </div>
                  <div
                    className="font-serifSC"
                    style={{ fontSize: 20, fontWeight: 500, color: isActive ? CREAM : 'rgba(245,241,230,.75)' }}
                  >
                    {h.city === 'South Asia' ? (isZh ? '中亞南亞' : 'S. Asia') : h.city}
                  </div>
                  <Mono color={isActive ? GOLD_SOFT : 'rgba(245,241,230,.4)'} size={9.5}>
                    {pickL(h.region, locale)}
                  </Mono>
                </button>
              );
            })}
          </div>

          {/* Active hub detail */}
          <div
            className="mt-6 relative gold-corners grid gap-8 lg:gap-12 items-start grid-cols-1 lg:grid-cols-[1.5fr_1fr]"
            style={{ padding: 36, background: 'rgba(245,241,230,.03)', border: '1px solid rgba(245,241,230,.12)' }}
          >
            <div>
              <div className="flex items-baseline gap-3.5">
                <span
                  className="font-serifSC"
                  style={{ fontSize: 52, color: GOLD_SOFT, fontWeight: 500, lineHeight: 1 }}
                >
                  {CN_NUM[active]}
                </span>
                <Mono color={GOLD_SOFT}>
                  HUB {String(active + 1).padStart(2, '0')} / 0{CORRIDORS.length}
                </Mono>
              </div>
              <div
                className="mt-4.5 font-serifSC"
                style={{ fontSize: 44, fontWeight: 500, letterSpacing: '-0.01em', color: CREAM, lineHeight: 1.1 }}
              >
                {CORRIDORS[active].city === 'South Asia'
                  ? isZh ? '中亞與南亞' : 'Central & South Asia'
                  : CORRIDORS[active].city}
              </div>
              <Mono color={GOLD_SOFT} size={10}>{pickL(CORRIDORS[active].region, locale)}</Mono>
              <p
                className="mt-5.5 font-light"
                style={{ fontSize: 14.5, lineHeight: 1.85, color: 'rgba(245,241,230,.72)', maxWidth: 540 }}
              >
                {pickL(CORRIDORS[active].description, locale)}
              </p>
            </div>
            <div style={{ borderLeft: '1px solid rgba(245,241,230,.1)', paddingLeft: 32 }}>
              {[
                { l: isZh ? '投資人類型' : 'LP Profile', v: CORRIDORS[active].details[0] },
                { l: isZh ? '主要賽道' : 'Focus Sectors', v: CORRIDORS[active].details[1] },
                { l: isZh ? '當地監管' : 'Local Reg.', v: CORRIDORS[active].details[2] },
              ].map((d, i) => (
                <div
                  key={i}
                  className="flex items-baseline justify-between font-monoDisp"
                  style={{
                    padding: '14px 0',
                    fontSize: 12,
                    borderBottom: i < 2 ? '1px dashed rgba(245,241,230,.1)' : 'none',
                  }}
                >
                  <span style={{ color: 'rgba(245,241,230,.5)', letterSpacing: '.1em', textTransform: 'uppercase', fontSize: 10 }}>
                    {d.l}
                  </span>
                  <span style={{ color: CREAM, fontSize: 13 }}>{d.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   INSTITUTIONAL ARCHITECTURE — 股东 × 平台 合并版
───────────────────────────────────────── */
function InstitutionalSection() {
  const locale = useLocale();
  const isZh = !locale.startsWith('en');

  return (
    <section className="relative paper-grain" style={{ background: 'var(--color-cream-2)', padding: 'clamp(80px, 11vw, 140px) 0' }}>
      <div className={`${WRAP} relative`}>
        <SectionHead
          cn="機構架構"
          en="Institutional Architecture"
          title={isZh ? '開曼控股 · 四地平臺 · 戰略夥伴' : 'Cayman Holding · Four Jurisdictions · Strategic Partners.'}
          subtitle={
            isZh
              ? '天際控股集團(開曼註冊)為全球控股平臺,旗下覆蓋四地基金牌照架構——香港 OFC(天汇基金自持 · SFC Type 4/9 持牌管理人)、新加坡 VCC(中銀資管基金合作)、開曼 SPC、中國內地 QFLP / 私募(恒邦資本內地股東);AKJ 集團在歐洲為戰略分銷夥伴,共同構成覆蓋亞歐的一體化資產架構。'
              : "SKYW Group, a Cayman-registered holding platform, operates four jurisdictional fund structures — Hong Kong OFC (SKYW Fund, SFC Type 4/9 licensed), Singapore VCC (BOCAM fund partner), Cayman SPC, and China Mainland QFLP / private fund (Hengbang shareholder). AKJ Group serves as European distribution partner — together forming an integrated Asia–Europe asset architecture."
          }
        />

        {/* Three unified rows: shareholder → platform → stats */}
        <div className="mt-16" style={{ border: '1px solid rgba(11,17,30,.12)', background: 'rgba(255,255,255,.65)' }}>
          {INSTITUTIONAL_UNITS.map((u, i) => (
            <AnimatedSection key={u.hubEn} delay={i * 0.08}>
              <div
                className="relative"
                style={{
                  padding: 'clamp(24px, 5vw, 36px) clamp(18px, 5vw, 36px) clamp(28px, 6vw, 40px)',
                  borderBottom: i < INSTITUTIONAL_UNITS.length - 1 ? '1px solid rgba(11,17,30,.1)' : undefined,
                }}
              >
                {/* Row header: hub + relationship chip + accent bar */}
                <div className="flex items-baseline justify-between mb-7 flex-wrap gap-3">
                  <div className="flex items-baseline gap-4">
                    <span
                      className="font-serifSC"
                      style={{ fontSize: 56, color: u.accent, fontWeight: 500, lineHeight: 1 }}
                    >
                      {u.cn}
                    </span>
                    <div>
                      <Mono color={u.accent} size={10}>
                        HUB {String(i + 1).padStart(2, '0')} / 03
                      </Mono>
                      <div
                        className="font-serifSC"
                        style={{ fontSize: 26, fontWeight: 500, color: 'var(--color-ink)', marginTop: 4, letterSpacing: '-0.005em' }}
                      >
                        {isZh ? u.hubCn : u.hubEn}
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: 1, margin: '0 28px', height: 1, background: `linear-gradient(to right, ${u.accent}66, transparent)` }} />
                  {/* Relationship chip — shareholder vs partner */}
                  <span
                    className="font-monoDisp inline-flex items-center gap-2 self-center"
                    style={{
                      padding: '6px 14px',
                      fontSize: 10.5,
                      fontWeight: 600,
                      letterSpacing: '.15em',
                      textTransform: 'uppercase',
                      border: `1px solid ${u.relationship === 'shareholder' ? u.accent : 'rgba(11,17,30,.25)'}`,
                      background: u.relationship === 'shareholder' ? `${u.accent}14` : 'transparent',
                      color: u.relationship === 'shareholder' ? u.accent : 'var(--color-ink)',
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: u.relationship === 'shareholder' ? 0 : '50%',
                        background: u.relationship === 'shareholder' ? u.accent : 'var(--color-muted-warm)',
                        transform: u.relationship === 'shareholder' ? 'rotate(45deg)' : undefined,
                      }}
                    />
                    {u.relationship === 'shareholder'
                      ? isZh ? '股東' : 'Shareholder'
                      : isZh ? '戰略夥伴' : 'Strategic Partner'}
                  </span>
                </div>

                {/* Body: shareholder | platform+fund | stats */}
                <div className="grid gap-7 lg:gap-0 grid-cols-1 lg:grid-cols-[1.1fr_auto_1.5fr_auto_1fr] items-start">
                  {/* Shareholder / Partner */}
                  <div>
                    <Mono color="var(--color-muted-warm)" size={10}>{pickL(u.relationshipLabel, locale)}</Mono>
                    <div
                      className="font-serifSC mt-2.5"
                      style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-ink)' }}
                    >
                      {pickL(u.owner, locale)}
                    </div>
                    <div className="mt-1">
                      <Mono color={u.accent} size={10}>{u.ownerBadge}</Mono>
                    </div>
                    <div
                      className="font-serifSC mt-2.5"
                      style={{ fontSize: 13, color: '#4a4538', lineHeight: 1.6 }}
                    >
                      {pickL(u.ownerHighlight, locale)}
                    </div>
                  </div>

                  {/* Connector → */}
                  <div className="hidden lg:flex items-center justify-center px-6 pt-7">
                    <span style={{ color: u.accent, fontSize: 22, fontWeight: 400 }}>→</span>
                  </div>

                  {/* Platform + fund */}
                  <div className="lg:pl-0">
                    <Mono color="var(--color-muted-warm)" size={10}>平臺 · Fund Platform</Mono>
                    <div className="flex items-center gap-2.5 mt-2.5">
                      <span style={{ width: 8, height: 8, background: u.accent }} />
                      <span
                        className="font-monoDisp"
                        style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--color-ink)' }}
                      >
                        {u.platformEn}
                      </span>
                    </div>
                    <div
                      className="font-serifSC mt-0.5"
                      style={{ fontSize: 11.5, color: 'var(--color-muted-warm)' }}
                    >
                      {u.platformCn}
                    </div>
                    <div
                      className="font-serifSC mt-3.5"
                      style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.4 }}
                    >
                      {u.fundName}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--color-muted-warm)', marginTop: 2 }}>
                      {u.fundCode}
                    </div>
                    <div className="mt-2" style={{ fontSize: 12.5, color: '#4a4538', lineHeight: 1.6 }}>
                      {pickL(u.fundDetail, locale)}
                    </div>
                  </div>

                  {/* Divider line */}
                  <div className="hidden lg:block" style={{ width: 1, height: '100%', background: 'rgba(11,17,30,.1)', marginLeft: 24, marginRight: 24 }} />

                  {/* Scale / stats */}
                  <div>
                    <Mono color="var(--color-muted-warm)" size={10}>規模 · Scale</Mono>
                    <div
                      className="font-serifSC mt-2.5"
                      style={{ fontSize: 24, fontWeight: 500, color: u.accent, letterSpacing: '-0.01em', lineHeight: 1.1 }}
                    >
                      {u.fundSize}
                    </div>
                    <div className="mt-1">
                      <Mono color={u.accent} size={9.5}>{u.platformLicense}</Mono>
                    </div>
                    <div
                      className="mt-4 grid grid-cols-3 gap-3 pt-3"
                      style={{ borderTop: '1px dashed rgba(11,17,30,.1)' }}
                    >
                      {u.ownerStats.map((s, si) => (
                        <div key={si}>
                          <div
                            className="font-serifSC"
                            style={{ fontSize: 16, fontWeight: 500, color: u.accent, letterSpacing: '-0.01em' }}
                          >
                            {s.v}
                          </div>
                          <Mono color="var(--color-muted-warm)" size={9}>{s.l}</Mono>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Europe / AKJ — ink band below the 3-row table */}
        <AnimatedSection delay={0.32}>
          <div
            className="mt-5 relative gold-corners"
            style={{
              background: 'var(--color-ink)',
              color: 'var(--color-cream)',
              border: `1px solid ${EUROPEAN_DISTRIBUTION.accent}55`,
              padding: 'clamp(22px, 5vw, 32px) clamp(20px, 5vw, 36px)',
            }}
          >
            <div className="grid gap-6 items-center grid-cols-1 lg:grid-cols-[auto_1fr_1.5fr_1fr]">
              {/* CN numeral + tag */}
              <div className="flex items-center gap-4">
                <span
                  className="font-serifSC"
                  style={{ fontSize: 46, color: EUROPEAN_DISTRIBUTION.accent, fontWeight: 500, lineHeight: 1 }}
                >
                  {EUROPEAN_DISTRIBUTION.cn}
                </span>
                <div>
                  <Mono color={EUROPEAN_DISTRIBUTION.accent} size={10}>
                    {isZh ? '戰略夥伴 · 歐洲分銷' : 'Strategic Partner · Europe'}
                  </Mono>
                  <div
                    className="font-serifSC mt-1"
                    style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.005em' }}
                  >
                    {pickL(EUROPEAN_DISTRIBUTION.name, locale)}
                  </div>
                </div>
              </div>
              {/* Role + badge */}
              <div>
                <Mono color={EUROPEAN_DISTRIBUTION.accent} size={10}>
                  {EUROPEAN_DISTRIBUTION.badge}
                </Mono>
                <div
                  className="font-serifSC mt-2"
                  style={{ fontSize: 13, color: 'rgba(245,241,230,.7)' }}
                >
                  {pickL(EUROPEAN_DISTRIBUTION.role, locale)}
                </div>
              </div>
              {/* Highlight */}
              <div
                className="font-serifSC"
                style={{ fontSize: 14, color: 'rgba(245,241,230,.82)', lineHeight: 1.65 }}
              >
                {pickL(EUROPEAN_DISTRIBUTION.highlight, locale)}
              </div>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {EUROPEAN_DISTRIBUTION.stats.map((s, i) => (
                  <div key={i}>
                    <div
                      className="font-serifSC"
                      style={{ fontSize: 20, fontWeight: 500, color: EUROPEAN_DISTRIBUTION.accent, letterSpacing: '-0.01em' }}
                    >
                      {s.v}
                    </div>
                    <Mono color="rgba(245,241,230,.5)" size={9}>{s.l}</Mono>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   TRACK RECORD — cream filter + portfolio table
───────────────────────────────────────── */
function TrackRecordSection() {
  const t = useTranslations('Home');
  const locale = useLocale();
  const isZh = !locale.startsWith('en');
  const [filter, setFilter] = useState<'all' | Sector>('all');
  const filtered = filter === 'all' ? PORTFOLIO : PORTFOLIO.filter((p) => p.sector === filter);
  const sectorKeys = Object.keys(SECTOR_LABELS) as Sector[];

  return (
    <section style={{ background: 'var(--color-cream)', padding: 'clamp(80px, 11vw, 140px) 0' }}>
      <div className={WRAP}>
        <div className="grid gap-8 items-start grid-cols-1 lg:grid-cols-[1.5fr_1fr]">
          <SectionHead
            cn={t('trackLabel')}
            en="Track Record"
            title={t('trackTitle')}
            subtitle={t('trackSubtitle')}
          />
          <div
            className="grid grid-cols-2 gap-px"
            style={{ background: 'rgba(11,17,30,.1)', border: '1px solid rgba(11,17,30,.1)' }}
          >
            {TRACK_STATS.map((s, i) => (
              <div key={i} style={{ background: '#fff', padding: '22px' }}>
                <div className="flex items-baseline gap-2.5">
                  <span className="font-serifSC" style={{ fontSize: 20, color: 'var(--color-cinnabar)', fontWeight: 500 }}>
                    {s.cn}
                  </span>
                  <span className="font-serifSC" style={{ fontSize: 26, fontWeight: 500, color: 'var(--color-gold-antique)' }}>
                    {s.v}
                  </span>
                </div>
                <Mono color="var(--color-muted-warm)" size={10}>{pickL(s.l, locale)}</Mono>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="mt-12 flex flex-wrap items-center gap-2">
          <Mono color="var(--color-muted-warm)">{isZh ? '篩選' : 'Filter'}</Mono>
          {(['all', ...sectorKeys] as const).map((k) => {
            const isActive = filter === k;
            return (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className="font-monoDisp transition-colors"
                style={{
                  padding: '8px 16px',
                  fontSize: 11.5,
                  fontWeight: 600,
                  border: `1px solid ${isActive ? 'var(--color-ink)' : 'rgba(11,17,30,.15)'}`,
                  background: isActive ? 'var(--color-ink)' : 'transparent',
                  color: isActive ? 'var(--color-cream)' : 'var(--color-ink)',
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                {k === 'all' ? (isZh ? '全部' : 'All') : pickL(SECTOR_LABELS[k], locale)}
                <span className="ml-1.5 opacity-60">
                  {k === 'all' ? PORTFOLIO.length : PORTFOLIO.filter((p) => p.sector === k).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="mt-6" style={{ border: '1px solid rgba(11,17,30,.12)', background: '#fff' }}>
          <div
            className="hidden lg:grid grid-cols-[60px_2fr_1fr_1fr_1fr]"
            style={{ padding: '14px 24px', borderBottom: '1px solid rgba(11,17,30,.1)', background: 'rgba(11,17,30,.03)' }}
          >
            <Mono color="var(--color-muted-warm)">№</Mono>
            <Mono color="var(--color-muted-warm)">{isZh ? '公司' : 'Company'}</Mono>
            <Mono color="var(--color-muted-warm)">{isZh ? '賽道' : 'Sector'}</Mono>
            <Mono color="var(--color-muted-warm)">{isZh ? '交易所' : 'Exchange'}</Mono>
            <Mono color="var(--color-muted-warm)">{isZh ? '角色' : 'Role'}</Mono>
          </div>
          {filtered.map((p, i) => {
            const s = SECTOR_STYLES[p.sector];
            return (
              <div
                key={`${p.en}-${i}`}
                className="grid items-start lg:items-center gap-x-3 gap-y-1.5 lg:gap-3 grid-cols-[auto_1fr] lg:grid-cols-[60px_2fr_1fr_1fr_1fr]"
                style={{
                  padding: '16px 20px',
                  borderBottom: i < filtered.length - 1 ? '1px solid rgba(11,17,30,.06)' : 'none',
                }}
              >
                <span className="font-monoDisp self-center" style={{ fontSize: 11, color: 'var(--color-muted-warm)', letterSpacing: '.1em' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <div className="font-serifSC" style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-ink)' }}>
                    {isZh ? p.zh : p.en}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-muted-warm)' }}>
                    {isZh ? p.en : p.zh}
                  </div>
                </div>
                {/* Meta: stacked on mobile (col-span-2), inline on desktop via lg:contents */}
                <div className="col-span-2 lg:col-span-1 flex flex-wrap items-center gap-x-3 gap-y-1 lg:contents">
                  <span>
                    <span
                      style={{
                        padding: '3px 10px',
                        fontSize: 10.5,
                        fontWeight: 600,
                        background: s.bg,
                        color: s.text,
                        border: `1px solid ${s.border}`,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {pickL(SECTOR_LABELS[p.sector], locale)}
                    </span>
                  </span>
                  <span className="font-monoDisp" style={{ fontSize: 11.5, color: 'var(--color-muted-warm)', letterSpacing: '.05em' }}>
                    {p.ex}
                  </span>
                  <Mono color="var(--color-cinnabar)" size={10}>
                    {i % 3 === 0 ? 'Cornerstone' : i % 3 === 1 ? 'Anchor' : 'Strategic'}
                  </Mono>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-5 italic" style={{ fontSize: 12, color: 'var(--color-muted-warm)' }}>
          {t('trackNote')}
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   BUSINESS — ink editorial menu
───────────────────────────────────────── */
function BusinessSection() {
  const t = useTranslations('Home');
  const locale = useLocale();
  const isZh = !locale.startsWith('en');
  const { divisions } = useSiteData();

  return (
    <section
      className="relative"
      style={{ background: 'var(--color-ink)', color: 'var(--color-cream)', padding: 'clamp(80px, 11vw, 140px) 0' }}
    >
      <div className="hidden lg:block absolute" style={{ top: 80, right: 24 }}>
        <VerticalCN color="rgba(212,175,95,.35)" size={12}>六策並舉</VerticalCN>
      </div>
      <div className={WRAP}>
        <SectionHead
          inverse
          cn={t('businessLabel')}
          en="Investment Strategies"
          title={t('businessTitle')}
          subtitle={t('businessSubtitle')}
        />
        <div className="mt-14">
          {divisions.map((div, i) => (
            <AnimatedSection key={div.divisionId} delay={i * 0.05}>
              <Link
                href={`/business/${div.slug}`}
                className="grid gap-6 lg:gap-8 items-center group transition-all grid-cols-1 lg:grid-cols-[100px_1fr_1.8fr_140px_60px] hover:pl-2"
                style={{
                  padding: '36px 0',
                  borderBottom: '1px solid rgba(245,241,230,.1)',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div className="font-serifSC" style={{ fontSize: 52, color: 'var(--color-gold-soft)', fontWeight: 500, lineHeight: 1 }}>
                  {CN_NUM[i] ?? (i + 1)}
                </div>
                <div>
                  <Mono color="rgba(245,241,230,.45)" size={10}>Strategy {String(i + 1).padStart(2, '0')}</Mono>
                  <h3 className="font-serifSC mt-2" style={{ fontSize: 24, fontWeight: 500, lineHeight: 1.25, color: 'var(--color-cream)' }}>
                    {loc(div, 'title', locale)}
                  </h3>
                </div>
                <p className="font-light m-0" style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(245,241,230,.6)' }}>
                  {loc(div, 'shortDesc', locale)}
                </p>
                <div>
                  <Mono color="var(--color-gold-soft)" size={10}>{isZh ? '查看詳情' : 'Learn More'}</Mono>
                </div>
                <div className="text-right" style={{ fontSize: 20, color: 'var(--color-gold-soft)' }}>
                  →
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
        <div className="mt-10">
          <Link
            href="/business"
            className="inline-flex items-center gap-2 font-monoDisp uppercase transition-colors"
            style={{ fontSize: 11.5, letterSpacing: '.12em', color: 'var(--color-gold-soft)' }}
          >
            {t('businessViewAll')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   INVESTOR CONNECT — cream-2 three paths + reqs
───────────────────────────────────────── */
function InvestorConnectSection() {
  const t = useTranslations('Home');
  const isZh = !useLocale().startsWith('en');

  const paths = [
    { tag: t('lpPath1Tag'), title: t('lpPath1Title'), desc: t('lpPath1Desc') },
    { tag: t('lpPath2Tag'), title: t('lpPath2Title'), desc: t('lpPath2Desc') },
    { tag: t('lpPath3Tag'), title: t('lpPath3Title'), desc: t('lpPath3Desc') },
  ];
  const reqs = [
    { l: t('lpReq1Label'), v: t('lpReq1Value') },
    { l: t('lpReq2Label'), v: t('lpReq2Value') },
    { l: t('lpReq3Label'), v: t('lpReq3Value') },
    { l: t('lpReq4Label'), v: t('lpReq4Value') },
  ];

  return (
    <section className="relative overflow-hidden" style={{ background: 'var(--color-cream-2)', padding: 'clamp(80px, 11vw, 140px) 0' }}>
      <div
        aria-hidden
        className="hidden lg:block pointer-events-none select-none absolute font-serifSC"
        style={{
          top: 60,
          right: 40,
          opacity: 0.06,
          fontSize: 380,
          fontWeight: 500,
          color: 'var(--color-cinnabar)',
          lineHeight: 0.9,
        }}
      >
        入
      </div>
      <div className={`${WRAP} relative`}>
        <SectionHead
          cn={t('lpLabel')}
          en="Investor Connect"
          title={t('lpTitle')}
          subtitle={t('lpSubtitle')}
        />
        <div className="mt-14 grid gap-5 grid-cols-1 md:grid-cols-3">
          {paths.map((p, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <Link
                href="/contact"
                className="relative flex flex-col min-h-[340px] gold-corners"
                style={{
                  background: '#fff',
                  border: '1px solid rgba(11,17,30,.12)',
                  padding: 36,
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-serifSC" style={{ fontSize: 48, color: 'var(--color-cinnabar)', fontWeight: 500, lineHeight: 1 }}>
                    {CN_NUM[i]}
                  </span>
                  <Mono color="var(--color-cinnabar)" size={10}>{p.tag}</Mono>
                </div>
                <h3 className="font-serifSC mt-8" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.35, color: 'var(--color-ink)' }}>
                  {p.title}
                </h3>
                <p className="mt-3.5 font-light flex-1" style={{ fontSize: 13.5, lineHeight: 1.8, color: '#5A5547' }}>
                  {p.desc}
                </p>
                <div className="mt-6 pt-5" style={{ borderTop: '1px dashed rgba(11,17,30,.15)' }}>
                  <Mono color="var(--color-gold-antique)">
                    {isZh ? '立即對接 →' : 'Get Started →'}
                  </Mono>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4" style={{ border: '1px solid rgba(11,17,30,.12)', background: '#fff' }}>
          {reqs.map((r, i) => (
            <div
              key={i}
              style={{
                padding: '24px 26px',
                borderRight: i < 3 ? '1px solid rgba(11,17,30,.08)' : undefined,
                borderBottom: i < 2 ? '1px solid rgba(11,17,30,.08)' : undefined,
              }}
            >
              <Mono color="var(--color-muted-warm)" size={10}>{r.l}</Mono>
              <div className="font-serifSC mt-2.5" style={{ fontSize: 17, fontWeight: 500, color: 'var(--color-ink)' }}>
                {r.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   ABOUT PREVIEW — cream office list
───────────────────────────────────────── */
function AboutPreview() {
  const t = useTranslations('Home');
  const isZh = !useLocale().startsWith('en');

  const offices = [
    { city: isZh ? '香港' : 'Hong Kong', role: 'HQ' },
    { city: isZh ? '深圳' : 'Shenzhen', role: 'GBA' },
    { city: isZh ? '新加坡' : 'Singapore', role: 'ASEAN' },
    { city: isZh ? '迪拜' : 'Dubai', role: 'GCC' },
    { city: isZh ? '倫敦' : 'London', role: 'EU' },
  ];

  return (
    <section style={{ background: 'var(--color-cream-2)', padding: 'clamp(72px, 10vw, 120px) 0' }}>
      <div className={WRAP}>
        <div className="grid gap-16 items-start grid-cols-1 lg:grid-cols-[1fr_auto_1fr]">
          <AnimatedSection>
            <div className="flex items-start gap-5">
              <div className="hidden lg:block">
                <VerticalCN color="rgba(11,17,30,.45)" size={13}>關於天際</VerticalCN>
              </div>
              <div>
                <Mono color="var(--color-gold-antique)">{t('aboutTitle')}</Mono>
                <p
                  className="font-serifSC mt-5"
                  style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', fontWeight: 400, lineHeight: 1.75, color: 'rgba(11,17,30,.8)' }}
                >
                  {t('aboutDescription')}
                </p>
                <Link
                  href="/about"
                  className="group mt-7 inline-flex items-center gap-2 font-monoDisp uppercase transition-colors"
                  style={{ fontSize: 11.5, letterSpacing: '.12em', color: 'var(--color-ink)', borderBottom: '1px solid var(--color-ink)', paddingBottom: 2 }}
                >
                  {t('aboutLearnMore')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
          <div className="hidden lg:block" style={{ width: 1, background: 'rgba(11,17,30,.1)', alignSelf: 'stretch' }} />
          <AnimatedSection delay={0.15}>
            <Mono color="var(--color-muted-warm)">{t('aboutGlobalPresence')}</Mono>
            <div className="mt-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {offices.map((o, i) => (
                <div
                  key={o.role}
                  className="py-3 pl-4"
                  style={{ borderLeft: '2px solid var(--color-gold-antique)' }}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-serifSC" style={{ fontSize: 14, color: 'var(--color-cinnabar)', fontWeight: 500 }}>
                      {CN_NUM[i]}
                    </span>
                    <span className="font-serifSC" style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-ink)' }}>
                      {o.city}
                    </span>
                  </div>
                  <Mono color="var(--color-muted-warm)" size={10}>{o.role}</Mono>
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
   INSIGHTS — cream editorial table
───────────────────────────────────────── */
function InsightsSection({ articles }: { articles: ArticleRow[] }) {
  const t = useTranslations('Home');
  const tInsights = useTranslations('Insights');
  const locale = useLocale();
  const isZh = !locale.startsWith('en');
  const latest = articles.slice(0, 5);

  const categoryLabels: Record<string, string> = {
    news: tInsights('categoryNews'),
    market: tInsights('categoryMarket'),
    industry: tInsights('categoryIndustry'),
  };

  return (
    <section style={{ background: 'var(--color-cream)', padding: 'clamp(80px, 11vw, 140px) 0' }}>
      <div className={WRAP}>
        <SectionHead
          cn={t('insightsTitle')}
          en="Insights"
          title={t('insightsSubtitle')}
          subtitle={isZh
            ? '追蹤一帶一路走廊的資本流動、監管演進與行業轉折。'
            : 'Tracking capital flows, regulation and sector inflection.'}
        />
        <div className="mt-14" style={{ border: '1px solid rgba(11,17,30,.12)', background: '#fff' }}>
          {latest.map((article, i) => (
            <AnimatedSection key={article.slug} delay={i * 0.06}>
              <Link
                href={`/insights/${article.slug}`}
                className="flex flex-col gap-2 lg:grid lg:grid-cols-[60px_130px_130px_1fr_110px] lg:gap-4 lg:items-center transition-colors hover:bg-[rgba(11,17,30,.02)]"
                style={{
                  padding: '22px 20px',
                  borderBottom: i < latest.length - 1 ? '1px solid rgba(11,17,30,.06)' : 'none',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                {/* Mobile meta line: CN + date + category (desktop: first 3 grid cells via contents) */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 lg:contents">
                  <span className="font-serifSC" style={{ fontSize: 22, color: 'var(--color-gold-antique)', fontWeight: 500 }}>
                    {CN_NUM[i] ?? (i + 1)}
                  </span>
                  <span className="font-monoDisp" style={{ fontSize: 12, color: 'var(--color-muted-warm)', letterSpacing: '.1em' }}>
                    {article.date}
                  </span>
                  <span>
                    <span
                      style={{
                        padding: '4px 10px',
                        fontSize: 10.5,
                        fontWeight: 700,
                        background: 'var(--color-ink)',
                        color: 'var(--color-gold-soft)',
                        letterSpacing: '.15em',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {categoryLabels[article.category] ?? article.category}
                    </span>
                  </span>
                </div>
                <h3
                  className="font-serifSC m-0"
                  style={{ fontSize: 16.5, fontWeight: 500, lineHeight: 1.45, color: 'var(--color-ink)' }}
                >
                  {loc(article, 'title', locale)}
                </h3>
                <Mono color="var(--color-cinnabar)" size={10}>
                  {isZh ? '閱讀 →' : 'Read →'}
                </Mono>
              </Link>
            </AnimatedSection>
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 font-monoDisp uppercase"
            style={{ fontSize: 11.5, letterSpacing: '.12em', color: 'var(--color-ink)' }}
          >
            {t('insightsViewAll')} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   CTA — ink banner with cta-banner.jpg + seal
───────────────────────────────────────── */
function CtaBanner() {
  const t = useTranslations('Home');
  const isZh = !useLocale().startsWith('en');

  return (
    <section style={{ background: 'var(--color-ink)', padding: 'clamp(64px, 8vw, 100px) 0' }}>
      <div className={WRAP}>
        <div
          className="relative overflow-hidden gold-corners"
          style={{ border: '1px solid rgba(212,175,95,.25)' }}
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/images/home/cta-banner.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'sepia(20%) grayscale(40%)',
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(11,17,30,.94) 0%, rgba(11,17,30,.8) 60%, rgba(11,17,30,.5) 100%)' }}
          />
          <div
            className="relative grid gap-10 items-center grid-cols-1 lg:grid-cols-[1fr_auto]"
            style={{ padding: 'clamp(40px, 7vw, 80px) clamp(24px, 6vw, 60px)', color: 'var(--color-cream)' }}
          >
            <div>
              <div className="flex items-center gap-3.5">
                <Seal text={isZh ? '啟程' : '啟'} size={44} />
                <Mono color="var(--color-gold-soft)">{isZh ? '下一步' : 'Next Step'}</Mono>
              </div>
              <h2
                className="font-serifSC mt-6"
                style={{ fontSize: 'clamp(30px, 3.4vw, 48px)', fontWeight: 500, lineHeight: 1.2 }}
              >
                {t('ctaTitle')}
              </h2>
              <p
                className="mt-4.5 font-light"
                style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(245,241,230,.55)', maxWidth: 600 }}
              >
                {t('ctaSubtitle')}
              </p>
            </div>
            <Link href="/contact" className="btn-gold">
              {t('ctaButton')} <ArrowRight className="h-3.5 w-3.5" />
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
  void metrics;
  return (
    <>
      <BRIHero />
      <PhilosophySection />
      <GatewaySection />
      <CorridorSection />
      <InstitutionalSection />
      <TrackRecordSection />
      <BusinessSection />
      <InvestorConnectSection />
      <AboutPreview />
      <InsightsSection articles={articles} />
      <CtaBanner />
    </>
  );
}
