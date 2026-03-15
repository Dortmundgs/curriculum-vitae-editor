'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { FileText, Mail, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useColorScheme } from '@/context/ColorSchemeContext';
import db from '@/lib/db';

export default function LoginPage() {
  const t = useTranslations('login');
  const router = useRouter();
  const { scheme } = useColorScheme();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sentTo, setSentTo] = useState('');

  const { user } = db.useAuth();

  if (user) {
    router.replace('/editor');
    return null;
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await db.auth.sendMagicCode({ email });
      setSentTo(email);
      setStep('code');
    } catch {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await db.auth.signInWithMagicCode({ email: sentTo, code });
      router.replace('/editor');
    } catch {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 py-16"
         style={{ background: `linear-gradient(135deg, #f8fafc, ${scheme.primaryLight})` }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 font-bold text-2xl text-slate-900 mb-2">
            <FileText className="w-8 h-8" style={{ color: scheme.primary }} />
            <span>CV<span style={{ color: scheme.primary }}>Builder</span></span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-4">{t('title')}</h1>
          <p className="text-slate-500 mt-2">{t('subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleSendCode} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {t('email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none transition-all text-sm"
                    style={{ ['--tw-ring-color' as string]: `${scheme.primary}33` }}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-3 text-white rounded-xl font-semibold
                           transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                style={{ backgroundColor: scheme.primary }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = scheme.primaryDark)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = scheme.primary)}
              >
                {loading ? t('sending') : t('sendCode')}
              </button>
              <p className="text-xs text-center text-slate-400 mt-3">
                {t('noAccount')}
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <button
                type="button"
                onClick={() => { setStep('email'); setCode(''); setError(''); }}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors
                           mb-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> {t('back')}
              </button>

              <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                {t('codeSent')}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {t('enterCode')}
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={t('codePlaceholder')}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none transition-all text-sm text-center
                             tracking-widest text-lg font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !code}
                className="w-full py-3 text-white rounded-xl font-semibold
                           transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                style={{ backgroundColor: scheme.primary }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = scheme.primaryDark)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = scheme.primary)}
              >
                {loading ? t('verifying') : t('verify')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
