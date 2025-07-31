// File: src/pages/PostJobWizard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/PortfolioBuilder.css';  // reuse exactly
import './PostJobWizard.css';            // any wizard-specific overrides

const INITIAL_JOB = {
  // Step 1
  title: '',
  type: '',
  customType: '',
  location: '',
  customLocation: '',
  duration: '',
  customDuration: '',
  // Step 2
  description: '',
  requirements: '',
  // Step 3
  skills: [''],
  endorsementsRequired: 0,
  projectLink: '',
  // Step 4
  payModel: '',
  budget: '',
  unpaidCredit: false,
  // Step 5
  department: '',
  employerBadge: false,
  bannerUrl: '',
  mentorshipHighlights: '',
};

const TOTAL_STEPS = 7;

const PostJobWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_JOB);

  // Next / Publish
  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(s => s + 1);
    else {
      alert('Job published (mock)');
      navigate('/');
    }
  };
  // Back (no prompts)
  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
  };

  // Per-step validation
  const isValid = () => {
    switch (step) {
      case 1:
        return form.title.trim() && (form.type || form.customType);
      case 2:
        return form.description.trim();
      case 3:
        return form.skills.some(s => s.trim());
      case 4:
        return form.payModel.trim() && form.budget.trim();
      case 5:
        return form.department.trim();
      case 6:
      case 7:
        return true;
      default:
        return false;
    }
  };

  // Render step content wrapped in card
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="card mb-4">
            <div className="card-body step-content">
              <h5>Job Basics</h5>
              <small>Tailored for student opportunities</small>
              <div className="field-group">
                <label>Job Title</label>
                <input
                  className="form-control"
                  placeholder="Campus Graphic Design Intern"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="row">
                <div className="col-md-6 field-group">
                  <label>Job Type</label>
                  <select
                    className="form-select"
                    value={form.type}
                    onChange={e =>
                      setForm({ ...form, type: e.target.value, customType: '' })
                    }
                  >
                    <option value="">Select...</option>
                    {['Internship','Part-Time','Campus Project','Freelance Gig','Volunteer'].map(o => (
                      <option key={o}>{o}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                  {form.type === 'Other' && (
                    <input
                      className="form-control mt-2"
                      placeholder="Custom job type"
                      value={form.customType}
                      onChange={e =>
                        setForm({ ...form, customType: e.target.value })
                      }
                    />
                  )}
                </div>
                <div className="col-md-6 field-group">
                  <label>Location</label>
                  <select
                    className="form-select"
                    value={form.location}
                    onChange={e =>
                      setForm({
                        ...form,
                        location: e.target.value,
                        customLocation: '',
                      })
                    }
                  >
                    <option value="">Select...</option>
                    {['On-Campus (Mzuni)','Remote','Mzuzu City'].map(o => (
                      <option key={o}>{o}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                  {form.location === 'Other' && (
                    <input
                      className="form-control mt-2"
                      placeholder="Custom location"
                      value={form.customLocation}
                      onChange={e =>
                        setForm({ ...form, customLocation: e.target.value })
                      }
                    />
                  )}
                </div>
              </div>

              <div className="field-group">
                <label>Duration</label>
                <select
                  className="form-select"
                  value={form.duration}
                  onChange={e =>
                    setForm({
                      ...form,
                      duration: e.target.value,
                      customDuration: '',
                    })
                  }
                >
                  <option value="">Select...</option>
                  {['Semester-Long','Weekend Project','Exam Break'].map(o => (
                    <option key={o}>{o}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                {form.duration === 'Other' && (
                  <input
                    className="form-control mt-2"
                    placeholder="Custom duration"
                    value={form.customDuration}
                    onChange={e =>
                      setForm({ ...form, customDuration: e.target.value })
                    }
                  />
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="card mb-4">
            <div className="card-body step-content">
              <h5>Description & Requirements</h5>
              <small>Student-focused customization</small>
              <div className="field-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Describe the role and academic skills..."
                  value={form.description}
                  onChange={e =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <div className="field-group">
                <label>Requirements</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="List skills, badges, standing..."
                  value={form.requirements}
                  onChange={e =>
                    setForm({ ...form, requirements: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="card mb-4">
            <div className="card-body step-content">
              <h5>Skills & Endorsements</h5>
              <small>Validation over experience</small>
              {form.skills.map((s, i) => (
                <div
                  key={i}
                  className="field-group d-flex align-items-center mb-2"
                >
                  <input
                    className="form-control me-2"
                    placeholder="e.g., Python"
                    value={s}
                    onChange={e => {
                      const arr = [...form.skills];
                      arr[i] = e.target.value;
                      setForm({ ...form, skills: arr });
                    }}
                  />
                  {form.skills.length > 1 && (
                    <button
                      className="btn-close"
                      onClick={() => {
                        const arr = form.skills.filter((_, idx) => idx !== i);
                        setForm({ ...form, skills: arr });
                      }}
                    />
                  )}
                </div>
              ))}
              <button
                className="btn btn-outline-success mb-3"
                onClick={() =>
                  setForm({ ...form, skills: [...form.skills, ''] })
                }
              >
                + Add Skill
              </button>

              <div className="row">
                <div className="col-md-6 field-group">
                  <label>Peer Endorsements Required</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    value={form.endorsementsRequired}
                    onChange={e =>
                      setForm({
                        ...form,
                        endorsementsRequired: +e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-6 field-group">
                  <label>Project Proof Link</label>
                  <input
                    className="form-control"
                    placeholder="GitHub repo or portfolio URL"
                    value={form.projectLink}
                    onChange={e =>
                      setForm({ ...form, projectLink: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="card mb-4">
            <div className="card-body step-content">
              <h5>Compensation & Transparency</h5>
              <small>Ethical, student-friendly pricing</small>
              <div className="row">
                <div className="col-md-6 field-group">
                  <label>Payment Model</label>
                  <select
                    className="form-select"
                    value={form.payModel}
                    onChange={e =>
                      setForm({ ...form, payModel: e.target.value })
                    }
                  >
                    <option value="">Select...</option>
                    {['Hourly','Project-Based','Stipend'].map(o => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 field-group">
                  <label>Budget Range</label>
                  <input
                    className="form-control"
                    placeholder="e.g., MWK 10,000–20,000"
                    value={form.budget}
                    onChange={e => setForm({ ...form, budget: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-check mt-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={form.unpaidCredit}
                  onChange={e =>
                    setForm({ ...form, unpaidCredit: e.target.checked })
                  }
                />
                <label className="form-check-label">
                  Unpaid but for academic credit
                </label>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="card mb-4">
            <div className="card-body step-content">
              <h5>Company Branding</h5>
              <small>Campus-centric branding</small>
              <div className="field-group">
                <label>Partner Department</label>
                <input
                  className="form-control"
                  placeholder="e.g., Mzuzu ICT Department"
                  value={form.department}
                  onChange={e =>
                    setForm({ ...form, department: e.target.value })
                  }
                />
              </div>
              <div className="form-check field-group">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={form.employerBadge}
                  onChange={e =>
                    setForm({ ...form, employerBadge: e.target.checked })
                  }
                />
                <label className="form-check-label">
                  University-approved employer badge
                </label>
              </div>
              <div className="field-group">
                <label>Banner Image URL</label>
                <input
                  className="form-control"
                  placeholder="https://..."
                  value={form.bannerUrl}
                  onChange={e =>
                    setForm({ ...form, bannerUrl: e.target.value})

                }
                />
              </div>
              <div className="field-group">
                <label>Mentorship Highlights</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="e.g., Gain mentorship from senior developers!"
                  value={form.mentorshipHighlights}
                  onChange={e =>
                    setForm({ ...form, mentorshipHighlights: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="card mb-4">
            <div className="card-body step-content">
              <h5>Review & Publish</h5>
              <p>Verify all details before publishing.</p>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="card mb-4">
            <div className="card-body step-content">
              <h5>Post-Posting Tools</h5>
              <p>Configure applicant filters, messages, and feedback.</p>
              {/* Live preview below, same step-content/card style */}
              <div className="step-content mt-4">
                <h5>Live Preview</h5>
                <p><strong>Title:</strong> {form.title || '—'}</p>
                <p><strong>Type:</strong> {form.type || form.customType || '—'}</p>
                <p><strong>Description:</strong> {form.description || '—'}</p>
                <p><strong>Skills:</strong> {form.skills.filter(s=>s).join(', ') || '—'}</p>
                <p><strong>Budget:</strong> {form.budget || '—'}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="portfolio-builder container">
      <h4>Step {step} of {TOTAL_STEPS}</h4>
      {renderStep()}
      <div className="wizard-controls">
        <button
          className="btn btn-success me-2"
          onClick={handleBack}
          disabled={step === 1}
        >
          Back
        </button>
        <button
          className="btn btn-success"
          onClick={handleNext}
          disabled={!isValid()}
        >
          {step < TOTAL_STEPS ? 'Next' : 'Publish Job'}
        </button>
      </div>
    </div>
  );
};

export default PostJobWizard;
