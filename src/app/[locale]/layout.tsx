import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Inter, Noto_Serif_SC, JetBrains_Mono } from 'next/font/google';
import { getDivisions } from '@/lib/data';
import { SiteDataProvider } from '@/components/providers/SiteDataProvider';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-serif-sc',
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: {
      default: t('title'),
      template: `%s | SKYW Group`,
    },
    description: t('description'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      type: 'website',
      locale: locale.replace('-', '_'),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const [messages, divisions] = await Promise.all([
    getMessages(),
    getDivisions(),
  ]);

  return (
    <html lang={locale} className={`${inter.variable} ${notoSerifSC.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased font-sans">
        <NextIntlClientProvider messages={messages}>
          <SiteDataProvider divisions={divisions}>
            <SmoothScrollProvider>
              <Header />
              <main>{children}</main>
              <Footer />
            </SmoothScrollProvider>
          </SiteDataProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
