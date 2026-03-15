import type { CVData } from './cv-types';

/**
 * Realistic fictitious CV used to populate template previews.
 * The `templateId` is overridden per-card when rendering the gallery.
 */
export const sampleCVData: CVData = {
  personalInfo: {
    firstName: 'Alex',
    lastName: 'Morgan',
    jobTitle: 'Senior Product Manager',
    email: 'alex.morgan@email.com',
    phone: '+49 170 123 4567',
    address: 'Unter den Linden 10',
    city: 'Berlin',
    summary:
      'Results-driven Product Manager with 8+ years of experience leading cross-functional teams to deliver innovative digital products. Proven track record of driving 40% revenue growth through data-informed product strategy and agile execution across B2B SaaS markets.',
    photo: '',
  },
  experience: [
    {
      id: 'exp1',
      jobTitle: 'Senior Product Manager',
      company: 'TechVision GmbH · Berlin',
      startDate: '03/2021',
      endDate: '',
      present: true,
      description:
        'Led product roadmap for B2B SaaS platform serving 500+ enterprise clients\nIncreased user retention by 34% through data-driven feature prioritisation\nManaged cross-functional team of 12 engineers, designers, and analysts\nLaunched 3 major product features generating €2.4M additional ARR',
      descriptionStyle: 'bullet',
    },
    {
      id: 'exp2',
      jobTitle: 'Product Manager',
      company: 'Innovate Labs · Munich',
      startDate: '06/2018',
      endDate: '02/2021',
      present: false,
      description:
        'Owned end-to-end product development for a mobile commerce platform\nGrew monthly active users from 80K to 320K within 18 months\nDefined and tracked OKRs across 4 product squads',
      descriptionStyle: 'bullet',
    },
    {
      id: 'exp3',
      jobTitle: 'Associate Product Manager',
      company: 'StartupHub · Hamburg',
      startDate: '09/2016',
      endDate: '05/2018',
      present: false,
      description:
        'Supported senior PM in defining requirements for fintech dashboard\nConducted 60+ user interviews to surface key pain points',
      descriptionStyle: 'bullet',
    },
  ],
  education: [
    {
      id: 'edu1',
      degree: 'M.Sc. Business Informatics',
      school: 'TU Berlin',
      fieldOfStudy: 'Product Management & Digital Innovation',
      startDate: '2014',
      endDate: '2016',
    },
    {
      id: 'edu2',
      degree: 'B.Sc. Computer Science',
      school: 'LMU Munich',
      fieldOfStudy: 'Software Engineering',
      startDate: '2011',
      endDate: '2014',
    },
  ],
  skills: [
    { id: 's1', name: 'Product Strategy', level: 'expert' },
    { id: 's2', name: 'Agile / Scrum', level: 'expert' },
    { id: 's3', name: 'Data Analysis', level: 'advanced' },
    { id: 's4', name: 'SQL', level: 'intermediate' },
    { id: 's5', name: 'Figma', level: 'intermediate' },
    { id: 's6', name: 'Stakeholder Management', level: 'expert' },
  ],
  languages: [
    { id: 'l1', language: 'English', proficiency: 'native' },
    { id: 'l2', language: 'German', proficiency: 'fluent' },
    { id: 'l3', language: 'French', proficiency: 'conversational' },
  ],
  certifications: [
    { id: 'c1', name: 'Certified Scrum Product Owner (CSPO)', issuer: 'Scrum Alliance', date: '2022' },
    { id: 'c2', name: 'Google Analytics Certification', issuer: 'Google', date: '2021' },
  ],
  templateId: 'professional',
  photoShape: 'circle',
};
