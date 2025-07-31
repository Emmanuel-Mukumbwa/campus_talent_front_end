// File: src/pages/CreateGigWizard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaListAlt,
  FaExclamationTriangle,
  FaEye,
  FaCheckCircle
} from 'react-icons/fa';
import api from '../utils/api';
import './PortfolioBuilder.css';

const CORE_SKILLS = [
  'Coding',
  'Video Production',
  'Graphics Design',
  'Research Writing',
  'Tutoring'
];

const INITIAL_GIG = {
  id: null,                 // ← ADDED
  title: '',
  description: '',
  gigType: '',
  customType: '',
  selectedSkills: [],
  budgetType: '',
  paymentAmount: '',
  paymentMethod: '',
  bankAccountNumber: '',
  bankName: '',
  duration: '',
  deliverables: '',
  contactInfo: '',
  expiresAt: '',
  location: ''
};

const STEP_TITLES = ['Gig Details', 'Validation', 'Preview & Publish'];
const STEP_ICONS = [
  <FaListAlt className="me-2 text-success" />,
  <FaExclamationTriangle className="me-2 text-success" />,
  <FaEye className="me-2 text-success" />
];
const TOTAL_STEPS = STEP_TITLES.length;

const CreateGigWizard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [step, setStep] = useState(1);
  const [gig, setGig] = useState(INITIAL_GIG);
  const [errors, setErrors] = useState({});
  const [minExpiry, setMinExpiry] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMsg, setAuthModalMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      api
        .get('/api/auth/me')
        .then(({ data }) => setUserRole(data.role))
        .catch(() => {
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
          setUserRole(null);
        });
    }
    setMinExpiry(new Date().toISOString().split('T')[0]);
  }, []);

  // ← UPDATED: unified POST‐then‐PUT upsert
  const upsert = async status => {
    const paymentAmount =
      gig.budgetType === 'Paid' && gig.paymentAmount
        ? parseFloat(gig.paymentAmount)
        : null;

    const payload = {
      title: gig.title,
      description: gig.description,
      gig_type: gig.gigType === 'Other' ? gig.customType : gig.gigType,
      skills: gig.selectedSkills,
      budget_type: gig.budgetType,
      payment_amount: paymentAmount,
      payment_method: gig.budgetType === 'Paid' ? gig.paymentMethod : null,
      bank_account_number:
        gig.paymentMethod === 'BankAccount'
          ? gig.bankAccountNumber
          : null,
      bank_name:
        gig.paymentMethod === 'BankAccount' ? gig.bankName : null,
      duration: gig.duration,
      deliverables: gig.deliverables,
      contact_info: gig.contactInfo,
      expires_at: gig.expiresAt,
      location: gig.location,
      status
    };

    if (gig.id) {
      // existing → always PUT against the same gigs1 endpoint
      await api.put(`/api/gigs1/${gig.id}`, payload);
      return { gigId: gig.id }; 
    }

    // first time → POST and stash the new ID
    const { data } = await api.post('/api/recruiter/gigs', payload);
    if (data.gigId) {
      setGig(g => ({ ...g, id: data.gigId }));
      return { gigId: data.gigId };
    }
    return {};
   };

  const validate = () => {
    const e = {};
    if (!gig.title.trim()) e.title = 'Title is required';
    if (!gig.description.trim()) e.description = 'Description is required';
    if (!gig.location.trim()) e.location = 'Location is required';
    if (!(gig.gigType || gig.customType.trim()))
      e.gigType = 'Type is required';
    if (!gig.selectedSkills.length)
      e.selectedSkills = 'Select at least one skill';
    if (!gig.budgetType) e.budgetType = 'Budget type is required';
    if (
      gig.budgetType === 'Paid' &&
      (!gig.paymentAmount || Number(gig.paymentAmount) < 5000)
    )
      e.paymentAmount = 'Paid gigs must be ≥ MWK 5,000';
    if (
      gig.budgetType === 'Paid' &&
      gig.paymentMethod === 'BankAccount' &&
      !gig.bankAccountNumber.trim()
    )
      e.bankAccountNumber = 'Bank account number is required';
    if (
      gig.budgetType === 'Paid' &&
      gig.paymentMethod === 'BankAccount' &&
      !gig.bankName.trim()
    )
      e.bankName = 'Bank name is required';
    if (!gig.duration.trim()) e.duration = 'Duration is required';
    if (!gig.deliverables.trim())
      e.deliverables = 'Deliverables are required';
    if (!gig.contactInfo.trim())
      e.contactInfo = 'Contact info is required';
    if (!gig.expiresAt) e.expiresAt = 'Expiration date is required';
    return e;
  };

  const isValid = () => Object.keys(validate()).length === 0;

  // ← UPDATED: unified handleNext
  const handleNext = async () => {
    if (step === 1) {
      if (!isAuthenticated) {
        setAuthModalMsg(
          'You must be logged in as a Recruiter to post a gig.'
        );
        setShowAuthModal(true);
        return;
      }
      if (userRole !== 'recruiter') {
        setAuthModalMsg(
          'Only users with the Recruiter role can post gigs.'
        );
        setShowAuthModal(true);
        return;
      }
    }

    setErrors({});
    if (step === 1) {
      const e = validate();
      if (Object.keys(e).length) {
        setErrors(e);
        return;
      }
    }

    try {
      // POST once (step 1), PUT thereafter (steps 2 & 3)
      const { gigId: newId } = await upsert(
        step < TOTAL_STEPS ? 'Draft' : 'Open'
      );

      if (step < TOTAL_STEPS) {
        setStep(s => s + 1);
      } else {
        setSuccessMsg(
          gig.id
            ? 'Your gig has been updated successfully!'
            : 'Your gig has been published successfully!'
        );
        setShowSuccessModal(true);
      }
    } catch {
      alert('Save failed—please try again.');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="wizard-card">
            <h5>{STEP_ICONS[0]}{STEP_TITLES[0]}</h5>
            <small>Fill out the gig’s core details</small>

            {/* Title & Description */}
            <div className="mt-3">
              <label>Title</label>
              <input
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                value={gig.title}
                onChange={e =>
                  setGig({ ...gig, title: e.target.value })
                }
              />
              {errors.title && (
                <div className="invalid-feedback">{errors.title}</div>
              )}
            </div>
            <div className="mt-3">
              <label>Description</label>
              <textarea
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                rows="3"
                value={gig.description}
                onChange={e =>
                  setGig({ ...gig, description: e.target.value })
                }
              />
              {errors.description && (
                <div className="invalid-feedback">
                  {errors.description}
                </div>
              )}
            </div>

            {/* Location */}
            <div className="mt-3">
              <label>Location</label>
              <input
                className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                value={gig.location}
                onChange={e =>
                  setGig({ ...gig, location: e.target.value })
                }
                placeholder="e.g. Lilongwe, Blantyre, Remote"
              />
              {errors.location && (
                <div className="invalid-feedback">
                  {errors.location}
                </div>
              )}
            </div>

            {/* Type */}
            <div className="mt-3">
              <label>Type</label>
              <select
                className={`form-select ${errors.gigType ? 'is-invalid' : ''}`}
                value={gig.gigType}
                onChange={e =>
                  setGig({
                    ...gig,
                    gigType: e.target.value,
                    customType: ''
                  })
                }
              > 
                <option value="">Select…</option>
                {['Project', 'Part-Time'].map(o => (
                  <option key={o}>{o}</option>
                ))}
                <option value="Other">Other</option>
              </select>
              {gig.gigType === 'Other' && (
                <input
                  className="form-control mt-2"
                  placeholder="Custom type"
                  value={gig.customType}
                  onChange={e =>
                    setGig({ ...gig, customType: e.target.value })
                  }
                />
              )}
              {errors.gigType && (
                <div className="invalid-feedback">{errors.gigType}</div>
              )}
            </div>

            {/* Skills */}
            <div className="mt-3">
              <label>Core Skills Required</label>
              <div className="core-skills-list">
                {CORE_SKILLS.map(skill => (
                  <label key={skill} className="form-check me-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={gig.selectedSkills.includes(skill)}
                      onChange={() => {
                        const sel = gig.selectedSkills.includes(skill)
                          ? gig.selectedSkills.filter(s => s !== skill)
                          : [...gig.selectedSkills, skill];
                        setGig({ ...gig, selectedSkills: sel });
                      }}
                    />
                    <span className="form-check-label">{skill}</span>
                  </label>
                ))}
              </div>
              {errors.selectedSkills && (
                <div className="text-danger mt-1">
                  {errors.selectedSkills}
                </div>
              )}
            </div>

            {/* Budget & Payment */}
            <div className="mt-3">
              <label>Budget Type</label>
              <select
                className={`form-select ${errors.budgetType ? 'is-invalid' : ''}`}
                value={gig.budgetType}
                onChange={e =>
                  setGig({ ...gig, budgetType: e.target.value })
                }
              >
                <option value="">Select…</option>
                {['Paid', 'Academic Credit', 'Volunteer'].map(o => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              {errors.budgetType && (
                <div className="invalid-feedback">{errors.budgetType}</div>
              )}
            </div>
            {gig.budgetType === 'Paid' && (
              <div className="row mt-3">
                <div className="col-md-4">
                  <label>Payment Amount (MWK)</label>
                  <input
                    type="number"
                    min="5000"
                    className={`form-control ${errors.paymentAmount ? 'is-invalid' : ''}`}
                    value={gig.paymentAmount}
                    onChange={e =>
                      setGig({ ...gig, paymentAmount: e.target.value })
                    }
                  />
                  {errors.paymentAmount && (
                    <div className="invalid-feedback">
                      {errors.paymentAmount}
                    </div>
                  )}
                </div>
                <div className="col-md-4">
                  <label>Payment Method</label>
                  <select
                    className="form-select"
                    value={gig.paymentMethod}
                    onChange={e =>
                      setGig({ ...gig, paymentMethod: e.target.value })
                    }
                  >
                    <option value="">Select…</option>
                    <option>PayChangu</option>
                    <option>BankAccount</option>
                  </select>
                </div>
                {gig.paymentMethod === 'BankAccount' && (
                  <>
                    <div className="col-md-4 mt-3 mt-md-0">
                      <label>Bank Account #</label>
                      <input
                        className={`form-control ${errors.bankAccountNumber ? 'is-invalid' : ''}`}
                        value={gig.bankAccountNumber}
                        onChange={e =>
                          setGig({ ...gig, bankAccountNumber: e.target.value })
                        }
                      />
                      {errors.bankAccountNumber && (
                        <div className="invalid-feedback">
                          {errors.bankAccountNumber}
                        </div>
                      )}
                    </div>
                    <div className="col-md-4 mt-3 mt-md-0">
                      <label>Bank Name</label>
                      <input
                        className={`form-control ${errors.bankName ? 'is-invalid' : ''}`}
                        value={gig.bankName}
                        onChange={e =>
                          setGig({ ...gig, bankName: e.target.value })
                        }
                      />
                      {errors.bankName && (
                        <div className="invalid-feedback">
                          {errors.bankName}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Duration, Deliverables, Contact & Expiry */}
            <div className="mt-3">
              <label>Duration</label>
              <input
                className={`form-control ${errors.duration ? 'is-invalid' : ''}`}
                placeholder="e.g. 2 weeks"
                value={gig.duration}
                onChange={e =>
                  setGig({ ...gig, duration: e.target.value })
                }
              />
              {errors.duration && (
                <div className="invalid-feedback">{errors.duration}</div>
              )}
            </div>
            <div className="mt-3">
              <label>Deliverables</label>
              <textarea
                className={`form-control ${errors.deliverables ? 'is-invalid' : ''}`}
                rows="2"
                placeholder="Describe expected deliverables"
                value={gig.deliverables}
                onChange={e =>
                  setGig({ ...gig, deliverables: e.target.value })
                }
              />
              {errors.deliverables && (
                <div className="invalid-feedback">{errors.deliverables}</div>
              )}
            </div>
            <div className="mt-3">
              <label>Contact Info</label>
              <input
                className={`form-control ${errors.contactInfo ? 'is-invalid' : ''}`}
                placeholder="Email or phone"
                value={gig.contactInfo}
                onChange={e =>
                  setGig({ ...gig, contactInfo: e.target.value })
                }
              />
              {errors.contactInfo && (
                <div className="invalid-feedback">{errors.contactInfo}</div>
              )}
            </div>
            <div className="mt-3">
              <label>Expiration Date</label>
              <input
                type="date"
                className={`form-control ${errors.expiresAt ? 'is-invalid' : ''}`}
                value={gig.expiresAt}
                onChange={e =>
                  setGig({ ...gig, expiresAt: e.target.value })
                }
                min={minExpiry}
              />
              {errors.expiresAt && (
                <div className="invalid-feedback">{errors.expiresAt}</div>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="wizard-card">
            <h5>{STEP_ICONS[1]}{STEP_TITLES[1]}</h5>
            <small>Check for missing fields</small>
            <ul className="mt-3">
              {Object.entries(validate()).map(([field, msg]) => (
                <li key={field}>{msg}</li>
              ))}
            </ul>
          </div>
        );
      case 3:
        return (
          <div className="wizard-card">
            <h5>{STEP_ICONS[2]}{STEP_TITLES[2]}</h5>
            <small>Review and publish your gig</small>
            <dl className="mt-3">
              <dt>Title</dt><dd>{gig.title}</dd>
              <dt>Description</dt><dd>{gig.description}</dd>
              <dt>Type</dt>
              <dd>{gig.gigType === 'Other' ? gig.customType : gig.gigType}</dd>
              <dt>Skills</dt><dd>{gig.selectedSkills.join(', ')}</dd>
              <dt>Budget</dt>
              <dd>
                {gig.budgetType}
                {gig.budgetType === 'Paid' && ` — MWK ${gig.paymentAmount} via ${gig.paymentMethod}`}
              </dd>
              {gig.paymentMethod === 'BankAccount' && (
                <>
                  <dt>Bank Account #</dt><dd>{gig.bankAccountNumber}</dd>
                  <dt>Bank Name</dt><dd>{gig.bankName}</dd>
                </>
              )}
              <dt>Duration</dt><dd>{gig.duration}</dd>
              <dt>Deliverables</dt><dd>{gig.deliverables}</dd>
              <dt>Contact Info</dt><dd>{gig.contactInfo}</dd>
              <dt>Expires At</dt><dd>{gig.expiresAt}</dd>
            </dl>
            <div className="alert alert-info">
              <FaCheckCircle className="me-1" />
              Ready to go live? Click “Publish Gig.”
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container py-5">
      {showAuthModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header"><h5 className="modal-title">Authentication Required</h5></div>
                <div className="modal-body"><p>{authModalMsg}</p></div>
                <div className="modal-footer">
                  <button className="btn btn-outline-secondary" onClick={() => setShowAuthModal(false)}>Close</button>
                  <button className="btn btn-success" onClick={() => { setShowAuthModal(false); navigate('/login'); }}>Go to Login</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}

      {showSuccessModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header"><h5 className="modal-title">Success!</h5></div>
                <div className="modal-body"><p>{successMsg}</p></div>
                <div className="modal-footer">
                  <button className="btn btn-success" onClick={() => { setShowSuccessModal(false); navigate('/jobs'); }}>Go to Gigs</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}

      <div className="text-center mb-4">
        <h2 className="text-success">Post a New Gig</h2>
        <p className="text-muted">Connect campus talent with real opportunities</p>
      </div>

      <main>
        <h6 className="mb-3 text-muted">Step {step} of {TOTAL_STEPS}</h6>
        {renderStepContent()}
        <div className="d-flex justify-content-between mt-4">
          <button className="btn btn-outline-secondary" onClick={handleBack} disabled={step === 1}>Back</button>
          <button className="btn btn-success" onClick={handleNext} disabled={step === 2 && !isValid()}>
            {step < TOTAL_STEPS ? 'Next' : 'Publish Gig'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default CreateGigWizard;
