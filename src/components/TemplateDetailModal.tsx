'use client';

import { useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { CVTemplate } from '@/lib/templates';
import { useColorScheme } from '@/context/ColorSchemeContext';

interface TemplateDetailModalProps {
  template: CVTemplate;
  label: string;
  onClose: () => void;
  onSelect: (id: string) => void;
}

/** Shorten a font-family stack to the first font name */
function shortFont(fontFamily: string) {
  return fontFamily.split(',')[0].trim();
}

/** Map template id → best-suited roles description */
const BEST_FOR: Record<string, string> = {
  professional: 'Finance, Law, Banking, HR, Management',
  modern:       'Marketing, Consulting, Business, Design',
  creative:     'Design, Media, Arts, Advertising, Fashion',
  minimal:      'Any industry — clean & universal',
  executive:    'C-suite, Director, Senior Leadership',
  academic:     'Research, Teaching, Science, Medicine',
  tech:         'Software Engineering, IT, Data Science',
  classic:      'All sectors — traditional & timeless',
};

/** Colour swatch + label row */
function ColorRow({ label, hex }: { label: string; hex: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-6 h-6 rounded-md flex-shrink-0 border border-black/10 shadow-sm"
        style={{ backgroundColor: hex }}
      />
      <span className="text-xs text-slate-600 font-medium">{label}</span>
      <span className="ml-auto text-[10px] font-mono text-slate-400 uppercase">{hex}</span>
    </div>
  );
}

/** Info row with a label and value */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-xs font-semibold text-slate-500 w-20 flex-shrink-0 pt-px">{label}</span>
      <span className="text-xs text-slate-700">{value}</span>
    </div>
  );
}

/** The same mockup used in TemplateCard, but taller */
function LargePreviewMockup({ template }: { template: CVTemplate }) {
  return (
    <div
      className="w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-white"
      style={{
        height: '340px',
        display: 'flex',
        flexDirection: template.sidebarPosition === 'right' ? 'row-reverse' : 'row',
      }}
    >
      {/* Sidebar */}
      {template.sidebarPosition !== 'none' && (
        <div style={{ width: '36%', backgroundColor: template.primaryColor, padding: '18px 14px' }}>
          <div className="w-14 h-14 rounded-full bg-white/20 mx-auto mb-4" />
          <div className="space-y-2">
            <div className="h-2.5 bg-white/40 rounded w-full" />
            <div className="h-2 bg-white/25 rounded w-3/4" />
            <div className="h-2 bg-white/25 rounded w-5/6" />
            <div className="mt-4 h-2.5 bg-white/40 rounded w-full" />
            <div className="h-2 bg-white/25 rounded w-2/3" />
            <div className="h-2 bg-white/25 rounded w-5/6" />
            <div className="mt-4 h-2.5 bg-white/40 rounded w-full" />
            <div className="h-2 bg-white/25 rounded w-3/4" />
          </div>
        </div>
      )}

      {/* Main area */}
      <div style={{ flex: 1, padding: '18px' }}>
        {/* Header */}
        <div
          className="mb-4 pb-3"
          style={{
            borderBottom: `3px solid ${template.primaryColor}`,
            textAlign: template.headerStyle === 'center' ? 'center' : 'left',
          }}
        >
          {/* Photo placeholder + name block (no-sidebar only) */}
          {template.sidebarPosition === 'none' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexDirection: template.headerStyle === 'center' ? 'column' : 'row',
                marginBottom: '6px',
              }}
            >
              <div
                className="rounded-full bg-slate-200 flex-shrink-0"
                style={{
                  width: '40px',
                  height: '40px',
                  border: `2px solid ${template.primaryColor}`,
                }}
              />
              <div style={{ flex: 1 }}>
                <div className="h-4 rounded w-36 mb-1.5" style={{ backgroundColor: template.primaryColor, display: 'inline-block' }} />
                <div
                  className="flex gap-2 mt-1"
                  style={{ justifyContent: template.headerStyle === 'center' ? 'center' : 'flex-start' }}
                >
                  <div className="h-1.5 bg-slate-200 rounded w-20" />
                  <div className="h-1.5 bg-slate-200 rounded w-14" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content rows */}
        <div className="space-y-4">
          {/* Section 1 */}
          <div>
            <div className="h-2 rounded w-24 mb-2" style={{ backgroundColor: `${template.primaryColor}60` }} />
            <div className="space-y-1">
              <div className="h-1.5 bg-slate-100 rounded w-full" />
              <div className="h-1.5 bg-slate-100 rounded w-11/12" />
              <div className="h-1.5 bg-slate-100 rounded w-4/5" />
            </div>
          </div>
          {/* Section 2 */}
          <div>
            <div className="h-2 rounded w-28 mb-2" style={{ backgroundColor: `${template.primaryColor}60` }} />
            <div className="space-y-1">
              <div className="flex justify-between mb-1">
                <div className="h-1.5 bg-slate-200 rounded w-32" />
                <div className="h-1.5 bg-slate-100 rounded w-16" />
              </div>
              <div className="h-1.5 rounded w-24 mb-1.5" style={{ backgroundColor: `${template.secondaryColor}50` }} />
              <div className="h-1.5 bg-slate-100 rounded w-full" />
              <div className="h-1.5 bg-slate-100 rounded w-5/6" />
            </div>
          </div>
          {/* Section 3 — skills chips */}
          <div>
            <div className="h-2 rounded w-16 mb-2" style={{ backgroundColor: `${template.primaryColor}60` }} />
            <div className="flex gap-1.5 flex-wrap">
              {[28, 36, 22, 32].map((w, i) => (
                <div
                  key={i}
                  className="h-5 rounded-sm"
                  style={{ width: `${w}px`, backgroundColor: `${template.secondaryColor}20` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TemplateDetailModal({
  template,
  label,
  onClose,
  onSelect,
}: TemplateDetailModalProps) {
  const t = useTranslations('templates');
  const { scheme } = useColorScheme();

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const sidebarLabel =
    template.sidebarPosition === 'left'  ? t('sidebarLeft')  :
    template.sidebarPosition === 'right' ? t('sidebarRight') :
    t('sidebarNone');

  const headerLabel =
    template.headerStyle === 'center' ? t('headerCenter') :
    template.headerStyle === 'split'  ? t('headerSplit')  :
    t('headerLeft');

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15,23,42,0.65)' }}
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: template.primaryColor }}
            />
            <h2 className="text-base font-bold text-slate-800">{t('templateDetails')} — {label}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Left: large preview */}
            <div>
              <LargePreviewMockup template={template} />
            </div>

            {/* Right: info panel */}
            <div className="space-y-5">
              {/* Description */}
              <div>
                <p className="text-sm text-slate-600 leading-relaxed">{template.description}</p>
              </div>

              {/* Best for */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {t('bestFor')}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {BEST_FOR[template.id] ?? '—'}
                </p>
              </div>

              {/* Colors */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {t('colors')}
                </p>
                <div className="space-y-2">
                  <ColorRow label={t('primaryColor')}   hex={template.primaryColor}   />
                  <ColorRow label={t('secondaryColor')} hex={template.secondaryColor} />
                  <ColorRow label={t('accentColor')}    hex={template.accentColor}    />
                </div>
              </div>

              {/* Layout & font */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {t('layout')} & {t('fontFamily')}
                </p>
                <div className="space-y-1.5">
                  <InfoRow label={t('layout')}     value={`${sidebarLabel} · ${headerLabel}`} />
                  <InfoRow label={t('fontFamily')} value={shortFont(template.fontFamily)}     />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold
                       text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {t('closeModal')}
          </button>
          <button
            onClick={() => { onSelect(template.id); onClose(); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                       text-white transition-colors cursor-pointer hover:opacity-90"
            style={{ backgroundColor: scheme.primary }}
          >
            {t('useTemplate')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
