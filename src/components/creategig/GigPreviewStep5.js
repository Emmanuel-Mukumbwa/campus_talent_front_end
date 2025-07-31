// File: src/components/creategig/GigPreviewStep5.jsx

import React from 'react';
import { Card, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import {
  FaEye,
  FaCheckCircle,
  FaTag,
  FaMapMarkerAlt,
  FaClock,
  FaRegMoneyBillAlt,
  FaHourglassHalf,
  FaChartLine,
  FaCalendarAlt,
  FaInfoCircle,
  FaClipboardList,
  FaPiggyBank
} from 'react-icons/fa';

export default function GigPreviewStep5({
  gig,
  rate,
  requirements = [],
  escrow
}) {
  // Ensure escrow is always an object
  const e = escrow || {};

  const TYPE_LABELS = {
    cover_letter:   'Cover Letter',
    resume_upload:  'Resume / CV Upload',
    portfolio_link: 'Portfolio Link',
    references:     'References',
    code_sample:    'Code Sample / GitHub',
    other:          'Other'
  };
  const requiredList = requirements.filter(r => r.required);

  return (
    <div className="wizard-card">
      {/* Section Title */}
      <div className="d-flex align-items-center mb-3">
        <FaEye size={28} className="text-success me-2" />
        <div>
          <h4 className="mb-0">Step 4: Preview &amp; Publish</h4>
          <small className="text-muted">Review everything before going live</small>
        </div>
      </div>

      {/* 1) Gig Details */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="d-flex align-items-center bg-white">
          <FaTag className="me-2 text-success" /> <strong>Gig Details</strong>
        </Card.Header>
        <Card.Body>
          <Row className="gy-3">
            <Col md={6}>
              <p className="mb-1">
                <FaTag className="me-1 text-secondary" />
                <strong>Title:</strong> {gig.title}
              </p>
              <p className="mb-1">
                <FaMapMarkerAlt className="me-1 text-secondary" />
                <strong>Location:</strong> {gig.location}
              </p>
              <p className="mb-1">
                <FaClock className="me-1 text-secondary" />
                <strong>Duration:</strong> {gig.duration}
              </p>
              <p className="mb-1">
                <FaInfoCircle className="me-1 text-secondary" />
                <strong>Contact:</strong> {gig.contactInfo}
              </p>
            </Col>
            <Col md={6}>
              <p className="mb-1">
                <FaRegMoneyBillAlt className="me-1 text-secondary" />
                <strong>Fixed Price:</strong> MK {gig.fixedPrice}
              </p>
              <p className="mb-1">
                <FaHourglassHalf className="me-1 text-secondary" />
                <strong>Est. Hours:</strong> {gig.estimatedHours} hr
              </p>
              <p className="mb-1">
                <FaChartLine className="me-1 text-secondary" />
                <strong>Rate:</strong> MK {rate ? rate.toFixed(0) : '—'}/hr
              </p>
              <p className="mb-1">
                <FaCalendarAlt className="me-1 text-secondary" />
                <strong>Expires At:</strong> {gig.expiresAt}
              </p>
            </Col>
          </Row>
          <hr />
          <div>
            <h6>Description</h6>
            <p className="text-muted">{gig.description}</p>
          </div>
          <div>
            <h6>Skills</h6>
            {gig.selectedSkills.map(skill => (
              <Badge key={skill} bg="info" className="me-1 mb-1">
                {skill}
              </Badge>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* 2) Application Requirements */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="d-flex align-items-center bg-white">
          <FaClipboardList className="me-2 text-success" /> <strong>Application Requirements</strong>
        </Card.Header>
        <ListGroup variant="flush">
          {requiredList.length > 0 ? (
            requiredList.map(r => (
              <ListGroup.Item key={r.type} className="d-flex">
                <FaCheckCircle className="me-2 text-success mt-1" />
                <div>
                  <strong>{TYPE_LABELS[r.type]}</strong>
                  {r.details && <span>: {r.details}</span>}
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item className="text-muted">
              No additional requirements
            </ListGroup.Item>
          )}
        </ListGroup>
      </Card>

      {/* 3) Escrow Details */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="d-flex align-items-center bg-white">
          <FaPiggyBank className="me-2 text-success" /> <strong>Escrow Details</strong>
        </Card.Header>
        <Card.Body as="dl">
          <div className="row mb-2">
            <dt className="col-sm-4">Amount</dt>
            <dd className="col-sm-8">MK {e.amount != null ? e.amount : '—'}</dd>
          </div>
          <div className="row mb-2">
            <dt className="col-sm-4">Status</dt>
            <dd className="col-sm-8">{e.status || '—'}</dd>
          </div>
          <div className="row">
            <dt className="col-sm-4">Deposited At</dt>
            <dd className="col-sm-8">
              {e.created_at
                ? new Date(e.created_at).toLocaleString()
                : '—'}
            </dd>
          </div>
        </Card.Body>
      </Card>

      <div className="alert alert-info d-flex align-items-center">
        <FaCheckCircle className="me-2" />
        Once you click “Publish Gig,” your escrow deposit is finalized.
      </div>
    </div>
  );
}
