'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Menu, ChevronDown } from 'lucide-react';
import { useSiteData } from '@/components/providers/SiteDataProvider';
import LanguageSwitcher from './LanguageSwitcher';
import MobileNav from './MobileNav';
import { loc } from '@/lib/locale-utils';

export default function Header() {
  const t = useTranslations('Nav');
  const locale = useLocale();
  const { divisions } = useSiteData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bizDropdown, setBizDropdown] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinkClass = scrolled
    ? 'text-[#1a1a2e] hover:text-gold-500'
    : 'text-white/90 hover:text-white';

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white shadow-[0_1px_0_rgba(0,0,0,0.08)]'
            : 'bg-transparent'
        }`}
      >
        {/* Top bar - secondary links */}
        <div
          className={`hidden border-b transition-colors duration-300 lg:block ${
            scrolled ? 'border-[#f0f0f0]' : 'border-white/10'
          }`}
        >
          <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-end gap-6 px-8">
            <LanguageSwitcher light={!scrolled} />
          </div>
        </div>

        {/* Main nav */}
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:h-[72px] lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-1.5">
            <span
              className={`text-2xl font-bold tracking-[0.15em] transition-colors duration-300 ${
                scrolled ? 'text-navy-900' : 'text-white'
              }`}
            >
              SKYW
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              href="/"
              className={`px-4 py-2 text-[13px] font-medium uppercase tracking-[0.08em] transition-colors ${navLinkClass}`}
            >
              {t('home')}
            </Link>
            <Link
              href="/about"
              className={`px-4 py-2 text-[13px] font-medium uppercase tracking-[0.08em] transition-colors ${navLinkClass}`}
            >
              {t('about')}
            </Link>

            {/* Business dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setBizDropdown(true)}
              onMouseLeave={() => setBizDropdown(false)}
            >
              <Link
                href="/business"
                className={`flex items-center gap-1 px-4 py-2 text-[13px] font-medium uppercase tracking-[0.08em] transition-colors ${navLinkClass}`}
              >
                {t('business')}
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </Link>

              {bizDropdown && (
                <div className="absolute left-0 top-full z-50 w-64 border border-[#e5e7eb] bg-white py-2 shadow-xl">
                  {divisions.map((div) => (
                    <Link
                      key={div.divisionId}
                      href={`/business/${div.slug}`}
                      className="block px-5 py-3 text-[13px] text-[#495057] transition-colors hover:bg-[#f8f9fa] hover:text-navy-900"
                    >
                      {loc(div, 'title', locale)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/insights"
              className={`px-4 py-2 text-[13px] font-medium uppercase tracking-[0.08em] transition-colors ${navLinkClass}`}
            >
              {t('insights')}
            </Link>
            <Link
              href="/contact"
              className={`px-4 py-2 text-[13px] font-medium uppercase tracking-[0.08em] transition-colors ${navLinkClass}`}
            >
              {t('contact')}
            </Link>
            <Link
              href="/partnership"
              className={`px-4 py-2 text-[13px] font-medium uppercase tracking-[0.08em] transition-colors ${navLinkClass}`}
            >
              {t('partnership')}
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
              <LanguageSwitcher light={!scrolled} />
            </div>

            {/* Mobile burger */}
            <button
              className="p-2 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu
                className={`h-6 w-6 transition-colors ${
                  scrolled ? 'text-navy-900' : 'text-white'
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && <MobileNav onClose={() => setMobileOpen(false)} />}
    </>
  );
}
