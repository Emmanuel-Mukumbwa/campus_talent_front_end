// File: src/components/DiscoverStudents.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Pagination, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

import SearchFilters  from './discover/SearchFilters';
import StudentSection from './discover/StudentSection';
import api            from '../utils/api';
import './DiscoverStudents.css';

const PAGE_SIZE = 2;

export default function DiscoverStudents() {
  const navigate = useNavigate();
  const location = useLocation();

  const [me, setMe]          = useState(null);
  const [filters, setFilters] = useState({});

  // Trending state
  const [trending, setTrending] = useState([]);
  const [tPage, setTPage]       = useState(1);
  const [tTotal, setTTotal]     = useState(1);
  const [tLoading, setTLoading] = useState(false);

  // Newly joined state
  const [newbies, setNewbies]   = useState([]);
  const [nPage, setNPage]       = useState(1);
  const [nTotal, setNTotal]     = useState(1);
  const [nLoading, setNLoading] = useState(false);

  // Equal‑height cards
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll('.student-card'));
    if (!cards.length) return;
    cards.forEach(c => (c.style.height = 'auto'));
    const maxH = cards.reduce((mx, c) => Math.max(mx, c.offsetHeight), 0);
    cards.forEach(c => (c.style.height = `${maxH}px`));
  }, [trending, newbies]);

  // Fetch Top Talent
  const fetchTrending = useCallback(async page => {
    setTLoading(true);
    try {
      const { data } = await api.get('/api/students1/trending', {
        params: { page, limit: PAGE_SIZE, ...filters }
      });
      setTrending(data.students);
      // calculate total pages (if total count returned)
      if (data.totalCount != null) {
        setTTotal(Math.ceil(data.totalCount / PAGE_SIZE));
      } else {
        // fallback: hasMore → next page exists
        setTTotal(page + (data.hasMore ? 1 : 0));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTLoading(false);
    }
  }, [filters]);

  // Fetch Newly Joined
  const fetchNew = useCallback(async page => {
    setNLoading(true);
    try {
      const { data } = await api.get('/api/students1/new', {
        params: { page, limit: PAGE_SIZE, ...filters }
      });
      setNewbies(data.students);
      if (data.totalCount != null) {
        setNTotal(Math.ceil(data.totalCount / PAGE_SIZE));
      } else {
        setNTotal(page + (data.hasMore ? 1 : 0));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setNLoading(false);
    }
  }, [filters]);

  // Initial load & on filters change
  useEffect(() => {
    setTPage(1);
    setNPage(1);
    fetchTrending(1);
    fetchNew(1);
  }, [filters, fetchTrending, fetchNew]);

  // Handlers
  const handleFiltersChange = vals => setFilters(vals);
  const handleSendMessage = student => navigate(`/messages/${student.id}`);

  return (
    <>
      {me && location.pathname === '/discover' && (
        <div style={{ position: 'fixed', top: 80, right: 20 }}>
          <img
            src={me.avatar_url?.startsWith('http')
              ? me.avatar_url
              : `${process.env.REACT_APP_API_URL}${me.avatar_url}`}
            alt="Me"
            width={40}
            height={40}
            className="rounded-circle"
          />
        </div>
      )}

      <Container className="my-5 discover-students">
        <h2 className="text-success mb-4">Discover Student Talent at Mzuzu University</h2>

        <SearchFilters onChange={handleFiltersChange} />

        <Row className="gy-4">
          <Col lg={6}>
            {tLoading
              ? <Spinner animation="border" />
              : <StudentSection
                  title="Top Talent"
                  students={trending}
                  onSendMessage={handleSendMessage}
                />
            }

            <div className="d-flex justify-content-center mt-3">
              <Pagination>
                <Pagination.Prev
                  onClick={() => { if (tPage > 1) { setTPage(p => p - 1); fetchTrending(tPage - 1); } }}
                  disabled={tPage === 1}
                />
                <Pagination.Item active>
                  Page {tPage} / {tTotal}
                </Pagination.Item>
                <Pagination.Next
                  onClick={() => { if (tPage < tTotal) { setTPage(p => p + 1); fetchTrending(tPage + 1); } }}
                  disabled={tPage >= tTotal}
                />
              </Pagination>
            </div>
          </Col>

          <Col lg={6}>
            {nLoading
              ? <Spinner animation="border" />
              : <StudentSection
                  title="Newly Joined"
                  students={newbies}
                  onSendMessage={handleSendMessage}
                />
            }

            <div className="d-flex justify-content-center mt-3">
              <Pagination>
                <Pagination.Prev
                  onClick={() => { if (nPage > 1) { setNPage(p => p - 1); fetchNew(nPage - 1); } }}
                  disabled={nPage === 1}
                />
                <Pagination.Item active>
                  Page {nPage} / {nTotal}
                </Pagination.Item>
                <Pagination.Next
                  onClick={() => { if (nPage < nTotal) { setNPage(p => p + 1); fetchNew(nPage + 1); } }}
                  disabled={nPage >= nTotal}
                />
              </Pagination>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
