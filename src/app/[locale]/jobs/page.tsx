'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Search, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { useColorScheme } from '@/context/ColorSchemeContext';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  sector: string;
  date: string;
  type: string;
  description: string;
}

const sampleJobs: Job[] = [
  { id: 1, title: 'Full Stack Developer', company: 'TechCorp', location: 'Paris, France', sector: 'technology', date: '2026-03-10', type: 'CDI', description: 'Build and maintain web applications using React and Node.js.' },
  { id: 2, title: 'Marketing Manager', company: 'BrandCo', location: 'Lyon, France', sector: 'marketing', date: '2026-03-08', type: 'CDI', description: 'Lead marketing campaigns and manage the digital strategy.' },
  { id: 3, title: 'Registered Nurse', company: 'City Hospital', location: 'Marseille, France', sector: 'healthcare', date: '2026-03-09', type: 'CDI', description: 'Provide patient care in the emergency department.' },
  { id: 4, title: 'Financial Analyst', company: 'FinanceGroup', location: 'Paris, France', sector: 'finance', date: '2026-03-07', type: 'CDD', description: 'Analyze financial data and prepare reports for senior management.' },
  { id: 5, title: 'High School Teacher', company: 'Lycée Victor Hugo', location: 'Bordeaux, France', sector: 'education', date: '2026-03-06', type: 'CDI', description: 'Teach mathematics to high school students.' },
  { id: 6, title: 'Mechanical Engineer', company: 'IndustrieTech', location: 'Toulouse, France', sector: 'engineering', date: '2026-03-05', type: 'CDI', description: 'Design and improve manufacturing processes.' },
  { id: 7, title: 'Sales Representative', company: 'SalesForce EU', location: 'Nice, France', sector: 'sales', date: '2026-03-04', type: 'CDI', description: 'Manage client relationships and drive revenue growth.' },
  { id: 8, title: 'UX Designer', company: 'DesignStudio', location: 'Paris, France', sector: 'design', date: '2026-03-03', type: 'Freelance', description: 'Create user-centered designs for web and mobile applications.' },
  { id: 9, title: 'Data Scientist', company: 'AI Labs', location: 'Remote', sector: 'technology', date: '2026-03-11', type: 'CDI', description: 'Develop machine learning models for product recommendations.' },
  { id: 10, title: 'Pharmacist', company: 'PharmaPlus', location: 'Strasbourg, France', sector: 'healthcare', date: '2026-03-02', type: 'CDI', description: 'Dispense medications and provide pharmaceutical consultations.' },
  { id: 11, title: 'Account Manager', company: 'AdAgency', location: 'Paris, France', sector: 'marketing', date: '2026-03-01', type: 'CDD', description: 'Manage client accounts and coordinate advertising campaigns.' },
  { id: 12, title: 'Civil Engineer', company: 'BuildCorp', location: 'Nantes, France', sector: 'engineering', date: '2026-02-28', type: 'CDI', description: 'Oversee infrastructure projects from planning to completion.' },
];

const sectors = [
  'allSectors', 'technology', 'healthcare', 'finance', 'education', 'marketing', 'engineering', 'sales', 'design',
] as const;

export default function JobsPage() {
  const t = useTranslations('jobs');
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('allSectors');
  const { scheme } = useColorScheme();

  const filtered = useMemo(() => {
    return sampleJobs.filter((job) => {
      const matchSector = sector === 'allSectors' || job.sector === sector;
      const matchSearch =
        !search ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.location.toLowerCase().includes(search.toLowerCase());
      return matchSector && matchSearch;
    });
  }, [search, sector]);

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{t('title')}</h1>
          <p className="mt-3 text-lg text-slate-500">{t('subtitle')}</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('search')}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {sectors.map((s) => (
              <button
                key={s}
                onClick={() => setSector(s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  sector === s
                    ? 'text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
                style={sector === s ? { backgroundColor: scheme.primary } : undefined}
              >
                {t(s)}
              </button>
            ))}
          </div>
        </div>

        {/* Job list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg">{t('noResults')}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-blue-200
                           transition-all flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center
                                    flex-shrink-0 font-bold text-sm"
                         style={{ backgroundColor: scheme.primaryLight, color: scheme.primary }}>
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{job.title}</h3>
                      <p className="text-sm font-medium" style={{ color: scheme.primary }}>{job.company}</p>
                      <p className="text-sm text-slate-500 mt-1">{job.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {t('postedOn')} {job.date}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-500 font-medium">
                          {job.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className="flex items-center gap-1.5 px-5 py-2.5 text-white rounded-lg text-sm
                             font-semibold transition-colors self-start cursor-pointer"
                  style={{ backgroundColor: scheme.primary }}>
                  {t('applyNow')}
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
