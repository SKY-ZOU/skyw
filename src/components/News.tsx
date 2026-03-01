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

export default function News() {
  return (
    <section className="py-24 bg-dark-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <h2 className="section-title text-gold-gradient">新闻中心</h2>
            <div className="gold-divider md:mx-0"></div>
          </div>
          <Link 
            href="/news" 
            className="mt-4 md:mt-0 inline-flex items-center text-gold hover:text-gold-light transition-colors"
          >
            查看全部 <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </motion.div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-gold group cursor-pointer"
            >
              {/* Date & Category */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-gold text-sm">{item.date}</span>
                <span className="px-3 py-1 bg-gold/10 text-gold text-xs rounded-full">
                  {item.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-gold transition-colors line-clamp-2">
                {item.title}
              </h3>

              {/* Excerpt */}
              <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                {item.excerpt}
              </p>

              {/* Read More */}
              <div className="flex items-center text-gold text-sm font-medium">
                阅读全文 <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
