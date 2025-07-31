// src/pages/StudentApplications.jsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Alert,
  Spinner,
  Button,
  Modal
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

import ApplicationsTable from '../components/applications/ApplicationsTable';

export default function StudentApplications() {
  const navigate = useNavigate();

  // State
  const [apps, setApps]               = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAppId, setDeleteAppId]         = useState(null);
  const [deleteLoading, setDeleteLoading]     = useState(false);

  // Fetch all applications
  const fetchApps = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/api/legacy/gig_applications');
      setApps(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  // Open modal for confirmation
  const openDeleteModal = (appId) => {
    setDeleteAppId(appId);
    setShowDeleteModal(true);
  };

  // Confirm deletion
  const handleConfirmDelete = async () => {
    if (!deleteAppId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/api/legacy/gig_applications/${deleteAppId}`);
      setShowDeleteModal(false);
      fetchApps();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete application');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Define table columns
  const columns = [
    {
      header: 'Gig Title',
      render: app => app.gig.title
    },
    {
      header: 'Recruiter',
      render: app => app.gig.recruiterName
    },
    {
      header: 'Status',
      field: 'status'
    },
    {
      header: 'Applied At',
      render: app => new Date(app.applied_at).toLocaleDateString()
    },
    {
      header: 'Payment',
      render: app => `MWK ${app.payment_amount?.toLocaleString()}`
    },
    {
      header: 'Actions',
      render: app => (
        <>
          {app.status === 'Applied' && (
            <Button
              size="sm"
              variant="outline-danger"
              className="me-2"
              onClick={() => openDeleteModal(app.id)}
            >
              Delete
            </Button>
          )}
          <Button
            size="sm"
            variant="outline-success"
            onClick={() => navigate(`/student/applications/${app.id}`)}
          >
            Details
          </Button>
        </>
      )
    }
  ];

  return (
    <Container className="py-4">
      <h3 className="mb-5 text-success">My Applications</h3>

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

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this application? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            variant="outline-danger"
            onClick={handleConfirmDelete}
            disabled={deleteLoading}
          >
            {deleteLoading
              ? <Spinner as="span" animation="border" size="sm" />
              : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
