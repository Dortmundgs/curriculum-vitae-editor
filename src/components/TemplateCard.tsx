'use client';

import { useRef, useEffect, useState } from 'react';
import { Edit3, Maximize2, Sparkles } from 'lucide-react';
import type { CVTemplate } from '@/lib/templates';
import { sampleCVData } from '@/lib/sample-data';
import CVPreview from '@/components/CVPreview';
import TemplatePreviewModal from '@/components/TemplatePreviewModal';

interface TemplateCardProps {
  template: CVTemplate;
  label: string;
  ctaLabel: string;
  onSelect: (id: string) => void;
}

/** Auto-scale CV to fit the container width via ResizeObserver. */
function useScale(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(0.38);
  useEffect(() => {
    if (!containerRef.current) return;
    const CV_W = 794;
    const measure = () => {
      const w = containerRef.current?.offsetWidth ?? CV_W;
      setScale(w / CV_W);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [containerRef]);
  return scale;
}

export default function TemplateCard({ template, label, ctaLabel, onSelect }: TemplateCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scale        = useScale(containerRef);
  const [showModal, setShowModal] = useState(false);
  const [hovered, setHovered]     = useState(false);

  const CV_H    = 1123;
  const scaledH = Math.round(CV_H * scale);
  const cvData  = { ...sampleCVData, templateId: template.id };
  const color   = template.primaryColor;

  return (
    <>
      {showModal && (
        <TemplatePreviewModal
          template={template}
          label={label}
          ctaLabel={ctaLabel}
          onClose={() => setShowModal(false)}
          onSelect={(id) => { setShowModal(false); onSelect(id); }}
        />
      )}

      {/* ── Card shell ── */}
      <div
        className="group relative flex flex-col rounded-2xl bg-white overflow-hidden
                   transition-all duration-400"
        style={{
          border:     `2px solid ${hovered ? color + '50' : '#e2e8f0'}`,
          boxShadow:  hovered
            ? `0 20px 60px ${color}22, 0 4px 16px rgba(0,0,0,0.08)`
            : '0 1px 4px rgba(0,0,0,0.06)',
          transform:  hovered ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'border 0.3s ease, box-shadow 0.35s ease, transform 0.3s ease',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >

        {/* ── CV Preview area ── */}
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden cursor-zoom-in"
          style={{ height: `${scaledH}px`, backgroundColor: '#f8fafc' }}
          onClick={() => setShowModal(true)}
        >
          {/* CV — subtle scale-up on hover */}
          <div
            style={{
              position:        'absolute',
              top:             0,
              left:            0,
              transformOrigin: 'top left',
              pointerEvents:   'none',
              userSelect:      'none',
              transform:       `scale(${hovered ? scale * 1.025 : scale})`,
              transition:      'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <CVPreview data={cvData} htmlId={null} />
          </div>

          {/* ── Gradient overlay — fades in from bottom ── */}
          <div
            style={{
              position:   'absolute',
              inset:      0,
              background: `linear-gradient(
                to bottom,
                transparent 30%,
                ${color}18 60%,
                ${color}70 100%
              )`,
              opacity:    hovered ? 1 : 0,
              transition: 'opacity 0.35s ease',
            }}
          />

          {/* ── Top badge — fades in, slides down ── */}
          <div
            style={{
              position:         'absolute',
              top:              12,
              left:             12,
              display:          'flex',
              alignItems:       'center',
              gap:              6,
              padding:          '4px 10px',
              borderRadius:     999,
              backgroundColor:  color,
              color:            '#fff',
              fontSize:         11,
              fontWeight:       700,
              boxShadow:        '0 2px 8px rgba(0,0,0,0.18)',
              opacity:          hovered ? 1 : 0,
              transform:        hovered ? 'translateY(0)' : 'translateY(-6px)',
              transition:       'opacity 0.25s ease 0.05s, transform 0.3s ease 0.05s',
            }}
          >
            {label}
          </div>

          {/* ── Buttons row — staggered fade-up ── */}
          <div
            style={{
              position:       'absolute',
              bottom:         20,
              left:           0,
              right:          0,
              display:        'flex',
              justifyContent: 'center',
              gap:            10,
            }}
          >
            {/* Preview button — delay 120 ms */}
            <button
              onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
              style={{
                display:         'flex',
                alignItems:      'center',
                gap:             7,
                padding:         '9px 16px',
                borderRadius:    12,
                fontSize:        13,
                fontWeight:      600,
                background:      '#ffffff',
                color:           '#1e293b',
                boxShadow:       '0 4px 16px rgba(0,0,0,0.18)',
                cursor:          'zoom-in',
                border:          'none',
                opacity:         hovered ? 1 : 0,
                transform:       hovered ? 'translateY(0)' : 'translateY(12px)',
                transition:      'opacity 0.28s ease 0.12s, transform 0.32s ease 0.12s, background 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget.style.background = '#f1f5f9'); }}
              onMouseLeave={(e) => { (e.currentTarget.style.background = '#ffffff'); }}
            >
              <Maximize2 style={{ width: 14, height: 14 }} />
              Preview
            </button>

            {/* Use Template button — delay 200 ms */}
            <button
              onClick={(e) => { e.stopPropagation(); onSelect(template.id); }}
              style={{
                display:         'flex',
                alignItems:      'center',
                gap:             7,
                padding:         '9px 16px',
                borderRadius:    12,
                fontSize:        13,
                fontWeight:      700,
                backgroundColor: color,
                color:           '#ffffff',
                boxShadow:       `0 4px 16px ${color}60`,
                cursor:          'pointer',
                border:          'none',
                opacity:         hovered ? 1 : 0,
                transform:       hovered ? 'translateY(0)' : 'translateY(12px)',
                transition:      'opacity 0.28s ease 0.2s, transform 0.32s ease 0.2s, opacity 0.2s',
              }}
            >
              <Edit3 style={{ width: 14, height: 14 }} />
              {ctaLabel}
            </button>
          </div>
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            display:         'flex',
            alignItems:      'center',
            gap:             12,
            padding:         '12px 16px',
            borderTop:       `1px solid ${hovered ? color + '25' : '#f1f5f9'}`,
            backgroundColor: hovered ? color + '08' : '#ffffff',
            transition:      'background-color 0.35s ease, border-color 0.35s ease',
          }}
        >
          {/* Colour dots */}
          <div style={{ display: 'flex', marginRight: -4 }}>
            {[color, template.secondaryColor, template.accentColor].map((c, i) => (
              <div
                key={i}
                style={{
                  width: 14, height: 14,
                  borderRadius: '50%',
                  backgroundColor: c,
                  border: '2px solid white',
                  marginLeft: i > 0 ? -4 : 0,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  transition: `transform 0.3s ease ${i * 60}ms`,
                  transform: hovered ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontWeight: 700,
                fontSize:   14,
                color:      hovered ? color : '#1e293b',
                overflow:   'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                transition: 'color 0.3s ease',
              }}
            >
              {label}
            </h3>
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {template.description}
            </p>
          </div>

          {template.layout === 'timeline' && (
            <span
              style={{
                display:         'flex',
                alignItems:      'center',
                gap:             4,
                padding:         '2px 8px',
                borderRadius:    999,
                fontSize:        10,
                fontWeight:      600,
                color:           '#7c3aed',
                backgroundColor: '#f5f3ff',
                border:          '1px solid #ddd6fe',
                flexShrink:      0,
                opacity:         hovered ? 1 : 0.6,
                transition:      'opacity 0.3s ease',
              }}
            >
              <Sparkles style={{ width: 10, height: 10 }} />
              EU
            </span>
          )}
        </div>
      </div>
    </>
  );
}
