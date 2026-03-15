'use client';

import { forwardRef } from 'react';
import type { CVData, PhotoShape } from '@/lib/cv-types';
import { formatDescription } from '@/lib/cv-types';
import { getTemplate } from '@/lib/templates';

interface CVPreviewProps {
  data: CVData;
  /** DOM id for the preview root element. Defaults to 'cv-preview'. Pass undefined to omit. */
  htmlId?: string | null;
}

// ── Photo size presets ───────────────────────────────────────────────────────
const PHOTO_SIZES = {
  header:  { circle: 76,  rectW: 58,  rectH: 78  },
  sidebar: { circle: 84,  rectW: 64,  rectH: 88  },
} as const;

type PhotoContext = keyof typeof PHOTO_SIZES;

/** Returns the CSS borderRadius string for a given shape */
function shapeRadius(shape: PhotoShape, rectRadius = '8px') {
  return shape === 'circle' ? '50%' : rectRadius;
}

/** Compute initials from name, or fall back to a person SVG placeholder */
function initials(first: string, last: string): string {
  return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase() || '?';
}

/** Render the profile photo or a styled placeholder */
function PhotoArea({
  src,
  shape,
  context,
  borderColor,
  firstName,
  lastName,
  dark = false,
}: {
  src: string;
  shape: PhotoShape;
  context: PhotoContext;
  borderColor: string;
  firstName: string;
  lastName: string;
  dark?: boolean;
}) {
  const sizes = PHOTO_SIZES[context];
  const w = shape === 'circle' ? sizes.circle : sizes.rectW;
  const h = shape === 'circle' ? sizes.circle : sizes.rectH;
  const radius = shapeRadius(shape);

  const containerStyle: React.CSSProperties = {
    width: `${w}px`,
    height: `${h}px`,
    borderRadius: radius,
    overflow: 'hidden',
    flexShrink: 0,
    border: `3px solid ${dark ? 'rgba(255,255,255,0.45)' : borderColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: dark ? 'rgba(255,255,255,0.12)' : `${borderColor}12`,
  };

  if (src) {
    return (
      <div style={containerStyle}>
        <img
          src={src}
          alt="Profile"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
    );
  }

  // Placeholder — dashed border + initials
  return (
    <div
      style={{
        ...containerStyle,
        border: `2px dashed ${dark ? 'rgba(255,255,255,0.35)' : borderColor + '55'}`,
        backgroundColor: dark ? 'rgba(255,255,255,0.08)' : `${borderColor}08`,
      }}
    >
      <span
        style={{
          fontSize: `${Math.round(w * 0.34)}px`,
          fontWeight: 700,
          color: dark ? 'rgba(255,255,255,0.5)' : `${borderColor}70`,
          letterSpacing: '-0.02em',
          userSelect: 'none',
        }}
      >
        {initials(firstName, lastName)}
      </span>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(({ data, htmlId = 'cv-preview' }, ref) => {
  const template = getTemplate(data.templateId);
  const { personalInfo, experience, education, skills, languages, certifications } = data;
  const photoShape = data.photoShape ?? 'circle';
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();

  const sectionTitleStyle: React.CSSProperties = {
    color: template.primaryColor,
    borderBottom: `2px solid ${template.secondaryColor}`,
    paddingBottom: '4px',
    marginBottom: '12px',
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  };

  /** Render description lines with chosen icon style */
  const renderDescription = (exp: CVData['experience'][0]) => {
    const lines = formatDescription(exp.description, exp.descriptionStyle);
    if (!lines.length) return null;

    if (exp.descriptionStyle === 'paragraph') {
      return (
        <p style={{ fontSize: '11px', color: '#64748b', marginTop: '5px', lineHeight: 1.55 }}>
          {lines.join(' ')}
        </p>
      );
    }

    return (
      <ul style={{ marginTop: '5px', paddingLeft: 0, listStyle: 'none' }}>
        {lines.map((line, i) => (
          <li key={i} style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.55, marginBottom: '2px' }}>
            <span style={{ whiteSpace: 'pre-wrap' }}>{line}</span>
          </li>
        ))}
      </ul>
    );
  };

  // ── Sidebar (Modern / Tech templates) ───────────────────────────────────
  const renderSidebar = () => (
    <div
      style={{
        backgroundColor: template.primaryColor,
        color: '#ffffff',
        padding: '24px 16px',
        width: '35%',
        minHeight: '100%',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Profile photo — always shown */}
      <div style={{ marginBottom: '14px' }}>
        <PhotoArea
          src={personalInfo.photo}
          shape={photoShape}
          context="sidebar"
          borderColor={template.accentColor}
          firstName={personalInfo.firstName}
          lastName={personalInfo.lastName}
          dark
        />
      </div>

      {/* Name */}
      <div style={{ marginBottom: '18px', textAlign: 'center', width: '100%' }}>
        <div style={{ fontSize: '17px', fontWeight: 700, lineHeight: 1.25, wordBreak: 'break-word' }}>
          {fullName || 'Your Name'}
        </div>
      </div>

      {/* Contact */}
      {(personalInfo.email || personalInfo.phone || personalInfo.city) && (
        <div style={{ marginBottom: '18px', width: '100%' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', opacity: 0.72 }}>
            Contact
          </div>
          {personalInfo.email   && <div style={{ fontSize: '10px', marginBottom: '3px', wordBreak: 'break-all' }}>{personalInfo.email}</div>}
          {personalInfo.phone   && <div style={{ fontSize: '10px', marginBottom: '3px' }}>{personalInfo.phone}</div>}
          {personalInfo.city    && <div style={{ fontSize: '10px', marginBottom: '3px' }}>{personalInfo.city}</div>}
          {personalInfo.address && <div style={{ fontSize: '10px' }}>{personalInfo.address}</div>}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ marginBottom: '18px', width: '100%' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', opacity: 0.72 }}>
            Skills
          </div>
          {skills.map((s) => (
            <div key={s.id} style={{ fontSize: '10px', marginBottom: '7px' }}>
              <div style={{ marginBottom: '2px' }}>{s.name}</div>
              <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: '2px' }}>
                <div style={{
                  height: '100%', borderRadius: '2px',
                  backgroundColor: template.accentColor,
                  width: s.level === 'expert' ? '100%' : s.level === 'advanced' ? '75%' : s.level === 'intermediate' ? '50%' : '25%',
                }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div style={{ width: '100%' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', opacity: 0.72 }}>
            Languages
          </div>
          {languages.map((l) => (
            <div key={l.id} style={{ fontSize: '10px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
              <span>{l.language}</span>
              <span style={{ opacity: 0.68 }}>{l.proficiency}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── Header variants for no-sidebar templates ────────────────────────────
  const headerVariant = template.headerVariant ?? 'standard';
  const isCenter = template.headerStyle === 'center';

  const renderHeader = () => {
    if (headerVariant === 'filled') {
      // Full-bleed colored block — negative margins compensate for container padding
      return (
        <div
          style={{
            margin: '-28px -32px 20px -32px',
            padding: '24px 32px',
            backgroundColor: template.primaryColor,
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            flexDirection: isCenter ? 'column' : 'row',
            textAlign: isCenter ? 'center' : 'left',
          }}
        >
          <PhotoArea
            src={personalInfo.photo}
            shape={photoShape}
            context="header"
            borderColor={template.accentColor}
            firstName={personalInfo.firstName}
            lastName={personalInfo.lastName}
            dark
          />
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '26px', fontWeight: 800,
              color: '#ffffff',
              fontFamily: template.fontFamily,
              lineHeight: 1.1,
            }}>
              {fullName || 'Your Name'}
            </div>
            <div style={{
              fontSize: '11px', color: 'rgba(255,255,255,0.78)', marginTop: '7px',
              display: 'flex', gap: '14px', flexWrap: 'wrap',
              justifyContent: isCenter ? 'center' : 'flex-start',
            }}>
              {personalInfo.email   && <span>{personalInfo.email}</span>}
              {personalInfo.phone   && <span>{personalInfo.phone}</span>}
              {personalInfo.city    && <span>{personalInfo.city}</span>}
              {personalInfo.address && <span>{personalInfo.address}</span>}
            </div>
          </div>
        </div>
      );
    }

    if (headerVariant === 'accent-bar') {
      return (
        <div
          style={{
            marginBottom: '20px',
            paddingBottom: '14px',
            paddingLeft: '14px',
            borderLeft: `5px solid ${template.primaryColor}`,
            borderBottom: `1px solid #e2e8f0`,
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            flexDirection: isCenter ? 'column' : 'row',
            textAlign: isCenter ? 'center' : 'left',
          }}
        >
          <PhotoArea
            src={personalInfo.photo}
            shape={photoShape}
            context="header"
            borderColor={template.primaryColor}
            firstName={personalInfo.firstName}
            lastName={personalInfo.lastName}
          />
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '26px', fontWeight: 800,
              color: template.primaryColor,
              fontFamily: template.fontFamily,
              lineHeight: 1.1,
            }}>
              {fullName || 'Your Name'}
            </div>
            <div style={{
              fontSize: '11px', color: '#64748b', marginTop: '6px',
              display: 'flex', gap: '14px', flexWrap: 'wrap',
              justifyContent: isCenter ? 'center' : 'flex-start',
            }}>
              {personalInfo.email   && <span>{personalInfo.email}</span>}
              {personalInfo.phone   && <span>{personalInfo.phone}</span>}
              {personalInfo.city    && <span>{personalInfo.city}</span>}
              {personalInfo.address && <span>{personalInfo.address}</span>}
            </div>
          </div>
        </div>
      );
    }

    // standard
    return (
      <div
        style={{
          marginBottom: '20px',
          paddingBottom: '14px',
          borderBottom: `3px solid ${template.primaryColor}`,
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          flexDirection: isCenter ? 'column' : 'row',
          textAlign: isCenter ? 'center' : 'left',
        }}
      >
        <PhotoArea
          src={personalInfo.photo}
          shape={photoShape}
          context="header"
          borderColor={template.primaryColor}
          firstName={personalInfo.firstName}
          lastName={personalInfo.lastName}
        />
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '26px', fontWeight: 800,
            color: template.primaryColor,
            fontFamily: template.fontFamily,
            lineHeight: 1.1,
          }}>
            {fullName || 'Your Name'}
          </div>
          <div style={{
            fontSize: '11px', color: '#64748b', marginTop: '6px',
            display: 'flex', gap: '14px', flexWrap: 'wrap',
            justifyContent: isCenter ? 'center' : 'flex-start',
          }}>
            {personalInfo.email   && <span>{personalInfo.email}</span>}
            {personalInfo.phone   && <span>{personalInfo.phone}</span>}
            {personalInfo.city    && <span>{personalInfo.city}</span>}
            {personalInfo.address && <span>{personalInfo.address}</span>}
          </div>
        </div>
      </div>
    );
  };

  // ── Main content (all templates) ────────────────────────────────────────
  const renderMainContent = (inSidebar: boolean) => (
    <div style={{ padding: inSidebar ? '24px 20px' : '28px 32px', flex: 1, minWidth: 0 }}>

      {/* Header — only for no-sidebar templates */}
      {!inSidebar && renderHeader()}

      {/* Summary */}
      {personalInfo.summary && (
        <div style={{ marginBottom: '18px' }}>
          <div style={sectionTitleStyle}>Profile</div>
          <p style={{ fontSize: '11px', lineHeight: 1.6, color: '#475569' }}>{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <div style={sectionTitleStyle}>Experience</div>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{exp.jobTitle}</div>
                <div style={{ fontSize: '10px', color: '#94a3b8', flexShrink: 0 }}>
                  {exp.startDate}{exp.startDate ? ' — ' : ''}{exp.present ? 'Present' : exp.endDate}
                </div>
              </div>
              <div style={{ fontSize: '11px', color: template.secondaryColor, fontWeight: 600 }}>{exp.company}</div>
              {renderDescription(exp)}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <div style={sectionTitleStyle}>Education</div>
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{edu.degree}</div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                  {edu.startDate}{edu.startDate ? ' — ' : ''}{edu.endDate}
                </div>
              </div>
              <div style={{ fontSize: '11px', color: template.secondaryColor, fontWeight: 600 }}>{edu.school}</div>
              {edu.fieldOfStudy && (
                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{edu.fieldOfStudy}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills — no-sidebar only */}
      {!inSidebar && skills.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <div style={sectionTitleStyle}>Skills</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {skills.map((s) => (
              <span key={s.id} style={{
                fontSize: '10px', padding: '3px 9px',
                backgroundColor: `${template.secondaryColor}15`,
                color: template.secondaryColor,
                borderRadius: '4px', fontWeight: 600,
              }}>
                {s.name}{s.level ? ` · ${s.level}` : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages — no-sidebar only */}
      {!inSidebar && languages.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <div style={sectionTitleStyle}>Languages</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {languages.map((l) => (
              <span key={l.id} style={{ fontSize: '11px', color: '#475569' }}>
                <strong>{l.language}</strong> — {l.proficiency}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div>
          <div style={sectionTitleStyle}>Certifications</div>
          {certifications.map((c) => (
            <div key={c.id} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b' }}>{c.name}</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>{c.issuer}</div>
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8', flexShrink: 0 }}>{c.date}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── Timeline layout (Europa / Hamburg / Berlin / Nordic) ────────────────
  const tlSection: React.CSSProperties = {
    color: template.primaryColor,
    borderBottom: `2px solid ${template.primaryColor}`,
    paddingBottom: '5px',
    marginBottom: '13px',
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  };

  const TL_DATE_W = '27%';

  const resolvedId = htmlId ?? undefined;

  const renderTimelineLayout = () => (
    <div
      ref={ref}
      id={resolvedId}
      style={{
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: '#ffffff',
        fontFamily: template.fontFamily,
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        overflow: 'hidden',
        display: 'block',
      }}
    >
      {/* ── Full-width header ── */}
      <div
        style={{
          backgroundColor: template.primaryColor,
          padding: '22px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        {/* Left: photo + name + job title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
          <PhotoArea
            src={personalInfo.photo}
            shape={photoShape}
            context="header"
            borderColor={template.accentColor}
            firstName={personalInfo.firstName}
            lastName={personalInfo.lastName}
            dark
          />
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: '24px', fontWeight: 800, color: '#ffffff',
              fontFamily: template.fontFamily, lineHeight: 1.15,
              wordBreak: 'break-word',
            }}>
              {fullName || 'Your Name'}
            </div>
            {personalInfo.jobTitle && (
              <div style={{
                fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.82)',
                textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '5px',
              }}>
                {personalInfo.jobTitle}
              </div>
            )}
          </div>
        </div>

        {/* Right: contact info with icons */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '7px',
          fontSize: '10.5px', color: 'rgba(255,255,255,0.88)',
          flexShrink: 0, maxWidth: '42%',
        }}>
          {personalInfo.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span style={{ fontSize: '11px', opacity: 0.75 }}>✉</span>
              <span style={{ wordBreak: 'break-all' }}>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span style={{ fontSize: '11px', opacity: 0.75 }}>✆</span>
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {(personalInfo.address || personalInfo.city) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span style={{ fontSize: '11px', opacity: 0.75 }}>⊙</span>
              <span>{[personalInfo.address, personalInfo.city].filter(Boolean).join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '22px 32px' }}>

        {/* Summary / Profile */}
        {personalInfo.summary && (
          <div style={{ marginBottom: '18px' }}>
            <div style={tlSection}>Profile</div>
            <p style={{ fontSize: '11px', lineHeight: 1.65, color: '#475569' }}>
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Experience — date | content */}
        {experience.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <div style={tlSection}>Experience</div>
            {experience.map((exp) => (
              <div key={exp.id} style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
                {/* Date column */}
                <div style={{
                  width: TL_DATE_W, flexShrink: 0,
                  fontSize: '10px', color: '#64748b', paddingTop: '2px', lineHeight: 1.4,
                }}>
                  {exp.startDate && <div>{exp.startDate}</div>}
                  {(exp.endDate || exp.present) && (
                    <div>{exp.present ? 'Present' : exp.endDate}</div>
                  )}
                </div>
                {/* Content column */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>
                    {exp.jobTitle}
                  </div>
                  {exp.company && (
                    <div style={{ fontSize: '11px', color: template.secondaryColor, fontWeight: 500, marginTop: '2px' }}>
                      {exp.company}
                    </div>
                  )}
                  {renderDescription(exp)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education — date | content */}
        {education.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <div style={tlSection}>Education</div>
            {education.map((edu) => (
              <div key={edu.id} style={{ display: 'flex', gap: '14px', marginBottom: '12px' }}>
                <div style={{
                  width: TL_DATE_W, flexShrink: 0,
                  fontSize: '10px', color: '#64748b', paddingTop: '2px',
                }}>
                  {edu.endDate || edu.startDate}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{edu.degree}</div>
                  {edu.school && (
                    <div style={{ fontSize: '11px', color: template.secondaryColor, fontWeight: 500, marginTop: '2px' }}>
                      {edu.school}
                    </div>
                  )}
                  {edu.fieldOfStudy && (
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{edu.fieldOfStudy}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills — bordered pill badges */}
        {skills.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <div style={tlSection}>Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {skills.map((s) => (
                <span key={s.id} style={{
                  fontSize: '10px', padding: '4px 12px',
                  border: `1px solid ${template.primaryColor}`,
                  color: template.primaryColor,
                  borderRadius: '3px',
                  fontWeight: 500,
                  display: 'inline-block',
                }}>
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages — name | proficiency */}
        {languages.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <div style={tlSection}>Languages</div>
            {languages.map((l) => (
              <div key={l.id} style={{
                display: 'flex', gap: '14px', marginBottom: '5px', fontSize: '11px',
              }}>
                <div style={{ width: TL_DATE_W, flexShrink: 0, fontWeight: 700, color: '#1e293b' }}>
                  {l.language}
                </div>
                <div style={{ flex: 1, color: '#64748b' }}>{l.proficiency}</div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications — date | name + issuer */}
        {certifications.length > 0 && (
          <div>
            <div style={tlSection}>Certifications</div>
            {certifications.map((c) => (
              <div key={c.id} style={{ display: 'flex', gap: '14px', marginBottom: '8px' }}>
                <div style={{
                  width: TL_DATE_W, flexShrink: 0,
                  fontSize: '10px', color: '#64748b', paddingTop: '2px',
                }}>
                  {c.date}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b' }}>{c.name}</div>
                  {c.issuer && (
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '1px' }}>{c.issuer}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ── Route to correct layout ──────────────────────────────────────────────
  if (template.layout === 'timeline') {
    return renderTimelineLayout();
  }

  const hasSidebar = template.sidebarPosition !== 'none';

  return (
    <div
      ref={ref}
      id={resolvedId}
      style={{
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: '#ffffff',
        fontFamily: template.fontFamily,
        display: 'flex',
        flexDirection: template.sidebarPosition === 'right' ? 'row-reverse' : 'row',
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        overflow: 'hidden',
      }}
    >
      {hasSidebar && renderSidebar()}
      {renderMainContent(hasSidebar)}
    </div>
  );
});

CVPreview.displayName = 'CVPreview';

export default CVPreview;
