import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import api from '../../utils/api';

export default function BasicVerification({ agreeToTOS, onVerified }) {
  const [step, setStep]       = useState('loading');  // 'loading','send','confirm','done'
  const [email, setEmail]     = useState('');
  const [emailDisabled, setEmailDisabled] = useState(false);
  const [code, setCode]       = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    (async () => {
      try {
        // 1) fetch user profile
        const { data: profile } = await api.get('/api/auth/me');
        if (profile.email) {
          setEmail(profile.email);
          setEmailDisabled(true);
        }

        // 2) check email verification status
        const { data: status } = await api.get('/api/recruiters/verify/basic/status');
        if (status.email_verified) {
          setStep('done');
          onVerified(true);
        } else {
          setStep('send');
        }
      } catch {
        // fallback to send step
        setStep('send');
      }
    })();
  }, [onVerified]);

  // Notify parent when done
  useEffect(() => {
    if (step === 'done') {
      onVerified(true);
    }
  }, [step, onVerified]);

  const sendCode = async () => {
    setError('');
    setLoading(true);
    try {
      await api.post('/api/recruiters/verify/basic/send', { email });
      setStep('confirm');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const confirmCode = async () => {
    setError('');
    setLoading(true);
    try {
      await api.post('/api/recruiters/verify/basic/confirm', { code });
      setStep('done');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  if (!agreeToTOS) {
    return <Alert variant="warning">Please agree to the Terms of Reference first.</Alert>;
  }

  if (step === 'loading') {
    return <div className="text-center py-5"><Spinner animation="border" /></div>;
  }

  if (step === 'done') {
    return (
      <Alert variant="success">
        Email verified! You may proceed to business verification. 
        {/*<div className="mt-3">
          <Button variant="success" onClick={() => onVerified(true)}>
            Continue to Business Verification
          </Button>
        </div>*/}
      </Alert>
    );
  }

  if (step === 'send') {
    return (
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading || emailDisabled}
            placeholder="you@company.com"
          />
        </Form.Group>
        {error && <Alert variant="danger">{error}</Alert>}
        <Button
          variant="success"
          onClick={sendCode}
          disabled={!email || loading}
        >
          {loading
            ? <Spinner animation="border" size="sm" />
            : 'Send Verification Code'}
        </Button>
      </Form>
    );
  }

  // confirm step
  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Enter 6‑digit code</Form.Label>
        <Form.Control
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
          disabled={loading}
          placeholder="123456"
        />
      </Form.Group>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button
        variant="success"
        onClick={confirmCode}
        disabled={code.length !== 6 || loading}
      >
        {loading
          ? <Spinner animation="border" size="sm" />
          : 'Confirm Code'}
      </Button>
    </Form>
  );
}
