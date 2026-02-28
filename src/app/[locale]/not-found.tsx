import { useTranslations } from 'next-intl';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-gradient-to-b from-navy-900 to-navy-950 pt-16">
      <Container className="text-center">
        <div className="text-8xl font-bold text-gold-400">404</div>
        <h1 className="mt-4 text-2xl font-bold text-white">Page Not Found</h1>
        <p className="mt-2 text-[#ADB5BD]">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-8">
          <Button href="/" variant="primary">
            Back to Home
          </Button>
        </div>
      </Container>
    </section>
  );
}
