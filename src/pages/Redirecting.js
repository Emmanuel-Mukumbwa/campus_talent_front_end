// File: src/pages/Redirecting.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

export default function Redirecting() {
  const [show, setShow] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const msg = localStorage.getItem('redirectMessage') || 'Redirecting...';
    setMessage(msg);

    const timer = setTimeout(() => {
      localStorage.removeItem('redirectMessage');
      navigate('/login');
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Modal show={show} centered backdrop="static">
      <Modal.Header>
        <Modal.Title>Redirecting...</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
        <p className="text-muted">You'll be redirected to login shortly.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={() => navigate('/login')}>
          Go to Login Now
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
