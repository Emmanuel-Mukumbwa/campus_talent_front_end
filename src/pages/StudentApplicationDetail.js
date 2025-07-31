// File: src/pages/StudentApplicationDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import {
  Container,
  Spinner,
  Alert,
  Button,
  Badge,
  Form,
  Modal
} from 'react-bootstrap';
import api from '../utils/api';

export default function StudentApplicationDetail() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  // Application state
  const [app, setApp]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // New deliverables state
  const [submitted, setSubmitted]     = useState([]);
  const [desc, setDesc]               = useState('');
  const [files, setFiles]             = useState([]);
  const [submitting, setSubmitting]   = useState(false);
  const [formError, setFormError]     = useState('');

  // Confirmation modal state
  const [showConfirm, setShowConfirm] = useState(false);

  // Currency formatter for MWK
  const fmt = new Intl.NumberFormat('en-MW', {
    style: 'currency',
    currency: 'MWK',
    minimumFractionDigits: 2
  }).format;

  useEffect(() => {
    setLoading(true);

    // 1) fetch application details
    api.get(`/api/legacy/gig_applications/${applicationId}`)
      .then(({ data }) => setApp(data))
      .catch(err => setError(err.response?.data?.message || 'Not found'))
      .finally(() => {
        // 2) then fetch submitted deliverables
        api.get(`/api/gig_applications_deliverable/${applicationId}/deliverables`)
          .then(({ data }) => setSubmitted(data))
          .catch(() => setSubmitted([]))
          .finally(() => setLoading(false));
      });
  }, [applicationId]);

  // Actual submission logic
  const doSubmit = async () => {
    setFormError('');
    // file‑type check
    for (let f of files) {
      if (!['application/pdf','image/png','image/jpeg'].includes(f.type)) {
        setFormError('Only PDF, PNG or JPG files allowed.');
        setShowConfirm(false);
        return;
      }
    }

    const form = new FormData();
    form.append('description', desc);
    files.forEach(f => form.append('files', f));

    setSubmitting(true);
    setShowConfirm(false);
    try {
      const { data: newDeliv } = await api.post(
        `/api/gig_applications_deliverable/${applicationId}/deliverables`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data' }}
      );
      setSubmitted(prev => [newDeliv, ...prev]);
      setDesc('');
      setFiles([]);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Open confirmation modal
  const handleOpenConfirm = e => {
    e.preventDefault();
    setFormError('');
    setShowConfirm(true);
  };

  if (loading) return (
    <Container className="py-4 text-center">
      <Spinner animation="border" />
    </Container>
  );
  if (error) return (
    <Container className="py-4">
      <Alert variant="danger">{error}</Alert>
      <Button onClick={() => navigate(-1)}>Back</Button>
    </Container>
  );
  if (!app) return <Navigate to="/student/applications" replace />;

  return (
    <Container className="py-4">
      <h3 className="mb-5 text-success">Application Details</h3>
      <hr />
      <h5>Gig: {app.gig.title}</h5>
      <p><strong>Status:</strong> {app.status}</p> 
      <p>
        <strong>Applied At:</strong>{' '}
        {new Date(app.applied_at).toLocaleString()}
      </p>

      {app.attachments?.length > 0 && (
        <>
          <h6>Attachments</h6>
          <ul>
            {app.attachments.map((url, i) => (
              <li key={i}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url.split('/').pop()}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* ORIGINAL DELIVERABLES */}
      <hr />
      <h6>Original Deliverables</h6>
      {Array.isArray(app.deliverables) && app.deliverables.length > 0 ? (
        <ul>
          {app.deliverables.map((item, i) => (
            <li key={i}>
              <Badge bg="success" className="me-1">✔</Badge>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p>No original deliverables listed.</p>
      )}

      {/* Duration & Payment Details */}
      <hr />
      <p><strong>Duration:</strong> {app.duration}</p>

      <p>
        <strong>Escrow Status:</strong>{' '}
        <Badge bg={app.escrow.paid ? 'success' : 'warning'}>
          {app.escrow.paid ? 'Released' : 'Held'}
        </Badge>
        {app.escrow.paid_at && ` on ${new Date(app.escrow.paid_at).toLocaleString()}`}
      </p>

      <p><strong>Gross Amount:</strong> {fmt(app.payment_amount)}</p>

      <p>
        <strong>Fees:</strong><br/>
        Recruiter ({app.fees.recruiterFeePercent}%): {fmt(app.fees.recruiterFeeAmount)}<br/>
        Student  ({app.fees.studentFeePercent}%): {fmt(app.fees.studentFeeAmount)}
      </p>

      <p><strong>Net to Student:</strong> {fmt(app.fees.netToStudent)}</p>

      <Button
        variant="link"
        size="sm"
        onClick={() => navigate(`/escrow/${app.escrow.tx_ref}`)}
      >
        View Escrow Details
      </Button>

      {/* SUBMITTED DELIVERABLES */}
      <hr />
      <h6>Submitted Deliverables</h6>
      {submitted.length > 0 ? (
        <ul>
          {submitted.map(d => (
            <li key={d.id} className="mb-3">
              <Badge
                bg={
                  d.status === 'pending'   ? 'warning'
                  : d.status === 'approved' ? 'success'
                  : 'danger'
                }
                className="me-2"
              >
                {d.status}
              </Badge>
              {d.created_at
                ? `${new Date(d.created_at).toLocaleString()} – `
                : ''
              }
              {d.description}

              {Array.isArray(d.files) && d.files.length > 0 && (
                <ul className="mt-1">
                  {d.files.map((f, i) => (
                    <li key={i}>
                      <a
                        href={f.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {f.file_url.split('/').pop()}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No deliverables submitted yet.</p>
      )}

      {/* SUBMIT NEW DELIVERABLE — only when accepted */}
      {app.status === 'Accepted' && (
        <>
          <hr />
          <h6>Add Deliverable</h6>
          <Form onSubmit={handleOpenConfirm}>
            {formError && <Alert variant="danger">{formError}</Alert>}

            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={desc}
                onChange={e => setDesc(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Files (PDF/PNG/JPG)</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept=".pdf,image/png,image/jpeg"
                onChange={e => setFiles(Array.from(e.target.files))}
              />
            </Form.Group>

            <Button
              type="submit"
              variant="success"
              disabled={submitting}
            >
              {submitting ? 'Submitting…' : 'Submit Deliverable'}
            </Button>
          </Form>
        </>
      )}

      {/* Confirmation Modal */}
      <Modal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to submit this deliverable?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirm(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={doSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting…' : 'Yes, submit'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Button
        variant="secondary"
        className="mt-4"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
    </Container>
  );
}
