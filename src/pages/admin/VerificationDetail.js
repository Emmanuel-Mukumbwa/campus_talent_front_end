// File: src/pages/admin/VerificationDetail.jsx

import React, { useState, useEffect } from 'react';
import {
  Container,
  Button,
  Spinner,
  Row,
  Col,
  Card,
  Form,
  Image,
  Modal
} from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export default function VerificationDetail() {
  const { id: verificationId } = useParams();
  const navigate = useNavigate();

  const [record, setRecord]         = useState(null);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newStatus, setNewStatus]   = useState('');
  const [comment, setComment]       = useState('');

  // File‑action confirmation modal state
  const [confirmAction, setConfirmAction] = useState({
    show:    false,
    fileKey: null,
    status:  null,
    label:   ''
  });

  // Preview modal state
  const [previewSrc, setPreviewSrc]   = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Build preview URL
  const openPreview = path => {
    if (!path) return;
    const base = api.defaults.baseURL?.replace(/\/+$/, '') || window.location.origin;
    setPreviewSrc(path.startsWith('http') ? path : `${base}${path}`);
    setShowPreview(true);
  };
  const closePreview = () => setShowPreview(false);

  // Load verification record
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/api/admin/verifications/${verificationId}`);
        console.log('VERIFICATION RECORD:', data);
        setRecord(data);
        setNewStatus(data.verification_status);
      } catch (err) {
        console.error(err);
        alert('Failed to load record');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [verificationId]);

  // Submit overall status change and notify recruiter
  const handleSubmit = async e => {
    e.preventDefault();
    if (!record) return;

    setSubmitting(true);
    try {
      // 1) update the verification status
      await api.post(
        `/api/admin/verifications/${verificationId}/update-status`,
        { status: newStatus, comment }
      );

      // 2) pick the correct recruiter ID field
      const recipientId = record.userId      // your backend is returning userId
                        || record.recruiter_id
                        || record.user_id
                        || record.id;       // fallback

      if (!recipientId) {
        console.error('No recruiter ID on record:', record);
        alert('Cannot send notification: recruiter ID missing.');
        setSubmitting(false);
        return;
      }

      // 3) send in‑app notification
      await api.post('/api/notifications', {
        recipient_id: recipientId,
        type:         `recruiter_${newStatus}`,
        data: {
          text: `Your account is now "${newStatus.replace('_',' ')}".`
        }
      });

      navigate('/admin/verifications');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  // Confirm per‑file status change
  const handleConfirmFile = async () => {
    const { fileKey, status } = confirmAction;
    setConfirmAction(c => ({ ...c, show: false }));
    try {
      await api.post(
        `/api/admin/verifications/${verificationId}/file-status`,
        { fileKey, status }
      );
      setRecord(r => ({ ...r, [`${fileKey}_status`]: status }));
    } catch (err) {
      console.error(err);
      alert('Failed to update file status');
    }
  };

  const isImage = url => /\.(jpe?g|png|gif|bmp|webp)$/i.test(url);

  if (loading || !record) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  // List of files including TIN
  const files = [
    { label: 'Letterhead',      key: 'letterhead_path', statusKey: 'letterhead_status' },
    { label: 'TIN Certificate', key: 'tin_number',     statusKey: 'tin_status'       },
    { label: 'ID Front',        key: 'id_front_path',   statusKey: 'id_front_status'  },
    { label: 'ID Back',         key: 'id_back_path',    statusKey: 'id_back_status'   },
    { label: 'Selfie',          key: 'selfie_path',     statusKey: 'selfie_status'    },
  ];

  return (
    <>
      <Container className="py-4">
        <Button variant="link" onClick={() => navigate(-1)}>
          ← Back to Verifications
        </Button>

        <h3 className="text-success mb-4">Verify: {record.recruiterName}</h3>

        <Row className="mb-4">
          <Col md={6}>
            <Card className="mb-3">
              <Card.Body>
                <p><strong>Recruiter:</strong> {record.recruiterName}</p>
                <p><strong>Email Verified:</strong> {record.email_verified ? 'Yes' : 'No'}</p>
                <p><strong>Domain:</strong> {record.domain || '—'}</p>
                <p><strong>Entity Type:</strong> {record.entity_type}</p>
                <p><strong>Current Status:</strong> {record.verification_status.replace('_',' ')}</p>
                <p><strong>Last Updated:</strong> {new Date(record.updated_at).toLocaleString()}</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card>
              <Card.Header>Uploaded Documents</Card.Header>
              <Card.Body>
                <Row>
                  {files.map(({ label, key, statusKey }) => {
                    const path       = record[key];
                    const fileStatus = record[statusKey] || 'pending';
                    const simpleKey  = key === 'tin_number'
                      ? 'tin'
                      : key.replace(/_(path|number)$/, '');

                    return (
                      <Col key={key} xs={6} className="mb-4 text-center">
                        {path ? (
                          <>
                            {isImage(path)
                              ? (
                                <Image
                                  src={path}
                                  thumbnail
                                  style={{ maxHeight: 120, objectFit: 'cover', cursor: 'pointer' }}
                                  alt={label}
                                  onClick={() => openPreview(path)}
                                />
                              )
                              : (
                                <a href={path} target="_blank" rel="noopener noreferrer">
                                  Open {label}
                                </a>
                              )
                            }

                            <div className="mt-1">
                              {isImage(path) && (
                                <Button variant="link" size="sm" onClick={() => openPreview(path)}>
                                  Preview
                                </Button>
                              )}{' '}
                              <a href={path} target="_blank" rel="noopener noreferrer">
                                Download
                              </a>
                            </div>

                            <div>
                              <small className={
                                fileStatus === 'rejected' ? 'text-danger' :
                                fileStatus === 'approved' ? 'text-success' :
                                'text-muted'
                              }>
                                {fileStatus}
                              </small>
                            </div>

                            <Button
                              variant={fileStatus === 'approved' ? 'success' : 'outline-success'}
                              size="sm"
                              className="me-1 mt-1"
                              onClick={() => setConfirmAction({
                                show:    true,
                                fileKey: simpleKey,
                                status:  fileStatus === 'approved' ? 'pending' : 'approved',
                                label:   fileStatus === 'approved'
                                          ? 'Undo approve this file?'
                                          : 'Approve this file?'
                              })}
                            >
                              {fileStatus === 'approved' ? 'Undo Approve' : 'Approve'}
                            </Button>

                            <Button
                              variant={fileStatus === 'rejected' ? 'danger' : 'outline-danger'}
                              size="sm"
                              className="mt-1"
                              onClick={() => setConfirmAction({
                                show:    true,
                                fileKey: simpleKey,
                                status:  fileStatus === 'rejected' ? 'pending' : 'rejected',
                                label:   fileStatus === 'rejected'
                                          ? 'Undo reject this file?' 
                                          : 'Reject this file?'
                              })}
                            >
                              {fileStatus === 'rejected' ? 'Undo Reject' : 'Reject'}
                            </Button>
                          </>
                        ) : (
                          <p className="text-muted">No {label}</p>
                        )}
                      </Col>
                    );
                  })}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card>
          <Card.Header>Update Verification Status</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>New Status</Form.Label>
                <Form.Select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="basic_verified">Basic Verified</option>
                  <option value="fully_verified">Fully Verified</option>
                  <option value="rejected">Rejected</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Comment / Reason</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Enter a comment for this status change"
                  required
                />
              </Form.Group>

              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Save Changes'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      {/* File‑action Confirmation Modal */}
      <Modal
        show={confirmAction.show}
        onHide={() => setConfirmAction(c => ({ ...c, show: false }))}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{confirmAction.label}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmAction(c => ({ ...c, show: false }))}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmFile}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Preview Modal */}
      <Modal show={showPreview} onHide={closePreview} centered size="lg">
        <Modal.Body className="text-center">
          <img src={previewSrc} alt="Preview" className="img-fluid" />
        </Modal.Body>
      </Modal>
    </>
  );
}
