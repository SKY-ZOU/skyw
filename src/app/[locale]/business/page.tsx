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
    <>
      <HeroSection title={t('heroTitle')} subtitle={t('heroSubtitle')} />

      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-px bg-[#e5e7eb] sm:grid-cols-2 lg:grid-cols-3">
            {divisions.map((div, i) => (
              <AnimatedSection key={div.divisionId} delay={i * 0.08}>
                <Link
                  href={`/business/${div.slug}`}
                  className="group flex h-full flex-col justify-between bg-white p-8 transition-colors hover:bg-[#fafafa] lg:p-10"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-[#1a1a2e] lg:text-2xl">
                      {loc(div, 'title', locale)}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-[#6c757d]">
                      {loc(div, 'shortDesc', locale)}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.08em] text-gold-500 transition-colors group-hover:text-navy-900">
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
