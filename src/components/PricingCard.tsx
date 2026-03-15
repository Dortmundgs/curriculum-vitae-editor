'use client';

import { Check } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useColorScheme } from '@/context/ColorSchemeContext';

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular?: string;
  highlighted?: boolean;
}

export default function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  popular,
  highlighted = false,
}: PricingCardProps) {
  const { scheme } = useColorScheme();

  return (
    <div
      className={`relative rounded-2xl p-6 flex flex-col ${
        highlighted
          ? 'text-white shadow-xl scale-105'
          : 'bg-white border border-slate-200 text-slate-800'
      }`}
      style={highlighted ? { backgroundColor: scheme.primary, boxShadow: `0 20px 40px ${scheme.primary}40` } : undefined}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 text-amber-900
                        rounded-full text-xs font-bold">
          {popular}
        </div>
      )}

      <div className="mb-6">
        <h3 className={`text-lg font-bold ${highlighted ? 'text-white' : 'text-slate-900'}`}>{name}</h3>
        <p className={`text-sm mt-1 ${highlighted ? 'text-white/70' : 'text-slate-500'}`}>{description}</p>
      </div>

      <div className="mb-6">
        <span className="text-4xl font-extrabold">{price}</span>
        <span className={`text-sm ${highlighted ? 'text-white/60' : 'text-slate-400'}`}>{period}</span>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <Check className={`w-4 h-4 flex-shrink-0 ${highlighted ? 'text-white/70' : 'text-green-500'}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/editor"
        className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
          highlighted ? 'bg-white hover:bg-slate-50' : 'text-white'
        }`}
        style={
          highlighted
            ? { color: scheme.primary }
            : { backgroundColor: scheme.primary }
        }
      >
        {cta}
      </Link>
    </div>
  );
}
