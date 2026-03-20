import { useTranslations } from 'next-intl';
import BusinessDetail from '@/components/business/BusinessDetail';

export default function Web3FinancePage() {
  const t = useTranslations('Business.web3');

  return (
    <BusinessDetail
      heroTitle={t('heroTitle')}
      heroSubtitle={t('heroSubtitle')}
      overviewTitle={t('overviewTitle')}
      overviewP1={t('overviewP1')}
      overviewP2={t('overviewP2')}
      currentSlug="web3-finance"
      features={[
        { title: t('feature1Title'), description: t('feature1Desc') },
        { title: t('feature2Title'), description: t('feature2Desc') },
        { title: t('feature3Title'), description: t('feature3Desc') },
        { title: t('feature4Title'), description: t('feature4Desc') },
      ]}
    />
  );
}
