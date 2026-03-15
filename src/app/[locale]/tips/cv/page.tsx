'use client';

import TipPage from '@/components/TipPage';

const sections = [
  { titleKey: 'sections.structure.title', contentKey: 'sections.structure.content' },
  { titleKey: 'sections.formatting.title', contentKey: 'sections.formatting.content' },
  { titleKey: 'sections.keywords.title', contentKey: 'sections.keywords.content' },
  { titleKey: 'sections.mistakes.title', contentKey: 'sections.mistakes.content' },
];

export default function CVTipsPage() {
  return (
    <TipPage
      titleKey="title"
      subtitleKey="subtitle"
      introKey="intro"
      sections={sections}
      translationPrefix="tips.cv"
    />
  );
}
