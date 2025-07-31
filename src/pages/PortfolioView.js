// File: src/pages/PortfolioView.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Badge,
  Image,
  OverlayTrigger,
  Tooltip,
  ProgressBar,
  ListGroup,
  Tabs,
  Tab,
  Modal
} from 'react-bootstrap';
import {
  FaPencilAlt,
  FaTag,
  FaChartLine,
  FaCheckCircle
} from 'react-icons/fa';
import api from '../utils/api';
import './PortfolioView.css';

export default function PortfolioView() {
  const navigate      = useNavigate();
  const { studentId } = useParams();

  // ── Verification-modal state ─────────────────────────────────────────────
  const [showAuthModal,    setShowAuthModal]    = useState(false);
  const [authModalMsg,     setAuthModalMsg]     = useState('');
  const [showVerifyButton, setShowVerifyButton] = useState(false);
  // ────────────────────────────────────────────────────────────────────────

  // portfolio owner profile (endorsements & badge)
  const [ownerProfile, setOwnerProfile] = useState(null);
  // signed-in user
  const [user, setUser]                 = useState(null);
  // portfolio metadata & projects
  const [data, setData]                 = useState(null);
  const [projects, setProjects]         = useState([]);
  const [page, setPage]                 = useState(1);
  const [limit]                         = useState(6);
  const [hasMore, setHasMore]           = useState(true);
  const [loading, setLoading]           = useState(true);
  // avatar src
  const [avatarSrcOwner, setAvatarSrcOwner] = useState('/default-avatar.png');

  const isOwner     = user?.id === Number(studentId);
  const isAdmin     = user?.role === 'admin';
  const isRecruiter = user?.role === 'recruiter';

  // badge color map
  const BADGE_COLOR_MAP = {
    Platinum: '#e5e4e2',
    Gold:     '#FFD700',
    Silver:   '#C0C0C0',
    Bronze:   '#CD7F31',
    default:  '#777887'
  };

  // fetch signed-in user
  useEffect(() => {
    api.get('/api/auth/me')
      .then(({ data }) => setUser({ ...data, id: data.userId }))
      .catch(() => setUser(null));
  }, []);

  // ── load portfolio + first page & bump view_count ────────────────────────
  useEffect(() => {
    setLoading(true);
    api.get(`/api/portfolioview/${studentId}?page=1&limit=${limit}`)
      .then(({ data: res }) => {
        setData(res.portfolio);
        setProjects(res.portfolio.projects.data);
        setHasMore(
          res.portfolio.projects.pagination.page <
          res.portfolio.projects.pagination.totalPages
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [studentId, limit]);
  // ────────────────────────────────────────────────────────────────────────

  // fetch owner’s profile (endorsementPoints & badge)
  useEffect(() => {
    api.get(`/api/profile/${studentId}`)
      .then(({ data }) => setOwnerProfile(data))
      .catch(console.error);
  }, [studentId]);

  // compute avatar URL
  useEffect(() => {
    if (!data?.avatar_url) {
      setAvatarSrcOwner('/default-avatar.png');
      return;
    }
    if (/^https?:\/\//.test(data.avatar_url)) {
      setAvatarSrcOwner(data.avatar_url);
    } else {
      const base = api.defaults.baseURL?.replace(/\/+$/, '') || window.location.origin;
      setAvatarSrcOwner(`${base}${data.avatar_url}`);
    }
  }, [data]);

  // fetch additional projects on scroll
  const fetchMore = () => {
    api.get(`/api/portfolioview/${studentId}?page=${page + 1}&limit=${limit}`)
      .then(({ data: res }) => {
        setProjects(prev => [...prev, ...res.portfolio.projects.data]);
        const { page: p, totalPages } = res.portfolio.projects.pagination;
        setPage(p);
        setHasMore(p < totalPages);
      })
      .catch(console.error);
  };

  // delete portfolio (admin only)
  const handleDelete = () => {
    if (!window.confirm('Delete this portfolio?')) return;
    api.delete(`/api/portfolio/${data.id}`)
      .then(() => navigate('/'))
      .catch(console.error);
  };

  // ── handle Endorse click with verification check ─────────────────────────
  const handleEndorseClick = async () => {
    try {
      const { data: statusResp } = await api.get('/api/recruiters/verification-status');
      const status = statusResp.verification_status;
      if (status === 'fully_verified') {
        navigate(`/endorse/${studentId}`);
      } else {
        setAuthModalMsg('Your account must be fully verified before endorsing a student.');
        setShowVerifyButton(true);
        setShowAuthModal(true);
      }
    } catch (err) {
      console.error('Verification check failed', err);
      setAuthModalMsg('Unable to check your verification status. Please try again.');
      setShowVerifyButton(false);
      setShowAuthModal(true);
    }
  };
  // ────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }
  if (!data) {
    return <p className="p-4 text-danger">Portfolio not found or you’re not authorized.</p>;
  }

  const {
    name,
    headline,
    about,
    proficiencies,
    skills,
    university,
    program,
    faculty,
    year,
    availability,
    payment_pref,
    completedGigsCount,
    last_active,
    profile_strength,
    status,
    view_count,
    portfolio_created
  } = data;

  const badgeName  = ownerProfile?.badge;
  const badgeColor = BADGE_COLOR_MAP[badgeName] || BADGE_COLOR_MAP.default;

  const withTooltip = text => (
    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-desc">{text}</Tooltip>}>
      <span>{text.length > 100 ? text.slice(0, 100) + '…' : text}</span>
    </OverlayTrigger>
  );

  return (
    <Container className="portfolio-container py-4">
      {/* TITLE & HEADER */}
      <h1 className="mb-4">Portfolio Overview</h1>
      <div className="portfolio-header mb-4">
        <div className="header-avatar">
          <Image
            src={avatarSrcOwner}
            alt="Owner avatar"
            roundedCircle
            width={80}
            height={80}
          />
        </div>
        <div className="header-content">
          <Row className="align-items-center">
            <Col xs={12} sm="auto">
              <h2 className="mb-0">{name}</h2>
            </Col>
            <Col xs={12} sm className="d-none d-sm-block">
              <p className="text-success mb-1">{headline}</p>
              <Badge bg="success" className="me-1">{university}</Badge>
              <Badge bg="success" className="me-1">{program}</Badge>
              <Badge bg="success" className="me-1">{faculty}, Year {year}</Badge>
            </Col>
            <Col xs="auto" className="d-flex gap-2">
              {isOwner && (
                <Button
                  variant="outline-success"
                  onClick={() => navigate('/portfolio-builder')}
                >
                  <FaPencilAlt className="me-1" />
                  Edit
                </Button>
              )}
              {isRecruiter && !isOwner && (
                <Button
                  variant="outline-success"
                  onClick={handleEndorseClick}
                >
                  <FaCheckCircle className="me-1" />
                  Endorse
                </Button>
              )}
              {isAdmin && (
                <Button variant="outline-danger" onClick={handleDelete}>
                  Delete
                </Button>
              )}
            </Col>
          </Row>
        </div>
      </div>

      {/* TABS */}
      <Tabs defaultActiveKey="about" id="portfolio-tabs" className="mb-4" fill variant="pills">
        {/* About Me */}
        <Tab eventKey="about" title="About Me">
          <Card className="mb-4">
            <Card.Body><Card.Text>{about}</Card.Text></Card.Body>
          </Card>
        </Tab>

        {/* Stats */}
        <Tab eventKey="stats" title="Stats">
          <Row className="g-3 mb-4">
            <Col xs={6} md={3}>
              <Card className="text-center">
                <FaChartLine className="stat-icon text-success" size={32}/>
                <Card.Body>
                  <Card.Title>{profile_strength}%</Card.Title>
                  <Card.Text>Profile Strength</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={3}>
              <Card className="text-center">
                <FaCheckCircle className="stat-icon text-success" size={32}/>
                <Card.Body>
                  <Card.Title>{completedGigsCount}</Card.Title>
                  <Card.Text>Completed Gigs</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={3}>
              <Card className="text-center">
                <FaTag className="stat-icon text-success" size={32}/>
                <Card.Body>
                  <Card.Title>{ownerProfile?.endorsementPoints ?? 0}</Card.Title>
                  <Card.Text>Endorsements</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={3}>
              <Card className="text-center">
                <FaTag className="stat-icon text-success" size={32}/>
                <Card.Body>
                  <Card.Title>{skills.length}</Card.Title>
                  <Card.Text>Skills</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Badge display */}
          {badgeName && (
            <Card className="mb-4 text-center">
              <Card.Body>
                <h5>Badge</h5>
                <Badge
                  bg="success"
                  className="p-2"
                  style={{ backgroundColor: badgeColor, color: '#fff', fontSize: '1rem' }}
                >
                  {badgeName.toUpperCase()}
                </Badge>
              </Card.Body>
            </Card>
          )}

          <Card className="profile-card mb-4">
            <ListGroup variant="flush">
              <ListGroup.Item><strong>Status:</strong> <Badge bg="success">{status}</Badge></ListGroup.Item>
              <ListGroup.Item><strong>Joined:</strong> {new Date(portfolio_created).toLocaleDateString()}</ListGroup.Item>
              <ListGroup.Item><strong>Views:</strong> {view_count}</ListGroup.Item>
              <ListGroup.Item><strong>Last Active:</strong> {new Date(last_active).toLocaleString()}</ListGroup.Item>
              <ListGroup.Item><strong>Availability:</strong> {availability}</ListGroup.Item>
              <ListGroup.Item><strong>Payment Pref.:</strong> {payment_pref}</ListGroup.Item>
            </ListGroup>
          </Card>
        </Tab>

        {/* Skills */}
        <Tab eventKey="skills" title="Skills">
          <Row className="g-3 mb-4">
            {skills.map(s => (
              <Col key={s.id} xs={6} md={4}>
                <Card className="h-100">
                  <Card.Body className="text-center">
                    <FaTag size={24} className="text-success" />
                    <Card.Title className="mt-2">{s.name}</Card.Title>
                    {s.level && <Badge bg="secondary">{s.level}</Badge>}
                    {typeof s.score_pct === 'number' && (
                      <ProgressBar
                        now={s.score_pct}
                        label={`${s.score_pct}%`}
                        variant="success"
                        className="mt-2"
                      />
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>

        {/* Projects */}
        <Tab eventKey="projects" title="Projects">
          <InfiniteScroll
            dataLength={projects.length}
            next={fetchMore}
            hasMore={hasMore}
            loader={<Spinner className="my-3" animation="border" variant="success" />}
            endMessage={<p className="text-center mt-3">No more projects</p>}
          >
            <Row className="gy-4 mb-4">
              {projects.map(proj => (
                <Col key={proj.id} xs={12} md={6} lg={4}>
                  <Card className="h-100 shadow-sm">
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-baseline mb-2">
                        <Card.Title className="h6 mb-0">{proj.title}</Card.Title>
                        {proj.role && <Badge bg="secondary" className="ms-2">{proj.role}</Badge>}
                      </div>
                      {(proj.start_date || proj.end_date) && (
                        <small className="text-muted mb-2">
                          {proj.start_date ? new Date(proj.start_date).toLocaleDateString() : '—'} – {proj.end_date ? new Date(proj.end_date).toLocaleDateString() : 'Present'}
                        </small>
                      )}
                      <Card.Text className="flex-grow-1 mb-2">
                        {withTooltip(proj.description)}
                      </Card.Text>
                      {Array.isArray(proj.skills_used) && proj.skills_used.length > 0 && (
                        <div className="mb-2">
                          {proj.skills_used.map(skill => (
                            <Badge bg="success" text="light" className="me-1 mb-1" key={skill}>{skill}</Badge>
                          ))}
                        </div>
                      )}
                      {Array.isArray(proj.evidence_links) && proj.evidence_links.length > 0 && (
                        <div className="mb-2">
                          {proj.evidence_links.map((url, idx) => (
                            <div key={idx}>
                              <a href={url} target="_blank" rel="noopener noreferrer">
                                {url.replace(/^https?:\/\//, '')}
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                      {Array.isArray(proj.media) && proj.media.length > 0 && (
                        <div className="mt-2 d-flex flex-wrap gap-2">
                          {proj.media.map((m, i) => (
                            <Image
                              key={i}
                              src={m}
                              alt={`${proj.title} media ${i+1}`}
                              thumbnail
                              style={{ maxWidth: '100px', maxHeight: '100px' }}
                            />
                          ))}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </InfiniteScroll>
        </Tab>
      </Tabs>

      {/* ── Verification Modal ─────────────────────────────────────────────── */}
      <Modal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Access Restricted</Modal.Title>
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
                navigate('/recruiterverification');
              }}
            >
              Verify Now
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
      {/* ─────────────────────────────────────────────────────────────────────── */}
    </Container>
  );
}
