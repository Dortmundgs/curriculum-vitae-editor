export interface PersonalInfo {
  firstName: string;
  lastName: string;
  /** Professional title / current role shown as a subtitle in the header */
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  summary: string;
  photo: string; // base64 data URL
}

export type PhotoShape = 'circle' | 'rectangle';

export type DescriptionStyle =
  | 'paragraph'
  | 'bullet'
  | 'arrow'
  | 'check'
  | 'star'
  | 'diamond';

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  present: boolean;
  description: string;
  descriptionStyle: DescriptionStyle;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
  id: string;
  name: string;
  level: string;
}

export interface LanguageEntry {
  id: string;
  language: string;
  proficiency: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: LanguageEntry[];
  certifications: Certification[];
  templateId: string;
  photoShape: PhotoShape;
}

export const defaultCVData: CVData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    summary: '',
    photo: '',
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  templateId: 'professional',
  photoShape: 'circle',
};

/** Map a descriptionStyle to its rendered prefix per line */
export const descriptionStylePrefix: Record<DescriptionStyle, string> = {
  paragraph: '',
  bullet: '• ',
  arrow: '→ ',
  check: '✓ ',
  star: '★ ',
  diamond: '◆ ',
};

/** Format a description string according to its style */
export function formatDescription(text: string, style: DescriptionStyle): string[] {
  if (!text.trim()) return [];
  const lines = text.split('\n').filter((l) => l.trim());
  if (style === 'paragraph') return lines;
  const prefix = descriptionStylePrefix[style];
  return lines.map((l) => `${prefix}${l.replace(/^[•→✓★◆\-–]\s*/, '')}`);
}
