'use client';

import TipPage from '@/components/TipPage';

const sections = [
  { titleKey: 'sections.structure.title', contentKey: 'sections.structure.content' },
  { titleKey: 'sections.personalization.title', contentKey: 'sections.personalization.content' },
  { titleKey: 'sections.tone.title', contentKey: 'sections.tone.content' },
  { titleKey: 'sections.template.title', contentKey: 'sections.template.content' },
];

export default function CoverLetterTipsPage() {
  return (
    <TipPage
      titleKey="title"
      subtitleKey="subtitle"
      introKey="intro"
      sections={sections}
      translationPrefix="tips.coverLetter"
    />
  );
}
