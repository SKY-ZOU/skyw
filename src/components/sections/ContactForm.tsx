'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

export default function ContactForm() {
  const t = useTranslations('Contact');

  const inputClass =
    'w-full border-b border-[#dee2e6] bg-transparent px-0 py-3 text-[15px] text-[#1a1a2e] outline-none transition-colors placeholder:text-[#adb5bd] focus:border-navy-900';

  return (
    <div>
      <p className="text-[13px] font-medium uppercase tracking-[0.15em] text-gold-500">
        {t('formTitle')}
      </p>

      <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-6 sm:grid-cols-2">
          <input type="text" required placeholder={`${t('formName')} *`} className={inputClass} />
          <input type="email" required placeholder={`${t('formEmail')} *`} className={inputClass} />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <input type="text" placeholder={t('formCompany')} className={inputClass} />
          <input type="text" required placeholder={`${t('formSubject')} *`} className={inputClass} />
        </div>
        <textarea
          required
          rows={4}
          placeholder={`${t('formMessage')} *`}
          className={`${inputClass} resize-none`}
        />

        <button
          type="submit"
          className="group inline-flex items-center gap-2 border border-navy-900 px-8 py-4 text-[13px] font-medium uppercase tracking-[0.1em] text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
        >
          {t('formSubmit')}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>

        <p className="text-[12px] text-[#adb5bd]">{t('formDisclaimer')}</p>
      </form>
    </div>
  );
}
