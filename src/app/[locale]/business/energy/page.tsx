import { useTranslations } from 'next-intl';
import BusinessDetail from '@/components/business/BusinessDetail';

export default function EnergyPage() {
  const t = useTranslations('Business.energy');

  return (
    <BusinessDetail
      heroTitle={t('heroTitle')}
      heroSubtitle={t('heroSubtitle')}
      overviewTitle={t('overviewTitle')}
      overviewP1={t('overviewP1')}
      overviewP2={t('overviewP2')}
      currentSlug="energy"
      features={[
        { title: t('area1Title'), description: t('area1Desc') },
        { title: t('area2Title'), description: t('area2Desc') },
        { title: t('area3Title'), description: t('area3Desc') },
        { title: t('area4Title'), description: t('area4Desc') },
      ]}
    />
  );
}
