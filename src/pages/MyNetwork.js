// src/pages/MyNetwork.jsx
import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import StudentNetwork from './StudentNetwork';
import RecruiterNetwork from './RecruiterNetwork';

export default function MyNetwork() {
  const initialRole = localStorage.getItem('userRole') || 'student';
  const [role] = useState(initialRole);
  const userName = localStorage.getItem('userName') || 'User';

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
                  <i className="bi bi-people-fill text-success me-2" />
                  Your Network Hub, {userName}!
                </>
              ) : (
                <>
                  <i className="bi bi-briefcase-fill text-success me-2" />
                  Talent Pool Dashboard, {userName}!
                </>
              )}
            </h2>
            <p className="lead text-muted">
              {role === 'student'
                ? 'Connect with recruiters, showcase your skills, and discover opportunities.'
                : 'Find vetted campus talent, track top candidates, and simplified hiring.'}
            </p>
          </div>
        </Col>
      </Row>

      {/* Main Content */}
      {role === 'student' ? <StudentNetwork /> : <RecruiterNetwork />}
    </Container>
  );
}