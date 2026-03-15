'use client';

import { Link } from '@/i18n/routing';
import { ArrowRight, FileText, Mail, Paperclip } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useColorScheme } from '@/context/ColorSchemeContext';

interface TipSection {
  titleKey: string;
  contentKey: string;
}

interface TipPageProps {
  titleKey: string;
  subtitleKey: string;
  introKey: string;
  sections: TipSection[];
  translationPrefix: string;
}

const tipNavItems = [
  { href: '/tips/cv', icon: FileText, labelKey: 'cv' },
  { href: '/tips/cover-letter', icon: Mail, labelKey: 'coverLetter' },
  { href: '/tips/attachments', icon: Paperclip, labelKey: 'attachments' },
];

export default function TipPage({
  titleKey,
  subtitleKey,
  introKey,
  sections,
  translationPrefix,
}: TipPageProps) {
  const t = useTranslations(translationPrefix);
  const tNav = useTranslations('nav.tipsMenu');
  const { scheme } = useColorScheme();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-brand text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">{t(titleKey)}</h1>
          <p className="mt-3 text-lg text-white/80">{t(subtitleKey)}</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl border border-slate-200 p-4 sticky top-24">
              <h3 className="text-xs font-semibold uppercase text-slate-400 mb-3 tracking-wider">Guides</h3>
              <ul className="space-y-1">
                {tipNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium
                                   text-slate-600 hover:text-slate-900 transition-colors"
                        style={{ ['--hover-bg' as string]: scheme.primaryLight }}
                      >
                        <Icon className="w-4 h-4" />
                        {tNav(item.labelKey)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          <main className="flex-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10">
              <p className="text-lg text-slate-600 leading-relaxed mb-10 border-l-4 pl-4"
                 style={{ borderColor: scheme.primary }}>
                {t(introKey)}
              </p>

              <div className="space-y-10">
                {sections.map((section, i) => (
                  <div key={i}>
                    <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: scheme.primaryLight, color: scheme.primary }}
                      >
                        {i + 1}
                      </span>
                      {t(section.titleKey)}
                    </h2>
                    <p className="text-slate-600 leading-relaxed pl-10">
                      {t(section.contentKey)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 rounded-xl border text-center"
                   style={{ backgroundColor: scheme.primaryLight, borderColor: `${scheme.primary}30` }}>
                <Link
                  href="/editor"
                  className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl
                             font-semibold transition-colors"
                  style={{ backgroundColor: scheme.primary }}
                >
                  {t(titleKey)} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
