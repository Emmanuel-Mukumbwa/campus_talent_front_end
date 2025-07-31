// File: src/components/gigs/PortfolioStep.jsx
import React, { useState, useEffect } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import api from '../../utils/api';

export default function PortfolioStep({ app, setApp }) {
  const [loading, setLoading] = useState(true);
  const [hasPortfolio, setHasPortfolio] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    api.get('/api/portfolio')
      .then(({ data }) => setHasPortfolio(!!data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleFiles = async e => {
    setUploadError('');
    const files = Array.from(e.target.files);
    const form = new FormData();
    files.forEach(f => form.append('attachments', f));
    try {
      await api.post('/api/student/portfolio/attachments', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setHasPortfolio(true);
    } catch {
      setUploadError('Unsupported file type or too large.');
    }
  };

  if (loading) return <div className="text-center"><Spinner /></div>;

  if (hasPortfolio) {
    return <Alert variant="success">Portfolio found — you may proceed.</Alert>;
  }

  return (
    <div className="wizard-card">
      <h5>Step 1: Upload Portfolio</h5>
      <small>You need a published portfolio to apply.</small>
      <div className="mt-3">
        <input type="file" multiple onChange={handleFiles} />
        {uploadError && <div className="text-danger mt-2">{uploadError}</div>}
      </div>
    </div>
  );
}
