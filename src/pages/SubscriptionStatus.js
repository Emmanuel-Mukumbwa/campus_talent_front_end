import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert, ProgressBar, Button } from 'react-bootstrap';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

export default function SubscriptionStatus() {
  const navigate = useNavigate();
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  useEffect(() => {
    api.get('/api/subscriptions/status')
      .then(({ data }) => setStatusData(data))
      .catch(() => setError('Failed to fetch status'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>;
  if (error)   return <Alert variant="danger">{error}</Alert>;

  const {
    message,
    plan,
    status: st,
    periodStart,
    periodEnd,
    usedPosts,
    maxPosts
  } = statusData;

  // No subscription case
  if (!plan) {
    return (
      <div className="container py-5">
        <h2>Subscription Status</h2>
        <Alert variant="info">{message || 'You have no active subscription yet.'}</Alert>
        <Button variant="success" onClick={() => navigate('/subscriptions')}>
          Choose a Plan
        </Button>
      </div>
    );
  }

  const pct = maxPosts === Infinity ? 100 : Math.round((usedPosts / maxPosts) * 100);

  return (
    <div className="container py-5">
      <h2>Subscription Status</h2>
      <Card className="p-4 mt-3">
        <p><strong>Plan:</strong> {plan.charAt(0).toUpperCase() + plan.slice(1)}</p>
        <p><strong>Status:</strong> {st}</p>
        {maxPosts !== Infinity && (
          <>
            <p><strong>Usage:</strong> {usedPosts} / {maxPosts} posts</p>
            <ProgressBar now={pct} variant="success" label={`${pct}%`} className="mb-3" />
            <p><strong>Period:</strong> {new Date(periodStart).toLocaleDateString()} &ndash; {new Date(periodEnd).toLocaleDateString()}</p>
          </>
        )}
        <Button variant="success" onClick={() => navigate('/subscriptions')}>
          Change Plan
        </Button>
      </Card>
    </div>
  );
}
