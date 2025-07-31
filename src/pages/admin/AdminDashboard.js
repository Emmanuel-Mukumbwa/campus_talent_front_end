// src/pages/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Spinner,
  Alert,
  Button
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats]               = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOverview() {
      try {
        const { data } = await api.get('/api/admin/dashboard');
        setStats(data.stats);
        setRecentActivity(data.recentActivity);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    fetchOverview();
  }, []);

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

  // Map your backend keys to human‑friendly labels
  const statsMap = [
    { key: 'activeUsers',           label: 'Active Users' },
    { key: 'activeGigs',            label: 'Open Gigs' },
    { key: 'completedGigs',         label: 'Completed Gigs' },
    { key: 'activeApplications',    label: 'In‑Progress Applications' },
    { key: 'completedApplications', label: 'Completed Applications' },
    { key: 'pendingVerifications',  label: 'Pending Verifications' },
    { key: 'totalSkills',           label: 'Total Skills', isLink: true, link: '/admin/skills' },
  ];

  return (
    <Container fluid>
      <h2 className="text-success mb-4">Admin Dashboard Overview</h2>

      <Row className="mb-4">
        {statsMap.map(({ key, label, isLink, link }) => (
          <Col key={key} md={2}>
            <Card
              bg="success"
              text="white"
              className="mb-2"
              style={isLink ? { cursor: 'pointer' } : {}}
              onClick={isLink ? () => navigate(link) : undefined}
            >
              <Card.Body className="text-center">
                <Card.Title>{stats[key]}</Card.Title>
                <Card.Text>{label}</Card.Text>
              </Card.Body>
              {isLink && (
                <Card.Footer className="bg-light text-success text-center py-1">
                  <small>Manage</small>
                </Card.Footer>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      <Card>
        <Card.Header className="bg-success text-white">Recent Activity</Card.Header>
        <ListGroup variant="flush">
          {recentActivity.length > 0 
            ? recentActivity.map((act, i) => (
                <ListGroup.Item key={i}>{act}</ListGroup.Item>
              ))
            : <ListGroup.Item>No recent activity.</ListGroup.Item>
          }
        </ListGroup>
      </Card>
    </Container>
  );
}
