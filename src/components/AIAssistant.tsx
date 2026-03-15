'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Check, RefreshCw, Loader2 } from 'lucide-react';

export interface AIAction {
  label: string;
  prompt: string;
}

interface AIAssistantProps {
  actions: AIAction[];
  context?: Record<string, string>;
  onResult: (text: string) => void;
  accent: string;
  /** Label shown on the trigger button */
  label?: string;
  /** Whether the popover opens above or below the button */
  position?: 'above' | 'below';
}

export default function AIAssistant({
  actions,
  context = {},
  onResult,
  accent,
  label = 'AI',
  position = 'below',
}: AIAssistantProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<AIAction | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const reset = () => {
    setResult(null);
    setError(null);
    setActiveAction(null);
  };

  const generate = async (action: AIAction) => {
    setLoading(true);
    setResult(null);
    setError(null);
    setActiveAction(action);

    const apiKey =
      typeof window !== 'undefined' ? (localStorage.getItem('cv-ai-key') ?? '') : '';

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: action.prompt, context, apiKey }),
      });
      const data = (await res.json()) as { result?: string; error?: string };
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.result ?? '');
      }
    } catch {
      setError('Failed to connect to the AI service. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (result !== null) {
      onResult(result);
      setOpen(false);
      reset();
    }
  };

  const handleRetry = () => {
    if (activeAction) generate(activeAction);
  };

  return (
    <div className="relative inline-block" ref={ref}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => { setOpen((v) => !v); if (!open) reset(); }}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold
                   transition-all cursor-pointer border"
        style={{
          color: accent,
          borderColor: `${accent}50`,
          backgroundColor: `${accent}12`,
        }}
      >
        <Sparkles className="w-3.5 h-3.5" />
        {label}
      </button>

      {/* Popover */}
      {open && (
        <div
          className={`absolute ${position === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'}
                      left-0 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl w-80`}
          style={{ minWidth: '280px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Sparkles className="w-4 h-4" style={{ color: accent }} />
              AI Writing Assistant
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100
                         transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action list */}
          {!loading && !result && !error && (
            <div className="p-3 space-y-1.5">
              <p className="text-xs text-slate-400 mb-2 px-1">Choose an action:</p>
              {actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => generate(action)}
                  className="w-full text-left px-3 py-2.5 text-sm rounded-lg border border-slate-200
                             hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer
                             text-slate-700 font-medium"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="px-4 py-8 flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: accent }} />
              <p className="text-sm text-slate-500">
                {activeAction ? `${activeAction.label}…` : 'Generating…'}
              </p>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="p-3 space-y-3">
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700 leading-relaxed">
                {error}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={reset}
                  className="flex-1 py-2 text-sm font-medium rounded-lg border border-slate-200
                             text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="flex-1 py-2 text-sm font-medium rounded-lg text-white
                             transition-colors cursor-pointer"
                  style={{ backgroundColor: accent }}
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Result state */}
          {result !== null && !loading && (
            <div className="p-3 space-y-3">
              <div
                className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-700
                           leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto"
              >
                {result}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAccept}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm
                             font-semibold rounded-lg text-white shadow-sm cursor-pointer transition-all
                             active:scale-95"
                  style={{ backgroundColor: accent }}
                >
                  <Check className="w-4 h-4" />
                  Accept
                </button>
                <button
                  type="button"
                  onClick={handleRetry}
                  title="Regenerate"
                  className="p-2.5 rounded-lg border border-slate-200 text-slate-600
                             hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={reset}
                  title="Discard"
                  className="p-2.5 rounded-lg border border-slate-200 text-slate-600
                             hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
