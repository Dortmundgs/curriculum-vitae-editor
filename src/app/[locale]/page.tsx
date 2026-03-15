'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  FileText,
  Layout,
  Download,
  Languages,
  Upload,
  Cloud,
  ArrowRight,
} from 'lucide-react';
import { useColorScheme } from '@/context/ColorSchemeContext';

const featureIcons = [Layout, FileText, Download, Languages, Upload, Cloud];
const featureKeys = ['templates', 'editor', 'download', 'bilingual', 'upload', 'save'] as const;

export default function HomePage() {
  const t = useTranslations('home');
  const { scheme } = useColorScheme();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, #f8fafc, ${scheme.primaryLight}, ${scheme.primaryLight}88)` }}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMDA4IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
              {t('heroTitle')}{' '}
              <span className="text-gradient">{t('heroTitleHighlight')}</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
              {t('heroSubtitle')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/editor"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white rounded-xl
                           text-lg font-semibold transition-all shadow-primary
                           hover:-translate-y-0.5"
                style={{ backgroundColor: scheme.primary }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = scheme.primaryDark)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = scheme.primary)}
              >
                {t('startButton')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/editor"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 rounded-xl
                           text-lg font-semibold hover:bg-slate-50 transition-all border border-slate-200
                           shadow-sm hover:shadow-md"
              >
                <Upload className="w-5 h-5" />
                {t('uploadButton')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '50,000+', label: t('stats.cvCreated') },
              { value: '8', label: t('stats.templates') },
              { value: '3', label: t('stats.languages') },
              { value: '98%', label: t('stats.satisfaction') },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl sm:text-4xl font-bold" style={{ color: scheme.primary }}>
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-slate-500 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              {t('features.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureKeys.map((key, i) => {
              const Icon = featureIcons[i];
              return (
                <div
                  key={key}
                  className="group p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all"
                  style={{ ['--hover-border' as string]: scheme.primaryLight }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                    style={{ backgroundColor: scheme.primaryLight, color: scheme.primary }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    {t(`features.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-slate-500 leading-relaxed">
                    {t(`features.${key}.desc`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-brand">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            {t('ctaTitle')}
          </h2>
          <p className="mt-4 text-lg text-white/80 leading-relaxed">
            {t('ctaSubtitle')}
          </p>
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-white rounded-xl
                       text-lg font-semibold hover:bg-slate-50 transition-all shadow-lg
                       hover:shadow-xl hover:-translate-y-0.5"
            style={{ color: scheme.primaryDark }}
          >
            {t('ctaButton')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
