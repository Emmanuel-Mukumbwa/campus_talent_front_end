// src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate }          from 'react-router-dom';
import AOS                             from 'aos';
import 'aos/dist/aos.css';

import {
  Container,
  Button,
  Modal
} from 'react-bootstrap';

import api              from '../utils/api';
import Footer           from '../components/Footer';
import DiscoverStudents from '../components/DiscoverStudents';
import FindJobsBySkill  from '../components/FindJobsBySkill';
import GlobalNavbar     from '../components/GlobalNavbar';

import './HomePage.css';
import background       from '../assets/images/background.jpg';

export default function HomePage() {
  const navigate = useNavigate();

  const [greeting, setGreeting]           = useState({ text: '', icon: '' });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMsg, setAuthModalMsg]   = useState('');
  const [showVerifyButton, setShowVerifyButton] = useState(false);

  // `user` undefined while loading, null if not logged in, or the user object
  const [user, setUser]                   = useState(undefined);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    api.get('/api/auth/me')
      .then(({ data }) => setUser(data))
      .catch(() => setUser(null));

    const hour = new Date().getHours();
    if (hour < 12)      setGreeting({ text: 'Good Morning',   icon: '🌅' });
    else if (hour < 18) setGreeting({ text: 'Good Afternoon', icon: '☀️' });
    else                setGreeting({ text: 'Good Evening',   icon: '🌙' });
  }, []);

  const handleBuildClick = async e => {
    e.preventDefault();
    let me;
    try {
      const resp = await api.get('/api/auth/me');
      me = resp.data;
    } catch {
      setAuthModalMsg('Please log in as a student to build your portfolio.');
      setShowVerifyButton(false);
      return setShowAuthModal(true);
    }

    if (me.role !== 'student') {
      setAuthModalMsg('Only students can build portfolios.');
      setShowVerifyButton(false);
      return setShowAuthModal(true);
    }

    try {
      const { data: portfolio } = await api.get('/api/portfolio');
      if (portfolio.status === 'published') {
        navigate(`/portfolioview/${me.userId}`);
      } else {
        navigate('/portfolio-builder');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        navigate('/portfolio-builder');
      } else {
        setAuthModalMsg('Could not check your portfolio right now. Please try again.');
        setShowVerifyButton(false);
        setShowAuthModal(true);
      }
    }
  };

  const handlePostClick = async e => {
    e.preventDefault();

    // 1) Ensure logged in as recruiter
    let me;
    try {
      const resp = await api.get('/api/auth/me');
      me = resp.data;
    } catch {
      setAuthModalMsg('Please log in as a recruiter to post a gig.');
      setShowVerifyButton(false);
      return setShowAuthModal(true);
    }
    if (me.role !== 'recruiter') {
      setAuthModalMsg('Only recruiters can post gigs.');
      setShowVerifyButton(false);
      return setShowAuthModal(true);
    }

    // 2) Ensure fully verified
    try {
      const { data } = await api.get('/api/recruiters/verification-status');
      if (data.verification_status !== 'fully_verified') {
        setAuthModalMsg(
          'You must be fully verified before posting gigs. Please complete verification first.'
        );
        setShowVerifyButton(true);
        return setShowAuthModal(true);
      }
    } catch {
      setAuthModalMsg('Unable to check your verification status. Please try again.');
      setShowVerifyButton(false);
      return setShowAuthModal(true);
    }

    // 3) Check subscription status & usage
    try {
      const { data: sub } = await api.get('/api/subscriptions/status');
      if (!sub.plan) {
        setAuthModalMsg('You need an active subscription to post gigs. Please choose a plan.');
        setShowVerifyButton(true);
        return setShowAuthModal(true);
      }
      if (sub.status !== 'active') {
        setAuthModalMsg('Your subscription is not active. Please renew or choose another plan.');
        setShowVerifyButton(true);
        return setShowAuthModal(true);
      }
      if (sub.usedPosts >= sub.maxPosts) {
        setAuthModalMsg(
          `You have used all ${sub.maxPosts} posts this period. Please upgrade or wait until ${new Date(sub.periodEnd).toLocaleDateString()}.`
        );
        setShowVerifyButton(true);
        return setShowAuthModal(true);
      }
    } catch {
      setAuthModalMsg('Unable to check your subscription. Please try again.');
      setShowVerifyButton(true);
      return setShowAuthModal(true);
    }

    // All checks passed!
    navigate('/post-job');
  };

  // Show flags: use `user == null` to catch both null and undefined
  const showStudent = user == null || user.role === 'student';
  const showRecruit = user == null || user.role === 'recruiter';

  return (
    <div className="homepage">
      <GlobalNavbar />

      {/* Hero */}
      <div className="hero-section" data-aos="fade-up"> 
        <div className="hero-text">
          <h5
            className="mb-3"
            style={{ color: 'black', fontSize: '1.25rem', fontWeight: 500 }}
            data-aos="fade-in"
            data-aos-delay="200"
          >
            <span style={{ fontSize: '1.5rem' }}>{greeting.icon}</span> {greeting.text}
          </h5>
          <h1 className="text-success">
            Welcome to CampusTalent,<br/>
            a platform of student skills and opportunities
          </h1>
          <p>Connect, Learn, and Grow with fellow students and recruiters.</p>
          <Link
            to="/getstarted"
            className="btn btn-success mt-3 px-4 py-2"
            data-aos="fade-in"
            data-aos-delay="300"
          >
            Get Started
          </Link>
        </div>
        <div
          className="hero-image"
          style={{ backgroundImage: `url(${background})` }}
        />
      </div>

      {/* Tiles */}
      {user !== undefined && (
        <Container className="mt-4">
          <div className="row">
            {showStudent && (
              <div className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm student-section">
                  <div className="card-body">
                    <h2>Showcase Your Skills</h2>
                    <p>Build a portfolio, earn badges, and connect with recruiters.</p>
                    <Button variant="success" onClick={handleBuildClick}>
                      Build Portfolio
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {showRecruit && (
              <div className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm recruiter-section">
                  <div className="card-body">
                    <h2>Hire Campus Talent</h2>
                    <p>Find vetted students with verified skills.</p>
                    <Button variant="success" onClick={handlePostClick}>
                      Post a Gig
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>
      )}

      {/* Only show the job‑browsing widget to students */}
      {showStudent && <FindJobsBySkill />}

      <DiscoverStudents />

      {/* Access‑Restricted / Subscription Modal */}
      <Modal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Action Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>{authModalMsg}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAuthModal(false)}>
            Cancel
          </Button>
          {showVerifyButton ? (
            <Button
              variant="success"
              onClick={() => {
                setShowAuthModal(false);
                navigate('/subscriptions');
              }}
            >
              Manage Subscription
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={() => {
                setShowAuthModal(false);
                navigate('/login');
              }}
            >
              Go to Login
            </Button>
          )}
        </Modal.Footer>
      </Modal>

    </div>
  );
}
