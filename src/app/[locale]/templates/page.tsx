'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { ZoomIn, ZoomOut, LayoutGrid } from 'lucide-react';
import { templates } from '@/lib/templates';
import { sampleCVData } from '@/lib/sample-data';
import TemplateCard from '@/components/TemplateCard';

const DRAFT_KEY = 'cv-builder-draft';

/** Maps zoom level (1–5) to a Tailwind grid-cols class string. */
const GRID_COLS = [
  'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5', // 1 — zoomed out most
  'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',                // 2
  'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',                // 3 — default
  'grid-cols-1 sm:grid-cols-2',                               // 4
  'grid-cols-1',                                              // 5 — zoomed in most
] as const;

const ZOOM_LABELS = ['20%', '33%', '50%', '66%', '100%'];
const DEFAULT_ZOOM = 2; // index into GRID_COLS (0-based)

export default function TemplatesPage() {
  const t      = useTranslations('templates');
  const router = useRouter();
  const [zoomIdx, setZoomIdx] = useState(DEFAULT_ZOOM);

  const zoomOut = () => setZoomIdx((i) => Math.max(0, i - 1));
  const zoomIn  = () => setZoomIdx((i) => Math.min(GRID_COLS.length - 1, i + 1));
  const reset   = () => setZoomIdx(DEFAULT_ZOOM);

  const handleSelect = (templateId: string) => {
    const draft = { ...sampleCVData, templateId };
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch { /* ignore */ }
    router.push('/editor');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-14">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page header ── */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{t('title')}</h1>
          <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">{t('subtitle')}</p>
          <p className="mt-2 text-sm text-slate-400">
            Click any template to open it in the editor · hover to preview full-size
          </p>
        </div>

        {/* ── Zoom toolbar ── */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-sm text-slate-500 font-medium">
            {templates.length} templates
          </p>

          <div className="flex items-center gap-2">
            {/* Zoom out */}
            <button
              onClick={zoomOut}
              disabled={zoomIdx === 0}
              title="Zoom out"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200
                         bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-colors cursor-pointer shadow-sm"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            {/* Zoom level pill */}
            <button
              onClick={reset}
              title="Reset to default"
              className="min-w-[58px] h-9 px-3 rounded-xl border border-slate-200 bg-white
                         text-xs font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300
                         transition-colors cursor-pointer shadow-sm"
            >
              {ZOOM_LABELS[zoomIdx]}
            </button>

            {/* Zoom in */}
            <button
              onClick={zoomIn}
              disabled={zoomIdx === GRID_COLS.length - 1}
              title="Zoom in"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200
                         bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-colors cursor-pointer shadow-sm"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-slate-200 mx-1" />

            {/* Reset to default grid */}
            <button
              onClick={reset}
              title="Reset grid"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200
                         bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300
                         transition-colors cursor-pointer shadow-sm"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Template grid ── */}
        <div
          className={`grid gap-6 transition-all duration-300 ${GRID_COLS[zoomIdx]}`}
        >
          {templates.map((tmpl) => (
            <TemplateCard
              key={tmpl.id}
              template={tmpl}
              label={t(tmpl.nameKey as Parameters<typeof t>[0])}
              ctaLabel={t('useTemplate')}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
