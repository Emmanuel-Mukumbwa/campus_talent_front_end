//src/pages/admin/VerificationsList.jsx
import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Container,
  Form,
  Row,
  Col,
  Spinner
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

export default function VerificationsList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // filter state
  const [statusFilter, setStatusFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      // stub: replace with real API call
      const { data } = await api.get('/api/admin/verifications');
      setRecords(data);
      setLoading(false);
    }
    load();
  }, []);

  // apply filters
  const filtered = records
    .filter(r =>
      (statusFilter ? r.verification_status === statusFilter : true) &&
      (entityFilter ? r.entity_type === entityFilter : true)
    )
    // pending first
    .sort((a, b) => {
      if (a.verification_status === 'pending' && b.verification_status !== 'pending') return -1;
      if (b.verification_status === 'pending' && a.verification_status !== 'pending') return 1;
      return new Date(b.updated_at) - new Date(a.updated_at);
    });

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h3 className="text-success mb-4">Recruiter Verifications</h3>

      <Form className="mb-3">
        <Row>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="basic_verified">Basic Verified</option>
                <option value="fully_verified">Fully Verified</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Entity Type</Form.Label>
              <Form.Select
                value={entityFilter}
                onChange={e => setEntityFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="company">Company</option>
                <option value="freelancer">Freelancer</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <Table bordered hover>
        <thead className="table-success">
          <tr>
            <th>Recruiter</th>
            <th>Email Verified</th>
            <th>Domain</th>
            <th>Entity</th>
            <th>Status</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(r => (
            <tr key={r.id}>
              <td>{r.recruiterName}</td>
              <td>{r.email_verified ? 'Yes' : 'No'}</td>
              <td>{r.domain || '—'}</td>
              <td className="text-capitalize">{r.entity_type}</td>
              <td className="text-capitalize">{r.verification_status.replace('_', ' ')}</td>
              <td>{new Date(r.updated_at).toLocaleString()}</td>
              <td>
                <Button
                  as={Link}
                  to={`/admin/verifications/${r.id}`}
                  size="sm"
                  variant="outline-success"
                >
                  Review
                </Button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}
