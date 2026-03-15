'use client';

import TipPage from '@/components/TipPage';

const sections = [
  { titleKey: 'sections.essential.title', contentKey: 'sections.essential.content' },
  { titleKey: 'sections.additional.title', contentKey: 'sections.additional.content' },
  { titleKey: 'sections.formats.title', contentKey: 'sections.formats.content' },
  { titleKey: 'sections.organization.title', contentKey: 'sections.organization.content' },
];

export default function AttachmentsTipsPage() {
  return (
    <TipPage
      titleKey="title"
      subtitleKey="subtitle"
      introKey="intro"
      sections={sections}
      translationPrefix="tips.attachments"
    />
  );
}
