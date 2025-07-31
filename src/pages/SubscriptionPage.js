// src/pages/SubscriptionPage.jsx

import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Spinner,
  Alert,
  OverlayTrigger,
  Tooltip,
  Modal,
  Row,
  Col
} from 'react-bootstrap';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const PLANS = [
  { key: 'free',  label: 'Free',  fee: 0,     posts: 1 },
  { key: 'basic', label: 'Basic', fee: 5000,  posts: 5 },
  { key: 'pro',   label: 'Pro',   fee: 15000, posts: 20 },
];

export default function SubscriptionPage() {
  const navigate = useNavigate();

  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [statusLoading, setStatusLoading] = useState(true);
  const [subStatus, setSubStatus]         = useState(null);

  // Confirmation & success modals
  const [confirmPlan, setConfirmPlan]     = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage]     = useState('');

  useEffect(() => {
    api.get('/api/subscriptions/status')
      .then(({ data }) => setSubStatus(data))
      .catch(() => setError('Failed to load subscription status'))
      .finally(() => setStatusLoading(false));
  }, []);

  const handleConfirmedSubscribe = async planKey => {
    setConfirmPlan(null);
    setLoading(true);
    try {
      const { data } = await api.post('/api/subscriptions', { plan: planKey });

      if (data.free) {
        // Free plan case
        setSuccessMessage(data.message);
        setShowSuccessModal(true);
      } else {
        // Paid plan: redirect to hosted checkout
        localStorage.setItem('subscription_tx_ref', data.tx_ref);
        window.location.href = data.paymentPageUrl;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  if (statusLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  const {
    plan: currentPlan,
    status,
    usedPosts = 0,
    maxPosts  = 0,
    periodEnd,
    freeAvailableAt
  } = subStatus || {};

  const now = new Date();
  const expired   = periodEnd ? new Date(periodEnd) < now : false;
  const freeLocked = freeAvailableAt ? new Date(freeAvailableAt) > now : false;

  return (
    <div className="container py-5">
      <Row className="align-items-center mb-4">
        <Col><h2>Choose Your Subscription</h2></Col>
        <Col className="text-end">
          <Button variant="outline-success" onClick={() => navigate('/subscription/status')}>
            View Subscription Status
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex flex-wrap gap-4">
        {PLANS.map(p => {
          const isCurrent    = p.key === currentPlan && !expired;
          const usedUpFree   = p.key === 'free' && usedPosts >= maxPosts;
          const needsRenewal = isCurrent && status === 'active' && p.key !== 'free' && usedPosts >= maxPosts;
          // Free can only be re‑taken if not locked, paid can be re‑selected if expired
          const canSelect = p.key === 'free'
            ? (!freeLocked && (!isCurrent || expired))
            : (!isCurrent || expired);

          // Decide which button to show
          let control;
          if (needsRenewal) {
            control = (
              <Button
                variant="warning"
                disabled={loading}
                onClick={() => setConfirmPlan(p.key)}
              >
                {loading ? <Spinner animation="border" size="sm" /> : 'Renew'}
              </Button>
            );
          } else if (isCurrent && !expired) {
            control = <Button variant="secondary" disabled>Current Plan</Button>;
          } else {
            control = (
              <Button
                variant={canSelect ? 'success' : 'outline-secondary'}
                disabled={!canSelect || loading}
                onClick={() => canSelect && setConfirmPlan(p.key)}
              >
                {loading ? <Spinner animation="border" size="sm" /> : 'Select'}
              </Button>
            );
          }

          // Wrap in tooltip for free when locked or used
          const wrappedControl =
            p.key === 'free' && (usedUpFree || freeLocked) ? (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>
                    {freeLocked
                      ? `Free tier locked until ${new Date(freeAvailableAt).toLocaleDateString()}.`
                      : `You’ve used your free gig this period.`}
                  </Tooltip>
                }
              >
                <span className="d-inline-block">{control}</span>
              </OverlayTrigger>
            ) : control;

          return (
            <Card
              key={p.key}
              className="flex-grow-1"
              style={{ minWidth: '12rem', opacity: (canSelect || isCurrent || needsRenewal) ? 1 : 0.6 }}
            >
              <Card.Body className="d-flex flex-column">
                <Card.Title>{p.label}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  MK {p.fee.toLocaleString()} / month
                </Card.Subtitle>
                <Card.Text className="flex-grow-1">
                  {p.posts} post{p.posts > 1 && 's'} / month
                </Card.Text>
                <div className="mt-auto">{wrappedControl}</div>
              </Card.Body>
            </Card>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      <Modal
        show={!!confirmPlan}
        onHide={() => setConfirmPlan(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Subscription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to{' '}
          {confirmPlan === currentPlan && !expired ? 'renew' : 'select'}{' '}
          the <strong>{confirmPlan}</strong> plan?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmPlan(null)}>
            Cancel
          </Button>
          <Button
            variant="success"
            disabled={loading}
            onClick={() => handleConfirmedSubscribe(confirmPlan)}
          >
            {loading
              ? <Spinner animation="border" size="sm" />
              : 'Yes, Confirm'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => {
          setShowSuccessModal(false);
          navigate('/subscription/status');
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Subscription Activated</Modal.Title>
        </Modal.Header>
        <Modal.Body>{successMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => {
              setShowSuccessModal(false);
              navigate('/subscription/status');
            }}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
 