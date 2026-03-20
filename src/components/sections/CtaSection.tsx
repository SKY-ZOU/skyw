import { useTranslations } from 'next-intl';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default function CtaSection() {
  const t = useTranslations('Home');

  return (
    <section className="bg-gradient-to-b from-navy-900 to-navy-950 py-[var(--spacing-section)]">
      <Container className="text-center">
        <h2 className="text-h2 font-bold text-white">{t('ctaTitle')}</h2>
        <p className="mx-auto mt-4 max-w-xl text-body-lg text-[#ADB5BD]">
          {t('ctaSubtitle')}
        </p>
        <div className="mt-8">
          <Button href="/contact" variant="primary">
            {t('ctaButton')}
          </Button>
        </div>
      </Container>
    </section>
  );
}
