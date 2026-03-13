// src/components/connections/ConnectionsSection.jsx
import React, { useEffect, useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { PeopleFill } from 'react-bootstrap-icons';
import ConnectionsGrid from './ConnectionsGrid';
import api from '../../utils/api';

export default function ConnectionsSection({
  viewerRole = 'student',
  filters, // include search/program/dateJoined/skills
  onFilterChange,
  clearFilters = () => {},
  pageSize = 4
}) {
  const [connections, setConnections] = useState([]);
  const [avatars, setAvatars] = useState({}); // id → full URL
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);

  // Load page (fetch). Declared inline — we'll disable exhaustive-deps
  const loadPage = async (pageNum) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/students/network', {
        params: {
          page: pageNum,
          pageSize,
          ...filters
        }
      });
      const { data, totalCount: total } = response.data || {};

      // merge pages safely (page 1 replaces)
      setConnections((prev) => {
        const incoming = Array.isArray(data) ? data : [];
        if (pageNum === 1) return incoming;
        const newOnes = incoming.filter((d) => !prev.some((p) => p.id === d.id));
        return [...prev, ...newOnes];
      });

      setTotalCount(typeof total === 'number' ? total : (Array.isArray(response.data?.data) ? response.data.data.length : 0));
      setPage(pageNum);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error loading connections:', err);
      setError('Failed to load suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset and fetch whenever viewerRole or filters change.
  // loadPage is declared inline; intentionally not included in deps.
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  useEffect(() => {
    setConnections([]);
    setAvatars({});
    setPage(1);
    loadPage(1);
  }, [viewerRole, filters]);

  // Batch fetch avatars once we have IDs
  useEffect(() => {
    if (connections.length === 0) return;

    const ids = connections.map((c) => c.id).join(',');
    api
      .get('/api/profile/batch', { params: { ids } })
      .then(({ data }) => {
        const map = {};
        Array.isArray(data) &&
          data.forEach(({ id, avatar_url }) => {
            if (avatar_url) {
              const isAbsolute = /^https?:\/\//.test(avatar_url);
              map[id] = isAbsolute
                ? avatar_url
                : `${(api.defaults.baseURL || '').replace(/\/+$/, '')}${avatar_url}`;
            }
          });
        setAvatars(map);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to batch avatars:', err);
      });
  }, [connections]);

  const handleLoadMore = () => {
    if (!loading && connections.length < totalCount) {
      loadPage(page + 1);
    }
  };

  return (
    <div className="connections-section">
      <h4 className="mb-4">
        <PeopleFill className="me-2" />
        {viewerRole === 'student' ? 'Recruiters You May Know' : 'Emerging Talent You May Know'}
      </h4>

      <div className="mb-3">
        <Button variant="outline-secondary" size="sm" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <ConnectionsGrid
        connections={connections}
        avatars={avatars}
        viewerRole={viewerRole}
        onAction={() => {}}
        loading={loading}
      />

      {connections.length < totalCount && (
        <div className="text-center mt-4">
          <Button variant="outline-success" onClick={handleLoadMore} disabled={loading}>
            {loading ? 'Loading…' : 'Show More'}
          </Button>
        </div>
      )}
    </div>
  );
}