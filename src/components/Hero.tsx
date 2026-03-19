'use client';

import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: ease,
    },
  },
};

export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const scale = useTransform(scrollY, [0, 1000], [1, 1.05]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-900">
      {/* Cinematic Background Layer */}
      <motion.div
        style={{ y: y1, scale, opacity }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>
        <div className="absolute inset-0 bg-radial-gold opacity-60"></div>

        {/* Slow drifting gold particles for premium feel (less chaotic than pulse) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gold rounded-full opacity-20 blur-[1px]"
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [null, '-10%'],
                opacity: [0.1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center px-5 py-2 rounded-full border border-gold/20 bg-dark-800/40 backdrop-blur-md mb-10"
          >
            <span className="w-1.5 h-1.5 bg-gold rounded-full mr-3 opacity-80"></span>
            <span className="text-gold/90 text-sm tracking-wider uppercase font-medium">香港国际黄金交易中心产业旗舰</span>
          </motion.div>

          {/* Main Title - Split for cinematic reveal */}
          <div className="mb-8 overflow-hidden">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.4, ease, delay: 0.2 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-light tracking-tight leading-tight"
            >
              <span className="text-white/95">传统黄金产业</span>
            </motion.h1>
          </div>
          <div className="mb-10 overflow-hidden">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.4, ease, delay: 0.3 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-medium tracking-tight leading-tight"
            >
              <span className="text-transparent bg-clip-text bg-gold-gradient">数字金融创新</span>
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light tracking-wide"
          >
            构建覆盖黄金贸易、加工精炼、数字代币化、金库仓储、矿产投资的全产业链生态系统
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-24"
          >
            <Link href="/gcoin" className="btn-gold inline-flex items-center justify-center px-8 py-4 text-sm tracking-widest uppercase transition-all duration-500 hover:scale-[1.02]">
              了解 G-COIN
              <ArrowRight className="ml-3 w-4 h-4 opacity-70" />
            </Link>
            <Link href="/about" className="btn-outline-gold inline-flex items-center justify-center px-8 py-4 text-sm tracking-widest uppercase transition-all duration-500 bg-transparent border-white/20 text-white hover:border-gold hover:text-gold hover:bg-gold/5">
              关于我们
            </Link>
          </motion.div>

          {/* Stats - Elegant Layout */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 border-t border-white/5 pt-12"
          >
            {[
              { value: '1,100', label: '吨储备能力' },
              { value: '172', label: '会员网络' },
              { value: '2', label: '交易所席位' },
              { value: '100%', label: '实物储备' }
            ].map((stat, idx) => (
              <motion.div key={idx} variants={itemVariants} className="text-center group">
                <div className="text-4xl sm:text-5xl font-display text-white mb-3 group-hover:text-gold transition-colors duration-700">{stat.value}</div>
                <div className="text-gray-400 text-xs tracking-widest uppercase uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator - Minimalist Line */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 1.5, delay: 1.8, ease }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-24 w-[1px] bg-gradient-to-b from-gold/50 to-transparent origin-top"
      />
    </section>
  );
}
