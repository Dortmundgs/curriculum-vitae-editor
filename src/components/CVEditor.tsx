'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Languages,
  Award,
  ChevronDown,
  ChevronRight,
  Trash2,
  Camera,
  X,
  ArrowUp,
  ArrowDown,
  Save,
} from 'lucide-react';
import type {
  CVData,
  Experience,
  Education,
  Skill,
  LanguageEntry,
  Certification,
  DescriptionStyle,
  PhotoShape,
} from '@/lib/cv-types';
import { useColorScheme } from '@/context/ColorSchemeContext';
import PhotoCropper from '@/components/PhotoCropper';
import AIAssistant from '@/components/AIAssistant';
import type { AIAction } from '@/components/AIAssistant';

interface CVEditorProps {
  data: CVData;
  onChange: (data: CVData) => void;
  onSave?: () => void;
}

function genId() {
  return Math.random().toString(36).substring(2, 9);
}

/** Move item at index by +1 or -1 */
function moveItem<T>(arr: T[], index: number, dir: 1 | -1): T[] {
  const next = index + dir;
  if (next < 0 || next >= arr.length) return arr;
  const copy = [...arr];
  [copy[index], copy[next]] = [copy[next], copy[index]];
  return copy;
}

function Section({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  accent,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
  accent: string;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100
                   transition-colors text-left cursor-pointer"
      >
        <span style={{ color: accent }} className="flex-shrink-0">
          <Icon className="w-4 h-4" />
        </span>
        <span className="text-sm font-semibold text-slate-800 flex-1">{title}</span>
        {open
          ? <ChevronDown className="w-4 h-4 text-slate-400" />
          : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="p-4 space-y-3">{children}</div>}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
      />
    </div>
  );
}

const BULLET_STYLES: { style: DescriptionStyle; label: string; icon: string }[] = [
  { style: 'paragraph', label: 'styleParagraph', icon: '¶' },
  { style: 'bullet',    label: 'styleBullet',    icon: '•' },
  { style: 'arrow',     label: 'styleArrow',     icon: '→' },
  { style: 'check',     label: 'styleCheck',     icon: '✓' },
  { style: 'star',      label: 'styleStar',      icon: '★' },
  { style: 'diamond',   label: 'styleDiamond',   icon: '◆' },
];

function DescriptionStylePicker({
  value,
  onChange,
  accent,
}: {
  value: DescriptionStyle;
  onChange: (s: DescriptionStyle) => void;
  accent: string;
}) {
  const t = useTranslations('editor');

  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1.5">
        {t('descriptionStyle')}
      </label>
      <div className="flex flex-wrap gap-1.5">
        {BULLET_STYLES.map(({ style, label, icon }) => (
          <button
            key={style}
            type="button"
            title={t(label as Parameters<typeof t>[0])}
            onClick={() => onChange(style)}
            className={`w-9 h-9 rounded-lg text-base font-bold transition-all cursor-pointer border ${
              value === style
                ? 'text-white shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}
            style={value === style ? { backgroundColor: accent, borderColor: accent } : undefined}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── AI action templates ───────────────────────────────────────────────────

const summaryAIActions: AIAction[] = [
  {
    label: '✨ Generate professional summary',
    prompt:
      'Write a compelling 2–3 sentence professional CV summary. Use the provided name, job title, and company as context. Highlight professional value and career strengths.',
  },
  {
    label: '💡 Improve my current summary',
    prompt:
      'Improve the following professional CV summary. Make it more impactful, concise, and ATS-friendly. Return only the improved text:\n\n{currentSummary}',
  },
  {
    label: '⚡ Make it more results-focused',
    prompt:
      'Rewrite the following CV summary to emphasise achievements and measurable outcomes rather than generic responsibilities. Return only the rewritten text:\n\n{currentSummary}',
  },
];

function buildExperienceAIActions(exp: { jobTitle: string; company: string; description: string }): AIAction[] {
  return [
    {
      label: '✨ Write bullet points for this role',
      prompt: `Write 4–5 strong achievement-focused bullet points for a ${exp.jobTitle || 'professional'} at ${exp.company || 'a company'}. Focus on impact and results. One bullet per line, no leading symbols.`,
    },
    {
      label: '💡 Improve my description',
      prompt: `Improve the following work experience bullet points for a ${exp.jobTitle || 'professional'} at ${exp.company || 'a company'}. Make them more impactful, specific, and ATS-optimized. Return one item per line:\n\n${exp.description}`,
    },
    {
      label: '⚡ Make more quantitative',
      prompt: `Rewrite the following work experience descriptions to include quantifiable metrics and measurable outcomes where appropriate. Keep it realistic. Return one item per line:\n\n${exp.description}`,
    },
    {
      label: '✂️ Shorten & sharpen',
      prompt: `Shorten and sharpen the following work experience points, keeping only the most impactful achievements. Return one item per line:\n\n${exp.description}`,
    },
  ];
}

export default function CVEditor({ data, onChange, onSave }: CVEditorProps) {
  const t = useTranslations('editor');
  const { scheme } = useColorScheme();
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Photo cropper state
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  // ── Personal info ────────────────────────────────────────────
  const updatePersonal = (field: string, value: string) =>
    onChange({ ...data, personalInfo: { ...data.personalInfo, [field]: value } });

  const handlePhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) return; // 8 MB guard (we'll crop it down)
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropApply = (dataUrl: string) => {
    onChange({ ...data, personalInfo: { ...data.personalInfo, photo: dataUrl } });
    setCropSrc(null);
  };

  const removePhoto = () =>
    onChange({ ...data, personalInfo: { ...data.personalInfo, photo: '' } });

  // ── Experience ───────────────────────────────────────────────
  const addExperience = () => {
    const newExp: Experience = {
      id: genId(), jobTitle: '', company: '',
      startDate: '', endDate: '', present: false,
      description: '', descriptionStyle: 'bullet',
    };
    onChange({ ...data, experience: [...data.experience, newExp] });
  };

  const updateExperience = (id: string, field: string, value: string | boolean | DescriptionStyle) =>
    onChange({ ...data, experience: data.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)) });

  const removeExperience = (id: string) =>
    onChange({ ...data, experience: data.experience.filter((e) => e.id !== id) });

  const moveExperience = (index: number, dir: 1 | -1) =>
    onChange({ ...data, experience: moveItem(data.experience, index, dir) });

  // ── Education ────────────────────────────────────────────────
  const addEducation = () => {
    const newEdu: Education = {
      id: genId(), degree: '', school: '', fieldOfStudy: '', startDate: '', endDate: '',
    };
    onChange({ ...data, education: [...data.education, newEdu] });
  };

  const updateEducation = (id: string, field: string, value: string) =>
    onChange({ ...data, education: data.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)) });

  const removeEducation = (id: string) =>
    onChange({ ...data, education: data.education.filter((e) => e.id !== id) });

  // ── Skills ───────────────────────────────────────────────────
  const addSkill = () =>
    onChange({ ...data, skills: [...data.skills, { id: genId(), name: '', level: 'intermediate' }] });

  const updateSkill = (id: string, field: string, value: string) =>
    onChange({ ...data, skills: data.skills.map((s) => (s.id === id ? { ...s, [field]: value } : s)) });

  const removeSkill = (id: string) =>
    onChange({ ...data, skills: data.skills.filter((s) => s.id !== id) });

  // ── Languages ────────────────────────────────────────────────
  const addLanguage = () =>
    onChange({ ...data, languages: [...data.languages, { id: genId(), language: '', proficiency: 'conversational' }] });

  const updateLanguage = (id: string, field: string, value: string) =>
    onChange({ ...data, languages: data.languages.map((l) => (l.id === id ? { ...l, [field]: value } : l)) });

  const removeLanguage = (id: string) =>
    onChange({ ...data, languages: data.languages.filter((l) => l.id !== id) });

  // ── Certifications ───────────────────────────────────────────
  const addCertification = () =>
    onChange({ ...data, certifications: [...data.certifications, { id: genId(), name: '', issuer: '', date: '' }] });

  const updateCertification = (id: string, field: string, value: string) =>
    onChange({ ...data, certifications: data.certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c)) });

  const removeCertification = (id: string) =>
    onChange({ ...data, certifications: data.certifications.filter((c) => c.id !== id) });

  return (
    <>
      {/* Photo crop modal */}
      {cropSrc && (
        <PhotoCropper
          imageSrc={cropSrc}
          accent={scheme.primary}
          onApply={handleCropApply}
          onCancel={() => setCropSrc(null)}
        />
      )}

      <div className="space-y-4">
        {/* ── Personal Info ── */}
        <Section title={t('personalInfo')} icon={User} defaultOpen accent={scheme.primary}>
          {/* Photo upload */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {data.personalInfo.photo ? (
                <div className="relative w-20 h-20">
                  <img
                    src={data.personalInfo.photo}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 cursor-pointer"
                    onClick={() => photoInputRef.current?.click()}
                    title="Click to change photo"
                  />
                  {/* Edit overlay */}
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    className="absolute inset-0 rounded-full bg-black/0 hover:bg-black/30 transition-colors
                               flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer"
                    title={t('photoUpload')}
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                  {/* Remove button */}
                  <button
                    onClick={removePhoto}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full
                               flex items-center justify-center shadow-sm hover:bg-red-600 cursor-pointer z-10"
                    title={t('photoRemove')}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => photoInputRef.current?.click()}
                  className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300
                             flex flex-col items-center justify-center gap-1 hover:border-slate-400
                             transition-all cursor-pointer bg-slate-50 hover:bg-slate-100 group"
                  title={t('photoUpload')}
                >
                  <Camera className="w-6 h-6 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  <span className="text-[9px] text-slate-300 group-hover:text-slate-500 font-medium text-center leading-tight px-1 transition-colors">
                    {t('photoHint')}
                  </span>
                </button>
              )}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoFile}
                className="hidden"
              />
            </div>

            <div className="flex-1 min-w-0 pt-1">
              <p className="text-xs font-semibold text-slate-700 mb-0.5">{t('photo')}</p>
              <p className="text-xs text-slate-400 leading-relaxed mb-2">
                {data.personalInfo.photo ? 'Click photo to change • drag to crop' : t('photoUpload')}
              </p>
              <button
                onClick={() => photoInputRef.current?.click()}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer"
                style={{
                  color: scheme.primary,
                  borderColor: scheme.primaryLight,
                  backgroundColor: scheme.primaryLight,
                }}
              >
                {data.personalInfo.photo ? 'Change photo' : t('photoUpload')}
              </button>
            </div>
          </div>

          {/* Photo shape picker */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">{t('photoShape')}</label>
            <div className="flex gap-2">
              {([
                {
                  shape: 'circle' as PhotoShape,
                  label: t('photoCircle'),
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="7.5" cy="7.5" r="6" />
                    </svg>
                  ),
                },
                {
                  shape: 'rectangle' as PhotoShape,
                  label: t('photoRectangle'),
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="2" y="1.5" width="8" height="12" rx="2" />
                    </svg>
                  ),
                },
              ] as { shape: PhotoShape; label: string; icon: React.ReactNode }[]).map(({ shape, label, icon }) => (
                <button
                  key={shape}
                  type="button"
                  onClick={() => onChange({ ...data, photoShape: shape })}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold
                              transition-all cursor-pointer ${
                    data.photoShape === shape
                      ? 'text-white shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                  style={data.photoShape === shape
                    ? { backgroundColor: scheme.primary, borderColor: scheme.primary }
                    : undefined}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Name & contact fields */}
          <div className="grid grid-cols-2 gap-3">
            <InputField label={t('firstName')} value={data.personalInfo.firstName} onChange={(v) => updatePersonal('firstName', v)} />
            <InputField label={t('lastName')} value={data.personalInfo.lastName} onChange={(v) => updatePersonal('lastName', v)} />
          </div>
          <InputField
            label={t('jobTitle')}
            value={data.personalInfo.jobTitle ?? ''}
            onChange={(v) => updatePersonal('jobTitle', v)}
            placeholder="e.g. Senior Product Manager"
          />
          <div className="grid grid-cols-2 gap-3">
            <InputField label={t('email')} value={data.personalInfo.email} onChange={(v) => updatePersonal('email', v)} type="email" />
            <InputField label={t('phone')} value={data.personalInfo.phone} onChange={(v) => updatePersonal('phone', v)} type="tel" />
            <InputField label={t('address')} value={data.personalInfo.address} onChange={(v) => updatePersonal('address', v)} />
            <InputField label={t('city')} value={data.personalInfo.city} onChange={(v) => updatePersonal('city', v)} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-500">{t('summary')}</label>
              <AIAssistant
                label="✨ AI Generate"
                accent={scheme.primary}
                context={{
                  name: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`.trim(),
                  jobTitle: data.experience[0]?.jobTitle ?? '',
                  company: data.experience[0]?.company ?? '',
                }}
                actions={summaryAIActions}
                onResult={(text) => updatePersonal('summary', text)}
                position="below"
              />
            </div>
            <textarea
              value={data.personalInfo.summary}
              onChange={(e) => updatePersonal('summary', e.target.value)}
              rows={3}
              placeholder="Write a compelling 2–3 sentence overview of your professional profile…"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>
        </Section>

        {/* ── Experience ── */}
        <Section title={t('experience')} icon={Briefcase} defaultOpen={false} accent={scheme.primary}>
          {data.experience.map((exp, index) => (
            <div key={exp.id} className="p-3 border border-slate-100 rounded-xl space-y-3 relative bg-slate-50/50">

              {/* Top-right controls: move up/down + delete */}
              <div className="absolute top-2 right-2 flex items-center gap-0.5">
                <button
                  onClick={() => moveExperience(index, -1)}
                  disabled={index === 0}
                  title={t('moveUp')}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-25
                             disabled:cursor-not-allowed hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveExperience(index, 1)}
                  disabled={index === data.experience.length - 1}
                  title={t('moveDown')}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-25
                             disabled:cursor-not-allowed hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => removeExperience(exp.id)}
                  title="Remove"
                  className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Position index badge */}
              <div
                className="absolute top-2 left-3 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: scheme.primary }}
              >
                {index + 1}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <InputField label={t('jobTitle')} value={exp.jobTitle} onChange={(v) => updateExperience(exp.id, 'jobTitle', v)} />
                <InputField label={t('company')} value={exp.company} onChange={(v) => updateExperience(exp.id, 'company', v)} />
                <InputField label={t('startDate')} value={exp.startDate} onChange={(v) => updateExperience(exp.id, 'startDate', v)} placeholder="MM/YYYY" />
                <div>
                  <InputField
                    label={t('endDate')}
                    value={exp.endDate}
                    onChange={(v) => updateExperience(exp.id, 'endDate', v)}
                    placeholder="MM/YYYY"
                  />
                  <label className="flex items-center gap-1.5 mt-1">
                    <input
                      type="checkbox"
                      checked={exp.present}
                      onChange={(e) => updateExperience(exp.id, 'present', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-xs text-slate-500">{t('present')}</span>
                  </label>
                </div>
              </div>

              {/* Description + style picker */}
              <div className="space-y-2">
                <DescriptionStylePicker
                  value={exp.descriptionStyle}
                  onChange={(s) => updateExperience(exp.id, 'descriptionStyle', s)}
                  accent={scheme.primary}
                />
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-500">{t('description')}</label>
                    <AIAssistant
                      label="✨ AI"
                      accent={scheme.primary}
                      context={{
                        jobTitle: exp.jobTitle,
                        company: exp.company,
                        currentDescription: exp.description,
                      }}
                      actions={buildExperienceAIActions(exp)}
                      onResult={(text) => updateExperience(exp.id, 'description', text)}
                      position="above"
                    />
                  </div>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    rows={4}
                    placeholder={
                      exp.descriptionStyle === 'paragraph'
                        ? 'Describe your role and achievements…'
                        : 'One achievement or task per line…'
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-y
                               focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    {exp.descriptionStyle !== 'paragraph'
                      ? '↩ Each new line becomes a separate item'
                      : 'Free-form paragraph text'}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addExperience}
            className="w-full py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer
                       border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50"
            style={{ color: scheme.primary }}
          >
            {t('addExperience')}
          </button>
        </Section>

        {/* ── Education ── */}
        <Section title={t('education')} icon={GraduationCap} defaultOpen={false} accent={scheme.primary}>
          {data.education.map((edu) => (
            <div key={edu.id} className="p-3 border border-slate-100 rounded-lg space-y-2 relative">
              <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-2 gap-2">
                <InputField label={t('degree')} value={edu.degree} onChange={(v) => updateEducation(edu.id, 'degree', v)} />
                <InputField label={t('school')} value={edu.school} onChange={(v) => updateEducation(edu.id, 'school', v)} />
                <InputField label={t('fieldOfStudy')} value={edu.fieldOfStudy} onChange={(v) => updateEducation(edu.id, 'fieldOfStudy', v)} />
                <div className="grid grid-cols-2 gap-2">
                  <InputField label={t('startDate')} value={edu.startDate} onChange={(v) => updateEducation(edu.id, 'startDate', v)} placeholder="YYYY" />
                  <InputField label={t('endDate')} value={edu.endDate} onChange={(v) => updateEducation(edu.id, 'endDate', v)} placeholder="YYYY" />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={addEducation}
            className="w-full py-2 text-sm font-medium rounded-lg border border-dashed border-slate-300
                       hover:border-slate-400 hover:bg-slate-50 transition-colors cursor-pointer"
            style={{ color: scheme.primary }}
          >
            {t('addEducation')}
          </button>
        </Section>

        {/* ── Skills ── */}
        <Section title={t('skills')} icon={Wrench} defaultOpen={false} accent={scheme.primary}>
          {data.skills.map((skill) => (
            <div key={skill.id} className="flex items-end gap-2">
              <div className="flex-1">
                <InputField label={t('skillName')} value={skill.name} onChange={(v) => updateSkill(skill.id, 'name', v)} />
              </div>
              <div className="w-36">
                <label className="block text-xs font-medium text-slate-500 mb-1">{t('level')}</label>
                <select
                  value={skill.level}
                  onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none bg-white"
                >
                  <option value="beginner">{t('beginner')}</option>
                  <option value="intermediate">{t('intermediate')}</option>
                  <option value="advanced">{t('advanced')}</option>
                  <option value="expert">{t('expert')}</option>
                </select>
              </div>
              <button onClick={() => removeSkill(skill.id)} className="p-2 text-red-400 hover:text-red-600 cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addSkill}
            className="w-full py-2 text-sm font-medium rounded-lg border border-dashed border-slate-300
                       hover:border-slate-400 hover:bg-slate-50 transition-colors cursor-pointer"
            style={{ color: scheme.primary }}
          >
            {t('addSkill')}
          </button>
        </Section>

        {/* ── Languages ── */}
        <Section title={t('languages')} icon={Languages} defaultOpen={false} accent={scheme.primary}>
          {data.languages.map((lang) => (
            <div key={lang.id} className="flex items-end gap-2">
              <div className="flex-1">
                <InputField label={t('language')} value={lang.language} onChange={(v) => updateLanguage(lang.id, 'language', v)} />
              </div>
              <div className="w-40">
                <label className="block text-xs font-medium text-slate-500 mb-1">{t('proficiency')}</label>
                <select
                  value={lang.proficiency}
                  onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none bg-white"
                >
                  <option value="basic">{t('basic')}</option>
                  <option value="conversational">{t('conversational')}</option>
                  <option value="fluent">{t('fluent')}</option>
                  <option value="native">{t('native')}</option>
                </select>
              </div>
              <button onClick={() => removeLanguage(lang.id)} className="p-2 text-red-400 hover:text-red-600 cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addLanguage}
            className="w-full py-2 text-sm font-medium rounded-lg border border-dashed border-slate-300
                       hover:border-slate-400 hover:bg-slate-50 transition-colors cursor-pointer"
            style={{ color: scheme.primary }}
          >
            {t('addLanguage')}
          </button>
        </Section>

        {/* ── Certifications ── */}
        <Section title={t('certifications')} icon={Award} defaultOpen={false} accent={scheme.primary}>
          {data.certifications.map((cert) => (
            <div key={cert.id} className="p-3 border border-slate-100 rounded-lg space-y-2 relative">
              <button onClick={() => removeCertification(cert.id)} className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-3 gap-2">
                <InputField label={t('certName')} value={cert.name} onChange={(v) => updateCertification(cert.id, 'name', v)} />
                <InputField label={t('issuer')} value={cert.issuer} onChange={(v) => updateCertification(cert.id, 'issuer', v)} />
                <InputField label={t('date')} value={cert.date} onChange={(v) => updateCertification(cert.id, 'date', v)} placeholder="YYYY" />
              </div>
            </div>
          ))}
          <button
            onClick={addCertification}
            className="w-full py-2 text-sm font-medium rounded-lg border border-dashed border-slate-300
                       hover:border-slate-400 hover:bg-slate-50 transition-colors cursor-pointer"
            style={{ color: scheme.primary }}
          >
            {t('addCertification')}
          </button>
        </Section>

        {/* ── Save Draft button (bottom of form) ── */}
        {onSave && (
          <button
            onClick={onSave}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold
                       text-white shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
            style={{ backgroundColor: scheme.primary }}
          >
            <Save className="w-4 h-4" />
            {t('saveDraft')}
          </button>
        )}
      </div>
    </>
  );
}
