'use client';

import React from 'react';
import AnimatedSection from '@/components/ui/AnimatedSection';
import HeroSection from '@/components/sections/HeroSection';
import RelatedBusinesses from './RelatedBusinesses';
import { motion, useScroll, useTransform } from 'framer-motion';

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
    'credit-guarantee': '/images/business/digital-trade-bg.png',
    'fund-management': '/images/business/ipo-bg.png',
  };

  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <>
      <HeroSection title={heroTitle} subtitle={heroSubtitle} backgroundImage={bgMap[currentSlug]} />

      <section ref={ref} className="bg-white relative overflow-hidden">
        {/* Subtle Section Pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#1a1a2e 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
          
          {/* Report-grade Overview Layout */}
          <div className="grid lg:grid-cols-[1fr_minmax(400px,1fr)] gap-16 lg:gap-24 items-start">
            <AnimatedSection>
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px w-8 bg-gold-400" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">
                    {overviewTitle}
                  </p>
                </div>
                <h2 className="text-[clamp(1.5rem,2.5vw,2rem)] font-light leading-tight text-navy-950 mb-8 border-b border-[#e5e7eb] pb-8">
                  {overviewP1}
                </h2>
                <p className="text-[1.05rem] font-light leading-relaxed text-[#6c757d]">
                  {overviewP2}
                </p>
              </div>
            </AnimatedSection>

            {/* Asymmetric Imagery */}
            <AnimatedSection delay={0.2}>
              <div className="relative hidden lg:block h-[500px] w-full">
                <motion.div style={{ y: yImage }} className="absolute inset-0 z-10 overflow-hidden shadow-2xl bg-[#f0f0f0]">
                  <div 
                    className="absolute inset-0 bg-cover bg-center grayscale mix-blend-multiply opacity-50"
                    style={{ backgroundImage: `url(${bgMap[currentSlug] || '/images/home/hero-bg.png'})` }}
                  />
                  {/* Decorative Elements */}
                  <div className="absolute top-10 left-10 w-2 h-2 bg-gold-400" />
                  <div className="absolute bottom-10 right-10 w-2 h-2 bg-navy-900" />
                  <div className="absolute inset-0 border-[0.5px] border-white/20 m-6 pointer-events-none" />
                </motion.div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 border border-gold-400/20 -z-10" />
              </div>
            </AnimatedSection>
          </div>

          {/* Sophisticated Features Grid */}
          <div className="mt-24 lg:mt-32">
            <AnimatedSection>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-900/40 mb-10">
                Core Strategies
              </p>
            </AnimatedSection>
            
            <div className="grid gap-px bg-[#e5e7eb] sm:grid-cols-2 border border-[#e5e7eb] shadow-xl shadow-navy-900/5">
              {features.map((feat, i) => (
                <AnimatedSection key={i} delay={i * 0.1}>
                  <div className="group bg-white p-10 lg:p-14 h-full relative overflow-hidden transition-all hover:bg-[#fafafa]">
                    {/* Hover indicator */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-gold-400 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    
                    <div className="mb-6 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-navy-900/20 tracking-wider">0{i + 1}</span>
                      <div className="h-px w-12 bg-gold-400/30 group-hover:bg-gold-400 transition-colors duration-500" />
                    </div>
                    
                    <h3 className="text-[18px] font-semibold text-[#1a1a2e] mb-4 group-hover:text-gold-600 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-[14.5px] font-light leading-relaxed text-[#6c757d]">
                      {feat.description}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      <RelatedBusinesses currentSlug={currentSlug} />
    </>
  );
}
