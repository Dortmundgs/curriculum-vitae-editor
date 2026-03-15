'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PhotoCropperProps {
  imageSrc: string;
  onApply: (croppedDataUrl: string) => void;
  onCancel: () => void;
  accent?: string;
}

const SIZE = 256; // crop viewport diameter in px

export default function PhotoCropper({ imageSrc, onApply, onCancel, accent = '#2563eb' }: PhotoCropperProps) {
  const t = useTranslations('editor');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [minScale, setMinScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  // Load image and calculate initial cover scale
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const coverScale = Math.max(SIZE / img.naturalWidth, SIZE / img.naturalHeight);
      setMinScale(coverScale);
      setScale(coverScale);
      setOffset({ x: 0, y: 0 });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Redraw canvas whenever scale or offset changes
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, SIZE, SIZE);

    // Checkerboard background (transparent areas)
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, SIZE, SIZE);

    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    const x = SIZE / 2 - w / 2 + offset.x;
    const y = SIZE / 2 - h / 2 + offset.y;
    ctx.drawImage(img, x, y, w, h);
  }, [scale, offset]);

  useEffect(() => { draw(); }, [draw]);

  // ── Pointer helpers (unified mouse + touch) ──────────────────
  const getPointerXY = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: (e as React.MouseEvent).clientX, y: (e as React.MouseEvent).clientY };
  };

  const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    lastPointer.current = getPointerXY(e);
  };

  const onPointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;
    const pos = getPointerXY(e);
    const dx = pos.x - lastPointer.current.x;
    const dy = pos.y - lastPointer.current.y;
    lastPointer.current = pos;
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const onPointerUp = () => { isDragging.current = false; };

  // ── Apply crop ───────────────────────────────────────────────
  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Draw a circular clip, then export
    const out = document.createElement('canvas');
    out.width = SIZE;
    out.height = SIZE;
    const ctx = out.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(canvas, 0, 0);
    onApply(out.toDataURL('image/png'));
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black/65 flex items-center justify-center z-[100] p-4"
      onMouseMove={onPointerMove as React.MouseEventHandler}
      onMouseUp={onPointerUp}
      onTouchMove={onPointerMove as React.TouchEventHandler}
      onTouchEnd={onPointerUp}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="text-base font-bold text-slate-800">{t('cropTitle')}</h3>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas crop area */}
        <div className="flex justify-center px-5">
          <div
            className="relative rounded-full overflow-hidden select-none"
            style={{
              width: SIZE,
              height: SIZE,
              cursor: isDragging.current ? 'grabbing' : 'grab',
              border: `3px solid ${accent}`,
              boxShadow: `0 0 0 4px ${accent}22`,
            }}
            onMouseDown={onPointerDown as React.MouseEventHandler}
            onMouseMove={onPointerMove as React.MouseEventHandler}
            onMouseUp={onPointerUp}
            onMouseLeave={onPointerUp}
            onTouchStart={onPointerDown as React.TouchEventHandler}
            onTouchMove={onPointerMove as React.TouchEventHandler}
            onTouchEnd={onPointerUp}
          >
            <canvas ref={canvasRef} width={SIZE} height={SIZE} className="block" />

            {/* Drag hint overlay (fades on first drag) */}
            <div className="absolute inset-0 flex items-end justify-center pb-3 pointer-events-none">
              <span className="text-[10px] bg-black/40 text-white px-2 py-0.5 rounded-full">
                drag to reposition
              </span>
            </div>
          </div>
        </div>

        {/* Zoom slider */}
        <div className="flex items-center gap-3 px-5 mt-4">
          <ZoomOut className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="range"
            min={minScale}
            max={minScale * 4}
            step={0.01}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="flex-1 accent-blue-600"
            style={{ accentColor: accent }}
          />
          <ZoomIn className="w-4 h-4 text-slate-400 flex-shrink-0" />
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-1">
          {t('zoom')}: {Math.round((scale / minScale) * 100)}%
        </p>

        {/* Action buttons */}
        <div className="flex gap-3 px-5 py-5">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold
                       text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {t('cancelCrop')}
          </button>
          <button
            onClick={handleApply}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                       text-sm font-semibold text-white transition-colors cursor-pointer"
            style={{ backgroundColor: accent }}
          >
            <Check className="w-4 h-4" />
            {t('applyCrop')}
          </button>
        </div>
      </div>
    </div>
  );
}
