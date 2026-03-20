import { useTranslations } from 'next-intl';
import BusinessDetail from '@/components/business/BusinessDetail';

export default function IpoAnchorPage() {
  const t = useTranslations('Business.ipo');

  return (
    <BusinessDetail
      heroTitle={t('heroTitle')}
      heroSubtitle={t('heroSubtitle')}
      overviewTitle={t('overviewTitle')}
      overviewP1={t('overviewP1')}
      overviewP2={t('overviewP2')}
      currentSlug="ipo-anchor"
      features={[
        { title: t('advantage1Title'), description: t('advantage1Desc') },
        { title: t('advantage2Title'), description: t('advantage2Desc') },
        { title: t('advantage3Title'), description: t('advantage3Desc') },
        { title: t('advantage4Title'), description: t('advantage4Desc') },
      ]}
    />
  );
}
