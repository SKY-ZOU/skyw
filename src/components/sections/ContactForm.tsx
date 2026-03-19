'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function ContactForm() {
  const t = useTranslations('Contact');
  const [inquiryType, setInquiryType] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const inputClass =
    'w-full border-b border-[#dee2e6] bg-transparent px-0 py-3 text-body text-[#1a1a2e] outline-none transition-colors placeholder:text-[#adb5bd] focus:border-navy-900';

  const inquiryTypes = [
    { value: 'lp-subscription', label: t('inquiryLP') },
    { value: 'co-investment', label: t('inquiryCoInvest') },
    { value: 'fund-materials', label: t('inquiryMaterials') },
    { value: 'project-referral', label: t('inquiryProject') },
    { value: 'partnership', label: t('inquiryPartnership') },
    { value: 'general', label: t('inquiryGeneral') },
  ];

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-4 py-12">
        <CheckCircle className="w-10 h-10 text-gold-500" />
        <h3 className="text-[18px] font-semibold text-[#1a1a2e]">{t('formSuccessTitle')}</h3>
        <p className="text-[14px] text-[#6c757d] leading-relaxed max-w-sm">{t('formSuccessDesc')}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-body-sm font-medium uppercase tracking-[0.15em] text-gold-500">
        {t('formTitle')}
      </p>

      {/* Inquiry type quick-select */}
      <div className="mt-6 mb-2">
        <p className="text-[11px] uppercase tracking-[0.15em] text-[#adb5bd] mb-3">{t('inquiryTypeLabel')}</p>
        <div className="flex flex-wrap gap-2">
          {inquiryTypes.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setInquiryType(opt.value)}
              className={`px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] border transition-colors ${
                inquiryType === opt.value
                  ? 'border-navy-900 bg-navy-900 text-white'
                  : 'border-[#dee2e6] text-[#6c757d] hover:border-navy-900 hover:text-navy-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <form
        className="mt-6 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <input type="text" required placeholder={`${t('formName')} *`} className={inputClass} />
          <input type="email" required placeholder={`${t('formEmail')} *`} className={inputClass} />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <input type="text" placeholder={t('formCompany')} className={inputClass} />
          <input type="text" placeholder={t('formPhone')} className={inputClass} />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <input
            type="text"
            placeholder={t('formInvestorType')}
            className={inputClass}
          />
          <input
            type="text"
            placeholder={t('formTicketSize')}
            className={inputClass}
          />
        </div>
        <textarea
          required
          rows={4}
          placeholder={`${t('formMessage')} *`}
          className={`${inputClass} resize-none`}
        />

        <button
          type="submit"
          className="group inline-flex items-center gap-2 bg-gold-400 px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-navy-950 transition-colors hover:bg-gold-300"
        >
          {t('formSubmit')}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>

        <p className="text-caption text-[#adb5bd]">{t('formDisclaimer')}</p>
      </form>
    </div>
  );
}
