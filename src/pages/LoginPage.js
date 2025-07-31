// File: src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { InputGroup, Form, Modal, Button, Spinner } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaExclamationCircle } from 'react-icons/fa';
import api from '../utils/api';
import './RegisterPage.css';
import joinHero from '../assets/images/join-hero.jpg';

export default function LoginPage() {
  const navigate = useNavigate();

  // On mount, clear any stale auth state
  useEffect(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('recruiterVerificationStatus');
  }, []);

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting]     = useState(false);

  // Welcome Modal state
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName]   = useState('');

  // Error Modal state
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg]             = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      const { token, role, name, verificationStatus } = data;

      // store auth state
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userName', name);
      localStorage.setItem('isLoggedIn', 'true');
      if (role === 'recruiter' && verificationStatus) {
        localStorage.setItem('recruiterVerificationStatus', verificationStatus);
      }
      // decode token for userId
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.userId) {
          localStorage.setItem('userId', String(payload.userId));
        }
      } catch {
        console.warn('Could not decode JWT payload');
      }

      // record login activity (fire-and-forget)
      api.post('/api/profile/activity').catch(console.warn);

      // show welcome
      setUserName(name);
      setShowModal(true);

    } catch (err) {
      // network vs server error
      const msg = err.isNetworkError
        ? err.userMessage
        : (err.response?.data?.message || 'Login failed. Please try again.');
      setErrorMsg(msg);
      setShowErrorModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    const role = localStorage.getItem('userRole');
    if (role === 'admin') navigate('/admin/dashboard');
    else navigate('/');
  };
  const handleErrorModalClose = () => setShowErrorModal(false);

  return (
    <div className="register-container">
      <div className="card shadow register-card">
        <div className="row g-0">
          {/* Hero Image */}
          <div className="col-md-6 d-none d-md-block">
            <img
              src={joinHero}
              alt="CampusTalent Login"
              className="img-fluid hero-image2"
            />
          </div>

          {/* Form Side */}
          <div className="col-md-6 p-4 d-flex flex-column justify-content-center">
            <h4 className="mb-3 text-center">Welcome Back</h4>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Password</label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(s => !s)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>
              </div>

              <button
                type="submit"
                className="btn btn-success w-100 mb-2"
                disabled={submitting}
              >
                {submitting && (
                  <Spinner animation="border" size="sm" className="me-2" />
                )}
                Log In
              </button>

              <p className="text-center mt-3">
                Don’t have an account?{' '}
                <Link to="/register" className="text-success">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Welcome Modal */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Welcome Back!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Hi <strong>{userName}</strong>, you’ve logged in successfully!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleModalClose}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal (friendly style) */}
      <Modal show={showErrorModal} onHide={handleErrorModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaExclamationCircle className="me-2 text-warning" />
            Oops!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{errorMsg}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-success" onClick={handleErrorModalClose}>
            Got it
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
