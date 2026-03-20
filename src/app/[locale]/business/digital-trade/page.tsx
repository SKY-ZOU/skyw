import { useTranslations } from 'next-intl';
import BusinessDetail from '@/components/business/BusinessDetail';

export default function DigitalTradePage() {
  const t = useTranslations('Business.digitalTrade');

  return (
    <BusinessDetail
      heroTitle={t('heroTitle')}
      heroSubtitle={t('heroSubtitle')}
      overviewTitle={t('overviewTitle')}
      overviewP1={t('overviewP1')}
      overviewP2={t('overviewP2')}
      currentSlug="digital-trade"
      features={[
        { title: t('feature1Title'), description: t('feature1Desc') },
        { title: t('feature2Title'), description: t('feature2Desc') },
        { title: t('feature3Title'), description: t('feature3Desc') },
        { title: t('feature4Title'), description: t('feature4Desc') },
      ]}
    />
  );
}
