// File: src/components/FindJobsBySkill.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate }                from 'react-router-dom';
import { Modal, Button, Alert }       from 'react-bootstrap';
import { InfoCircle, ExclamationTriangleFill } from 'react-bootstrap-icons';
import api from '../utils/api';
import '../pages/PortfolioBuilder.css';
import './FindJobsBySkill.css';

export default function FindJobsBySkill() {
  const navigate = useNavigate();
  const [skills, setSkills]               = useState([]);
  const [trending, setTrending]           = useState([]);
  const [hoverSkill, setHoverSkill]       = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [gigs, setGigs]                   = useState([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const fetchId = useRef(0);

  // load skill list
  useEffect(() => {
    api.get('/api/skills')
      .then(res => setSkills(res.data.map(s => s.name)))
      .catch(err => {
        const msg = err.isNetworkError
          ? err.userMessage
          : (err.response?.data?.message || err.message);
        setError(msg);
      });
  }, []);

  // load trending
  useEffect(() => {
    api.get('/api/skills/trending', { params: { days: 7 } })
      .then(res => setTrending(res.data.map(r => r.name)))
      .catch(() => {});  // ignore errors here
  }, []);

  const activeSkill = hoverSkill || selectedSkill;

  // fetch gigs for selected skill
  useEffect(() => {
    if (!activeSkill) {
      setGigs([]); setLoading(false);
      return;
    }
    const current = ++fetchId.current;
    setLoading(true);
    setError(null);

    api.get('/api/gigs/by-skill', { params: { skill: activeSkill } })
      .then(res => {
        if (current === fetchId.current) setGigs(res.data);
      })
      .catch(err => {
        if (current === fetchId.current) {
          const msg = err.isNetworkError
            ? err.userMessage
            : (err.response?.data?.message || err.message);
          setError(msg);
        }
      })
      .finally(() => {
        if (current === fetchId.current) setLoading(false);
      });
  }, [activeSkill]);

  const handleApply = id => {
    if (localStorage.getItem('userRole') !== 'student') {
      setShowAuthModal(true);
    } else {
      navigate(`/gigs2/${id}/apply`);
    }
  };

  return (
    <div className="container my-5 skills-section">
      <h3 className="section-title">Find Gigs by Skill</h3>

      {/* Instruction */}
      <Alert variant="light" className="instruction-box">
        <InfoCircle className="me-2 text-success" />
        <span>
          Hover over a skill for a quick preview, or click to lock in and explore gigs in detail.
        </span>
      </Alert>

      {/* Friendly warning banner */}
      {error && (
        <Alert
          variant="warning"
          onClose={() => setError(null)}
          dismissible
          className="d-flex align-items-center"
        >
          <ExclamationTriangleFill className="me-2 text-warning" />
          <div>
            {error}
          </div>
        </Alert>
      )}

      {/* Trending */}
      <h5 className="mt-5 mb-3">Trending Skills (last 7 days)</h5>
      <div className="badge-group mb-4">
        {trending.map(skill => (
          <span key={skill} className="trend-badge me-2 mb-2">
            {skill}
          </span>
        ))}
      </div>

      {/* Skill badges */}
      <div className="badge-group mb-5">
        {skills.map(skill => {
          const isActive = selectedSkill === skill;
          return (
            <button
              key={skill}
              className={`btn skill-badge me-2 mb-2 ${isActive ? 'active' : ''}`}
              onMouseEnter={() => setHoverSkill(skill)}
              onMouseLeave={() => setHoverSkill(null)}
              onClick={() => setSelectedSkill(isActive ? null : skill)}
            >
              {skill}
            </button>
          );
        })}
      </div>

      {/* Loading spinner */}
      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-success" role="status" />
        </div>
      )}

      {/* Gigs list */}
      {activeSkill && !loading && (
        <>
          <h5 className="mb-4">Gigs for “{activeSkill}”</h5>
          {gigs.length === 0 ? (
            <p className="text-muted">No open gigs found for this skill.</p>
          ) : (
            <div className="row g-4">
              {gigs.map(job => (
                <div key={job.id} className="col-lg-6">
                  <div className="card job-card">
                    <div className="card-body">
                      <h5 className="job-title">{job.title}</h5>
                      <p className="company text-muted mb-3">
                        {job.company} &mdash; Posted by {job.recruiter}
                      </p>
                      <p className="description">{job.description}</p>
                      <ul className="job-meta list-unstyled my-3">
                        <li>📍 {job.location}</li>
                        <li>⏳ {job.duration}</li>
                        <li>💰 MK {job.price}</li>
                        <li>💵 Paid: MK {job.paid_amount}</li>
                        <li>📅 Apply by: {job.deadline}</li>
                        <li>
                          ✅ Matches {job.matched_skills_count}/{job.total_skills_count} skills
                        </li>
                      </ul>
                      <div className="deliverables mb-4">
                        <strong>Deliverables:</strong><br />
                        {job.deliverables}
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-success btn-lg"
                          onClick={() => handleApply(job.id)}
                        >
                          Easy Apply
                        </button>
                        <button
                          className="btn btn-outline-primary btn-lg"
                          onClick={() => navigate(`/gigs/${job.id}`)}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Unauthorized modal */}
      <Modal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Action Restricted</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You must be logged in as a student to apply for gigs. Please log in or sign up with a student account.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowAuthModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
