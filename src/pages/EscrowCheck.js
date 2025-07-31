import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function EscrowCheck() {
  const [status, setStatus] = useState('Checking payment...');

  useEffect(() => {
    // ✅ Option B: Use tx_ref from localStorage instead of query params
    const tx_ref = localStorage.getItem('escrow_tx_ref');

    if (!tx_ref) {
      setStatus('No transaction reference found.');
      return;
    }

    // ✅ Call backend to verify payment and release escrow
    api.post('/api/escrow/release', { tx_ref })
      .then(res => {
        if (res.data.status === 'success') {
          setStatus('✅ Payment successful! Funds are now held in escrow.');
        } else {
          setStatus(`⚠️ Payment status: ${res.data.status}`);
        }
      })
      .catch(err => {
        console.error(err);
        setStatus('❌ Error verifying payment. Please try again later.');
      });
  }, []);

  return (
    <div className="container mt-5 text-center">
      <h3>Escrow Status</h3>
      <p>{status}</p>
    </div>
  );
}
