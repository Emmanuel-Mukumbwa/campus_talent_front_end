// File: src/pages/EndorseWizard.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
  FaListAlt,
  FaLink,
  FaPenNib,
  FaEye,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import './PortfolioBuilder.css';

const STEPS = [
  'Skill Selection',
  'Evidence',
  'Write Review',
  'Preview & Submit'
];

const STEP_ICONS = [
  <FaListAlt className="me-2 text-success" key="icon-1" />,
  <FaLink className="me-2 text-success" key="icon-2" />,
  <FaPenNib className="me-2 text-success" key="icon-3" />,
  <FaEye className="me-2 text-success" key="icon-4" />,
];

const INITIAL_DATA = {
  selectedSkills: [],
  evidenceLink: '',
  reviewText: '',
  endorserRole: localStorage.getItem('userRole') || '',
};

export default function EndorseWizard() {
  const { studentId } = useParams();
  const { state }     = useLocation();
  const navigate      = useNavigate();

  const [studentName, setStudentName] = useState(state?.studentName || '');
  const totalSteps = STEPS.length;

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_DATA);
  const [availableSkills, setAvailableSkills] = useState(null);
  const [endorsedSkills, setEndorsedSkills]   = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitError, setSubmitError]           = useState('');

  // Fetch student name if needed
  useEffect(() => {
    if (!studentName) {
      api.get(`/api/students/${studentId}`)
        .then(res => setStudentName(res.data.name))
        .catch(() => setStudentName('Student'));
    }
  }, [studentId, studentName]);

  // Fetch portfolio skills
  useEffect(() => {
    api.get(`/api/students/${studentId}/portfolio/skills`)
      .then(({ data }) => setAvailableSkills(data.skills))
      .catch(() => setAvailableSkills([]));
  }, [studentId]);

  // Fetch skills this user has already endorsed
  useEffect(() => {
    api.get(`/api/students/${studentId}/endorsements/me`)
      .then(({ data }) => setEndorsedSkills(data))
      .catch(() => setEndorsedSkills([]));
  }, [studentId]);

  const validate = () => {
    const errs = {};
    if (step === 1) {
      if (availableSkills?.length === 0) {
        errs.noSkills = 'This student has no skills to endorse.';
      } else if (form.selectedSkills.length === 0) {
        errs.selectedSkills = 'Select at least one skill';
      }
    }
    if (step === 2 && !form.evidenceLink.startsWith('http')) {
      errs.evidenceLink = 'Evidence link must start with http';
    }
    if (step === 3 && form.reviewText.trim().length < 120) {
      errs.reviewText = 'Review must be at least 120 characters';
    }
    return errs;
  };

  const isValid = () => Object.keys(validate()).length === 0;

  const allAlreadyEndorsed = () =>
    availableSkills &&
    endorsedSkills &&
    availableSkills.every(({ name }) => endorsedSkills.includes(name));

  const handleNext = async () => {
    if (!isValid()) return;
    if (step < totalSteps) {
      setStep(s => s + 1);
      return;
    }
    setSubmitError('');
    const skillMap = {
      Coding:            'Coding',
      'Video Production':'Video',
      'Graphics Design': 'Design',
      'Research Writing':'Research',
      Tutoring:          'Tutoring',
    };
    const payload = {
      selectedSkills: form.selectedSkills.map(s => skillMap[s] || s),
      evidenceLink:   form.evidenceLink,
      reviewText:     form.reviewText,
      endorserRole:   form.endorserRole,
    };
    try {
      await api.post(`/api/students/${studentId}/endorse`, payload);
      setShowSuccessModal(true);
    } catch {
      setSubmitError('Failed to send endorsement. Please try again.');
    }
  };

  const handleBack = () => step > 1 && setStep(s => s - 1);

  const renderStepContent = () => {
    const errors = validate();
    switch (step) {
      case 1:
        if (availableSkills === null || endorsedSkills === null) {
          return <p>Loading skills…</p>;
        }
        if (availableSkills.length === 0) {
          return (
            <div className="alert alert-warning">
              This student hasn’t registered any skills in their portfolio.
            </div>
          );
        }
        if (allAlreadyEndorsed()) {
          return (
            <div className="alert alert-info">
              You’ve already endorsed all of this student’s skills.
            </div>
          );
        }
        return (
          <div className="mt-3">
            <div className="core-skills-list">
              {availableSkills.map(({ id, name }) => {
                const disabled = endorsedSkills.includes(name);
                return (
                  <label
                    key={id}
                    className={`form-check me-3${disabled ? ' text-muted' : ''}`}
                    title={disabled ? 'You already endorsed this skill' : ''}
                  >
                    <input
                      type="checkbox"
                      className="form-check-input"
                      disabled={disabled}
                      checked={form.selectedSkills.includes(name)}
                      onChange={() => {
                        const next = form.selectedSkills.includes(name)
                          ? form.selectedSkills.filter(s => s !== name)
                          : [...form.selectedSkills, name];
                        setForm({ ...form, selectedSkills: next });
                      }}
                    />
                    <span className="form-check-label">{name}</span>
                  </label>
                );
              })}
            </div>
            {errors.selectedSkills && (
              <div className="text-danger mt-1">{errors.selectedSkills}</div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="mt-3">
            <label>Evidence Link</label>
            <input
              type="url"
              className={`form-control ${errors.evidenceLink ? 'is-invalid' : ''}`}
              placeholder="https://github.com/…"
              value={form.evidenceLink}
              onChange={e => setForm({ ...form, evidenceLink: e.target.value })}
            />
            {errors.evidenceLink && (
              <div className="invalid-feedback">{errors.evidenceLink}</div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="mt-3">
            <label>Write Review (min 120 chars)</label>
            <textarea
              className="form-control"
              rows="6"
              value={form.reviewText}
              onChange={e => setForm({ ...form, reviewText: e.target.value })}
            />
            <small className={form.reviewText.length < 120 ? 'text-danger' : 'text-success'}>
              {form.reviewText.length} / 120
            </small>
            {errors.reviewText && (
              <div className="text-danger">{errors.reviewText}</div>
            )}
          </div>
        );

      case 4:
        // Split on empty lines or single newlines
        const paragraphs = form.reviewText.split(/\n+/).map((p, i) => p.trim()).filter(Boolean);
        return (
          <div className="mt-3">
            <dl className="row">
              <dt className="col-sm-4">To</dt>
              <dd className="col-sm-8">{studentName}</dd>

              <dt className="col-sm-4">Skills</dt>
              <dd className="col-sm-8">{form.selectedSkills.join(', ')}</dd>

              <dt className="col-sm-4">Evidence</dt>
              <dd className="col-sm-8">
                {form.evidenceLink
                  ? <a href={form.evidenceLink} target="_blank" rel="noopener noreferrer">
                      {form.evidenceLink}
                    </a>
                  : '—'}
              </dd>

              <dt className="col-sm-4">Review</dt>
              <dd className="col-sm-8">
                {paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </dd>
            </dl>

            {submitError && (
              <div className="alert alert-danger">{submitError}</div>
            )}

            <div className="alert alert-info">
              <FaCheckCircle className="me-1" />
              Ready to send? Click “Submit.”
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container py-5">
      {showSuccessModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <FaCheckCircle className="me-2 text-success" />
                    Endorsement Sent
                  </h5>
                </div>
                <div className="modal-body">
                  Thank you for endorsing <strong>{studentName}</strong>!
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      setShowSuccessModal(false);
                      navigate('/');
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}

      <div className="text-center mb-4">
        <h2 className="text-success">Endorse {studentName}</h2>
        <p className="text-muted">Step {step} of {totalSteps}</p>
      </div>

      <div className="wizard-card">
        <h5>
          {STEP_ICONS[step - 1]}
          {STEPS[step - 1]}
        </h5>
        <small className="text-muted">
          {step < totalSteps
            ? 'Complete this step'
            : 'Review your endorsement before sending'}
        </small>

        {renderStepContent()}

        <div className="d-flex justify-content-between mt-4">
          <button
            className="btn btn-outline-secondary"
            onClick={handleBack}
            disabled={step === 1}
          >
            <FaChevronLeft className="me-1" /> Back
          </button>
          <button
            className="btn btn-success"
            onClick={handleNext}
            disabled={
              !isValid() || 
              (step === 1 && (availableSkills?.length === 0 || allAlreadyEndorsed()))
            }
          >
            {step < totalSteps ? 'Next' : 'Submit'} <FaChevronRight className="ms-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
