'use client';

import { useEffect, useCallback, useState } from 'react';
import { X, ZoomIn, ZoomOut, Edit3, RotateCcw } from 'lucide-react';
import type { CVTemplate } from '@/lib/templates';
import { sampleCVData } from '@/lib/sample-data';
import CVPreview from '@/components/CVPreview';

interface TemplatePreviewModalProps {
  template: CVTemplate;
  label: string;
  ctaLabel: string;
  onClose: () => void;
  onSelect: (id: string) => void;
}

const MIN_ZOOM = 0.35;
const MAX_ZOOM = 1.0;
const STEP     = 0.05;
const DEFAULT_ZOOM = 0.62;

export default function TemplatePreviewModal({
  template,
  label,
  ctaLabel,
  onClose,
  onSelect,
}: TemplatePreviewModalProps) {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const zoomIn  = useCallback(() => setZoom((z) => Math.min(+(z + STEP).toFixed(2), MAX_ZOOM)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(+(z - STEP).toFixed(2), MIN_ZOOM)), []);
  const reset   = useCallback(() => setZoom(DEFAULT_ZOOM), []);

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')              onClose();
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-')                  zoomOut();
      if (e.key === '0')                  reset();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, zoomIn, zoomOut, reset]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const cvData = { ...sampleCVData, templateId: template.id };
  const pct    = Math.round(zoom * 100);

  // Scaled CV dimensions (natural: 794 × 1123 px)
  const scaledW = Math.round(794  * zoom);
  const scaledH = Math.round(1123 * zoom);

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col"
      style={{ backgroundColor: 'rgba(0,0,0,0.82)' }}
    >
      {/* ── Top toolbar ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-3
                      bg-white/5 backdrop-blur-sm border-b border-white/10">

        {/* Template info */}
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: template.primaryColor }}
          />
          <span className="text-white font-semibold text-sm">{label}</span>
          <span className="text-white/40 text-xs hidden sm:inline">{template.description}</span>
        </div>

        {/* Zoom controls — centre */}
        <div className="flex items-center gap-1 bg-white/10 rounded-xl px-1 py-1">
          <button
            onClick={zoomOut}
            disabled={zoom <= MIN_ZOOM}
            title="Zoom out  (−)"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white
                       hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed
                       transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={reset}
            title="Reset zoom  (0)"
            className="min-w-[52px] text-center text-xs font-bold text-white/90
                       hover:text-white transition-colors cursor-pointer px-1 py-1 rounded-lg
                       hover:bg-white/10"
          >
            {pct}%
          </button>

          <button
            onClick={zoomIn}
            disabled={zoom >= MAX_ZOOM}
            title="Zoom in  (+)"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white
                       hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed
                       transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-white/20 mx-1" />

          <button
            onClick={reset}
            title="Reset  (0)"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60
                       hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelect(template.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
                       text-white shadow-lg hover:opacity-90 active:scale-95
                       transition-all cursor-pointer"
            style={{ backgroundColor: template.primaryColor }}
          >
            <Edit3 className="w-4 h-4" />
            <span className="hidden sm:inline">{ctaLabel}</span>
          </button>

          <button
            onClick={onClose}
            title="Close  (Esc)"
            className="w-9 h-9 flex items-center justify-center rounded-xl
                       text-white/70 hover:text-white hover:bg-white/15
                       transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Scrollable preview area ── */}
      <div className="flex-1 overflow-auto">
        <div
          className="flex justify-center py-8 px-4"
          style={{ minWidth: `${scaledW + 32}px` }}
        >
          {/* Shadow + border frame */}
          <div
            style={{
              width:  `${scaledW}px`,
              height: `${scaledH}px`,
              position: 'relative',
              flexShrink: 0,
              boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            {/* CV at natural size, scaled down */}
            <div
              style={{
                position:        'absolute',
                top:             0,
                left:            0,
                transform:       `scale(${zoom})`,
                transformOrigin: 'top left',
                pointerEvents:   'none',
                userSelect:      'none',
              }}
            >
              <CVPreview data={cvData} htmlId={null} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom hint bar ── */}
      <div className="flex-shrink-0 flex items-center justify-center gap-6 py-2
                      bg-white/5 border-t border-white/10">
        <span className="text-white/35 text-xs">
          Scroll to see the full CV · <kbd className="font-mono">+</kbd> / <kbd className="font-mono">−</kbd> to zoom ·
          <kbd className="font-mono"> Esc</kbd> to close
        </span>
      </div>
    </div>
  );
}
