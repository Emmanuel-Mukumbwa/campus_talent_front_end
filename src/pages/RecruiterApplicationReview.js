// File: src/pages/RecruiterApplicationReview.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import {
  Container,
  Spinner,
  Alert,
  Button,
} from 'react-bootstrap';
import api from '../utils/api';

export default function RecruiterApplicationReview() {
  const { gigId, appId } = useParams();
  const navigate = useNavigate();

  const [gig, setGig]         = useState(null);
  const [app, setApp]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/api/gigs1/${gigId}`),
      api.get(`/api/gig_applications/${appId}`)
    ])
      .then(([gigRes, appRes]) => {
        setGig(gigRes.data);
        setApp(appRes.data);
      })
      .catch(err => {
        console.error(err);
        setError(
          err.response?.status === 404
            ? 'Not found'
            : 'Failed to load data'
        );
      })
      .finally(() => setLoading(false));
  }, [gigId, appId]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </Container>
    );
  }

  if (!app) {
    return <Navigate to="/recruiter/applications" replace />;
  }

  const { requirements = {} } = app;

  // Break a long string into sentence‑based paragraphs
  const renderCoverLetter = (text) => {
    const sentences = text
      .split(/([.?!])\s+/)
      .reduce((acc, piece, i) => {
        if (/[.?!]/.test(piece) && i > 0) {
          acc[acc.length - 1] += piece;
        } else if (!/[.?!]/.test(piece)) {
          acc.push(piece);
        }
        return acc;
      }, [])
      .filter(s => s.trim());

    return sentences.map((s, i) => (
      <p key={i} style={{ textAlign: 'justify' }}>{s.trim()}</p>
    ));
  };

  // Renders either text or file links
  const renderRequirement = (key, val) => {
    // cover_letter
    if (key === 'cover_letter' && typeof val === 'string') {
      return renderCoverLetter(val);
    }

    // array of URLs
    if (Array.isArray(val) && val.length && typeof val[0] === 'string') {
      return (
        <ul className="list-unstyled">
          {val.map((url, i) => {
            const filename = url.split('/').pop();
            return (
              <li key={i}>
                <Button
                  variant="link"
                  onClick={() => window.open(`${api.defaults.baseURL}${url}`, '_blank')}
                >
                  📄 {filename}
                </Button>
              </li>
            );
          })}
        </ul>
      );
    }

    // single URL
    if (typeof val === 'string' && val.startsWith('/uploads/')) {
      const filename = val.split('/').pop();
      return (
        <Button
          variant="link"
          onClick={() => window.open(`${api.defaults.baseURL}${val}`, '_blank')}
        >
          📄 {filename}
        </Button>
      );
    }

    // fallback to text / arrays
    if (Array.isArray(val)) {
      return (
        <ul>
          {val.map((v, i) => <li key={i}>{String(v)}</li>)}
        </ul>
      );
    }

    return <span>{String(val)}</span>;
  };

  // snake_case → Title Case
  const labelText = (type) =>
    type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

  return (
    <Container className="py-4">
      <h3 className="text-success mb-4">
        Review Application Requirements for: {gig?.title}
      </h3>

      <dl>
        {Object.entries(requirements).map(([key, val]) => {
          if (
            val == null ||
            (Array.isArray(val) && val.length === 0) ||
            (typeof val === 'string' && !val.trim())
          ) {
            return null;
          }
          return (
            <React.Fragment key={key}>
              <dt style={{ textTransform: 'capitalize' }}>
                {labelText(key)}
              </dt>
              <dd>{renderRequirement(key, val)}</dd>
            </React.Fragment>
          );
        })}
      </dl>

      <Button variant="secondary" onClick={() => navigate(-1)}>
        Back to List
      </Button>
    </Container>
  );
}
