// File: src/pages/student/StudentNetwork.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Offcanvas, Button } from 'react-bootstrap';
import FiltersSidebar from '../components/FiltersSidebar';
import ConnectionsSection from '../components/connections/ConnectionsSection';
import Recommendations from '../components/Recommendations';
import AnalyticsPanel from '../components/AnalyticsPanel';
import { studentRecs, growthData } from '../data/networkData';

export default function StudentNetwork() {
  const [filters, setFilters] = useState({
    search: '',
    program: '',
    skills: '',
    dateJoined: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const analytics = {
    growth: '12%',
    topSkills: ['Python', 'UI/UX'],
    skillPercents: ['70%', '50%'],
  };

  const handleFilterChange = (field, value) => {
    setFilters(f => ({ ...f, [field]: value }));
  };
  const clearFilters = () => {
    setFilters({ search: '', program: '', skills: '', dateJoined: '' });
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        {/* Desktop Sidebar */}
        <Col lg={3} className="d-none d-lg-block border-end">
          <div className="sticky-top pt-3">
            <FiltersSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              clearFilters={clearFilters}
              show
              onToggle={() => {}}
            />
          </div>
        </Col>

        {/* Main Content */}
        <Col lg={6} xs={12}>
          <ConnectionsSection
            viewerRole="student"
            filters={filters}
            onFilterChange={handleFilterChange}
            clearFilters={clearFilters}
          />

          {/*<div className="mt-4">
            <h5>Recommendations</h5>
            <Recommendations recs={studentRecs} columns={1} />
          </div>*/}
        </Col>

        {/* Analytics */}
        <Col lg={3} className="d-none d-lg-block ps-4">
          <AnalyticsPanel role="student" analytics={analytics} data={growthData} />
        </Col>
      </Row>

      {/* Mobile Filters FAB */}
      <Button
        className="d-lg-none fixed-bottom mb-3 ms-auto me-3 rounded-pill shadow"
        variant="outline-success"
        style={{ width: 'fit-content' }}
        onClick={() => setShowFilters(true)}
      >
        <i className="bi bi-funnel-fill me-1" /> Filters
      </Button>

      {/* Offcanvas for Mobile */}
      <Offcanvas
        show={showFilters}
        onHide={() => setShowFilters(false)}
        placement="end"
        className="h-100"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filters & Analytics</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <FiltersSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            clearFilters={clearFilters}
            show
            onToggle={() => setShowFilters(false)}
          />
          <AnalyticsPanel role="student" analytics={analytics} data={growthData} />
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
}
