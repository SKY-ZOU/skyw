'use client';

import AnimatedSection from '@/components/ui/AnimatedSection';
import HeroSection from '@/components/sections/HeroSection';
import RelatedBusinesses from './RelatedBusinesses';

interface Feature {
  title: string;
  description: string;
}

export default function BusinessDetail({
  heroTitle,
  heroSubtitle,
  overviewTitle,
  overviewP1,
  overviewP2,
  features,
  currentSlug,
}: {
  heroTitle: string;
  heroSubtitle: string;
  overviewTitle: string;
  overviewP1: string;
  overviewP2: string;
  features: Feature[];
  currentSlug: string;
}) {
  const bgMap: Record<string, string> = {
    'gold': '/images/business/gold-bg.png',
    'ipo-anchor': '/images/business/ipo-bg.png',
    'china-innovation': '/images/business/china-innovation-bg.png',
    'digital-trade': '/images/business/digital-trade-bg.png',
    'energy': '/images/business/energy-bg.png',
    'web3-finance': '/images/business/web3-bg.png',
  };

  return (
    <>
      <HeroSection title={heroTitle} subtitle={heroSubtitle} backgroundImage={bgMap[currentSlug]} />

      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
          <AnimatedSection>
            <div className="max-w-3xl">
              <p className="text-body-sm font-medium uppercase tracking-[0.15em] text-gold-500">
                {overviewTitle}
              </p>
              <p className="mt-6 text-lead font-light leading-relaxed text-[#495057]">
                {overviewP1}
              </p>
              <p className="mt-4 text-lead font-light leading-relaxed text-[#495057]">
                {overviewP2}
              </p>
            </div>
          </AnimatedSection>

          <div className="mt-20 grid gap-px bg-[#e5e7eb] sm:grid-cols-2">
            {features.map((feat, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-[#fafafa] p-8 lg:p-12">
                  <div className="mb-4 h-[2px] w-8 bg-gold-400" />
                  <h3 className="text-xl font-semibold text-[#1a1a2e]">{feat.title}</h3>
                  <p className="mt-3 text-body leading-relaxed text-[#6c757d]">
                    {feat.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <RelatedBusinesses currentSlug={currentSlug} />
    </>
  );
}
