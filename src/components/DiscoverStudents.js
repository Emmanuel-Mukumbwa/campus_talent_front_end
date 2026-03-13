// src/components/DiscoverStudents.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Row,
  Col,
  Pagination,
  Card,
  Placeholder
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import SearchFilters from './discover/SearchFilters';
import StudentSection from './discover/StudentSection';
import api from '../utils/api';
import './DiscoverStudents.css';

const PAGE_SIZE = 2;

// Skeleton placeholder cards
function StudentCardSkeleton({ count = PAGE_SIZE }) {
  return (
    <Row className="student-cards">
      {Array.from({ length: count }).map((_, idx) => (
        <Col lg={6} key={idx} className="mb-4">
          <Card className="card-skeleton">
            <div className="skeleton-img mb-3" />
            <Card.Body>
              <Placeholder animation="glow">
                <Placeholder xs={6} />
                <Placeholder xs={8} />
                <Placeholder xs={4} className="mt-3" />
              </Placeholder>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

// Empty-state display
function EmptyState({ title, message, cta }) {
  return (
    <div className="empty-state text-center my-5">
      <img
        src="/images/no-results-illustration.svg"
        alt="No results"
        className="empty-img mb-4"
      />
      <h4>{title}</h4>
      <p className="text-muted">{message}</p>
      {cta && (
        <button className="btn btn-outline-secondary" onClick={cta.onClick}>
          {cta.text}
        </button>
      )}
    </div>
  );
}

export default function DiscoverStudents() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({});

  const [trending, setTrending] = useState([]);
  const [tPage, setTPage] = useState(1);
  const [tTotal, setTTotal] = useState(1);
  const [tLoading, setTLoading] = useState(false);

  const [newbies, setNewbies] = useState([]);
  const [nPage, setNPage] = useState(1);
  const [nTotal, setNTotal] = useState(1);
  const [nLoading, setNLoading] = useState(false);

  const fetchTrending = useCallback(
    async (page) => {
      setTLoading(true);
      try {
        const { data } = await api.get('/api/students1/trending', {
          params: { page, limit: PAGE_SIZE, ...filters }
        });
        setTrending(Array.isArray(data.students) ? data.students : []);
        if (data.totalCount != null) {
          setTTotal(Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)));
        } else {
          setTTotal(page + (data.hasMore ? 1 : 0));
        }
      } catch (err) {
        // keep console.error for server-side debugging
        // eslint-disable-next-line no-console
        console.error('fetchTrending error', err);
      } finally {
        setTLoading(false);
      }
    },
    [filters]
  );

  const fetchNew = useCallback(
    async (page) => {
      setNLoading(true);
      try {
        const { data } = await api.get('/api/students1/new', {
          params: { page, limit: PAGE_SIZE, ...filters }
        });
        setNewbies(Array.isArray(data.students) ? data.students : []);
        if (data.totalCount != null) {
          setNTotal(Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)));
        } else {
          setNTotal(page + (data.hasMore ? 1 : 0));
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('fetchNew error', err);
      } finally {
        setNLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    // reset to first page whenever filters change
    setTPage(1);
    setNPage(1);
    fetchTrending(1);
    fetchNew(1);
  }, [filters, fetchTrending, fetchNew]);

  const handleFiltersChange = (vals) => setFilters(vals || {});
  const handleSendMessage = (student) => navigate(`/messages/${student.id}`);

  const renderPagination = (page, total, onPageChange) => {
    const pages = [];
    // show a small window of pages around current page
    for (let p = Math.max(1, page - 1); p <= Math.min(total, page + 1); p++) {
      pages.push(
        <Pagination.Item
          key={p}
          active={p === page}
          onClick={() => onPageChange(p)}
        >
          {p}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-center my-3">
        <Pagination.First onClick={() => onPageChange(1)} disabled={page === 1} />
        <Pagination.Prev
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        />
        {page > 2 && <Pagination.Ellipsis disabled />}
        {pages}
        {page < total - 1 && <Pagination.Ellipsis disabled />}
        <Pagination.Next
          onClick={() => onPageChange(Math.min(total, page + 1))}
          disabled={page === total}
        />
        <Pagination.Last
          onClick={() => onPageChange(total)}
          disabled={page === total}
        />
      </Pagination>
    );
  };

  return (
    <>
      <Container className="my-5 discover-students">
        <h2 className="text-success mb-4">Discover Student Talent at Mzuzu University</h2>

        <SearchFilters onChange={handleFiltersChange} />

        <Row>
          <Col lg={6}>
            {tLoading ? (
              <StudentCardSkeleton />
            ) : trending.length ? (
              <StudentSection
                title="Top Talent"
                students={trending}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <EmptyState
                title="No Top Talent Found"
                message="No students are available right now. Please try again later or adjust your filters."
                cta={{ text: 'Clear Filters', onClick: () => setFilters({}) }}
              />
            )}
            {renderPagination(tPage, tTotal, (p) => {
              setTPage(p);
              fetchTrending(p);
            })}
          </Col>

          <Col lg={6}>
            {nLoading ? (
              <StudentCardSkeleton />
            ) : newbies.length ? (
              <StudentSection
                title="Newly Joined"
                students={newbies}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <EmptyState
                title="No Recent Joiners"
                message="No students are available right now. Please try again later or adjust your filters."
                cta={{ text: 'Clear Filters', onClick: () => setFilters({}) }}
              />
            )}
            {renderPagination(nPage, nTotal, (p) => {
              setNPage(p);
              fetchNew(p);
            })}
          </Col>
        </Row>
      </Container>
    </>
  );
}