import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export type AppLocale = 'en' | 'fr' | 'de';

export const routing = defineRouting({
  locales: ['en', 'fr', 'de'] as const,
  defaultLocale: 'en',
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
