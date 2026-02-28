import { useTranslations } from 'next-intl';
import BusinessDetail from '@/components/business/BusinessDetail';

export default function FundManagementPage() {
  const t = useTranslations('Business.fund');

  return (
    <BusinessDetail
      heroTitle={t('heroTitle')}
      heroSubtitle={t('heroSubtitle')}
      overviewTitle={t('overviewTitle')}
      overviewP1={t('overviewP1')}
      overviewP2={t('overviewP2')}
      currentSlug="fund-management"
      features={[
        { title: t('strategy1Title'), description: t('strategy1Desc') },
        { title: t('strategy2Title'), description: t('strategy2Desc') },
        { title: t('strategy3Title'), description: t('strategy3Desc') },
        { title: t('strategy4Title'), description: t('strategy4Desc') },
      ]}
    />
  );
}
