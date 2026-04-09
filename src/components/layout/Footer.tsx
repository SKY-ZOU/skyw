'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import NextLink from 'next/link';
import { useSiteData } from '@/components/providers/SiteDataProvider';
import { loc } from '@/lib/locale-utils';

export default function Footer() {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Nav');
  const locale = useLocale();
  const { divisions } = useSiteData();
  const businessLinks =
    divisions.length > 0
      ? divisions.map((div) => ({
          key: div.divisionId,
          href: `/business/${div.slug}`,
          label: loc(div, 'title', locale),
        }))
      : [
          {
            key: 'business-default',
            href: '/business',
            label: tNav('business'),
          },
        ];

  return (
    <footer className="bg-navy-950 text-white">
      {/* Main footer */}
      <div className="mx-auto max-w-[1400px] px-6 pt-16 pb-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <span className="text-2xl font-bold tracking-[0.15em] text-white">
              SKYW
            </span>
            <p className="mt-4 max-w-sm text-body font-light leading-relaxed text-white/40">
              {t('companyDesc')}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 sm:gap-8 lg:col-span-3">
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
                  { href: '/partnership', label: tNav('partnership') },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] leading-6 text-white/60 transition-colors hover:text-white sm:text-body-md"
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
                {businessLinks.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className="text-[13px] leading-6 text-white/60 transition-colors hover:text-white sm:text-body-md"
                    >
                      {item.label}
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
                      className="text-[13px] leading-6 text-white/60 transition-colors hover:text-white sm:text-body-md"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 py-6 lg:px-8">
          <p className="text-[11px] leading-relaxed text-white/30 sm:text-caption">
            {t('licenseNote')}
          </p>
          <p className="mt-1 text-[11px] text-white/30 sm:text-caption">
            {t('riskWarning')}
          </p>
          <p className="mt-3 text-[10.5px] text-white/30 sm:text-caption">
            {t('copyright')}
          </p>
          <div className="mt-4 border-t border-white/5 pt-3">
            <NextLink
              href="/admin"
              className="text-[11px] text-white/15 transition-colors hover:text-white/40"
            >
              Admin
            </NextLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
