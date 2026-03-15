export interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  gradientFrom: string;
  gradientTo: string;
}

export const colorSchemes: ColorScheme[] = [
  {
    id: 'blue',
    name: 'Ocean Blue',
    primary: '#2563eb',
    primaryDark: '#1d4ed8',
    primaryLight: '#dbeafe',
    accent: '#3b82f6',
    gradientFrom: '#2563eb',
    gradientTo: '#7c3aed',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    primary: '#059669',
    primaryDark: '#047857',
    primaryLight: '#d1fae5',
    accent: '#10b981',
    gradientFrom: '#059669',
    gradientTo: '#0d9488',
  },
  {
    id: 'violet',
    name: 'Violet',
    primary: '#7c3aed',
    primaryDark: '#6d28d9',
    primaryLight: '#ede9fe',
    accent: '#8b5cf6',
    gradientFrom: '#7c3aed',
    gradientTo: '#ec4899',
  },
  {
    id: 'rose',
    name: 'Rose',
    primary: '#e11d48',
    primaryDark: '#be123c',
    primaryLight: '#ffe4e6',
    accent: '#f43f5e',
    gradientFrom: '#e11d48',
    gradientTo: '#f97316',
  },
  {
    id: 'amber',
    name: 'Amber',
    primary: '#d97706',
    primaryDark: '#b45309',
    primaryLight: '#fef3c7',
    accent: '#f59e0b',
    gradientFrom: '#d97706',
    gradientTo: '#dc2626',
  },
  {
    id: 'teal',
    name: 'Teal',
    primary: '#0d9488',
    primaryDark: '#0f766e',
    primaryLight: '#ccfbf1',
    accent: '#14b8a6',
    gradientFrom: '#0d9488',
    gradientTo: '#2563eb',
  },
  {
    id: 'slate',
    name: 'Slate',
    primary: '#475569',
    primaryDark: '#334155',
    primaryLight: '#f1f5f9',
    accent: '#64748b',
    gradientFrom: '#475569',
    gradientTo: '#1e293b',
  },
  {
    id: 'indigo',
    name: 'Indigo',
    primary: '#4f46e5',
    primaryDark: '#4338ca',
    primaryLight: '#e0e7ff',
    accent: '#6366f1',
    gradientFrom: '#4f46e5',
    gradientTo: '#06b6d4',
  },
];

export function getScheme(id: string): ColorScheme {
  return colorSchemes.find((s) => s.id === id) || colorSchemes[0];
}
