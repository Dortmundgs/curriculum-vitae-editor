'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Save, Palette, Eye, EyeOff, Paintbrush, Check, Loader2, Trash2, Upload as UploadIcon, KeyRound, Sparkles, X } from 'lucide-react';
import CVEditor from '@/components/CVEditor';
import CVPreview from '@/components/CVPreview';
import DownloadButton from '@/components/DownloadButton';
import UploadCV from '@/components/UploadCV';
import type { CVData } from '@/lib/cv-types';
import { defaultCVData } from '@/lib/cv-types';
import { templates } from '@/lib/templates';
import { colorSchemes } from '@/lib/color-schemes';
import { useColorScheme } from '@/context/ColorSchemeContext';
import db from '@/lib/db';
import { id } from '@instantdb/react';

const DRAFT_KEY = 'cv-builder-draft';

function loadDraft(): CVData {
  if (typeof window === 'undefined') return { ...defaultCVData };
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return { ...defaultCVData };
    const parsed = JSON.parse(raw) as CVData;
    // Back-fill missing fields introduced in new versions
    if (!parsed.personalInfo.photo)    parsed.personalInfo.photo    = '';
    if (!parsed.personalInfo.jobTitle) parsed.personalInfo.jobTitle = '';
    if (!parsed.photoShape) parsed.photoShape = 'circle';
    parsed.experience = parsed.experience.map((e) => ({
      ...e,
      descriptionStyle: e.descriptionStyle ?? 'bullet',
    }));
    return parsed;
  } catch {
    return { ...defaultCVData };
  }
}

function saveDraft(data: CVData) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    // quota exceeded — silently ignore
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch { /* ignore */ }
}

type DraftStatus = 'idle' | 'saving' | 'saved';

export default function EditorPage() {
  const t = useTranslations('editor');
  const tt = useTranslations('templates');
  const [cvData, setCvData] = useState<CVData>({ ...defaultCVData });
  const [showPreview, setShowPreview] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showColorSchemes, setShowColorSchemes] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);
  const [aiKey, setAiKey] = useState('');
  const [aiKeySaved, setAiKeySaved] = useState(false);
  const [cloudSaving, setCloudSaving] = useState(false);
  const [draftStatus, setDraftStatus] = useState<DraftStatus>('idle');
  const previewRef = useRef<HTMLDivElement>(null);
  const draftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { scheme, setSchemeId } = useColorScheme();
  const initialised = useRef(false);

  const { user } = db.useAuth();

  // Restore draft and AI key from localStorage on mount
  useEffect(() => {
    const draft = loadDraft();
    setCvData(draft);
    initialised.current = true;
    const savedKey = localStorage.getItem('cv-ai-key') ?? '';
    setAiKey(savedKey);
  }, []);

  const saveAiKey = () => {
    localStorage.setItem('cv-ai-key', aiKey.trim());
    setAiKeySaved(true);
    setTimeout(() => setAiKeySaved(false), 2500);
  };

  // Auto-save draft to localStorage whenever cvData changes (debounced 800 ms)
  const handleChange = useCallback((data: CVData) => {
    setCvData(data);
    if (!initialised.current) return;

    if (draftTimer.current) clearTimeout(draftTimer.current);
    setDraftStatus('saving');
    draftTimer.current = setTimeout(() => {
      saveDraft(data);
      setDraftStatus('saved');
      setTimeout(() => setDraftStatus('idle'), 2500);
    }, 800);
  }, []);

  // Cloud save (InstantDB — authenticated users only)
  const handleCloudSave = async () => {
    if (!user) return;
    setCloudSaving(true);
    try {
      const cvId = id();
      db.transact(
        db.tx.cvs[cvId]
          .update({
            title: `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName} CV`.trim() || 'My CV',
            templateId: cvData.templateId,
            personalInfo: cvData.personalInfo,
            experience: cvData.experience,
            education: cvData.education,
            skills: cvData.skills,
            languages: cvData.languages,
            certifications: cvData.certifications,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          })
          .link({ owner: user.id })
      );
    } finally {
      setCloudSaving(false);
    }
  };

  const handleUpload = (data: CVData) => {
    setCvData(data);
    saveDraft(data);
    setShowUpload(false);
  };

  const handleClearDraft = () => {
    clearDraft();
    setCvData({ ...defaultCVData });
    setDraftStatus('idle');
  };

  const fullName =
    `${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}`.replace(/\s+/g, '_') || 'my_cv';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Toolbar ── */}
      <div className="sticky top-16 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-4 py-2 flex items-center gap-2 flex-wrap">
          <h1 className="text-lg font-bold text-slate-800 mr-4">{t('title')}</h1>

          <div className="flex items-center gap-2 flex-1 flex-wrap">
            {/* Template picker */}
            <button
              onClick={() => { setShowTemplateSelector(!showTemplateSelector); setShowColorSchemes(false); setShowUpload(false); setShowAISettings(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600
                         border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Palette className="w-4 h-4" />
              {t('chooseTemplate')}
            </button>

            {/* Color scheme picker */}
            <button
              onClick={() => { setShowColorSchemes(!showColorSchemes); setShowTemplateSelector(false); setShowUpload(false); setShowAISettings(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600
                         border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Paintbrush className="w-4 h-4" />
              {t('colorScheme')}
            </button>

            {/* Upload */}
            <button
              onClick={() => { setShowUpload(!showUpload); setShowTemplateSelector(false); setShowColorSchemes(false); setShowAISettings(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600
                         border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <UploadIcon className="w-4 h-4" />
              {t('upload')}
            </button>

            {/* AI Settings */}
            <button
              onClick={() => { setShowAISettings(!showAISettings); setShowTemplateSelector(false); setShowColorSchemes(false); setShowUpload(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg
                         border transition-colors cursor-pointer ${
                showAISettings
                  ? 'text-violet-700 border-violet-300 bg-violet-50'
                  : 'text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              AI Settings
            </button>

            {/* Preview toggle (mobile) */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600
                         border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors lg:hidden cursor-pointer"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {t('preview')}
            </button>
          </div>

          {/* Right side: draft status + clear + cloud save + download */}
          <div className="flex items-center gap-2">
            {/* Draft status badge */}
            {draftStatus !== 'idle' && (
              <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                {draftStatus === 'saving' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                )}
                {draftStatus === 'saving' ? t('autoSaving') : t('autoSaved')}
              </span>
            )}

            {/* Clear draft */}
            <button
              onClick={handleClearDraft}
              title={t('clearDraft')}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg
                         transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Cloud save (only when logged in) */}
            {user && (
              <button
                onClick={handleCloudSave}
                disabled={cloudSaving}
                className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium
                           border rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                style={{ color: scheme.primary, borderColor: scheme.primaryLight, backgroundColor: `${scheme.primaryLight}88` }}
              >
                {cloudSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {t('save')}
              </button>
            )}

            <DownloadButton
              label={t('download')}
              targetId="cv-preview"
              fileName={fullName}
            />
          </div>
        </div>

        {/* Template selector */}
        {showTemplateSelector && (
          <div className="border-t border-slate-100 bg-white px-4 py-3">
            <div className="max-w-[1800px] mx-auto">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {templates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => {
                      handleChange({ ...cvData, templateId: tmpl.id });
                      setShowTemplateSelector(false);
                    }}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                      cvData.templateId === tmpl.id ? 'text-white' : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                    style={cvData.templateId === tmpl.id ? { borderColor: scheme.primary, backgroundColor: scheme.primary } : undefined}
                  >
                    <div className="w-4 h-4 rounded-full inline-block mr-2 align-middle" style={{ backgroundColor: tmpl.primaryColor }} />
                    {tt(tmpl.nameKey as Parameters<typeof tt>[0])}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Color scheme selector */}
        {showColorSchemes && (
          <div className="border-t border-slate-100 bg-white px-4 py-3">
            <div className="max-w-[1800px] mx-auto">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {colorSchemes.map((cs) => (
                  <button
                    key={cs.id}
                    onClick={() => { setSchemeId(cs.id); setShowColorSchemes(false); }}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                               border transition-all cursor-pointer ${
                      cs.id === scheme.id ? 'border-slate-800 shadow-md' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex -space-x-1">
                      <div className="w-5 h-5 rounded-full border-2 border-white" style={{ backgroundColor: cs.primary }} />
                      <div className="w-5 h-5 rounded-full border-2 border-white" style={{ backgroundColor: cs.gradientTo }} />
                    </div>
                    <span className="text-slate-700">{cs.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Upload area */}
        {showUpload && (
          <div className="border-t border-slate-100 bg-white px-4 py-4">
            <div className="max-w-md mx-auto">
              <UploadCV label={t('upload')} onUpload={handleUpload} />
            </div>
          </div>
        )}

        {/* AI Settings panel */}
        {showAISettings && (
          <div className="border-t border-slate-100 bg-white px-4 py-4">
            <div className="max-w-lg mx-auto">
              <div className="flex items-start gap-3 p-4 bg-violet-50 border border-violet-100 rounded-xl">
                <Sparkles className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-violet-900 mb-1">AI Writing Assistant</h3>
                  <p className="text-xs text-violet-700 mb-3 leading-relaxed">
                    Enter your OpenAI API key to enable AI-powered content generation for your CV summary and work experience descriptions.
                    Your key is stored only in your browser.
                  </p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
                      <input
                        type="password"
                        value={aiKey}
                        onChange={(e) => setAiKey(e.target.value)}
                        placeholder="sk-..."
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-violet-200 text-sm
                                   focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 outline-none
                                   bg-white text-slate-800 placeholder:text-slate-400"
                        onKeyDown={(e) => e.key === 'Enter' && saveAiKey()}
                      />
                    </div>
                    <button
                      onClick={saveAiKey}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg
                                 text-white transition-all cursor-pointer active:scale-95"
                      style={{ backgroundColor: '#7c3aed' }}
                    >
                      {aiKeySaved ? <Check className="w-4 h-4" /> : <KeyRound className="w-4 h-4" />}
                      {aiKeySaved ? 'Saved!' : 'Save Key'}
                    </button>
                    {aiKey && (
                      <button
                        onClick={() => { setAiKey(''); localStorage.removeItem('cv-ai-key'); }}
                        title="Clear key"
                        className="p-2 rounded-lg border border-violet-200 text-violet-400
                                   hover:text-violet-600 hover:bg-violet-100 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {aiKey && (
                    <p className="text-[10px] text-violet-500 mt-2 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      API key configured — AI features are ready to use.
                    </p>
                  )}
                  <p className="text-[10px] text-violet-500 mt-1">
                    Get a key at{' '}
                    <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer"
                       className="underline">platform.openai.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Main content ── */}
      <div className="max-w-[1800px] mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Editor panel */}
          <div className={`${showPreview ? 'w-[440px] flex-shrink-0' : 'flex-1 max-w-2xl mx-auto'} overflow-y-auto`}>
            <CVEditor
              data={cvData}
              onChange={handleChange}
              onSave={() => {
                saveDraft(cvData);
                setDraftStatus('saved');
                setTimeout(() => setDraftStatus('idle'), 2500);
              }}
            />
          </div>

          {/* Preview panel */}
          {showPreview && (
            <div className="flex-1 overflow-auto">
              <div className="sticky top-4 flex justify-center">
                <div className="transform scale-[0.58] origin-top-left">
                  <CVPreview ref={previewRef} data={cvData} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
