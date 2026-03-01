'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { name: '首页', href: '/' },
  { name: '关于我们', href: '/about' },
  { 
    name: '核心业务', 
    href: '/business',
    submenu: [
      { name: '黄金贸易', href: '/business/trade' },
      { name: '加工精炼', href: '/business/refining' },
      { name: 'G-COIN', href: '/gcoin' },
      { name: '金库仓储', href: '/business/vault' },
      { name: '矿产投资', href: '/business/mining' },
    ]
  },
  { name: 'G-COIN', href: '/gcoin' },
  { name: '新闻中心', href: '/news' },
  { name: '联系我们', href: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-dark-900/95 backdrop-blur-md border-b border-gold/20 shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center">
                <span className="text-dark-900 font-bold text-xl">G</span>
              </div>
              <div className="absolute -inset-1 rounded-full bg-gold/30 blur-sm -z-10"></div>
            </div>
            <div>
              <span className="text-gold-gradient font-display text-2xl font-bold">G-COIN</span>
              <span className="block text-xs text-gray-400">大湾区国际黄金集团</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div 
                key={item.name}
                className="relative"
                onMouseEnter={() => item.submenu && setActiveSubmenu(item.name)}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <Link 
                  href={item.href}
                  className="px-4 py-2 text-gray-300 hover:text-gold transition-colors duration-200 flex items-center"
                >
                  {item.name}
                  {item.submenu && <ChevronDown className="ml-1 w-4 h-4" />}
                </Link>
                
                {/* Submenu */}
                <AnimatePresence>
                  {item.submenu && activeSubmenu === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-dark-800 border border-gold/20 rounded-lg overflow-hidden shadow-xl"
                    >
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-3 text-gray-300 hover:text-gold hover:bg-dark-700 transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link href="/gcoin" className="btn-gold">
              了解 G-COIN
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-300 hover:text-gold"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-dark-800 border-t border-gold/20"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-gray-300 hover:text-gold hover:bg-dark-700 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
              <div className="pt-4">
                <Link href="/gcoin" className="btn-gold block text-center" onClick={() => setIsMobileMenuOpen(false)}>
                  了解 G-COIN
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
