'use client';

import { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { colorSchemes } from '@/lib/color-schemes';
import { useColorScheme } from '@/context/ColorSchemeContext';

export default function ColorSchemePicker() {
  const { scheme, setSchemeId } = useColorScheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                   hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Color scheme"
      >
        <Palette className="w-4 h-4" />
        <div
          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: scheme.primary }}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-lg border border-slate-200 p-3 z-50">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">
            Color Scheme
          </p>
          <div className="grid grid-cols-4 gap-2">
            {colorSchemes.map((s) => (
              <button
                key={s.id}
                onClick={() => { setSchemeId(s.id); setOpen(false); }}
                className="group relative flex flex-col items-center gap-1 p-2 rounded-lg
                           hover:bg-slate-50 transition-colors cursor-pointer"
                title={s.name}
              >
                <div
                  className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                    s.id === scheme.id
                      ? 'border-slate-800 scale-110'
                      : 'border-transparent group-hover:border-slate-300'
                  }`}
                  style={{ backgroundColor: s.primary }}
                >
                  {s.id === scheme.id && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className="text-[10px] text-slate-500 font-medium truncate w-full text-center">
                  {s.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
