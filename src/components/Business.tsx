'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Coins,
  Shield,
  Building2,
  Globe2,
  ArrowRight,
  TrendingUp,
  Lock,
  Zap
} from 'lucide-react';

const businesses = [
  {
    icon: TrendingUp,
    title: '黄金贸易',
    description: '跨境进出口贸易，服务香港黄金交易所172个会员，构建覆盖亚太的经销商网络',
    href: '/business/trade',
  },
  {
    icon: Coins,
    title: 'G-COIN 数字黄金',
    description: '1 G-COIN = 1克99.99%纯度黄金，区块链技术，100%实物储备',
    href: '/gcoin',
    featured: true,
  },
  {
    icon: Building2,
    title: '金库仓储',
    description: '香港100吨精品金库 + 深圳1000吨战略储备金库，双金库网络体系',
    href: '/business/vault',
  },
  {
    icon: Globe2,
    title: '矿产投资',
    description: '参股优质黄金矿山项目，获取资源增值红利，保障上游原料供应',
    href: '/business/mining',
  },
];

const features = [
  {
    icon: Lock,
    title: '安全可靠',
    description: '100%实物黄金储备，链上实时验证',
  },
  {
    icon: Zap,
    title: '即时交易',
    description: '7×24小时全球交易，秒级确认',
  },
  {
    icon: Shield,
    title: '合规透明',
    description: '符合香港数字资产监管要求',
  },
  {
    icon: Globe2,
    title: '全球流通',
    description: '支持跨境转账与贸易结算',
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Business() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.2, ease }}
          className="text-center mb-20"
        >
          <h2 className="text-sm tracking-[0.2em] text-gold uppercase mb-4">核心业务 | Core Business</h2>
          <h3 className="text-4xl md:text-5xl font-display text-white mb-6">构建黄金产业完整生态链</h3>
          <div className="w-12 h-[1px] bg-gold/50 mx-auto mb-8"></div>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            1个核心驱动 + 3个增长引擎 + 1个战略布局
          </p>
        </motion.div>

        {/* Business Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {businesses.map((business, index) => (
            <motion.div
              key={business.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1, delay: index * 0.15, ease }}
              className="group h-full"
            >
              <Link href={business.href} className="block h-full">
                <div className={`card-gold h-full p-8 transition-all duration-700 bg-dark-800/30 hover:bg-dark-800/80 border ${business.featured ? 'border-gold/40 shadow-[0_0_30px_rgba(212,175,55,0.1)]' : 'border-white/5 hover:border-gold/30'}`}>
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-8 transition-transform duration-700 group-hover:scale-110 ${business.featured
                    ? 'bg-gold'
                    : 'bg-dark-900 border border-white/10 group-hover:border-gold/30'
                    }`}>
                    <business.icon className={`w-6 h-6 ${business.featured ? 'text-dark-900' : 'text-gold'}`} />
                  </div>

                  {business.featured && (
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-gold/10 border border-gold/20 text-gold text-micro tracking-widest uppercase rounded-full">
                        重点业务 Priority
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-display text-white mb-4 group-hover:text-gold transition-colors duration-500">{business.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8 font-light">{business.description}</p>

                  <div className="flex items-center text-gold text-xs tracking-widest uppercase font-medium mt-auto pt-4 border-t border-white/5 group-hover:border-gold/20 transition-colors duration-500">
                    了解更多
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* G-COIN Features */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.5, ease }}
          className="relative overflow-hidden bg-dark-900 border border-gold/20 rounded-sm p-10 md:p-16 lg:p-20"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-2xl bg-gold/5 blur-[100px] pointer-events-none rounded-full"></div>

          <div className="relative z-10 text-center mb-16">
            <h3 className="text-3xl md:text-5xl font-display text-white mb-6">
              G-COIN 数字黄金
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
              香港黄金代币化标杆项目，推动黄金交易数字化转型
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 + (index * 0.15), ease }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-dark-800 border-2 border-dark-700 flex items-center justify-center mb-6 transition-colors duration-500 group-hover:border-gold/50">
                  <feature.icon className="w-6 h-6 text-gold transition-transform duration-500 group-hover:scale-110" />
                </div>
                <h4 className="text-white text-lg font-display mb-3 group-hover:text-gold transition-colors duration-500">{feature.title}</h4>
                <p className="text-gray-400 text-sm font-light leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 1, ease }}
            className="relative z-10 text-center mt-20"
          >
            <Link href="/gcoin" className="inline-flex items-center px-8 py-4 bg-transparent border border-gold text-gold text-sm tracking-widest uppercase hover:bg-gold hover:text-dark-900 transition-all duration-500">
              详细了解 G-COIN
              <ArrowRight className="ml-3 w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div >
    </section >
  );
}
