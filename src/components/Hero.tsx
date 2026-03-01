'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Coins, Building2, Globe } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern"></div>
      <div className="absolute inset-0 bg-radial-gold"></div>
      
      {/* Animated gold particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold rounded-full opacity-30"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [null, '-20%'],
              opacity: [0.3, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 rounded-full border border-gold/30 bg-dark-800/50 mb-8"
          >
            <span className="w-2 h-2 bg-gold rounded-full mr-2 animate-pulse"></span>
            <span className="text-gold text-sm">香港国际黄金交易中心产业旗舰</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6"
          >
            <span className="text-white">传统黄金产业</span>
            <br />
            <span className="text-gold-gradient">数字金融创新</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed"
          >
            构建覆盖黄金贸易、加工精炼、数字代币化、金库仓储、矿产投资的全产业链生态系统
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link href="/gcoin" className="btn-gold inline-flex items-center justify-center">
              了解 G-COIN
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/about" className="btn-outline-gold inline-flex items-center justify-center">
              关于我们
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-2">1,100</div>
              <div className="text-gray-400 text-sm">吨储备能力</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-2">172</div>
              <div className="text-gray-400 text-sm">会员网络</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-2">2</div>
              <div className="text-gray-400 text-sm">交易所席位</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-2">100%</div>
              <div className="text-gray-400 text-sm">实物储备</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-gold rounded-full"></div>
        </motion.div>
      </motion.div>
    </section>
  );
}
