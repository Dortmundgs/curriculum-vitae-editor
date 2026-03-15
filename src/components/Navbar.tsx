'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import {
  FileText,
  Menu,
  X,
  ChevronDown,
  LogIn,
  LogOut,
} from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import ColorSchemePicker from './ColorSchemePicker';
import { useColorScheme } from '@/context/ColorSchemeContext';
import db from '@/lib/db';

export default function Navbar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);
  const { scheme } = useColorScheme();

  const { user } = db.useAuth();

  const navLinks = [
    { href: '/editor', label: t('editor') },
    { href: '/templates', label: t('templates') },
    { href: '/jobs', label: t('jobs') },
    { href: '/pricing', label: t('pricing') },
  ];

  const tipsLinks = [
    { href: '/tips/cv', label: t('tipsMenu.cv') },
    { href: '/tips/cover-letter', label: t('tipsMenu.coverLetter') },
    { href: '/tips/attachments', label: t('tipsMenu.attachments') },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <FileText className="w-6 h-6" style={{ color: scheme.primary }} />
            <span>CV<span style={{ color: scheme.primary }}>Builder</span></span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                style={isActive(link.href) ? { backgroundColor: scheme.primaryLight, color: scheme.primaryDark } : undefined}
              >
                {link.label}
              </Link>
            ))}

            <div className="relative">
              <button
                onClick={() => setTipsOpen(!tipsOpen)}
                onBlur={() => setTimeout(() => setTipsOpen(false), 150)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  pathname.startsWith('/tips')
                    ? ''
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                style={pathname.startsWith('/tips') ? { backgroundColor: scheme.primaryLight, color: scheme.primaryDark } : undefined}
              >
                {t('tips')}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${tipsOpen ? 'rotate-180' : ''}`} />
              </button>
              {tipsOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                  {tipsLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      onClick={() => setTipsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <ColorSchemePicker />
            <LanguageSwitcher />
            {user ? (
              <button
                onClick={() => db.auth.signOut()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-600
                           hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                {t('logout')}
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-600
                           hover:bg-slate-100 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                {t('login')}
              </Link>
            )}
            <Link
              href="/editor"
              className="px-4 py-2 text-white rounded-lg text-sm font-semibold
                         transition-colors shadow-sm"
              style={{ backgroundColor: scheme.primary }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = scheme.primaryDark)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = scheme.primary)}
            >
              {t('startEditor')}
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive(link.href)
                      ? ''
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  style={isActive(link.href) ? { backgroundColor: scheme.primaryLight, color: scheme.primaryDark } : undefined}
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-3 py-2 text-xs font-semibold uppercase text-slate-400 mt-2">
                {t('tips')}
              </div>
              {tipsLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-5 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200 px-3">
                <ColorSchemePicker />
                <LanguageSwitcher />
                {user ? (
                  <button
                    onClick={() => { db.auth.signOut(); setMobileOpen(false); }}
                    className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> {t('logout')}
                  </button>
                ) : (
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-1.5 text-sm text-slate-600">
                    <LogIn className="w-4 h-4" /> {t('login')}
                  </Link>
                )}
              </div>
              <Link
                href="/editor"
                onClick={() => setMobileOpen(false)}
                className="mx-3 mt-3 px-4 py-2.5 text-white rounded-lg text-sm font-semibold text-center transition-colors"
                style={{ backgroundColor: scheme.primary }}
              >
                {t('startEditor')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
