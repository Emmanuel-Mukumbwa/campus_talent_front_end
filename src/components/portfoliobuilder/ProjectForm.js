// File: src/components/portfoliobuilder/ProjectForm.jsx
import React from 'react';

export default function ProjectForm({
  idx,
  project,
  onFieldChange,
  onEvidenceChange,
  touchedEvidence,
  onEvidenceBlur,
  isValidUrl,
  onRemove
}) {
  const { title, description, evidence, evidenceLabel, isCustom } = project;

  return (
    <div className="mb-3">
      {/* Template selector lives in parent, so we skip it here */}

      <div className="mb-3">
        <label className="form-label">Project Title</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={e => onFieldChange(idx, 'title', e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          rows="3"
          value={description}
          onChange={e => onFieldChange(idx, 'description', e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Evidence ({evidenceLabel})</label>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={evidence[0]}
            onChange={e => onEvidenceChange(idx, 0, e.target.value)}
            onBlur={() => onEvidenceBlur(idx, 0)}
          />
          <span className="input-group-text">
            {touchedEvidence[`${idx}-0`]
              ? isValidUrl(evidence[0])
                ? <i className="bi bi-check-circle-fill text-success" />
                : <i className="bi bi-exclamation-circle-fill text-danger" />
              : <i className="bi bi-exclamation-circle text-muted" />}
          </span>
        </div>
      </div>

      <div className="text-end">
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => onRemove(idx)}
        >
          Remove Project
        </button>
      </div>
    </div>
  );
}
