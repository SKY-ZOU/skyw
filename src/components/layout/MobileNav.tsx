'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { X, ChevronDown } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="flex h-16 items-center justify-between px-4">
        <span className="text-lg font-bold tracking-wider text-navy-900">SKYW</span>
        <button onClick={onClose} className="p-2" aria-label="Close menu">
          <X className="h-6 w-6 text-[#212529]" />
        </button>
      </div>

      <nav className="px-4 py-6">
        <Link href="/" onClick={onClose} className="block border-b border-[#E9ECEF] py-4 text-lg font-medium text-[#212529]">
          {t('home')}
        </Link>
        <Link href="/about" onClick={onClose} className="block border-b border-[#E9ECEF] py-4 text-lg font-medium text-[#212529]">
          {t('about')}
        </Link>

        <div className="border-b border-[#E9ECEF]">
          <button
            onClick={() => setBizOpen(!bizOpen)}
            className="flex w-full items-center justify-between py-4 text-lg font-medium text-[#212529]"
          >
            {t('business')}
            <ChevronDown className={`h-5 w-5 transition-transform ${bizOpen ? 'rotate-180' : ''}`} />
          </button>
          {bizOpen && (
            <div className="pb-4 pl-4">
              <Link href="/business" onClick={onClose} className="block py-2 text-[#495057]">
                {t('business')}
              </Link>
              {divisions.map((div) => (
                <Link
                  key={div.divisionId}
                  href={`/business/${div.slug}`}
                  onClick={onClose}
                  className="block py-2 text-[#495057]"
                >
                  {loc(div, 'title', locale)}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link href="/insights" onClick={onClose} className="block border-b border-[#E9ECEF] py-4 text-lg font-medium text-[#212529]">
          {t('insights')}
        </Link>
        <Link href="/contact" onClick={onClose} className="block border-b border-[#E9ECEF] py-4 text-lg font-medium text-[#212529]">
          {t('contact')}
        </Link>

        {/* Language selector */}
        <div className="mt-8">
          <p className="mb-3 text-sm font-medium text-[#6C757D]">{t('language')}</p>
          <div className="flex gap-2">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  router.replace(pathname, { locale: l.code as 'zh-CN' | 'zh-TW' | 'en' });
                  onClose();
                }}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  locale === l.code
                    ? 'bg-gold-400 text-white'
                    : 'bg-[#F8F9FA] text-[#495057] hover:bg-[#E9ECEF]'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
