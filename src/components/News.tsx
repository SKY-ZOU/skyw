'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';

const news = [
  {
    date: '2026.02.14',
    category: '集团动态',
    title: '大湾区国际黄金集团与香港黄金交易所达成战略合作',
    excerpt: '双方将在黄金贸易、数字黄金代币化等领域开展深度合作...',
    href: '/news/1',
  },
  {
    date: '2026.02.10',
    category: '行业新闻',
    title: '香港黄金交易中心建设取得重要进展',
    excerpt: '特区政府财经事务及库务局专项工作组积极推进相关工作...',
    href: '/news/2',
  },
  {
    date: '2026.02.05',
    category: 'G-COIN',
    title: 'G-COIN 数字黄金产品正式发布',
    excerpt: '1 G-COIN 锚定1克99.99%纯度实物黄金，开启黄金投资新纪元...',
    href: '/news/3',
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function News() {
  return (
    <section className="py-24 bg-dark-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.2, ease }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
        >
          <div>
            <h2 className="text-sm tracking-[0.2em] text-gold uppercase mb-4">新闻中心 | News & Insights</h2>
            <h3 className="text-4xl md:text-5xl font-display text-white mb-6">最新动态</h3>
            <div className="w-12 h-[1px] bg-gold/50 md:mx-0"></div>
          </div>
          <Link
            href="/news"
            className="mt-8 md:mt-0 inline-flex items-center text-gray-400 hover:text-gold transition-colors duration-500 text-sm tracking-widest uppercase"
          >
            查看全部 <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </motion.div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1, delay: index * 0.15, ease }}
            >
              <Link href={item.href} className="block h-full">
                <article className="card-gold group cursor-pointer h-full p-8 transition-all duration-700 bg-dark-800/30 hover:bg-dark-800/80 border border-white/5 hover:border-gold/30">
                  {/* Date & Category */}
                  <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4 group-hover:border-gold/20 transition-colors duration-500">
                    <span className="text-gold/80 text-sm font-light tracking-wide">{item.date}</span>
                    <span className="text-white/50 text-xs tracking-widest uppercase">
                      {item.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-display text-white mb-4 group-hover:text-gold transition-colors duration-500 line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-400 text-sm font-light leading-relaxed mb-8 line-clamp-3">
                    {item.excerpt}
                  </p>

                  {/* Read More */}
                  <div className="flex items-center text-gold text-xs tracking-widest uppercase font-medium mt-auto group-hover:text-gold-light transition-colors duration-500">
                    阅读全文 <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
