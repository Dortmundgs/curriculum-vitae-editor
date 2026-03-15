'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

interface DownloadButtonProps {
  label: string;
  targetId: string;
  fileName?: string;
}

export default function DownloadButton({ label, targetId, fileName = 'cv' }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const element = document.getElementById(targetId);
      if (!element) return;

      const html2pdf = (await import('html2pdf.js')).default;

      const opt = {
        margin: 0,
        filename: `${fileName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold
                 hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      {label}
    </button>
  );
}
