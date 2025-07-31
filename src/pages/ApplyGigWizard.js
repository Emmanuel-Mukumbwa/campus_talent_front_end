// File: src/pages/ApplyGigWizard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaExclamationTriangle, FaUpload, FaPaperPlane } from 'react-icons/fa';
import api from '../utils/api';
import PortfolioStep from '../components/apply/PortfolioStep';
import ApplicationStep from '../components/apply/ApplicationStep';
import './PortfolioBuilder.css';

const STEP_TITLES = ['Portfolio', 'Application', 'Preview & Submit'];
const STEP_ICONS = [
  <FaUpload className="me-2 text-success" key="icon-1" />,
  <FaExclamationTriangle className="me-2 text-success" key="icon-2" />,
  <FaPaperPlane className="me-2 text-success" key="icon-3" />
];

export default function ApplyGigWizard() {
  const { gigId } = useParams();
  const navigate  = useNavigate();

  const [step, setStep]               = useState(1);
  const [gig, setGig]                 = useState(null);
  const [errors, setErrors]           = useState({});
  const [showAuthModal, setShowAuthModal]   = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [app, setApp] = useState({
    id:             null,
    attachments:    [],
    payment_amount: null,
    duration:       '',
    deliverables:   '',
    status:         'draft',
    requirements:   {}
  });

  const [requirements, setRequirements] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setShowAuthModal(true);
      return;
    }
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    api.get('/api/auth/me')
      .then(({ data }) => {
        if (data.role !== 'student') {
          setShowAuthModal(true);
          throw new Error('Not a student');
        }
      })
      .then(() => api.get(`/api/gigs1/${gigId}`))
      .then(({ data }) => {
        setGig(data);
        setApp(a => ({
          ...a,
          payment_amount: data.payment_amount,
          duration:       data.duration,
          deliverables:   data.deliverables
        }));
      })
      .then(() => api.get(`/api/gigs/${gigId}/requirements`))
      .then(({ data }) => {
        setRequirements(data);
        setApp(a => {
          const reqs = { ...a.requirements };
          data.forEach(r => {
            if (!(r.type in reqs)) {
              if (r.type === 'resume_upload' || r.type === 'code_sample') {
                reqs[r.type] = [];
              } else if (r.type === 'references') {
                reqs.references = [''];
              } else {
                reqs[r.type] = '';
              }
            }
          });
          return { ...a, requirements: reqs };
        });
      })
      .then(() =>
        api.get('/api/gig_applications', { params: { gig_id: gigId } })
      )
      .then(({ data }) => {
        if (data && data.id) {
          setApp(a => ({
            ...a,
            id:              data.id,
            status:          data.status,
            duration:        data.duration,
            deliverables:    data.deliverables,
            payment_amount:  data.payment_amount,
            requirements:    data.requirements || a.requirements,
            attachments:     data.attachments || []
          }));
        }
      })
      .catch(err => {
        if (err.response?.status && err.response.status !== 404) {
          console.error(err);
          alert('Failed to load gig, requirements, or application');
        }
      });
  }, [gigId]);

  const validateStep = () => {
    const errs = {};
    if (step === 2) {
      requirements.forEach(r => {
        const val = app.requirements[r.type];
        if (r.required) {
          const emptyArray = Array.isArray(val) && val.length === 0;
          if (emptyArray || (!Array.isArray(val) && !val)) {
            errs[r.type] = 'This field is required';
            return;
          }
        }
        if (r.type === 'cover_letter' && val) {
          if (String(val).trim().length < 100) {
            errs.cover_letter = 'Cover letter must be at least 100 characters';
          }
        }
        if (r.type === 'resume_upload' && Array.isArray(val) && val.length) {
          const nonPdf = val.some(f => f.type !== 'application/pdf');
          if (nonPdf) {
            errs.resume_upload = 'Resume must be a PDF file';
          }
        }
      });
    }
    return errs;
  };

  const handleNext = async () => {
    const errs = validateStep();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const form = new FormData();
    if (app.id) form.append('id', app.id);
    form.append('gig_id',        gig.id);
    form.append('duration',      app.duration);
    form.append('deliverables',  app.deliverables);
    form.append('status',        step < 3 ? 'draft' : 'Applied');
    form.append('payment_amount', app.payment_amount);

    // portfolio attachments
    app.attachments.forEach(f => form.append('attachments', f));

    // requirement file uploads
    (app.requirements.resume_upload || []).forEach(f =>
      form.append('resume_upload', f)
    );
    (app.requirements.code_sample || []).forEach(f =>
      form.append('code_sample', f)
    );

    // requirements JSON
    form.append(
      'requirements',
      JSON.stringify(app.requirements)
    );

    try {
      const { data } = await api.post(
        '/api/gig_applications',
        form
      );
      if (data.id) {
        setApp(a => ({ ...a, id: data.id }));
      }
      if (step < 3) {
        setStep(s => s + 1);
      } else {
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error('Submit error:', err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
        'Save failed—please try again.'
      );
    }
  };

  const handleBack = () => setStep(s => Math.max(1, s - 1));
  const StepComponent = step === 1 ? PortfolioStep : ApplicationStep;

  return (
    <div className="container py-5">
      {/* Wizard header */}
      <div className="text-center mb-4 text-success">
        {STEP_ICONS[step - 1]}
        <h2 className="d-inline-block ms-2">{STEP_TITLES[step - 1]}</h2>
        <p className="text-muted">Step {step} of 3</p>
      </div>

      {/* Gig Title */}
      {gig && (
        <div className="text-center mb-3">
          <h3 className="text-success">Apply to: {gig.title}</h3>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <>
          <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Access Denied</h5>
                </div>
                <div className="modal-body">
                  <p>You must be logged in as a Student to apply.</p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <>
          <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Success!</h5>
                </div>
                <div className="modal-body">
                  <p>Your application has been submitted.</p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-success"
                    onClick={() => navigate('/student/applications')}
                  >
                    My Applications
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}

      {/* Wizard Content */}
      {gig && !showAuthModal && !showSuccessModal && (
        <>
          <StepComponent
            gig={gig}
            app={app}
            setApp={setApp}
            errors={errors}
            requirements={requirements}
          />

          <div className="d-flex justify-content-between mt-4">
            <button
              className="btn btn-outline-secondary"
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </button>
            <button className="btn btn-success" onClick={handleNext}>
              {step < 3 ? 'Next' : 'Submit Application'}
            </button>
          </div>
        </>
      )} 
    </div>
  );
}
