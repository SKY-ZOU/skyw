import { useTranslations } from 'next-intl';
import BusinessDetail from '@/components/business/BusinessDetail';

export default function CreditGuaranteePage() {
  const t = useTranslations('Business.credit');

  return (
    <BusinessDetail
      heroTitle={t('heroTitle')}
      heroSubtitle={t('heroSubtitle')}
      overviewTitle={t('overviewTitle')}
      overviewP1={t('overviewP1')}
      overviewP2={t('overviewP2')}
      currentSlug="credit-guarantee"
      features={[
        { title: t('service1Title'), description: t('service1Desc') },
        { title: t('service2Title'), description: t('service2Desc') },
        { title: t('service3Title'), description: t('service3Desc') },
        { title: t('service4Title'), description: t('service4Desc') },
      ]}
    />
  );
}
