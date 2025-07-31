// File: src/pages/RecruiterNetwork.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Offcanvas, Button } from 'react-bootstrap';
import FiltersSidebar from '../components/FiltersSidebar';
import ConnectionsSection from '../components/connections/ConnectionsSection';
import AnalyticsPanel from '../components/AnalyticsPanel';
import { recruiterRecs } from '../data/networkData';

export default function RecruiterNetwork() {
  const [filters, setFilters] = useState({
    search: '',
    program: '',
    dateJoined: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const analytics = {
    matched: 15,
    avgResponse: '2.4 days',
    responseDistribution: ['60%', '30%', '10%'],
  };

  const handleFilterChange = (field, value) => {
    setFilters(f => ({ ...f, [field]: value }));
  };
  const clearFilters = () => {
    setFilters({ search: '', program: '', dateJoined: '' });
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        {/* Desktop Sidebar */}
        <Col lg={3} className="d-none d-lg-block border-end">
          <div className="sticky-top pt-3">
            <FiltersSidebar
              viewerRole="recruiter"               
              filters={filters}
              onFilterChange={handleFilterChange}
              clearFilters={clearFilters}
            />
          </div>
        </Col>

        {/* Main Content */} 
        <Col lg={6} xs={12}>
          <ConnectionsSection
            viewerRole="recruiter"
            filters={filters}
            onFilterChange={handleFilterChange}
            clearFilters={clearFilters}
          />

          {/*<div className="mt-4">
            <h5>Recommendations</h5>
            <Recommendations recs={recruiterRecs} columns={1} />
          </div>*/}
        </Col>

        {/* Analytics */}
        <Col lg={3} className="d-none d-lg-block ps-4">
          <AnalyticsPanel role="recruiter" analytics={analytics} />
        </Col>
      </Row>

      {/* Mobile Filters FAB */}
      <Button
        className="d-lg-none fixed-bottom mb-3 ms-auto me-3 rounded-pill shadow"
        variant="outline-success"
        style={{ width: 'fit-content' }}
        onClick={() => setShowFilters(true)}
      >
        <i className="bi bi-funnel-fill me-1" /> Filters & Analytics
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
            viewerRole="recruiter"               // ← and here
            filters={filters}
            onFilterChange={handleFilterChange}
            clearFilters={clearFilters}
          />
          <AnalyticsPanel role="recruiter" analytics={analytics} />
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
}
