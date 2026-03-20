'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const footerLinks = {
  company: [
    { name: '关于我们', href: '/about' },
    { name: '核心业务', href: '/business' },
    { name: '新闻中心', href: '/news' },
    { name: '联系我们', href: '/contact' },
  ],
  business: [
    { name: '黄金贸易', href: '/business/trade' },
    { name: '加工精炼', href: '/business/refining' },
    { name: 'G-COIN', href: '/gcoin' },
    { name: '金库仓储', href: '/business/vault' },
  ],
  gcoin: [
    { name: '产品介绍', href: '/gcoin#intro' },
    { name: '技术架构', href: '/gcoin#tech' },
    { name: '应用场景', href: '/gcoin#scenarios' },
    { name: '安全保障', href: '/gcoin#security' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-gold/20">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center">
                <span className="text-dark-900 font-bold text-xl">G</span>
              </div>
              <div>
                <span className="text-gold-gradient font-display text-2xl font-bold">G-COIN</span>
                <span className="block text-xs text-gray-400">大湾区国际黄金集团</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              大湾区国际黄金集团是服务于香港国际黄金交易中心建设的产业旗舰平台，
              通过"传统黄金产业 + 数字金融创新"的双轮驱动模式，
              构建覆盖黄金贸易、加工精炼、数字代币化、金库仓储、矿产投资的全产业链生态系统。
            </p>
            <div className="flex space-x-4">
              {/* Social icons placeholder */}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-gold font-semibold mb-4">公司</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-gold transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Links */}
          <div>
            <h4 className="text-gold font-semibold mb-4">业务</h4>
            <ul className="space-y-3">
              {footerLinks.business.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-gold transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* G-COIN Links */}
          <div>
            <h4 className="text-gold font-semibold mb-4">G-COIN</h4>
            <ul className="space-y-3">
              {footerLinks.gcoin.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-gold transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-gold/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Hong Kong Office */}
            <div className="flex items-start space-x-4">
              <MapPin className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
              <div>
                <h5 className="text-white font-medium mb-1">香港总部</h5>
                <p className="text-gray-400 text-sm">香港中环金融中心</p>
              </div>
            </div>

            {/* Shenzhen Office */}
            <div className="flex items-start space-x-4">
              <MapPin className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
              <div>
                <h5 className="text-white font-medium mb-1">深圳运营中心</h5>
                <p className="text-gray-400 text-sm">深圳市南山区前海深港合作区</p>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-start space-x-4">
              <Mail className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
              <div>
                <h5 className="text-white font-medium mb-1">联系我们</h5>
                <p className="text-gray-400 text-sm">info@g-coin.hk</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} 大湾区国际黄金集团. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-500 hover:text-gold text-sm transition-colors">
                隐私政策
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-gold text-sm transition-colors">
                服务条款
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
