'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useSiteData } from '@/components/providers/SiteDataProvider';
import { loc } from '@/lib/locale-utils';

export default function Footer() {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Nav');
  const locale = useLocale();
  const { divisions } = useSiteData();

  return (
    <footer className="bg-navy-950 text-white">
      {/* Main footer */}
      <div className="mx-auto max-w-[1400px] px-6 pt-16 pb-12 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <span className="text-2xl font-bold tracking-[0.15em] text-white">
              SKYW
            </span>
            <p className="mt-4 max-w-sm text-body font-light leading-relaxed text-white/40">
              {t('companyDesc')}
            </p>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-caption font-semibold uppercase tracking-[0.15em] text-white/40">
              {t('company')}
            </h4>
            <ul className="mt-5 space-y-3">
              {[
                { href: '/about', label: tNav('about') },
                { href: '/business', label: tNav('business') },
                { href: '/insights', label: tNav('insights') },
                { href: '/contact', label: tNav('contact') },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-md text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business links */}
          <div>
            <h4 className="text-caption font-semibold uppercase tracking-[0.15em] text-white/40">
              {t('businessCol')}
            </h4>
            <ul className="mt-5 space-y-3">
              {divisions.map((div) => (
                <li key={div.divisionId}>
                  <Link
                    href={`/business/${div.slug}`}
                    className="text-body-md text-white/60 transition-colors hover:text-white"
                  >
                    {loc(div, 'title', locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-caption font-semibold uppercase tracking-[0.15em] text-white/40">
              {t('legal')}
            </h4>
            <ul className="mt-5 space-y-3">
              {[
                { href: '/legal/privacy', label: t('privacy') },
                { href: '/legal/terms', label: t('terms') },
                { href: '/legal/disclaimer', label: t('disclaimer') },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-md text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 py-6 lg:px-8">
          <p className="text-caption leading-relaxed text-white/30">
            {t('licenseNote')}
          </p>
          <p className="mt-1 text-caption text-white/30">
            {t('riskWarning')}
          </p>
          <p className="mt-3 text-caption text-white/30">
            {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
