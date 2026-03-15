'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';
import type { CVData } from '@/lib/cv-types';
import { defaultCVData } from '@/lib/cv-types';

interface UploadCVProps {
  label: string;
  onUpload: (data: CVData) => void;
}

export default function UploadCV({ label, onUpload }: UploadCVProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const text = reader.result as string;

          const lines = text
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean);

          const data: CVData = { ...defaultCVData };

          const emailMatch = text.match(
            /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
          );
          if (emailMatch) {
            data.personalInfo.email = emailMatch[0];
          }

          const phoneMatch = text.match(
            /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
          );
          if (phoneMatch) {
            data.personalInfo.phone = phoneMatch[0];
          }

          if (lines.length > 0) {
            const nameParts = lines[0].split(' ');
            if (nameParts.length >= 2) {
              data.personalInfo.firstName = nameParts[0];
              data.personalInfo.lastName = nameParts.slice(1).join(' ');
            }
          }

          onUpload(data);
        } catch {
          onUpload({ ...defaultCVData });
        }
      };

      reader.readAsText(file);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        {isDragActive ? (
          <FileText className="w-8 h-8 text-blue-500" />
        ) : (
          <Upload className="w-8 h-8 text-slate-400" />
        )}
        <p className="text-sm text-slate-600 font-medium">{label}</p>
        <p className="text-xs text-slate-400">.txt, .pdf</p>
      </div>
    </div>
  );
}
