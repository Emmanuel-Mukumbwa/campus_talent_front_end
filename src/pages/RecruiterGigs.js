// File: src/pages/RecruiterGigs.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Offcanvas,
  Spinner,
  Alert
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import FiltersSidebar from '../components/gigs/FiltersSidebar';
import GigsGrid from '../components/gigs/GigsGrid';
import AnalyticsPanel from '../components/gigs/AnalyticsPanel';
import api from '../utils/api';

export default function RecruiterGigs() {
  const navigate = useNavigate();

  const [filtersOpen, setFiltersOpen] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    skills: '',
    duration: '',
    deadline: ''
  });

  const [gigs, setGigs] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [analytics, setAnalytics] = useState({});

  // Mock analytics only
  useEffect(() => {
    import('../data/gigs').then(({ recruiterAnalytics }) => {
      setAnalytics(recruiterAnalytics);
    });
  }, []);

  const fetchGigs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: pageInfo.page,
        pageSize: pageInfo.pageSize,
        search: filters.search,
        location: filters.location,
      };

      if (Array.isArray(filters.skills)) {
        params.skill_ids = filters.skills.join(',');
      } else if (filters.skills) {
        params.skill_ids = filters.skills;
      }

      if (filters.duration) {
        params.gig_type = filters.duration;
      }

      if (filters.deadline) {
        params.deadline = filters.deadline;
      }

      const { data } = await api.get('/api/gigs1', { params });
      setGigs(data.gigs);
      setPageInfo(pi => ({ ...pi, total: data.total }));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load gigs');
    } finally {
      setLoading(false);
    }
  }, [filters, pageInfo.page, pageInfo.pageSize]);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  const handleFilterChange = (field, val) => {
    setPageInfo(pi => ({ ...pi, page: 1 }));
    setFilters(f => ({ ...f, [field]: val }));
  };
  const clearFilters = () => {
    setPageInfo(pi => ({ ...pi, page: 1 }));
    setFilters({ search: '', location: '', skills: '', duration: '', deadline: '' });
  };

  const handleAction = async (gig, action) => {
    switch (action) {
      case 'view-applicants':
        navigate(`/recruiter/gigs1/${gig.id}/applicants`);
        break;
      case 'edit':
        navigate(`/recruiter/gigs1/edit/${gig.id}`);
        break;
      case 'close':
        if (window.confirm('Are you sure you want to close this gig?')) {
          try {
            await api.delete(`/api/gigs1/${gig.id}`);
            fetchGigs();
          } catch (err) {
            alert(err.response?.data?.message || 'Failed to close gig');
          }
        }
        break;
      default:
        console.warn('Unknown action', action);
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        {/* Left: Desktop Filters */}
        <Col lg={3} className="d-none d-lg-block">
          <FiltersSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            clearFilters={clearFilters}
            show={filtersOpen}
            onToggle={() => setFiltersOpen(o => !o)}
          />
        </Col>

        {/* Center: Gigs */}
        <Col lg={6} xs={12}>
          <Button
            className="d-lg-none fixed-bottom mb-3 ms-auto me-3 rounded-pill shadow"
            style={{ width: 'fit-content' }}
            onClick={() => setShowFilters(true)}
          >
            <i className="bi bi-funnel me-1" /> Filters
          </Button>

          <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="end">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Filters</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <FiltersSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                clearFilters={clearFilters}
                show={filtersOpen}
                onToggle={() => setFiltersOpen(o => !o)}
              />
            </Offcanvas.Body>
          </Offcanvas>

          <h4 className="mb-3 text-success">Gigs</h4>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <div className="text-center"><Spinner animation="border" /></div>
          ) : (
            <GigsGrid gigs={gigs} filters={filters} role="recruiter" onAction={handleAction} />
          )}
        </Col>

        {/* Right: Analytics */}
        <Col lg={3} className="d-none d-lg-block">
          <AnalyticsPanel role="recruiter" analytics={analytics} />
        </Col>
      </Row>
    </Container>
  );
}
