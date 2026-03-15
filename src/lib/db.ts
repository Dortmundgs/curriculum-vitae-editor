import { init, i, type InstaQLEntity } from '@instantdb/react';

const APP_ID = '7d6f23a7-fd44-40c5-9f2d-653c36318aff';

const schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string(),
    }),
    profiles: i.entity({
      name: i.string(),
      lang: i.string(),
    }),
    cvs: i.entity({
      title: i.string(),
      templateId: i.string(),
      personalInfo: i.json<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        summary: string;
      }>(),
      experience: i.json<
        Array<{
          jobTitle: string;
          company: string;
          startDate: string;
          endDate: string;
          present: boolean;
          description: string;
        }>
      >(),
      education: i.json<
        Array<{
          degree: string;
          school: string;
          fieldOfStudy: string;
          startDate: string;
          endDate: string;
        }>
      >(),
      skills: i.json<Array<{ name: string; level: string }>>(),
      languages: i.json<Array<{ language: string; proficiency: string }>>(),
      certifications: i.json<
        Array<{ name: string; issuer: string; date: string }>
      >(),
      createdAt: i.number(),
      updatedAt: i.number(),
    }),
  },
  links: {
    profileOwner: {
      forward: { on: 'profiles', has: 'one', label: 'owner' },
      reverse: { on: '$users', has: 'one', label: 'profile' },
    },
    cvOwner: {
      forward: { on: 'cvs', has: 'one', label: 'owner' },
      reverse: { on: '$users', has: 'many', label: 'cvs' },
    },
  },
});

export type Schema = typeof schema;
export type CV = InstaQLEntity<Schema, 'cvs'>;
export type Profile = InstaQLEntity<Schema, 'profiles'>;

const db = init({ appId: APP_ID, schema });

export default db;
