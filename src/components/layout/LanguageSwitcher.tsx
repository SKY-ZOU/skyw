'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';

const LOCALES = [
  { code: 'zh-CN', label: '简体' },
  { code: 'zh-TW', label: '繁體' },
  { code: 'en', label: 'EN' },
] as const;

export default function LanguageSwitcher({ light = false }: { light?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const currentLabel = LOCALES.find((l) => l.code === locale)?.label ?? locale;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-2 py-1 text-body-sm font-medium tracking-wide transition-colors ${
          light
            ? 'text-white/70 hover:text-white'
            : 'text-[#6C757D] hover:text-[#212529]'
        }`}
        aria-label="Switch language"
      >
        <Globe className="h-3.5 w-3.5" />
        <span>{currentLabel}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[100px] border border-[#e5e7eb] bg-white py-1 shadow-xl">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                router.replace(pathname, { locale: l.code as 'zh-CN' | 'zh-TW' | 'en' });
                setOpen(false);
              }}
              className={`block w-full px-4 py-2 text-left text-body-sm transition-colors hover:bg-[#f8f9fa] ${
                locale === l.code
                  ? 'font-semibold text-navy-900'
                  : 'text-[#495057]'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
