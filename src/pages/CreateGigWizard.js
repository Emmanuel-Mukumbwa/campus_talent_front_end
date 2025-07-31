// File: src/pages/CreateGigWizard.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaListAlt,
  FaExclamationTriangle,
  FaClipboardList,
  FaEye,
  FaPiggyBank,
  FaCheckCircle
} from 'react-icons/fa';
import { Button } from 'react-bootstrap';
import api from '../utils/api';

import GigFormStep1         from '../components/creategig/GigFormStep1';
import GigRequirementsStep4 from '../components/creategig/GigRequirementsStep4';
import GigPreviewStep5      from '../components/creategig/GigPreviewStep5';
import GigEscrowStep3       from '../components/creategig/GigEscrowStep3';

const STEP_TITLES = [
  'Gig Details',
  'Validation',
  'Application Settings',
  'Preview',
  'Finalize & Deposit'
];

const STEP_ICONS = [
  <FaListAlt className="me-2 text-success" key="icon-1" />,
  <FaExclamationTriangle className="me-2 text-success" key="icon-2" />,
  <FaClipboardList className="me-2 text-success" key="icon-3" />,
  <FaEye className="me-2 text-success" key="icon-4" />,
  <FaPiggyBank className="me-2 text-success" key="icon-5" />
];

// Initialize skillLevels as an empty map
const INITIAL_GIG = {
  id: null,
  title: '',
  description: '',
  gig_type: '',
  selectedSkills: [],
  skillLevels: {},        // ← new
  fixedPrice: '',
  estimatedHours: '',
  duration: '',
  deliverables: '',
  contactInfo: '',
  expiresAt: '',
  location: ''
};

export default function CreateGigWizard() {
  const navigate = useNavigate();
  const [step, setStep]                 = useState(1);
  const [gig, setGig]                   = useState(INITIAL_GIG);
  const [errors, setErrors]             = useState({});
  const [requirements, setRequirements] = useState([]);
  const [escrow, setEscrow]             = useState(null);
  const [showSuccess, setShowSuccess]   = useState(false);
  const [skipEscrow, setSkipEscrow]     = useState(false);

  // compute rate & floor
  const fixed       = parseFloat(gig.fixedPrice) || 0;
  const hours       = parseFloat(gig.estimatedHours) || 0;
  const rate        = hours > 0 ? fixed / hours : 0;
  const belowFloor  = rate < 1500;

  // Step 1 validation (ignore skillLevels here)
  const validate = () => {
    const e = {};
    if (!gig.title.trim())            e.title = 'Title is required';
    if (!gig.description.trim())      e.description = 'Description is required';
    if (!gig.location.trim())         e.location = 'Location is required';
    if (!gig.selectedSkills.length)   e.selectedSkills = 'Select at least one skill';
    if (!gig.fixedPrice || gig.fixedPrice <= 0)         e.fixedPrice = 'Fixed price is required';
    if (!gig.estimatedHours || gig.estimatedHours <= 0) e.estimatedHours = 'Estimated hours required';
    if (belowFloor)                   e.rate = `Rate MK ${rate.toFixed(0)}/hr is below MK 1,500/hr`;
    if (!gig.duration.trim())         e.duration = 'Duration is required';
    if (!gig.deliverables.trim())     e.deliverables = 'Deliverables are required';
    if (!gig.contactInfo.trim())      e.contactInfo = 'Contact info is required';
    if (!gig.expiresAt)               e.expiresAt = 'Expiration date required';
    return e;
  };
  const isStep1Valid = () => Object.keys(validate()).length === 0;

  // Upsert gig (draft or open)
  const upsert = async status => {
    const payload = {
      id:               gig.id,
      title:            gig.title,
      description:      gig.description,
      gig_type:         gig.gig_type,
      skills:           gig.selectedSkills.map(skill => ({
        name:       skill,
        proficiency: gig.skillLevels[skill]
      })),                   // send both skill & level
      budget_type:      'Paid',
      payment_amount:   parseFloat(gig.fixedPrice) || null,
      estimated_hours:  parseInt(gig.estimatedHours, 10) || null,
      duration:         gig.duration,
      deliverables:     gig.deliverables,
      contact_info:     gig.contactInfo,
      expires_at:       gig.expiresAt,
      location:         gig.location,
      status
    };

    if (gig.id) {
      await api.put(`/api/recruiter/gigs/${gig.id}`, payload);
      return gig.id;
    } else {
      const { data } = await api.post('/api/recruiter/gigs', payload);
      setGig(g => ({ ...g, id: data.gigId }));
      return data.gigId;
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      const errs = validate();
      if (Object.keys(errs).length) {
        setErrors(errs);
        return;
      }
      await upsert('Draft');
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }
    if (step === 3) {
      // Post requirements
      try {
        await api.post(`/api/gigs/${gig.id}/requirements`, requirements);
      } catch {
        return alert('Could not save requirements; please try again.');
      }
      setStep(4);
      return;
    }
    if (step === 4) {
      setStep(5);
      return;
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
  };

  const hasReq = requirements.some(r => r.required);

  return (
    <div className="container py-5">
      <h2 className="text-success text-center mb-4">Create a New Gig</h2>
      <div className="mb-2 text-muted">
        Step {step} of {STEP_TITLES.length}
      </div>

      {step === 1 && (
        <GigFormStep1 gig={gig} setGig={setGig} errors={errors} />
      )}

      {step === 2 && (
        <div className="wizard-card">
          <h5>{STEP_ICONS[1]}{STEP_TITLES[1]}</h5>
          <small>Ensure MK 1,500/hr minimum</small>
          <ul className="mt-3">
            {belowFloor ? (
              <li className="text-danger">
                Rate MK {rate.toFixed(0)}/hr is below the floor
              </li>
            ) : (
              <li className="text-success">
                ✅ Rate MK {rate.toFixed(0)}/hr meets the floor
              </li>
            )}
          </ul>
        </div>
      )}

      {step === 3 && (
        <GigRequirementsStep4
          gigId={gig.id}
          requirements={requirements}
          setRequirements={setRequirements}
        />
      )}

      {step === 4 && (
        <GigPreviewStep5
          gig={gig}
          rate={rate}
          requirements={requirements}
          escrow={escrow || {}}
        />
      )}

      {step === 5 && gig.id && (
        <>
          <GigEscrowStep3
            gigId={gig.id}
            fixedPrice={fixed}
            recruiterRate={0.10}
            studentRate={0.05}
            onDeposited={async data => {
              setEscrow(data);
              await upsert('Open');
              setShowSuccess(true);
            }}
          />

          <div className="text-center mt-3">
            <Button
              variant="outline-secondary"
              onClick={async () => {
                setSkipEscrow(true);
                try {
                  await upsert('Open');
                  setShowSuccess(true);
                } catch {
                  alert('Could not publish gig—please try again.');
                }
              }}
            >
              Publish without escrow
            </Button>
          </div>
        </>
      )}

      <div className="d-flex justify-content-between mt-4">
        <Button variant="outline-secondary" onClick={handleBack} disabled={step === 1}>
          Back
        </Button>
        {step < 5 && (
          <Button
            variant="success"
            onClick={handleNext}
            disabled={(step === 1 && !isStep1Valid()) || (step === 3 && !hasReq)}
          >
            Next
          </Button>
        )}
      </div>

      {showSuccess && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <FaCheckCircle className="me-2 text-success" />
                    Gig Published Successfully
                  </h5>
                </div>
                <div className="modal-body">
                  Your gig is live{skipEscrow ? '' : ', and escrow has been initiated'}!
                </div>
                <div className="modal-footer">
                  <Button variant="success" onClick={() => navigate('/jobs')}>
                    OK
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </div>
  );
}
