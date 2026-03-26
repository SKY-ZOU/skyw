'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AnimatedSection from '@/components/ui/AnimatedSection';

export default function HeroSection({
  title,
  subtitle,
  children,
  backgroundImage,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  backgroundImage?: string;
}) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative flex flex-col justify-center bg-navy-950 pt-32 pb-20 lg:pt-40 lg:pb-32 min-h-[50vh] overflow-hidden">
      {/* Immersive Parallax Background */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        {backgroundImage ? (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        ) : (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-luminosity scale-105"
            style={{ backgroundImage: "url('/images/home/hero-bg.png')" }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/90 via-navy-950/40 to-navy-950" />
      </motion.div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      
      {/* Warm radial glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 50% at 50% 0%, rgba(212,175,55,0.05) 0%, transparent 100%)',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-8">
        <AnimatedSection>
          <div className="max-w-4xl">
            <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-extralight leading-[1.1] tracking-tight text-white mb-6">
              {title}
            </h1>
            {subtitle && (
              <p className="max-w-2xl text-[clamp(1.05rem,1.5vw,1.25rem)] font-light leading-relaxed text-white/50">
                {subtitle}
              </p>
            )}
            {children && <div className="mt-10">{children}</div>}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
