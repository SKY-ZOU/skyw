'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { useSiteData } from '@/components/providers/SiteDataProvider';
import { ArrowRight } from 'lucide-react';
import { loc } from '@/lib/locale-utils';

export default function RelatedBusinesses({ currentSlug }: { currentSlug: string }) {
  const locale = useLocale();
  const { divisions } = useSiteData();
  const others = divisions.filter((d) => d.slug !== currentSlug).slice(0, 3);

  return (
    <section className="bg-[#f7f8f9]">
      <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
        <div className="grid gap-px bg-[#e5e7eb] md:grid-cols-3">
          {others.map((div, i) => (
            <AnimatedSection key={div.divisionId} delay={i * 0.1}>
              <Link
                href={`/business/${div.slug}`}
                className="group flex h-full flex-col justify-between bg-white p-8 transition-colors hover:bg-[#fafafa] lg:p-10"
              >
                <div>
                  <h3 className="text-lg font-semibold text-[#1a1a2e]">
                    {loc(div, 'title', locale)}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[15px] text-[#6c757d]">
                    {loc(div, 'shortDesc', locale)}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-[13px] font-medium uppercase tracking-[0.08em] text-gold-500 transition-colors group-hover:text-navy-900">
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
