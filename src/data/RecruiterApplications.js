// File: src/pages/RecruiterApplications.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Alert,
  Spinner,
  Button,
  Modal
} from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

import StatusTabs        from '../components/applications/StatusTabs';
import ApplicationsTable from '../components/applications/ApplicationsTable';
import TaskChecklist     from '../components/applications/TaskChecklist';

const STATUSES = ['All','Applied','Shortlisted','Accepted','Completed','Rejected'];

export default function RecruiterApplications() {
  const { gigId }               = useParams();
  const navigate                 = useNavigate(); 
  const [gigTitle, setGigTitle]  = useState(`Gig #${gigId}`); 
  const [apps, setApps]          = useState([]);
  const [status, setStatus]      = useState('All');
  const [loading, setLoading]    = useState(false);
  const [error, setError]        = useState('');

  // Modal state
  const [showModal, setShowModal]      = useState(false);
  const [modalAction, setModalAction]  = useState('');   // 'shortlist'|'accept'|'reject'
  const [modalAppId, setModalAppId]    = useState(null);
  const [modalLoading, setModalLoading]= useState(false);

  // Fetch gig title
  useEffect(() => {
    api.get(`/api/gigs1/${gigId}`)
      .then(({ data }) => data.title && setGigTitle(data.title))
      .catch(() => setGigTitle(`Gig #${gigId}`));
  }, [gigId]);

  // Fetch applications
  const fetchApps = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { gig_id: gigId };
      if (status !== 'All') params.status = status;
      const { data } = await api.get('/api/gig_applications', { params });
      setApps(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [gigId, status]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  // Decide if button should be enabled for a given status
  const canShortlist = s => s === 'Applied';
  const canAccept    = s => ['Applied','Shortlisted'].includes(s);
  const canReject    = s => ['Applied','Shortlisted'].includes(s);

  // Open modal
  const openModal = (appId, action) => {
    setModalAppId(appId);
    setModalAction(action);
    setShowModal(true);
    setError('');
  };

  // Handle confirm
  const handleConfirm = async () => {
    if (!modalAppId || !modalAction) return;
    setModalLoading(true);
    setError('');
    let newStatus = null;
    if (modalAction === 'shortlist') newStatus = 'Shortlisted';
    if (modalAction === 'accept')    newStatus = 'Accepted';
    if (modalAction === 'reject')    newStatus = 'Rejected';

    try {
      await api.patch(
        `/api/gig_applications/${modalAppId}/status`,
        { status: newStatus }
      );
      setShowModal(false);
      fetchApps();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setModalLoading(false);
    }
  };

  // Table columns (View moved to right)
  const columns = [
    {
      header: 'Student',
      render: app => (
        <>
          {app.student.name}
          <br/>
          <small>⭐{app.student.rating.toFixed(1)}</small>
        </>
      )
    },
    {
      header: 'Skills',
      render: app => app.student.skills.join(', ')
    },
    {
      header: 'Proposal',
      render: app => `${app.proposal_text.slice(0, 80)}…`
    },
    {
      header: 'Deliverables',
      render: app => <TaskChecklist items={app.deliverables} />
    },
    {
      header: 'Actions',
      render: app => (
        <>
          <Button
            size="sm"
            variant="outline-success"
            className="me-1"
            disabled={!canShortlist(app.status)}
            onClick={() => openModal(app.id, 'shortlist')}
          >
            Shortlist
          </Button>
          <Button
            size="sm"
            variant="outline-primary"
            className="me-1"
            disabled={!canAccept(app.status)}
            onClick={() => openModal(app.id, 'accept')}
          >
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline-danger"
            disabled={!canReject(app.status)}
            onClick={() => openModal(app.id, 'reject')}
          >
            Reject
          </Button>
        </>
      )
    },
    {
      header: 'View',
      render: app => (
        <Button
          size="sm"
          variant="outline-success"
          onClick={() => navigate(`/recruiter/applications/${gigId}/${app.id}`)}
        >
          View
        </Button>
      )
    }
  ];

  return (
    <Container className="py-4">
      <h3>Applicants for “{gigTitle}”</h3>

      <StatusTabs
        statuses={STATUSES}
        active={status}
        onSelect={key => setStatus(key)}
      />

      {/* Inline Error */}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <ApplicationsTable
          applications={apps}
          columns={columns}
        />
      )}

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalAction === 'shortlist' && 'Confirm Shortlist'}
            {modalAction === 'accept'    && 'Confirm Accept'}
            {modalAction === 'reject'    && 'Confirm Reject'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalAction === 'shortlist' && 'Are you sure you want to shortlist this application?'}
          {modalAction === 'accept'    && 'Are you sure you want to accept this application?'}
          {modalAction === 'reject'    && 'Are you sure you want to reject this application?'}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={modalLoading}>
            Cancel
          </Button>
          <Button
            variant={modalAction === 'reject' ? 'danger' : 'success'}
            onClick={handleConfirm}
            disabled={modalLoading}
          >
            {modalLoading
              ? <Spinner as="span" animation="border" size="sm" />
              : `Yes, ${modalAction.charAt(0).toUpperCase() + modalAction.slice(1)}`}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
