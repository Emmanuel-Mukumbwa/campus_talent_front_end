// File: src/pages/MyNetwork.jsx

import React, { useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import StudentNetwork from './StudentNetwork';
import RecruiterNetwork from './RecruiterNetwork';

export default function MyNetwork() {
  const initialRole = localStorage.getItem('userRole') || 'student';
  const [role, setRole] = useState(initialRole);
  const userName = localStorage.getItem('userName') || 'User';
  const [pendingInvites] = useState(4);   // Mock data - connect to your API
  const [newApplicants] = useState(7);    // Mock data

  const handleRoleChange = newRole => {
    setRole(newRole);
    localStorage.setItem('userRole', newRole);
  };

  return (
    <Container fluid className="mt-1 pt-1">
      {/* Welcoming Header with Status Card */}
      <Row className="mb-3 align-items-start">
        {/* Main Header Text */}
        <Col lg={8} className="mb-4 mb-lg-9">
          <div className="text-center text-lg-start">
            <h2 className="display-6 mb-2">
              {role === 'student' ? (
                <>
                  <i className="bi bi-people-fill text-success me-2"></i>
                  Your Network Hub, {userName}!
                </>
              ) : (
                <>
                  <i className="bi bi-briefcase-fill text-success me-2"></i>
                  Talent Pool Dashboard, {userName}!
                </>
              )}
            </h2>
            <p className="lead text-muted">
              {role === 'student'
                ? "Connect with recruiters, showcase your skills, and discover opportunities."
                : "Find vetted campus talent, track top candidates, and simplified hiring."}
            </p>
          </div>
        </Col>

        {/* Status Card (Right-aligned on desktop, centered on mobile)
        <Col lg={4}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-3">
              {role === 'student' ? (
                <>
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-person-plus-fill text-success fs-5 me-2"></i>
                    <h6 className="mb-0">Network Updates</h6>
                  </div>
                  <p className="small text-muted mb-2">
                    You have {pendingInvites} pending invites
                  </p>
                  <Button
                    variant="success"
                    size="sm"
                    className="w-100"
                    onClick={() => {
                      // Navigate to invites page
                    }}
                  >
                    View Invites
                  </Button>
                </>
              ) : (
                <>
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-people-fill text-success fs-5 me-2"></i>
                    <h6 className="mb-0">Network Updates</h6>
                  </div>
                  <p className="small text-muted mb-2">
                    {newApplicants} new connection requests
                  </p>
                  <Button
                    variant="success"
                    size="sm"
                    className="w-100"
                    onClick={() => {
                      // Navigate to connection requests page
                    }}
                  >
                    View Connection Requests
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col> */}
      </Row>

      {/* Main Content */}
      {role === 'student' ? <StudentNetwork /> : <RecruiterNetwork />}
    </Container>
  );
}
