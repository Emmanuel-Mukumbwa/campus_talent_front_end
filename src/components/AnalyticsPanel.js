// File: src/components/AnalyticsPanel.js
import React, { useState, useEffect } from 'react';
import { Card, ProgressBar, Spinner } from 'react-bootstrap';
import { BiTrendingUp } from 'react-icons/bi';

import api from '../utils/api';

export default function AnalyticsPanel() {
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [totalCount, setTotal]    = useState(0);
  const [allPeers, setAllPeers]   = useState([]);

  useEffect(() => {
    async function fetchAllNetwork() {
      try {
        setLoading(true);

        // 1) Fetch metadata to know how many total
        const metaRes = await api.get('/api/students/network', {
          params: { page: 1, pageSize: 1 }
        });
        const { totalCount } = metaRes.data;
        setTotal(totalCount);

        if (totalCount > 0) {
          // 2) Fetch every peer in a single call
          const fullRes = await api.get('/api/students/network', {
            params: { page: 1, pageSize: totalCount }
          });
          setAllPeers(fullRes.data.data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load network analytics');
      } finally {
        setLoading(false);
      }
    }

    fetchAllNetwork();
  }, []);

  // Calculate average profile strength once allPeers is populated
  const avgProfileStrength = allPeers.length
    ? Math.round(
        allPeers.reduce((sum, p) => sum + (p.profileStrength || 0), 0)
        / allPeers.length
      )
    : 0;

  return (
    <Card className="mt-3 shadow-sm analytics-panel">
      <Card.Body>
        <h6 className="mb-3">
          <BiTrendingUp className="me-2 text-success" /> Network Insights
        </h6>

        {loading ? (
          <Spinner animation="border" size="sm" />
        ) : error ? (
          <div className="text-danger">{error}</div>
        ) : (
          <>
            {/* Total Peers */}
            <div className="mb-4">
              <small className="text-muted">Total in Network</small>
              <h4 className="text-success">{totalCount}</h4>
            </div>

            {/* Avg. Profile Strength */}
            {allPeers.length > 0 && (
              <div className="mb-4">
                <small className="text-muted">Avg. Profile Strength</small>
                <div className="d-flex align-items-center">
                  <h4 className="text-success mb-0 me-3">
                    {avgProfileStrength}%
                  </h4>
                  <ProgressBar
                    now={avgProfileStrength}
                    variant="success"
                    style={{ height: '8px', flex: 1 }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
}
