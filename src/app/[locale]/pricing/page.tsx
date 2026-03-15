'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import PricingCard from '@/components/PricingCard';
import { useColorScheme } from '@/context/ColorSchemeContext';

export default function PricingPage() {
  const t = useTranslations('pricing');
  const [yearly, setYearly] = useState(false);
  const { scheme } = useColorScheme();

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{t('title')}</h1>
          <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">{t('subtitle')}</p>

          <div className="mt-8 inline-flex items-center bg-white rounded-xl border border-slate-200 p-1">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                !yearly ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
              style={!yearly ? { backgroundColor: scheme.primary } : undefined}
            >
              {t('monthly')}
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                yearly ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
              style={yearly ? { backgroundColor: scheme.primary } : undefined}
            >
              {t('yearly')}
              <span className="ml-1.5 text-xs text-green-500 font-bold">{t('yearlyDiscount')}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <PricingCard
            name={t('free.name')}
            price={t('free.price')}
            period={t('free.period')}
            description={t('free.desc')}
            features={[t('free.features.0'), t('free.features.1'), t('free.features.2'), t('free.features.3')]}
            cta={t('free.cta')}
          />
          <PricingCard
            name={t('pro.name')}
            price={yearly ? t('pro.priceYearly') : t('pro.price')}
            period={t('pro.period')}
            description={t('pro.desc')}
            features={[t('pro.features.0'), t('pro.features.1'), t('pro.features.2'), t('pro.features.3'), t('pro.features.4'), t('pro.features.5')]}
            cta={t('pro.cta')}
            popular={t('pro.popular')}
            highlighted
          />
          <PricingCard
            name={t('premium.name')}
            price={yearly ? t('premium.priceYearly') : t('premium.price')}
            period={t('premium.period')}
            description={t('premium.desc')}
            features={[t('premium.features.0'), t('premium.features.1'), t('premium.features.2'), t('premium.features.3'), t('premium.features.4'), t('premium.features.5')]}
            cta={t('premium.cta')}
          />
        </div>
      </div>
    </div>
  );
}
