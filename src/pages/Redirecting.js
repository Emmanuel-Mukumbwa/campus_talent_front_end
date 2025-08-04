// File: src/pages/Redirecting.jsx

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner, ProgressBar, Button } from 'react-bootstrap';
import './Redirecting.css';

export default function Redirecting() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Redirecting…');
  const [percent, setPercent] = useState(0);
  const countdownRef = useRef(0);

  useEffect(() => {
    const saved = localStorage.getItem('redirectMessage');
    if (saved) setMessage(saved);
    localStorage.removeItem('redirectMessage');

    // We'll count up to 100% over 3.5s
    const totalMs = 3500;
    const intervalMs = 100;
    const steps = totalMs / intervalMs;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const next = Math.min(100, Math.round((step / steps) * 100));
      setPercent(next);
      if (next === 100) {
        clearInterval(interval);
        navigate('/login');
      }
    }, intervalMs);
    countdownRef.current = interval;

    return () => clearInterval(countdownRef.current);
  }, [navigate]);

  return (
    <div className="redirecting-container">
      <div className="redirecting-card">
        <Spinner animation="border" role="status" className="my-3">
          <span className="visually-hidden">Loading…</span>
        </Spinner>
        <h4 className="mb-2">{message}</h4>
 <ProgressBar
          now={percent}
          label={`${percent}%`}
          variant="success"           
          className="w-75 mb-3 thick-bar"
        />
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={() => clearInterval(countdownRef.current)}>
            Cancel
          </Button>
          <Button variant="success" onClick={() => navigate('/login')}>
            Go to Login Now
          </Button>
        </div>
      </div>
    </div>
  );
}
