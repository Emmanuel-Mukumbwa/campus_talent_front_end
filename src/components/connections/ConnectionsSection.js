// File: src/components/connections/ConnectionsSection.jsx

import React, { useEffect, useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { PeopleFill } from 'react-bootstrap-icons';
import ConnectionsGrid from './ConnectionsGrid';
import api from '../../utils/api';

export default function ConnectionsSection({
  viewerRole = 'student',
  filters,          // ← new
  onFilterChange,   // ← new
  clearFilters,     // ← new
  pageSize = 4      // ← now configurable
}) {
  const [connections, setConnections] = useState([]);
  const [avatars, setAvatars]         = useState({});      // id → full URL
  const [page, setPage]               = useState(1);
  const [loading, setLoading]         = useState(false);
  const [totalCount, setTotalCount]   = useState(0);
  const [error, setError]             = useState(null);

  // 1) Fetch one page, including filters
  const loadPage = async (pageNum) => {
    setLoading(true); 
    setError(null);
    try {
      const response = await api.get('/api/students/network', {
        params: {
          page: pageNum,
          pageSize,
          ...filters            // ← include search, program, dateJoined, skills
        },
      });
      const { data, totalCount: total } = response.data;

      setConnections(prev => {
        const newOnes = data.filter(d => !prev.some(p => p.id === d.id));
        return pageNum === 1 ? data : [...prev, ...newOnes];
      });
      setTotalCount(total);
      setPage(pageNum);
    } catch (err) {
      console.error('Error loading connections:', err);
      setError('Failed to load suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2) Whenever viewerRole OR filters change, reset & fetch page 1
  useEffect(() => {
    setConnections([]);
    setAvatars({});
    setPage(1);
    loadPage(1);
  }, [viewerRole, filters]);

  // 3) Batch‑fetch avatars once we have IDs
  useEffect(() => {
    if (connections.length === 0) return;

    const ids = connections.map(c => c.id).join(',');
    api.get('/api/profile/batch', { params: { ids } })
      .then(({ data }) => {
        const map = {};
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
      .catch(err => {
        console.error('Failed to batch avatars:', err);
      });
  }, [connections]);

  // 4) “Load more” handler
  const handleLoadMore = () => {
    if (!loading && connections.length < totalCount) {
      loadPage(page + 1);
    }
  };

  return (
    <div className="connections-section">
      <h4 className="mb-4">
        <PeopleFill className="me-2" />
        {viewerRole === 'student'
          ? 'Recruiters You May Know'
          : 'Emerging Talent You May Know'}
      </h4> 

      {/* expose clearFilters if you like */}
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
          <Button
            variant="outline-success"
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading…' : 'Show More'}
          </Button>
        </div>
      )}
    </div>
  );
}
 