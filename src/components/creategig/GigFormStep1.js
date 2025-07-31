// File: src/components/creategig/GigFormStep1.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { FaListAlt } from 'react-icons/fa';
import { Badge, Form } from 'react-bootstrap';
import '../../pages/PortfolioBuilder.css';
import api from '../../utils/api';

const CORE_SKILLS = [
  'Coding',
  'Video Production',
  'Graphics Design',
  'Research Writing',
  'Tutoring',
];

export default function GigFormStep1({ gig, setGig, errors }) {
  const [gigCount, setGigCount] = useState(0);
  const [manualDuration, setManualDuration] = useState(false);

  // Fetch how many completed gig applications this recruiter has
  useEffect(() => {
    api
      .get('/api/recruiter/gigs/count')
      .then(res => setGigCount(res.data.count))
      .catch(() => setGigCount(0));
  }, []);

  // Parse numeric inputs
  const fixed = parseFloat(gig.fixedPrice) || 0;
  const hours = parseFloat(gig.estimatedHours) || 0;

  // Real‑time rate & fees
  const rate = useMemo(() => (hours > 0 ? fixed / hours : 0), [fixed, hours]);
  const recruiterRate = useMemo(() => (gigCount === 0 ? 0 : gigCount >= 5 ? 0.08 : 0.10), [gigCount]);
  const studentRate   = useMemo(() => (gigCount >= 5 ? 0.03 : 0.05), [gigCount]);

  const [recruiterFee, studentFee, combinedFees] = useMemo(() => {
    let rf = fixed * recruiterRate;
    let sf = fixed * studentRate;
    let cf = rf + sf;
    if (cf > 50000) cf = 50000;
    return [rf, sf, cf];
  }, [fixed, recruiterRate, studentRate]);

  // Auto‑fill duration unless manually edited
  useEffect(() => {
    if (manualDuration) return;
    if (!hours) {
      setGig(g => ({ ...g, duration: '' }));
      return;
    }
    const days = Math.floor(hours / 8);
    const rem  = hours % 8;
    let text   = '';
    if (days) text += `${days} day${days > 1 ? 's' : ''}`;
    if (rem)  text += (text ? ' ' : '') + `${rem} hr${rem > 1 ? 's' : ''}`;
    setGig(g => ({ ...g, duration: text }));
  }, [hours, manualDuration, setGig]);

  return (
    <div className="wizard-card">
      <h5>
        <FaListAlt className="me-2 text-success" />
        Gig Details
      </h5>
      <small>Fill out the gig’s core details</small>

      {/* Title */}
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          value={gig.title}
          isInvalid={!!errors.title}
          onChange={e => setGig({ ...gig, title: e.target.value })}
        />
        <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
      </Form.Group>

      {/* Description */}
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={gig.description}
          isInvalid={!!errors.description}
          onChange={e => setGig({ ...gig, description: e.target.value })}
        />
        <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
      </Form.Group>

      {/* Location */}
      <Form.Group className="mb-3">
        <Form.Label>Location</Form.Label>
        <Form.Control
          type="text"
          placeholder="e.g. Lilongwe, Blantyre, Remote"
          value={gig.location}
          isInvalid={!!errors.location}
          onChange={e => setGig({ ...gig, location: e.target.value })}
        />
        <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
      </Form.Group>

      {/* Gig Type */}
      <Form.Group className="mb-3">
        <Form.Label>Type</Form.Label>
        <Form.Control
          as="select"
          name="gig_type"
          value={gig.gig_type || ''}
          isInvalid={!!errors.gig_type}
          onChange={e => setGig({ ...gig, gig_type: e.target.value })}
        >
          <option value="" disabled>Select…</option>
          <option value="Project">Project</option>
          <option value="Part-Time">Part-Time</option>
        </Form.Control>
        <Form.Control.Feedback type="invalid">{errors.gig_type}</Form.Control.Feedback>
      </Form.Group>

      {/* Skills */}
      <Form.Group className="mb-3">
        <Form.Label>Core Skills Required</Form.Label>
        <div className="core-skills-list">
          {CORE_SKILLS.map(skill => {
            const isChecked = gig.selectedSkills.includes(skill);
            return (
              <div key={skill} className="mb-2">
                <Form.Check
                  inline
                  label={skill}
                  type="checkbox"
                  id={`skill-${skill}`}
                  checked={isChecked}
                  onChange={() => {
                    // build new selected array & levels map
                    const newLevels = { ...gig.skillLevels };
                    let newSelected;
                    if (isChecked) {
                      // uncheck: remove skill
                      newSelected = gig.selectedSkills.filter(s => s !== skill);
                      delete newLevels[skill];
                    } else {
                      // check: add with default 'Beginner'
                      newSelected = [...gig.selectedSkills, skill];
                      newLevels[skill] = 'Beginner';
                    }
                    setGig({
                      ...gig,
                      selectedSkills: newSelected,
                      skillLevels:    newLevels
                    });
                  }}
                />
                {isChecked && (
                  <Form.Select
                    size="sm"
                    className="mt-1 ms-4 w-auto d-inline-block"
                    value={gig.skillLevels[skill]}
                    onChange={e =>
                      setGig(g => ({
                        ...g,
                        skillLevels: {
                          ...g.skillLevels,
                          [skill]: e.target.value
                        }
                      }))
                    }
                  >
                    {['Beginner', 'Intermediate', 'Expert'].map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </Form.Select>
                )}
              </div>
            );
          })}
        </div>
        {errors.selectedSkills && (
          <div className="text-danger mt-1">{errors.selectedSkills}</div>
        )}
      </Form.Group>

      {/* Fixed Price & Estimated Hours */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <Form.Group>
            <Form.Label>Fixed Price (MWK)</Form.Label>
            <Form.Control
              type="number"
              value={gig.fixedPrice}
              isInvalid={!!errors.fixedPrice}
              onChange={e => setGig({ ...gig, fixedPrice: e.target.value })}
            />
            <Form.Control.Feedback type="invalid">{errors.fixedPrice}</Form.Control.Feedback>
          </Form.Group>
        </div>
        <div className="col-md-6 mb-3">
          <Form.Group>
            <Form.Label>Estimated Hours</Form.Label>
            <Form.Control
              type="number"
              value={gig.estimatedHours}
              isInvalid={!!errors.estimatedHours}
              onChange={e => setGig({ ...gig, estimatedHours: e.target.value })}
            />
            <Form.Control.Feedback type="invalid">{errors.estimatedHours}</Form.Control.Feedback>
          </Form.Group>
        </div>
      </div>

      {/* Inline Fee Calculator */}
      <div className="mt-3 p-3 border rounded bg-light">
        <h6>Platform Fees & Estimated Earnings</h6>
        <p>Rate: <strong>MK {rate.toFixed(0)}/hr</strong></p>
        <p>
          Recruiter Fee ({(recruiterRate * 100).toFixed(0)}%):
          <strong> MK {recruiterFee.toFixed(0)}</strong>
        </p>
        <p>
          Student Fee ({(studentRate * 100).toFixed(0)}%):
          <strong> MK {studentFee.toFixed(0)}</strong>
        </p>
        <p>
          <u>Combined Fees</u>:
          <strong> MK {combinedFees.toFixed(0)}</strong>
          {combinedFees < recruiterFee + studentFee && ' (capped at MK 50,000)'}
        </p>
        {gigCount === 0 && (
          <Badge bg="success" className="me-2">First Gig – Recruiter fee waived!</Badge>
        )}
        {gigCount >= 5 && (
          <Badge bg="info">Power-User – Reduced fees!</Badge>
        )}
      </div>

      {/* Duration */}
      <Form.Group className="mb-3">
        <Form.Label>Duration</Form.Label>
        <Form.Control
          type="text"
          placeholder="e.g. 2 weeks"
          value={gig.duration}
          isInvalid={!!errors.duration}
          disabled={hours > 0 && !manualDuration}
          onChange={e => {
            setManualDuration(true);
            setGig({ ...gig, duration: e.target.value });
          }}
        />
        <Form.Control.Feedback type="invalid">{errors.duration}</Form.Control.Feedback>
      </Form.Group>

      {/* Deliverables */}
      <Form.Group className="mb-3">
        <Form.Label>Deliverables</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="Describe expected deliverables"
          value={gig.deliverables}
          isInvalid={!!errors.deliverables}
          onChange={e => setGig({ ...gig, deliverables: e.target.value })}
        />
        <Form.Control.Feedback type="invalid">{errors.deliverables}</Form.Control.Feedback>
      </Form.Group>

      {/* Contact Info & Expiry */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <Form.Group>
            <Form.Label>Contact Info</Form.Label>
            <Form.Control
              type="text"
              placeholder="Email or phone"
              value={gig.contactInfo}
              isInvalid={!!errors.contactInfo}
              onChange={e => setGig({ ...gig, contactInfo: e.target.value })}
            />
            <Form.Control.Feedback type="invalid">{errors.contactInfo}</Form.Control.Feedback>
          </Form.Group>
        </div>
        <div className="col-md-6 mb-3">
          <Form.Group>
            <Form.Label>Expiration Date</Form.Label>
            <Form.Control
              type="date"
              value={gig.expiresAt}
              isInvalid={!!errors.expiresAt}
              onChange={e => setGig({ ...gig, expiresAt: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
            <Form.Control.Feedback type="invalid">{errors.expiresAt}</Form.Control.Feedback>
          </Form.Group>
        </div>
      </div>
    </div>
  );
}
