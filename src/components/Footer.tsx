'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { FileText } from 'lucide-react';
import { useColorScheme } from '@/context/ColorSchemeContext';

export default function Footer() {
  const t = useTranslations('footer');
  const tn = useTranslations('nav');
  const { scheme } = useColorScheme();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-xl text-white mb-4">
              <FileText className="w-6 h-6" style={{ color: scheme.accent }} />
              <span>CV<span style={{ color: scheme.accent }}>Builder</span></span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('description')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t('product')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/editor" className="hover:text-white transition-colors">{tn('editor')}</Link></li>
              <li><Link href="/templates" className="hover:text-white transition-colors">{tn('templates')}</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">{tn('pricing')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t('resources')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/tips/cv" className="hover:text-white transition-colors">{tn('tipsMenu.cv')}</Link></li>
              <li><Link href="/tips/cover-letter" className="hover:text-white transition-colors">{tn('tipsMenu.coverLetter')}</Link></li>
              <li><Link href="/tips/attachments" className="hover:text-white transition-colors">{tn('tipsMenu.attachments')}</Link></li>
              <li><Link href="/jobs" className="hover:text-white transition-colors">{tn('jobs')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t('company')}</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-white transition-colors cursor-pointer">{t('about')}</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">{t('contact')}</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">{t('privacy')}</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">{t('terms')}</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} CVBuilder. {t('rights')}
        </div>
      </div>
    </footer>
  );
}
