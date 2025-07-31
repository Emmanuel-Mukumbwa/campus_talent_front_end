// File: src/pages/RecruiterApplicationDetail.jsx

import React, { useEffect, useState } from 'react';
import {
  Container,
  Spinner,
  Alert,
  Button,
  Badge,
  Modal,
  Form
} from 'react-bootstrap';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import InlinePreview from '../components/applications/InlinePreview';
import TaskChecklist from '../components/applications/TaskChecklist';
import GigEscrowStep3 from '../components/creategig/GigEscrowStep3';

export default function RecruiterApplicationDetail() {
  const { gigId, applicationId } = useParams();
  const navigate = useNavigate();

  // ── Main application state ──
  const [app, setApp]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // ── Deliverables ──
  const [submitted, setSubmitted]   = useState([]);
  const [subLoading, setSubLoading] = useState(true);
  const [subError, setSubError]     = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // ── Payment modal (manual pay) ──
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount]       = useState('');
  const [payRef, setPayRef]             = useState('');
  const [payLoading, setPayLoading]     = useState(false);
  const [payError, setPayError]         = useState('');

  // ── Release & complete ──
  const [releasing, setReleasing]         = useState(false);
  const [releaseError, setReleaseError]   = useState('');
  const [completing, setCompleting]       = useState(false);
  const [completeError, setCompleteError] = useState('');

  // MWK formatter
  const fmt = new Intl.NumberFormat('en-MW', {
    style: 'currency',
    currency: 'MWK',
    minimumFractionDigits: 2
  }).format;

  useEffect(() => {
    async function fetchAll() {
      try {
        const { data: raw } = await api.get(
          `/api/legacy/gig_applications/${applicationId}`
        );
        setApp(raw);
      } catch (err) {
        setError(err.response?.data?.message || 'Not found');
        setLoading(false);
        return;
      }
      setLoading(false);

      try {
        const { data } = await api.get(
          `/api/gig_applications_deliverable/${applicationId}/deliverables`
        );
        setSubmitted(data);
      } catch (err) {
        setSubError(err.response?.data?.message || 'Failed to load deliverables');
      } finally {
        setSubLoading(false);
      }
    }
    fetchAll();
  }, [applicationId]);

  // Approve / Reject deliverables
  const handleUpdate = async (delivId, newStatus) => {
    setUpdatingId(delivId);
    try {
      const { data: updated } = await api.patch(
        `/api/gig_applications_deliverable/${applicationId}/deliverables/${delivId}`,
        { status: newStatus }
      );
      setSubmitted(s => s.map(d => d.id === delivId ? updated : d));
    } catch (err) {
      setSubError(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  // Manual payment
  const handleMakePayment = async () => {
    setPayLoading(true);
    setPayError('');
    try {
      await api.post('/api/gig_payments', {
        application_id: app.id,
        amount: payAmount,
        transaction_reference: payRef
      });
      setShowPayModal(false);
    } catch (err) {
      setPayError(err.response?.data?.message || 'Payment failed');
    } finally {
      setPayLoading(false);
    }
  };

  // Release escrow funds
  const handleReleaseFunds = async () => {
    if (!app.escrow?.tx_ref) return;
    setReleaseError('');
    setReleasing(true);
    try {
      await api.post('/api/escrow/release', { tx_ref: app.escrow.tx_ref });
      setApp(a => ({
        ...a,
        escrow: { ...a.escrow, paid: true, paid_at: new Date().toISOString() }
      }));
    } catch (err) {
      setReleaseError(err.response?.data?.message || 'Release failed');
    } finally {
      setReleasing(false);
    }
  };

  // Mark application complete + auto‑endorse
  const handleMarkComplete = async () => {
    setCompleteError('');
    setCompleting(true);
    try {
      await api.patch(`/api/legacy/gig_applications/${app.id}/status`, { status: 'Completed' });
      await api.post(`/api/students/${app.student_id}/endorse/gig/${app.gig_id}/complete`);
      const { data } = await api.get(`/api/legacy/gig_applications/${app.id}`);
      setApp(data);
    } catch (err) {
      setCompleteError(err.response?.data?.message || 'Could not complete & endorse');
    } finally {
      setCompleting(false);
    }
  };

  // Loading & Errors
  if (loading || subLoading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }
  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </Container>
    );
  }
  if (!app) {
    return <Navigate to={`/recruiter/applications/${gigId}`} replace />;
  }

  return (
    <Container className="py-4">
      <h3 className="mb-5 text-success">Application Details</h3>
      <hr />

      {/* Gig & Student Info */}
      <h5>Gig: {app.gig.title}</h5>
      <p>
        <strong>Status:</strong> {app.status}<br/>
        <strong>Applied At:</strong> {new Date(app.applied_at).toLocaleString()}
      </p>
      <h6>Student</h6>
      <p>
        <strong>Name:</strong> {app.student.name}<br/>
        <strong>Email:</strong> {app.student.email}
      </p>

      {/* Proposal & Attachments */}
      {app.proposal_text && <>
        <h6>Proposal</h6>
        <p>{app.proposal_text}</p>
      </>}
      {app.attachments?.length > 0 && <>
        <h6>Attachments</h6>
        <div className="d-flex flex-wrap gap-3">
          {app.attachments.map((url,i) =>
            <InlinePreview key={i} url={url} height="150px" />
          )}
        </div>
      </>}

      {/* Original Deliverables */}
      <h6 className="mt-4">Deliverables</h6>
      <TaskChecklist items={app.deliverables} />

      {/* Submitted Deliverables */}
      <hr />
      <h6>Submitted Deliverables</h6>
      {subError && <Alert variant="danger">{subError}</Alert>}
      {submitted.length === 0
        ? <p>No deliverables submitted yet.</p>
        : <ul>
            {submitted.map(d => (
              <li key={d.id} className="mb-3">
                <Badge bg={
                  d.status === 'pending'  ? 'warning' :
                  d.status === 'approved' ? 'success' :
                  'danger'
                } className="me-2">{d.status}</Badge>
                {new Date(d.created_at).toLocaleString()} – {d.description}
                <ul className="mt-1">
                  {d.files.map((f,i) =>
                    <li key={i}>
                      <a href={f.file_url} target="_blank" rel="noopener noreferrer">
                        {f.file_url.split('/').pop()}
                      </a>
                    </li>
                  )}
                </ul>
                <div className="mt-2">
                  <Button size="sm" variant="outline-success" className="me-1"
                    disabled={d.status!=='pending'||updatingId===d.id}
                    onClick={()=>handleUpdate(d.id,'approved')}>
                    {updatingId===d.id
                      ? <Spinner as="span" animation="border" size="sm"/>
                      : 'Approve'}
                  </Button>
                  <Button size="sm" variant="outline-danger"
                    disabled={d.status!=='pending'||updatingId===d.id}
                    onClick={()=>handleUpdate(d.id,'rejected')}>
                    {updatingId===d.id
                      ? <Spinner as="span" animation="border" size="sm"/>
                      : 'Reject'}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
      }

      {/* Duration & Payment Breakdown */}
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

      {/* View Escrow Details */}
      {app.escrow.tx_ref && (
        <Button variant="link" size="sm"
          onClick={()=>navigate(`/escrow/${app.escrow.tx_ref}`)}>
          View Escrow Details
        </Button>
      )}

      {/* If no escrow yet, show deposit widget */}
      {!app.escrow.tx_ref && (
        <div className="mb-4">
          <h5 className="text-success">Deposit Escrow</h5>
          <GigEscrowStep3
            gigId={app.gig_id}
            fixedPrice={app.payment_amount}
            recruiterRate={app.fees.recruiterFeePercent/100}
            studentRate={app.fees.studentFeePercent/100}
            onDeposited={async data => {
              // record the new escrow
              await api.post('/api/escrow/record', {
                gigId: app.gig_id,
                tx_ref: data.tx_ref,
                amount: data.amount
              });
              // update UI
              setApp(a => ({
                ...a,
                escrow: { tx_ref: data.tx_ref, paid: false }
              }));
            }}
          />
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 d-flex gap-2 flex-wrap">
        <Button variant="warning"
          onClick={handleReleaseFunds}
          disabled={!app.escrow.tx_ref||app.escrow.paid||releasing}>
          {releasing
            ? <Spinner animation="border" size="sm"/>
            : 'Release Funds'}
        </Button>
        <Button variant="success"
          onClick={handleMarkComplete}
          disabled={app.status!=='Accepted'||completing}>
          {completing
            ? <Spinner animation="border" size="sm"/>
            : 'Mark Complete'}
        </Button>
      </div>
      {releaseError &&  <Alert className="mt-2" variant="danger">{releaseError}</Alert>}
      {completeError && <Alert className="mt-2" variant="danger">{completeError}</Alert>}

      {/* Manual Payment Modal */}
      <Modal show={showPayModal} onHide={()=>setShowPayModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Make Payment</Modal.Title></Modal.Header>
        <Modal.Body>
          {payError && <Alert variant="danger">{payError}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Amount (MWK)</Form.Label>
            <Form.Control type="number" value={payAmount}
              onChange={e=>setPayAmount(e.target.value)}/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Transaction Reference</Form.Label>
            <Form.Control type="text" value={payRef}
              onChange={e=>setPayRef(e.target.value)}/>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShowPayModal(false)} disabled={payLoading}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleMakePayment} disabled={payLoading}>
            {payLoading
              ? <Spinner animation="border" size="sm"/>
              : 'Submit Payment'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
