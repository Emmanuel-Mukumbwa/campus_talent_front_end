// File: src/components/creategig/GigRequirementsStep4.jsx
import React, { useEffect, useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import api from '../../utils/api';

const REQ_TYPES = [
  { key: 'cover_letter',   label: 'Cover Letter' },
  { key: 'resume_upload',  label: 'Resume / CV Upload' },
  { key: 'portfolio_link', label: 'Portfolio Link' },
  { key: 'references',     label: 'References' },
  { key: 'code_sample',    label: 'Code Sample / GitHub' },
  { key: 'other',          label: 'Other (free‑form)' },
];
 
export default function GigRequirementsStep4({
  gigId,
  requirements, 
  setRequirements
}) {
  const [localReqs, setLocalReqs] = useState([]);

  useEffect(() => {
    if (requirements?.length) {
      // if parent already has them (e.g. user toggled), use that
      setLocalReqs(requirements);
    } else if (gigId) {
      // otherwise, fetch from server
      api.get(`/api/gigs/${gigId}/requirements`)
        .then(res => {
          const data = res.data;
          if (Array.isArray(data) && data.length) {
            setLocalReqs(data);
            setRequirements(data);
          } else {
            // no existing → initialize defaults
            const defaults = REQ_TYPES.map(r => ({
              type: r.key,
              required: false,
              details: ''
            }));
            setLocalReqs(defaults);
            setRequirements(defaults);
          }
        })
        .catch(() => {
          // on error, just default
          const defaults = REQ_TYPES.map(r => ({
            type: r.key,
            required: false,
            details: ''
          }));
          setLocalReqs(defaults);
          setRequirements(defaults);
        });
    } else {
      // brand‑new gig, no ID yet
      const defaults = REQ_TYPES.map(r => ({
        type: r.key,
        required: false,
        details: ''
      }));
      setLocalReqs(defaults);
      setRequirements(defaults);
    }
  }, [gigId, requirements, setRequirements]);

  const toggleRequired = idx => {
    const copy = [...localReqs];
    copy[idx].required = !copy[idx].required;
    setLocalReqs(copy);
    setRequirements(copy);
  };

  const updateDetails = (idx, val) => {
    const copy = [...localReqs];
    copy[idx].details = val;
    setLocalReqs(copy);
    setRequirements(copy);
  };

  return (
    <div className="wizard-card">
      <h5>Step 4: Application Settings</h5>
      <small>Toggle which materials applicants must provide</small>

      <Form className="mt-3">
        {localReqs.map((r, i) => (
          <Row key={r.type} className="align-items-center mb-2">
            <Col xs={1}>
              <Form.Check
                type="checkbox"
                checked={r.required}
                onChange={() => toggleRequired(i)}
              />
            </Col>
            <Col xs={3}>
              <Form.Label>
                {REQ_TYPES.find(rt => rt.key === r.type).label}
              </Form.Label>
            </Col>
            <Col xs={8}> 
              {['portfolio_link','references','code_sample','other'].includes(r.type) && r.required && (
                <Form.Control
                  placeholder="Add details or prompt (optional)"
                  value={r.details}
                  onChange={e => updateDetails(i, e.target.value)}
                />
              )}
            </Col>
          </Row>
        ))}
      </Form>
    </div>
  );
}
