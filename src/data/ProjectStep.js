// File: src/components/portfoliobuilder/ProjectStep.jsx

import React, { useState, useRef } from 'react';
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaTrash,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { ProgressBar, Button } from 'react-bootstrap';
import { PROJECT_TEMPLATES } from './templates';
import api from '../../utils/api';



const MAX_PROJECTS_PER_SKILL   = 2;
const CONCURRENT_UPLOADS_LIMIT = 3;
const FILE_LIMITS = {
  image:  5 * 1024 * 1024,  // 5 MB
  video: 20 * 1024 * 1024,  // 20 MB
  doc:   10 * 1024 * 1024   // 10 MB
};

const isValidUrl = url => {
  try { return ['http:','https:'].includes(new URL(url).protocol); }
  catch { return false; }
};

function fileCategory(file) {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  return 'doc';
}

function FilePreview({ url, category }) {
  if (category === 'image') {
    return <img src={url} style={{ maxWidth: 100, maxHeight: 100 }} alt="" />;
  }
  if (category === 'video') {
    return (
      <video style={{ maxWidth: 120, maxHeight: 80 }} controls>
        <source src={url} type="video/mp4" />
      </video>
    );
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      View document
    </a>
  );
}

export default function ProjectStep({ data, setData }) {
  const { selectedSkills, projects } = data;
  const [touchedEvidence, setTouchedEvidence] = useState({});
  const [uploads, setUploads] = useState({});
  const projectRefs = useRef({});
  const fileInputs = useRef({});

  // Enqueue new files for upload
  const enqueueFiles = (projIndex, fileList) => {
    console.log('📥 enqueueFiles for projIndex=', projIndex, 'files=', fileList);
    const toAdd = Array.from(fileList)
      .filter(file => {
        const cat = fileCategory(file);
        const limit = FILE_LIMITS[cat] || FILE_LIMITS.doc;
        return file.size <= limit;
      })
      .map(file => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
        status: 'pending',
        progress: 0,
        url: null
      }));
    if (!toAdd.length) return;
    setUploads(u => ({
      ...u,
      [projIndex]: [...(u[projIndex] || []), ...toAdd]
    }));
     // Defer to next tick so state has updated
   setTimeout(() => processQueue(projIndex), 0);
  };

  // Start next upload if under limit
  const processQueue = projIndex => {
    const list = uploads[projIndex] || [];
    const uploadingCount = list.filter(u => u.status === 'uploading').length;
    const pendingItems = list.filter(u => u.status === 'pending');
    if (uploadingCount >= CONCURRENT_UPLOADS_LIMIT || pendingItems.length === 0) return;

    const next = pendingItems[0];
    setUploads(u => ({
      ...u,
      [projIndex]: u[projIndex].map(i =>
        i.id === next.id ? { ...i, status: 'uploading' } : i
      )
    }));
    uploadOne(projIndex, next.id);
  };
  
  // Upload one file to project-specific endpoint
  const uploadOne = async (projIndex, uploadId) => {
    const item = (uploads[projIndex] || []).find(u => u.id === uploadId);
    console.log('🔄 uploadOne called for', { projIndex, uploadId, uploads, projects });
    const projectId = projects[projIndex]?.id;
    console.log('   → resolved item?', !!item, 'projectId=', projectId);
    if (!item || !projectId) return;

    const form = new FormData();
    form.append('attachments', item.file);

    try {
      const resp = await api.post(
        `/api/student/portfolio/${projectId}/attachments`,
        form,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: ev => {
            const pct = Math.round((ev.loaded / ev.total) * 100);
            setUploads(u => ({
              ...u,
              [projIndex]: u[projIndex].map(i =>
                i.id === uploadId ? { ...i, progress: pct } : i
              )
            }));
          }
        }
      );

      const [finalUrl] = resp.data.attachments;

      // Mark done in upload queue
      setUploads(u => ({
        ...u,
        [projIndex]: u[projIndex].map(i =>
          i.id === uploadId
            ? { ...i, status: 'done', url: finalUrl, progress: 100 }
            : i
        )
      }));

      // Persist into project data so preview survives step navigation
      setData(d => ({
        ...d,
        projects: d.projects.map((p, idx) =>
          idx === projIndex
            ? { ...p, media: [...(p.media || []), finalUrl] }
            : p
        )
      }));
    } catch {
      setUploads(u => ({
        ...u,
        [projIndex]: u[projIndex].map(i =>
          i.id === uploadId ? { ...i, status: 'error' } : i
        )
      }));
    } finally {
      setTimeout(() => processQueue(projIndex), 0);
    }
  };

  // Retry a failed upload
  const retryUpload = (projIndex, uploadId) => {
    setUploads(u => ({
      ...u,
      [projIndex]: u[projIndex].map(i =>
        i.id === uploadId ? { ...i, status: 'pending', progress: 0 } : i
      )
    }));
    processQueue(projIndex);
  };

  // Scroll to a project card
  const scrollToProject = idx => {
    projectRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Handler: add new blank project
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
    setData(d => ({ ...d, projects: [...d.projects, newProj] }));
    setTimeout(() => scrollToProject(projects.length), 100);
  };

  // Handler: change template or switch to custom
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

  // Handler: field changes (title, description)
  const handleFieldChange = (idx, field, val) => {
    setData(d => ({
      ...d,
      projects: d.projects.map((p, i) =>
        i === idx ? { ...p, [field]: val } : p
      )
    }));
  };

  // Handler: evidence link changes
  const handleEvidenceChange = (idx, evIdx, val) => {
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

  // Handler: evidence input blur for validation icon
  const handleEvidenceBlur = (idx, evIdx) => {
    setTouchedEvidence(t => ({ ...t, [`${idx}-${evIdx}`]: true }));
  };

  // Handler: remove entire project
  const handleRemoveProject = idx => {
    setData(d => ({
      ...d,
      projects: d.projects.filter((_, i) => i !== idx)
    }));
  };

  // Handler: drag over to allow drop
  const handleDragOver = e => {
    e.preventDefault();
  };

  // Handler: drop files
  const handleDrop = (e, idx) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) {
      enqueueFiles(idx, e.dataTransfer.files);
    }
  };

  // Remove a saved media item
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

  // Move saved media up/down
  const moveMedia = (idx, from, to) => {
    setData(d => ({
      ...d,
      projects: d.projects.map((p, i) => {
        if (i !== idx) return p;
        const m = [...(p.media || [])];
        const [item] = m.splice(from, 1);
        m.splice(to, 0, item);
        return { ...p, media: m };
      })
    }));
  };

  return (
    <div className="wizard-card">
      <h5>📁 Project Showcase</h5>
      <small>
        You can upload up to {MAX_PROJECTS_PER_SKILL} projects per skill. Then upload related media.
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

            {skillProjects.map(({ idx, title, description, evidence, evidenceLabel, isCustom, media = [] }) => {
              const queue = uploads[idx] || [];

              return (
                <div
                  key={idx}
                  className="border rounded p-3 mb-4"
                  ref={el => (projectRefs.current[idx] = el)}
                  onDragOver={handleDragOver}
                  onDrop={e => handleDrop(e, idx)}
                >
                  {/* Template selector */}
                  <label className="form-label mt-2">Template</label>
                  <select
                    className="form-select mb-3"
                    value={isCustom ? '__other' : title}
                    onChange={e => handleTemplateChange(skill, idx, e.target.value)}
                  >
                    <option value="" disabled>-- Select template or Other --</option>
                    {PROJECT_TEMPLATES[skill].map(tpl => (
                      <option key={tpl.label} value={tpl.label}>{tpl.label}</option>
                    ))}
                    <option value="__other">Other (write your own)</option>
                  </select>

                  {/* Title input */}
                  <div className="mb-3">
                    <label className="form-label">Project Title</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter project title"
                      value={title}
                      onChange={e => handleFieldChange(idx, 'title', e.target.value)}
                    />
                  </div>

                  {/* Description textarea */}
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Describe your project…"
                      value={description}
                      onChange={e => handleFieldChange(idx, 'description', e.target.value)}
                    />
                  </div>

                  {/* Evidence input */}
                  <div className="mb-3">
                    <label className="form-label">Evidence ({evidenceLabel})</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={evidenceLabel}
                        value={evidence[0]}
                        onChange={e => handleEvidenceChange(idx, 0, e.target.value)}
                        onBlur={() => handleEvidenceBlur(idx, 0)}
                      />
                      <span className="input-group-text">
                        {touchedEvidence[`${idx}-0`]
                          ? isValidUrl(evidence[0])
                            ? <FaCheckCircle />
                            : <FaExclamationCircle className="text-danger" />
                          : <FaExclamationCircle className="text-muted" />}
                      </span>
                    </div>
                  </div>

                  {/* Media Upload section */}
                  <div className="mb-3">
                    <label className="form-label">Upload Media</label>
                    <div
                      className="border p-3 text-center mb-2"
                      style={{ background: '#f8f9fa', cursor: 'pointer' }}
                      onClick={() => fileInputs.current[idx].click()}
                    >
                      Drag &amp; drop files here, or click to select
                    </div>
                    <input
                      type="file"
                      multiple
                      style={{ display: 'none' }}
                      ref={el => (fileInputs.current[idx] = el)}
                      onChange={e => enqueueFiles(idx, e.target.files)}
                    />

                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {/* In‑flight uploads */}
                      {queue.map(item => {
                        const cat = item.status === 'done'
                          ? fileCategory({ type: item.url.endsWith('.mp4') ? 'video/mp4' : 'image/jpg' })
                          : fileCategory(item.file);

                        return (
                          <div key={item.id} className="position-relative">
                            {item.status === 'done'
                              ? <FilePreview url={item.url} category={cat} />
                              : <img
                                  src={item.preview}
                                  style={{
                                    maxWidth: 100,
                                    maxHeight: 100,
                                    opacity: item.status === 'error' ? 0.5 : 1
                                  }}
                                  alt=""
                                />
                            }
                            <div style={{ width: 100, marginTop: 4 }}>
                              {item.status === 'uploading' && (
                                <ProgressBar now={item.progress} label={`${item.progress}%`} striped />
                              )}
                              {item.status === 'error' && (
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() => retryUpload(idx, item.id)}
                                >
                                  ⚠️ Retry
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Already‑saved media */}
                      {media.map((url, mIdx) => {
                        const cat = fileCategory({ type: url.endsWith('.mp4') ? 'video/mp4' : 'image/jpg' });
                        return (
                          <div key={mIdx} className="position-relative">
                            <FilePreview url={url} category={cat} />
                            <div className="d-flex position-absolute top-0 end-0">
                              <button
                                className="btn btn-sm btn-light"
                                onClick={() => moveMedia(idx, mIdx, mIdx - 1)}
                                disabled={mIdx === 0}
                              ><FaArrowUp /></button>
                              <button
                                className="btn btn-sm btn-light"
                                onClick={() => moveMedia(idx, mIdx, mIdx + 1)}
                                disabled={mIdx === media.length - 1}
                              ><FaArrowDown /></button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => removeMedia(idx, mIdx)}
                              ><FaTrash /></button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Remove project button */}
                  <div className="text-end">
                    <Button variant="outline-danger" size="sm" onClick={() => handleRemoveProject(idx)}>
                      Remove Project
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
