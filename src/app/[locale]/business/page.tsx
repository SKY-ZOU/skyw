'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import HeroSection from '@/components/sections/HeroSection';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { useSiteData } from '@/components/providers/SiteDataProvider';
import { ArrowRight } from 'lucide-react';
import { loc } from '@/lib/locale-utils';

export default function BusinessPage() {
  const t = useTranslations('Business');
  const locale = useLocale();
  const { divisions } = useSiteData();

  return (
    <div className="bg-[#f7f8f9] min-h-screen">
      <HeroSection title={t('heroTitle')} subtitle={t('heroSubtitle')} />

      <section className="relative overflow-hidden">
        {/* Subtle decorative background text */}
        <div className="absolute top-20 right-0 text-[12vw] font-black text-navy-900/[0.02] select-none uppercase pointer-events-none whitespace-nowrap">
          Our Strategies
        </div>

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-px bg-[#e5e7eb] sm:grid-cols-2 lg:grid-cols-3 border border-[#e5e7eb] shadow-2xl shadow-navy-900/5">
            {divisions.map((div, i) => (
              <AnimatedSection key={div.divisionId} delay={i * 0.08}>
                <Link
                  href={`/business/${div.slug}`}
                  className="group relative overflow-hidden flex h-full flex-col justify-between bg-white p-10 lg:p-12 transition-all hover:bg-[#fafafa]"
                >
                  {/* Gold Light Sweep Effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] ease-in-out bg-gradient-to-r from-transparent via-gold-400/5 to-transparent pointer-events-none" />

                  <div className="relative z-10">
                    <div className="w-8 h-[1px] bg-gold-400 mb-8 transition-all duration-700 group-hover:w-16" />
                    <h3 className="text-[20px] font-semibold text-[#1a1a2e] group-hover:text-gold-600 transition-colors">
                      {loc(div, 'title', locale)}
                    </h3>
                    <p className="mt-4 text-[15px] leading-relaxed text-[#6c757d] font-light">
                      {loc(div, 'shortDesc', locale)}
                    </p>
                  </div>
                  <div className="relative z-10 mt-12 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-gold-500 group-hover:text-navy-900 transition-all">
                    <span className="border-b border-transparent group-hover:border-navy-900 pb-0.5">
                      Explore Strategy
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
