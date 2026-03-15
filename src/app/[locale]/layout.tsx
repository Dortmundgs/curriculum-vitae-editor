import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ColorSchemeProvider } from '@/context/ColorSchemeContext';

export const metadata: Metadata = {
  title: 'CV Builder — Create Professional Resumes',
  description:
    'Professional CV builder for job seekers. Create, customize, and download your perfect resume in minutes.',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'fr' | 'de')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen flex flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          <ColorSchemeProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ColorSchemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
