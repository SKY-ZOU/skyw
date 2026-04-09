'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import NextLink from 'next/link';
import { X, ChevronDown, Globe } from 'lucide-react';
import { useSiteData } from '@/components/providers/SiteDataProvider';
import { loc } from '@/lib/locale-utils';

const LOCALES = [
  { code: 'zh-CN', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'en', label: 'English' },
] as const;

export default function MobileNav({ onClose }: { onClose: () => void }) {
  const t = useTranslations('Nav');
  const locale = useLocale();
  const { divisions } = useSiteData();
  const router = useRouter();
  const pathname = usePathname();
  const [bizOpen, setBizOpen] = useState(false);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-navy-950 text-white">
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/10 bg-navy-950/95 px-4 backdrop-blur-md">
          <span className="text-[1.05rem] font-bold tracking-[0.2em] text-white">SKYW</span>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md border border-white/15 p-2"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="border-b border-white/10 px-4 py-4">
          <p className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
            <Globe className="h-3.5 w-3.5" />
            {t('language')}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  router.replace(pathname, { locale: l.code as 'zh-CN' | 'zh-TW' | 'en' });
                  onClose();
                }}
                className={`rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
                  locale === l.code
                    ? 'border-gold-400 bg-gold-400/15 text-gold-300'
                    : 'border-white/10 bg-white/5 text-white/75'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <nav className="px-4 py-3">
          <Link href="/" onClick={onClose} className="block border-b border-white/10 py-4 text-lg font-medium text-white/92">
            {t('home')}
          </Link>
          <Link href="/about" onClick={onClose} className="block border-b border-white/10 py-4 text-lg font-medium text-white/92">
            {t('about')}
          </Link>

          <div className="border-b border-white/10">
            <button
              onClick={() => setBizOpen(!bizOpen)}
              className="flex w-full items-center justify-between py-4 text-lg font-medium text-white/92"
            >
              {t('business')}
              <ChevronDown className={`h-5 w-5 text-white/70 transition-transform ${bizOpen ? 'rotate-180' : ''}`} />
            </button>
            {bizOpen && (
              <div className="space-y-1 pb-4 pl-1">
                <Link href="/business" onClick={onClose} className="block rounded-md px-2 py-2 text-[15px] text-white/70">
                  {t('business')}
                </Link>
                {divisions.map((div) => (
                  <Link
                    key={div.divisionId}
                    href={`/business/${div.slug}`}
                    onClick={onClose}
                    className="block rounded-md px-2 py-2 text-[15px] text-white/70"
                  >
                    {loc(div, 'title', locale)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/insights" onClick={onClose} className="block border-b border-white/10 py-4 text-lg font-medium text-white/92">
            {t('insights')}
          </Link>
          <Link href="/contact" onClick={onClose} className="block border-b border-white/10 py-4 text-lg font-medium text-white/92">
            {t('contact')}
          </Link>
          <Link href="/partnership" onClick={onClose} className="block border-b border-white/10 py-4 text-lg font-medium text-white/92">
            {t('partnership')}
          </Link>

          <div className="pt-6">
            <NextLink
              href="/lp/login"
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-md border border-gold-400 bg-gold-400/10 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-gold-300"
            >
              {t('investorPortal')}
            </NextLink>
          </div>
        </nav>
      </div>
    </div>
  );
}
