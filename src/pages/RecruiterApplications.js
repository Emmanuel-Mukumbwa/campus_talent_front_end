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

import ApplicationsTable from '../components/applications/ApplicationsTable';
import TaskChecklist     from '../components/applications/TaskChecklist';

export default function RecruiterApplications() {
  const { gigId }            = useParams();
  const navigate             = useNavigate();
  const isAllGigs            = !gigId;
  const [gigTitle, setGigTitle] = useState(
    isAllGigs ? 'All Applications' : `Gig #${gigId}`
  );

  const [apps, setApps]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Modal state
  const [showModal, setShowModal]        = useState(false);
  const [modalAction, setModalAction]    = useState('');   // 'shortlist'|'accept'|'reject'
  const [modalAppId, setModalAppId]      = useState(null);
  const [modalLoading, setModalLoading]  = useState(false);
 
  // If a gigId is present, fetch its title
  useEffect(() => {
    if (!isAllGigs) {
      api.get(`/api/gigs1/${gigId}`)
        .then(({ data }) => data.title && setGigTitle(data.title))
        .catch(() => {});
    }
  }, [gigId, isAllGigs]);

  // Fetch all applications then filter if needed
  const fetchApps = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/api/legacy/gig_applications');
      const nonDraft = data.filter(a => a.status !== 'draft');
      const filtered = isAllGigs
        ? nonDraft
        : nonDraft.filter(a => String(a.gig_id) === String(gigId));
      setApps(filtered);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [gigId, isAllGigs]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  // Status change availability
  const canShortlist = s => s === 'Applied';
  const canAccept    = s => ['Applied','Shortlisted'].includes(s);
  const canReject    = s => ['Applied','Shortlisted'].includes(s);

  // Open confirm modal
  const openModal = (appId, action) => {
    setModalAppId(appId);
    setModalAction(action);
    setShowModal(true);
    setError('');
  };

  // Confirm status update and fire notification
  const handleConfirm = async () => {
    if (!modalAppId || !modalAction) return;
    setModalLoading(true);
    setError('');

    const mapping = {
      shortlist: 'Shortlisted',
      accept:    'Accepted',
      reject:    'Rejected'
    };
    const newStatus = mapping[modalAction];

    try {
      // 1) update application status
      await api.patch(
        `/api/legacy/gig_applications/${modalAppId}/status`,
        { status: newStatus }
      );

      // 2) find the application we just updated
      const app = apps.find(a => a.id === modalAppId);
      if (app) {
        // 3) send in-app notification to the student
        await api.post('/api/notifications', {
          recipient_id: app.student_id,
          type: `application_${newStatus.toLowerCase()}`,
          data: {
            gigId: app.gig_id,
            appId: modalAppId,
            text: `Your application for “${gigTitle}” was ${newStatus.toLowerCase()}.`
          }
        });
      }

      setShowModal(false);
      fetchApps();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setModalLoading(false);
    }
  };

  // Handle delete action
  const handleDelete = async (appId) => {
    if (!window.confirm('Delete this application?')) return;
    await api.delete(`/api/legacy/gig_applications/${appId}`);
    fetchApps();
  };

  // Table columns
  const columns = [
    {
      header: isAllGigs ? 'Gig Title' : 'Student',
      render: app => isAllGigs
        ? app.gig.title
        : (
            <>
              {app.student.name}<br/>
              <small>⭐{app.student.rating.toFixed(1)}</small>
            </>
          )
    },
    {
      header: isAllGigs ? 'Recruiter' : 'Skills',
      render: app => isAllGigs
        ? app.gig.recruiterName
        : app.student.skills.join(', ')
    },
    { header: 'Status', field: 'status' },
    {
      header: 'Applied At',
      render: app => new Date(app.applied_at).toLocaleDateString()
    },
    {
      header: 'Payment',
      render: app => `MWK ${app.payment_amount?.toLocaleString()}`
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
            variant="outline-success"
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
          {app.status === 'Applied' && (
            <Button
              size="sm"
              variant="outline-danger"
              className="ms-1"
              onClick={() => handleDelete(app.id)}
            >
              Delete
            </Button>
          )}
        </>
      )
    },
    {
      header: 'View',
      render: app => (
        <>
          <Button
            size="sm"
            variant="outline-primary"
            className="me-1"
            onClick={() =>
              navigate(
                `/recruiter/applications/${isAllGigs ? app.gig_id : gigId}/${app.id}/review`
              )
            }
          >
            Review
          </Button>
          <Button
            size="sm"
            variant="outline-success"
            className="me-1"
            onClick={() =>
              navigate(
                isAllGigs
                  ? `/recruiter/applications/${app.gig_id}/${app.id}`
                  : `/recruiter/applications/${gigId}/${app.id}`
              )
            }
          >
            Details
          </Button>
          <Button
            size="sm"
            variant="outline-success"
            onClick={() =>
              navigate(
                `/recruiter/portfolioview/${app.student_id}`,
                { state: { studentName: app.student.name } }
              )
            }
          >
            Portfolio
          </Button>
        </>
      )
    }
  ];

  return (
    <Container className="py-4">
      <h3 className="mb-5 text-success">
        {isAllGigs ? 'All Applications' : `Applicants for “${gigTitle}”`}
      </h3>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" variant="success" />
        </div>
      ) : (
        <ApplicationsTable
          applications={apps}
          columns={columns}
        />
      )}

      {/* Confirm Modal */}
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
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            disabled={modalLoading}
          >
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
