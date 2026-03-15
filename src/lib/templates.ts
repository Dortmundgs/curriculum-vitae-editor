export interface CVTemplate {
  id: string;
  nameKey: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  headerStyle: 'left' | 'center' | 'split';
  sidebarPosition: 'none' | 'left' | 'right';
  description: string;
  /** Visual treatment for the top header block on no-sidebar templates */
  headerVariant?: 'standard' | 'filled' | 'accent-bar';
  /**
   * 'timeline' renders a two-column experience layout (date on left, content on right),
   * bordered skill badges, and a split header with contact icons.
   */
  layout?: 'standard' | 'timeline';
}

export const templates: CVTemplate[] = [
  {
    id: 'professional',
    nameKey: 'professional',
    primaryColor: '#1e3a5f',
    secondaryColor: '#2563eb',
    accentColor: '#f59e0b',
    fontFamily: 'Georgia, serif',
    headerStyle: 'left',
    sidebarPosition: 'none',
    description: 'A clean, traditional layout perfect for corporate roles.',
  },
  {
    id: 'modern',
    nameKey: 'modern',
    primaryColor: '#0f172a',
    secondaryColor: '#6366f1',
    accentColor: '#22d3ee',
    fontFamily: 'Inter, sans-serif',
    headerStyle: 'split',
    sidebarPosition: 'left',
    description: 'Bold and contemporary with a striking sidebar design.',
  },
  {
    id: 'creative',
    nameKey: 'creative',
    primaryColor: '#7c3aed',
    secondaryColor: '#ec4899',
    accentColor: '#f97316',
    fontFamily: 'Poppins, sans-serif',
    headerStyle: 'center',
    sidebarPosition: 'none',
    description: 'Vibrant and expressive for creative industry professionals.',
  },
  {
    id: 'minimal',
    nameKey: 'minimal',
    primaryColor: '#374151',
    secondaryColor: '#6b7280',
    accentColor: '#374151',
    fontFamily: 'Helvetica, Arial, sans-serif',
    headerStyle: 'left',
    sidebarPosition: 'none',
    description: 'Simple and elegant with maximum whitespace and clarity.',
  },
  {
    id: 'executive',
    nameKey: 'executive',
    primaryColor: '#1a1a2e',
    secondaryColor: '#16213e',
    accentColor: '#c9a227',
    fontFamily: 'Playfair Display, serif',
    headerStyle: 'center',
    sidebarPosition: 'none',
    description: 'Sophisticated and authoritative for senior positions.',
  },
  {
    id: 'academic',
    nameKey: 'academic',
    primaryColor: '#1b4332',
    secondaryColor: '#2d6a4f',
    accentColor: '#95d5b2',
    fontFamily: 'Times New Roman, serif',
    headerStyle: 'left',
    sidebarPosition: 'none',
    description: 'Formal and structured for academic and research roles.',
  },
  {
    id: 'tech',
    nameKey: 'tech',
    primaryColor: '#0a0a0a',
    secondaryColor: '#10b981',
    accentColor: '#06b6d4',
    fontFamily: 'JetBrains Mono, monospace',
    headerStyle: 'split',
    sidebarPosition: 'right',
    description: 'Modern tech-inspired layout with a developer aesthetic.',
  },
  {
    id: 'classic',
    nameKey: 'classic',
    primaryColor: '#2c3e50',
    secondaryColor: '#34495e',
    accentColor: '#e74c3c',
    fontFamily: 'Garamond, serif',
    headerStyle: 'center',
    sidebarPosition: 'none',
    description: 'Timeless and universally accepted across all industries.',
  },

  // ── European-style templates ──────────────────────────────────────────────
  {
    id: 'europa',
    nameKey: 'europa',
    primaryColor: '#003C8C',
    secondaryColor: '#0057CC',
    accentColor: '#FF6B35',
    fontFamily: 'Arial, Helvetica, sans-serif',
    headerStyle: 'left',
    sidebarPosition: 'none',
    headerVariant: 'filled',
    layout: 'timeline',
    description: 'ATS-optimized two-column layout with bold filled header — popular across European job markets.',
  },
  {
    id: 'hamburg',
    nameKey: 'hamburg',
    primaryColor: '#00695C',
    secondaryColor: '#00897B',
    accentColor: '#B2DFDB',
    fontFamily: 'Roboto, Arial, sans-serif',
    headerStyle: 'left',
    sidebarPosition: 'none',
    headerVariant: 'filled',
    layout: 'timeline',
    description: 'Clean teal-themed two-column layout — highly readable for business and technical roles.',
  },
  {
    id: 'berlin',
    nameKey: 'berlin',
    primaryColor: '#1A1A2E',
    secondaryColor: '#16213E',
    accentColor: '#E94560',
    fontFamily: 'Inter, Arial, sans-serif',
    headerStyle: 'left',
    sidebarPosition: 'none',
    headerVariant: 'filled',
    layout: 'timeline',
    description: 'Bold dark header, two-column timeline body — ideal for senior and leadership roles.',
  },
  {
    id: 'nordic',
    nameKey: 'nordic',
    primaryColor: '#37474F',
    secondaryColor: '#546E7A',
    accentColor: '#80CBC4',
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    headerStyle: 'left',
    sidebarPosition: 'none',
    headerVariant: 'filled',
    layout: 'timeline',
    description: 'Scandinavian-inspired two-column layout — minimal, structured, and highly readable.',
  },
  {
    id: 'vienna',
    nameKey: 'vienna',
    primaryColor: '#4A148C',
    secondaryColor: '#7B1FA2',
    accentColor: '#FFD740',
    fontFamily: 'Georgia, serif',
    headerStyle: 'center',
    sidebarPosition: 'none',
    headerVariant: 'filled',
    description: 'Elegant violet and gold design for creative professionals and senior executives.',
  },
];

export function getTemplate(id: string): CVTemplate {
  return templates.find((t) => t.id === id) || templates[0];
}
