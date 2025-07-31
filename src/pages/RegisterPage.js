// File: src/pages/RegisterPage.jsx
import './RegisterPage.css';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';
import { FiAlertCircle } from 'react-icons/fi';
import joinHero from '../assets/images/join-hero.jpg';
import api from '../utils/api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm]         = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
  });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
    if (!form.firstName || !form.lastName) {
      setError('Please enter both your first and last name.');
      return;
    }
    if (!form.role) {
      setError('Please select whether you’re a student or a recruiter.');
      return;
    }
    if (form.password.length < 8) {
      setError('Your password must be at least 8 characters long.');
      return;
    }
    if (form.role === 'student') {
      const mzuniRegex = /^[A-Za-z0-9._%+-]+@my\.mzuni\.ac\.mw$/;
      if (!mzuniRegex.test(form.email)) {
        setError('Use your institutional student email (e.g. bictu1234@my.mzuni.ac.mw).');
        return;
      }
    }

    setLoading(true);
    try {
      await api.post('/api/auth/register', {
        name:     fullName,
        email:    form.email,
        password: form.password,
        role:     form.role,
      });
      setShowSuccess(true);
    } catch (err) {
      if (err.isNetworkError) {
        setError(err.userMessage);
      } else if (err.response?.status === 409) {
        setError('Looks like that email is already registered.');
      } else {
        console.error(err);
        setError('Oops! Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowSuccess(false);
    navigate('/login');
  };

  return (
    <>
      <div className="register-container">
        <div className="card shadow register-card">
          <div className="row g-0">
            {/* Hero Image */}
            <div className="col-md-6 d-none d-md-block">
              <img
                src={joinHero}
                alt="Join CampusTalent"
                className="img-fluid hero-image2"
              />
            </div>

            {/* Form Side */}
            <div className="col-md-6 p-4 d-flex flex-column justify-content-center">
              <h4 className="mb-3 text-center">Join CampusTalent</h4>
              <form onSubmit={handleSubmit} noValidate>
                {/* Role Picker */}
                <div className="mb-4 text-center">
                  <p className="mb-2">Register as a:</p>
                  <div className="d-flex justify-content-center gap-3">
                    {['student', 'recruiter'].map(r => (
                      <button
                        key={r}
                        type="button"
                        className={`btn btn-outline-success ${form.role === r ? 'active' : ''}`}
                        onClick={() => handleChange('role', r)}
                        disabled={loading}
                        style={{ minWidth: 120 }}
                      >
                        {r === 'student' ? 'Student' : 'Recruiter'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <Alert variant="warning" className="d-flex align-items-center mb-3">
                    <FiAlertCircle size={20} className="me-2" />
                    <div>{error}</div>
                  </Alert>
                )}

                {/* First & Last Name */}
                <div className="row mb-3">
                  <div className="col">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.firstName}
                      onChange={e => handleChange('firstName', e.target.value)}
                      disabled={loading || !form.role}
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div className="col">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.lastName}
                      onChange={e => handleChange('lastName', e.target.value)}
                      disabled={loading || !form.role}
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    disabled={loading || !form.role}
                    placeholder={
                      form.role === 'student'
                        ? 'e.g. bictu1234@my.mzuni.ac.mw'
                        : 'you@example.com'
                    }
                    required
                  />
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={form.password}
                    onChange={e => handleChange('password', e.target.value)}
                    disabled={loading || !form.role}
                    placeholder="At least 8 characters"
                    minLength={8}
                    required
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-success w-100 mb-2"
                  disabled={loading || !form.role}
                >
                  {loading && (
                    <Spinner animation="border" size="sm" className="me-2" />
                  )}
                  {loading ? 'Creating Account…' : 'Create Account'}
                </button>

                <p className="text-center text-muted">
                  Already registered?{' '}
                  <Link to="/login" className="text-success">
                    Log in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal show={showSuccess} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Welcome aboard!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your account has been created successfully. Let’s get you signed in!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={closeModal}>
            Go to Login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
