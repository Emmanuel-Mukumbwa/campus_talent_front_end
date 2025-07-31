// File: src/components/creategig/GigEscrowStep3.jsx

import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { FaPiggyBank } from 'react-icons/fa';
import api from '../../utils/api';

export default function GigEscrowStep3({
  gigId,
  fixedPrice,
  recruiterRate,
  studentRate,
  onDeposited, // kept for future mobile support 
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Calculate fees
  const recruiterFee = fixedPrice * recruiterRate;
  const studentFee   = fixedPrice * studentRate;
  const combined     = Math.min(recruiterFee + studentFee, 50000);

  const handleMakePayment = async () => {
    setError('');
    setLoading(true);

    try {
      // This should match your backend: POST http://localhost:5000/api/escrow
      const { data, status } = await api.post('/api/escrow', {
        gigId,
        amount: fixedPrice,
        paymentMethod: 'card',
      });

      console.log('Escrow response status:', status);
      console.log('Escrow response data:', data);

      if (!data.paymentPageUrl || !data.tx_ref) {
        throw new Error('Invalid response from server');
      }

      // Store tx_ref for later status checks
      localStorage.setItem('escrow_tx_ref', data.tx_ref);

      // Callback for future mobile logic
      onDeposited?.(data);

      // Redirect to hosted payment page
      window.location.href = data.paymentPageUrl;

    } catch (err) {
      // Log full error
      if (err.response) {
        console.error('Escrow error response data:', err.response.data);
        console.error('Escrow error response status:', err.response.status);
      } else {
        console.error('Escrow error:', err);
      }

      // Prefer server‑sent message if available
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error   ||
        err.message;

      setError(serverMsg || 'Could not start payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wizard-card">
      <h5>
        <FaPiggyBank className="me-2 text-success" />
        Step 5: Escrow Deposit
      </h5>
      <small>Secure funds so work can begin with confidence.</small>

      <dl className="mt-4">
        <dt>Total Deposit</dt>
        <dd>MK {fixedPrice.toLocaleString()}</dd>

        <dt>Recruiter Fee ({(recruiterRate * 100).toFixed(0)}%)</dt>
        <dd>MK {recruiterFee.toFixed(0)}</dd>

        <dt>Student Fee ({(studentRate * 100).toFixed(0)}%)</dt>
        <dd>MK {studentFee.toFixed(0)}</dd>

        <dt>Combined Fees</dt>
        <dd>
          MK {combined.toFixed(0)}
          {combined < recruiterFee + studentFee && ' (capped at MK 50,000)'}
        </dd>
      </dl>

      {error && (
        <div className="text-danger mb-3">
          {error}
        </div>
      )}

      <Button
        variant="success"
        onClick={handleMakePayment}
        disabled={loading}
      >
        {loading
          ? <Spinner animation="border" size="sm" />
          : 'Make Payment'}
      </Button>
    </div>
  );
}
