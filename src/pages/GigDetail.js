// File: src/pages/GigDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Spinner,
  Alert,
  Card,
  Badge,
  Row,
  Col,
  Button,
  ListGroup
} from 'react-bootstrap';
import {
  FaMapMarkerAlt,
  FaClock,
  FaTag,
  FaRegMoneyBillAlt,
  FaClipboardList,
  FaPiggyBank,
  FaCalendarAlt,
  FaUsers,
  FaListAlt,
  FaStar,
  FaFileAlt
} from 'react-icons/fa';
import api from '../utils/api';

export default function GigDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/api/gigdetail/${id}`);
        setGig(data);
      } catch (e) {
        setError(e.response?.data?.message || 'Could not load gig.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={() => navigate(-1)}>← Back</Button>
      </Container>
    );
  }
  if (!gig) return null;

  return (
    <Container className="py-5">
      <Button variant="link" onClick={() => navigate(-1)}>
        ← Back to List
      </Button>

      {/* Main Gig Card */}
      <Card className="mt-3 shadow-sm border-start border-4" style={{ borderColor: '#28a745' }}>
        <Card.Header className="bg-success text-white py-3">
          <h2 className="mb-1">{gig.title}</h2>
          <small className="text-light">
            Posted by recruiter #{gig.recruiter_id} on{' '}
            {new Date(gig.created_at).toLocaleDateString()}
          </small>
        </Card.Header>

        <Card.Body>
          {/* Core Details */}
          <Row className="mb-4">
            <Col md={6}>
              <dl className="row mb-0">
                <dt className="col-sm-4"><FaTag className="me-1 text-success" />Type</dt>
                <dd className="col-sm-8">{gig.gig_type}</dd>
                <dt className="col-sm-4"><FaMapMarkerAlt className="me-1 text-success" />Location</dt>
                <dd className="col-sm-8">{gig.location || '—'}</dd>
                <dt className="col-sm-4"><FaClock className="me-1 text-success" />Duration</dt>
                <dd className="col-sm-8">{gig.duration || '—'}</dd>
                <dt className="col-sm-4"><FaClipboardList className="me-1 text-success" />Deliverables</dt>
                <dd className="col-sm-8">{gig.deliverables}</dd>
              </dl>
            </Col>
            <Col md={6}>
              <dl className="row mb-0">
                <dt className="col-sm-4"><FaRegMoneyBillAlt className="me-1 text-success" />Budget</dt>
                <dd className="col-sm-8">{gig.budget_type}</dd>
                {gig.fixedPrice != null && (
                  <>
                    <dt className="col-sm-4"><FaRegMoneyBillAlt className="me-1 text-success" />Fixed Price</dt>
                    <dd className="col-sm-8">
                      MK {parseFloat(gig.fixedPrice).toLocaleString()}
                    </dd>
                  </>
                )}
                {gig.estimatedHours != null && (
                  <>
                    <dt className="col-sm-4"><FaClock className="me-1 text-success" />Est. Hours</dt>
                    <dd className="col-sm-8">{gig.estimatedHours} hr</dd>
                  </>
                )}
                <dt className="col-sm-4"><FaCalendarAlt className="me-1 text-success" />Expires</dt>
                <dd className="col-sm-8">
                  {gig.expires_at
                    ? new Date(gig.expires_at).toLocaleDateString()
                    : '—'}
                </dd>
              </dl>
            </Col>
          </Row>

          <div className="gradient-divider" />

          {/* Description */}
          <div className="p-4 rounded mb-4" style={{ backgroundColor: '#e9f7ef' }}>
            <h5><FaFileAlt className="me-2 text-success" />Description</h5>
            <p className="mb-0">{gig.description}</p>
          </div>

          {/* Requirements & Skills */}
          <Row className="mb-4">
            {gig.requirements?.length > 0 && (
              <Col md={6}>
                <h5><FaListAlt className="me-2 text-success" />Requirements</h5>
                <ListGroup variant="flush" className="border rounded">
                  {gig.requirements.map(r => (
                    <ListGroup.Item key={r.id}>
                      <strong>
                        {r.type.replace(/_/g, ' ')
                          .replace(/\b\w/g, c => c.toUpperCase())}:
                      </strong>{' '}
                      {r.details || 'Required'}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
            )}
            {gig.skills?.length > 0 && (
              <Col md={6}>
                <h5><FaStar className="me-2 text-success" />Skills & Proficiency</h5>
                <div className="d-flex flex-wrap gap-2">
                  {gig.skills.map(s => {
                    const color =
                      s.proficiency === 'Expert' ? 'danger' :
                      s.proficiency === 'Intermediate' ? 'warning' :
                      'success';
                    return (
                      <Badge
                        key={s.skill_id}
                        bg="light"
                        text="dark"
                        className="border"
                      >
                        {s.name}{' '}
                        <Badge bg={color} text="light">
                          {s.proficiency}
                        </Badge>
                      </Badge>
                    );
                  })}
                </div>
              </Col>
            )}
          </Row>

          <div className="gradient-divider" />

          {/* Escrow & Applicants */}
          <Row>
            <Col md={6}>
              <h5><FaPiggyBank className="me-2 text-success" />Escrow Status</h5>
              {gig.escrow ? (
                <p>
                  {gig.escrow.paid
                    ? <Badge bg="success">Released</Badge>
                    : <Badge bg="warning">Held</Badge>
                  }{' '}
                  since {new Date(gig.escrow.created_at).toLocaleDateString()}
                </p>
              ) : (
                <p><em>No escrow deposited yet.</em></p>
              )}
            </Col>
            <Col md={6}>
              <h5><FaUsers className="me-2 text-success" />Applicants</h5>
              <p className="display-6 text-success mb-0">{gig.applicantCount}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}
