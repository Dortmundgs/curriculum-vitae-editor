'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Globe, ChevronDown } from 'lucide-react';
import type { AppLocale } from '@/i18n/routing';

const localeLabels: Record<AppLocale, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
};

const localeFlags: Record<AppLocale, string> = {
  en: 'EN',
  fr: 'FR',
  de: 'DE',
};

export default function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const switchTo = (target: AppLocale) => {
    router.replace(pathname, { locale: target });
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                   hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Switch language"
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase">{localeFlags[locale]}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
          {(Object.keys(localeLabels) as AppLocale[]).map((loc) => (
            <button
              key={loc}
              onClick={() => switchTo(loc)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                loc === locale
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="font-mono mr-2 text-xs">{localeFlags[loc]}</span>
              {localeLabels[loc]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
