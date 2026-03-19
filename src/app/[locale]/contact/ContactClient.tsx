'use client';

import { useTranslations, useLocale } from 'next-intl';
import HeroSection from '@/components/sections/HeroSection';
import AnimatedSection from '@/components/ui/AnimatedSection';
import ContactForm from '@/components/sections/ContactForm';
import { MapPin, Phone, Mail } from 'lucide-react';
import { loc } from '@/lib/locale-utils';

interface OfficeRow {
  id: number;
  slug: string;
  nameZhCN: string; nameZhTW: string; nameEn: string;
  typeZhCN: string; typeZhTW: string; typeEn: string;
  addressZhCN: string; addressZhTW: string; addressEn: string;
  phone: string; email: string;
}

function OfficeCard({
  name,
  address,
  phone,
  email,
}: {
  name: string;
  address: string;
  phone: string;
  email: string;
}) {
  return (
    <div className="border-l-2 border-gold-400 py-2 pl-6">
      <h3 className="text-lg font-semibold text-[#1a1a2e]">{name}</h3>
      <div className="mt-3 space-y-2 text-body-md text-[#6c757d]">
        <p className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#adb5bd]" />
          {address}
        </p>
        <p className="flex items-center gap-2">
          <Phone className="h-4 w-4 shrink-0 text-[#adb5bd]" />
          {phone}
        </p>
        <p className="flex items-center gap-2">
          <Mail className="h-4 w-4 shrink-0 text-[#adb5bd]" />
          {email}
        </p>
      </div>
    </div>
  );
}

export default function ContactClient({ offices }: { offices: OfficeRow[] }) {
  const t = useTranslations('Contact');
  const locale = useLocale();

  // Show first 3 offices with addresses
  const displayOffices = offices.filter((o) => {
    const addr = loc(o, 'address', locale);
    return addr && addr.length > 0;
  }).slice(0, 3);

  return (
    <>
      <HeroSection title={t('heroTitle')} subtitle={t('heroSubtitle')} />

      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <AnimatedSection>
                <p className="text-body-sm font-medium uppercase tracking-[0.15em] text-gold-500">
                  {t('officesTitle')}
                </p>
              </AnimatedSection>
              <div className="mt-8 space-y-8">
                {displayOffices.map((office, i) => (
                  <AnimatedSection key={office.id} delay={(i + 1) * 0.1}>
                    <OfficeCard
                      name={loc(office, 'name', locale)}
                      address={loc(office, 'address', locale)}
                      phone={office.phone}
                      email={office.email}
                    />
                  </AnimatedSection>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              <AnimatedSection delay={0.15}>
                <ContactForm />
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
