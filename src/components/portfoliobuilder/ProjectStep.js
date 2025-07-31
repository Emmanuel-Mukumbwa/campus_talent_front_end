// File: src/components/portfoliobuilder/ProjectStep.jsx
import React, { useState, useRef, useEffect } from 'react';
import ProjectForm from './ProjectForm';
import MediaUpload from './MediaUpload';
import { PROJECT_TEMPLATES } from './templates';

const MAX_PROJECTS_PER_SKILL = 2;

export default function ProjectStep({ data, setData, setUploadsInFlight }) {
  const { selectedSkills, projects } = data;
  const [touchedEvidence, setTouchedEvidence] = useState({});
  const [uploads, setUploads] = useState({});
  const projectRefs = useRef({});

  // Whenever uploads change, tell parent if any are still pending/uploading
  useEffect(() => {
    const anyInFlight = Object.values(uploads)
      .flat()
      .some(u => u.status === 'pending' || u.status === 'uploading');
    setUploadsInFlight(anyInFlight);
  }, [uploads, setUploadsInFlight]);

  const isValidUrl = url => {
    try { return ['http:','https:'].includes(new URL(url).protocol); }
    catch { return false; }
  };

  // 2) Field changes
  const onFieldChange = (idx, field, val) => {
    setData(d => ({
      ...d,
      projects: d.projects.map((p, i) =>
        i === idx ? { ...p, [field]: val } : p
      )
    }));
  };

  // 3) Evidence link changes
  const onEvidenceChange = (idx, evIdx, val) => {
    setData(d => ({
      ...d,
      projects: d.projects.map((p, i) => {
        if (i !== idx) return p;
        const newE = [...p.evidence];
        newE[evIdx] = val;
        return { ...p, evidence: newE };
      })
    }));
  };

  // 4) Evidence blur → show validation icon
  const onEvidenceBlur = (idx, evIdx) => {
    setTouchedEvidence(t => ({ ...t, [`${idx}-${evIdx}`]: true }));
  };

  // 5) Append a freshly‑uploaded URL immediately into project.media
  const appendMediaUrl = (idx, url) => {
    setData(d => ({
      ...d,
      projects: d.projects.map((p, i) =>
        i === idx ? { ...p, media: [...(p.media||[]), url] } : p
      )
    }));
  };

  // 6) Remove an existing saved media item
  const removeMedia = (idx, mIdx) => {
    setData(d => ({
      ...d,
      projects: d.projects.map((p, i) =>
        i === idx
          ? { ...p, media: p.media.filter((_, j) => j !== mIdx) }
          : p
      )
    }));
  };

  // 7) Reorder saved media up/down
  const moveMedia = (idx, from, to) => {
    setData(d => ({
      ...d,
      projects: d.projects.map((p, i) => {
        if (i !== idx) return p;
        const m = [...(p.media||[])];
        const [item] = m.splice(from, 1);
        m.splice(to, 0, item);
        return { ...p, media: m };
      })
    }));
  };

  // 8) Remove entire project
  const onRemoveProject = idx => {
    setData(d => ({
      ...d,
      projects: d.projects.filter((_, i) => i !== idx)
    }));
  };

  // 9) Add a new blank project
  const handleAddProject = skill => {
    const newProj = {
      skill,
      title: '',
      description: '',
      evidence: [''],
      evidenceLabel: 'Link',
      isCustom: true,
      media: []
    };
    const oldLength = projects.length;
    setData(d => ({ ...d, projects: [...d.projects, newProj] }));

    // scroll into view for new card
    setTimeout(() => {
      projectRefs.current[oldLength]?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // 10) Change between a template or custom
  const handleTemplateChange = (skill, idx, tmpl) => {
    const tpl = PROJECT_TEMPLATES[skill].find(t => t.label === tmpl);
    setData(d => ({
      ...d,
      projects: d.projects.map((p, i) => {
        if (i !== idx) return p;
        if (tmpl === '__other') {
          return { ...p, title: '', description: '', isCustom: true };
        }
        return {
          ...p,
          title: tpl.label,
          description: tpl.description,
          evidence: [''],
          evidenceLabel: tpl.evidenceLabel,
          isCustom: false
        };
      })
    }));
  };

  return (
    <div className="wizard-card">
      <h5>📁 Project Showcase</h5>
      <small>
        You can upload up to {MAX_PROJECTS_PER_SKILL} projects per skill, then add related media.
      </small>

      {selectedSkills.map(skill => {
        const skillProjects = projects
          .map((p, idx) => ({ ...p, idx }))
          .filter(p => p.skill === skill);

        return (
          <div key={skill} className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6>{skill} Projects</h6>
              <button
                className="btn btn-sm btn-outline-success"
                disabled={skillProjects.length >= MAX_PROJECTS_PER_SKILL}
                onClick={() => handleAddProject(skill)}
              >
                + Add Project
              </button>
            </div>

            {skillProjects.length === 0 && (
              <p className="text-muted">No {skill} projects yet.</p>
            )}

            {skillProjects.map(({ idx }) => {
              const proj = projects[idx];
              return (
                <div
                  key={idx}
                  className="border rounded p-3 mb-4"
                  ref={el => (projectRefs.current[idx] = el)}
                >
                  {/* -- Template selector -- */}
                  <label className="form-label mt-2">Template</label>
                  <select
                    className="form-select mb-3"
                    value={proj.isCustom ? '__other' : proj.title}
                    onChange={e => handleTemplateChange(skill, idx, e.target.value)}
                  >
                    <option value="" disabled>
                      -- Select template or Other --
                    </option>
                    {PROJECT_TEMPLATES[skill].map(tpl => (
                      <option key={tpl.label} value={tpl.label}>
                        {tpl.label}
                      </option>
                    ))}
                    <option value="__other">Other (write your own)</option>
                  </select>

                  {/* -- Project form inputs -- */}
                  <ProjectForm
                    idx={idx}
                    project={proj}
                    onFieldChange={onFieldChange}
                    onEvidenceChange={onEvidenceChange}
                    touchedEvidence={touchedEvidence}
                    onEvidenceBlur={onEvidenceBlur}
                    isValidUrl={isValidUrl}
                    onRemove={onRemoveProject}
                  />

                  {/* -- Media upload & preview -- 
                  <MediaUpload
                    idx={idx}
                    projectId={proj.id}
                    media={proj.media || []}
                    uploads={uploads}
                    setUploads={setUploads}
                    appendMediaUrl={appendMediaUrl}
                    removeMedia={removeMedia}
                    moveMedia={moveMedia}
                  />*/}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
