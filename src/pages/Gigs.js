// src/pages/Gigs.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Modal
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import StudentGigs from './StudentGigs';
import RecruiterGigs from './RecruiterGigs';
import './Gigs.css';

export default function Gigs() {
  const navigate = useNavigate();
  const initialRole = localStorage.getItem('userRole') || 'student';
  const [role, setRole] = useState(initialRole);
  const [pending, setPending] = useState(0);
  const userName = localStorage.getItem('userName') || 'User';
  const userId = localStorage.getItem('userId');

  // Modal state for unauthorized / unverified / subscription issues
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMsg, setAuthModalMsg] = useState('');
  const [showVerifyButton, setShowVerifyButton] = useState(false);

  // Re-fetch counts whenever the role changes
  useEffect(() => {
    async function fetchCounts() {
      try {
        if (role === 'recruiter') {
          // Recruiter: count all "Applied" across gigs
          const { data: gigs } = await api.get('/api/gigsstatus/recruitergigs', { params: { recruiterId: userId } });
          const counts = await Promise.all(
            (gigs || []).map((g) =>
              api
                .get(`/api/gigsstatus/${g.id}/applications`, {
                  params: { status: 'Applied' }
                })
                .then((r) => r.data.count)
                .catch(() => 0)
            )
          );
          setPending(counts.reduce((sum, c) => sum + (c || 0), 0));
        } else {
          // Student: all reviewed (non-draft) applications
          const { data: apps } = await api.get(`/api/gigsstatus/studentsreviewedgigs/${userId}/applications`, { params: { status: '!draft' } });
          setPending(Array.isArray(apps) ? apps.length : 0);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching application counts', err);
        setPending(0);
      }
    }
    fetchCounts();
  }, [role, userId]);

  // Post Gig click handler with verification & subscription check
  const handlePostGigClick = async () => {
    let me;
    // 1) ensure logged in
    try {
      const resp = await api.get('/api/auth/me');
      me = resp?.data ?? resp;
    } catch {
      setAuthModalMsg('Please log in as a recruiter to post gigs.');
      setShowVerifyButton(false);
      setShowAuthModal(true);
      return;
    }

    // 2) ensure recruiter role
    if (me?.role !== 'recruiter') {
      setAuthModalMsg('Only recruiters can post gigs.');
      setShowVerifyButton(false);
      setShowAuthModal(true);
      return;
    }

    // 3) ensure fully verified
    try {
      const { data } = await api.get('/api/recruiters/verification-status');
      if (data?.verification_status !== 'fully_verified') {
        setAuthModalMsg('Your account must be fully verified before posting gigs. Please complete verification first.');
        setShowVerifyButton(true);
        setShowAuthModal(true);
        return;
      }
    } catch {
      setAuthModalMsg('Unable to check your verification status. Please try again.');
      setShowVerifyButton(false);
      setShowAuthModal(true);
      return;
    }

    // 4) ensure subscription allows posting
    try {
      const { data: sub } = await api.get('/api/subscriptions/status');

      // No subscription
      if (!sub?.plan) {
        setAuthModalMsg('You need an active subscription to post gigs. Please choose a plan.');
        setShowVerifyButton(true);
        setShowAuthModal(true);
        return;
      }
      // Inactive subscription
      if (sub?.status !== 'active') {
        setAuthModalMsg('Your subscription is not active. Please renew or choose another plan.');
        setShowVerifyButton(true);
        setShowAuthModal(true);
        return;
      }
      // Exceeded monthly quota
      if (typeof sub.usedPosts === 'number' && typeof sub.maxPosts === 'number' && sub.usedPosts >= sub.maxPosts) {
        setAuthModalMsg(`You have used all ${sub.maxPosts} posts this period. Please upgrade or wait until ${new Date(sub.periodEnd).toLocaleDateString()}.`);
        setShowVerifyButton(true);
        setShowAuthModal(true);
        return;
      }
    } catch {
      setAuthModalMsg('Unable to check your subscription. Please try again.');
      setShowVerifyButton(true);
      setShowAuthModal(true);
      return;
    }

    // All checks passed!
    navigate('/post-job');
  };

  return (
    <Container fluid className="my-gigs-page">
      {/* Header + Status Card */}
      <Row className="mb-4 align-items-start">
        <Col lg={8} className="mb-4 mb-lg-0">
          <div className="network-header">
            <h2 className="display-6 mb-0">
              <i className="bi bi-briefcase-fill text-success me-2" />
              {role === 'student' ? `Your Gig Board, ${userName}!` : `Manage Your Gigs, ${userName}!`}
            </h2>
            <p className="lead">
              {role === 'student'
                ? 'Browse and apply for gigs tailored to your skills.'
                : 'Post new gigs, review applicants, and manage your listings.'}
            </p>
          </div>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm status-card">
            <Card.Body className="p-3 d-flex flex-column">
              <div className="d-flex align-items-center mb-2">
                <i className={`bi ${role === 'student' ? 'bi-person-check' : 'bi-people-fill'} text-success fs-5 me-2`} />
                <h6 className="mb-0">Gig Updates ({pending})</h6>
              </div>

              <div className="d-grid gap-2 mt-auto">
                {role === 'student' ? (
                  <Button variant="success" size="sm" onClick={() => navigate('/student/applications')}>
                    View Applications
                  </Button>
                ) : (
                  <>
                    <Button variant="success" size="sm" onClick={() => navigate('/recruiter/applications')}>
                      View Applications
                    </Button>
                    <Button variant="success" size="sm" onClick={handlePostGigClick}>
                      Post Gig
                    </Button>
                    <Button variant="outline-success" size="sm" onClick={() => navigate('/subscriptions')}>
                      Manage Subscription
                    </Button>
                  </>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      {role === 'student' ? <StudentGigs /> : <RecruiterGigs />}

      {/* Auth / Verification / Subscription Modal */}
      <Modal show={showAuthModal} onHide={() => setShowAuthModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Access Restricted</Modal.Title>
        </Modal.Header>
        <Modal.Body>{authModalMsg}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAuthModal(false)}>
            Cancel
          </Button>
          {showVerifyButton ? (
            <Button variant="success" onClick={() => { setShowAuthModal(false); navigate('/subscriptions'); }}>
              Manage Subscription
            </Button>
          ) : (
            <Button variant="success" onClick={() => { setShowAuthModal(false); navigate('/login'); }}>
              Go to Login
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
}