import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Container,
  Spinner,
  Alert
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export default function ApplicationTracking() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchApplications() {
      try {
        const res = await api.get('/api/admin/applications');
        setApps(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load applications');
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, []);

  const viewApplication = (app) => {
    navigate(`/admin/applications/${app.id}`);
  };

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
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h3 className="text-success mb-3">Application Tracking</h3>
      {apps.length === 0 ? (
        <Alert variant="info">No applications found.</Alert>
      ) : (
        <Table bordered hover responsive>
          <thead className="table-success">
            <tr>
              <th>ID</th>
              <th>Gig</th>
              <th>Student</th>
              <th>Status</th>
              <th>Applied At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.gigTitle}</td>
                <td>{a.studentName}</td>
                <td className="text-capitalize">{a.status}</td>
                <td>{new Date(a.applied_at).toLocaleString()}</td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-success"
                    onClick={() => viewApplication(a)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
