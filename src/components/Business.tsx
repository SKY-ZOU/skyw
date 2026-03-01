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

export default function Business() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title text-gold-gradient">核心业务</h2>
          <div className="gold-divider"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            1个核心驱动 + 3个增长引擎 + 1个战略布局，构建黄金产业完整生态链
          </p>
        </motion.div>

        {/* Business Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {businesses.map((business, index) => (
            <motion.div
              key={business.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={business.href}>
                <div className={`card-gold h-full ${business.featured ? 'border-gold/50 ring-1 ring-gold/30' : ''}`}>
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                    business.featured 
                      ? 'bg-gold-gradient' 
                      : 'bg-dark-600 border border-gold/20'
                  }`}>
                    <business.icon className={`w-7 h-7 ${business.featured ? 'text-dark-900' : 'text-gold'}`} />
                  </div>
                  {business.featured && (
                    <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs rounded-full mb-3">
                      重点业务
                    </span>
                  )}
                  <h3 className="text-xl font-semibold text-white mb-3">{business.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{business.description}</p>
                  <div className="flex items-center text-gold text-sm font-medium">
                    了解更多 <ArrowRight className="ml-1 w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* G-COIN Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-dark-800/50 border border-gold/20 rounded-2xl p-8 md:p-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
              G-COIN 数字黄金
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              香港黄金代币化标杆项目，推动黄金交易数字化转型
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-dark-700 border border-gold/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8 text-gold" />
                </div>
                <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/gcoin" className="btn-gold inline-flex items-center">
              详细了解 G-COIN
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
