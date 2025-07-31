// File: src/pages/PortfolioView.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  ListGroup
} from 'react-bootstrap';
import {
  FaPencilAlt,
  FaShareAlt,
  FaTag,
  FaChartLine,
  FaCheckCircle
} from 'react-icons/fa';
import api from '../utils/api';
import './PortfolioView.css';

export default function PortfolioView() {

   const BADGE_COLOR_MAP = {
    Platinum: '#e5e4e2',
    Gold:     '#FFD700',
    Silver:   '#C0C0C0',
    Bronze:   '#CD7F31',
    default:  '#777887'
  };

  const { studentId } = useParams();

  // portfolio *owner*’s enriched profile (for endorsements & badge)
  const [ownerProfile, setOwnerProfile] = useState(null);
  // signed‑in user (for permissions)
  const [user, setUser] = useState(null);
  // portfolio metadata & projects
  const [data, setData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  // computed avatar src (fall back to default)
  const [avatarSrcOwner, setAvatarSrcOwner] = useState('/default-avatar.png');

  const isOwner = user?.id === Number(studentId);
  const isAdmin = user?.role === 'admin';

  // load signed‑in user
  useEffect(() => {
    api.get('/api/auth/me')
      .then(({ data }) => {
        const normalized = { ...data, id: data.userId };
        setUser(normalized);
      })
      .catch(() => setUser(null));
  }, []);

  // load portfolio + first page
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

  // fetch the owner’s profile (to get endorsementPoints & badge)
  useEffect(() => {
    api.get(`/api/profile/${studentId}`)
      .then(({ data }) => setOwnerProfile(data))
      .catch(console.error);
  }, [studentId]);
   const badgeName  = ownerProfile?.badge;
  const badgeColor = BADGE_COLOR_MAP[badgeName] || BADGE_COLOR_MAP.default;

  // compute avatar URL once data.avatar_url is available
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

  // load next page of projects
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

  // admin delete
  const handleDelete = () => {
    if (!window.confirm('Delete this portfolio?')) return;
    api.delete(`/api/portfolio/${data.id}`)
      .then(() => window.location.href = '/')
      .catch(console.error);
  };

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
    // response_rate,      // no longer used
    completedGigsCount,   // new
    last_active,
    profile_strength,
    status,
    view_count,
    portfolio_created
  } = data;

  // tooltip wrapper for long text
  const withTooltip = (text) => (
    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-desc">{text}</Tooltip>}>
      <span>{text.length > 100 ? text.slice(0, 100) + '…' : text}</span>
    </OverlayTrigger>
  );

  return (
    <Container className="portfolio-container py-4">
      {/* MAIN TITLE */}
      <h1 className="mb-4">Portfolio Overview</h1>

      {/* HEADER WITH AVATAR */}
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
            <Col xs="auto">
              {isOwner && (
                <Button variant="outline-success" className="me-2">
                  <FaPencilAlt /> Edit
                </Button>
              )}
              <Button variant="success" className="me-2">
                <FaShareAlt /> {isOwner ? 'Share' : 'Hire'}
              </Button>
              {isAdmin && (
                <Button variant="outline-danger" onClick={handleDelete}>
                  Delete
                </Button>
              )}
            </Col>
          </Row>
        </div>
      </div>

      {/* PROFESSIONAL STATS */}
      <h5 className="mb-3">Professional Stats</h5>
      <Row className="stat-cards g-3 mb-4">
        {/* Endorsement Points */}
        <Col xs={6} md={3}>
          <Card className="stat-card">
            <FaTag className="stat-icon text-success" />
            <h4>{ownerProfile?.endorsementPoints ?? 0}</h4>
            <small>Endorsements Total Points</small>
          </Card>
        </Col>
        {/* Profile Strength */}
        <Col xs={6} md={3}>
          <Card className="stat-card">
            <FaChartLine className="stat-icon text-success" />
            <ProgressBar now={profile_strength} variant="success" label={`${profile_strength}%`} />
            <small>Profile Strength</small>
          </Card>
        </Col>
        {/* Completed Gigs (last 6 mo) */}
        <Col xs={6} md={3}>
          <Card className="stat-card">
            <FaCheckCircle className="stat-icon text-success" />
            <h4>{completedGigsCount}</h4>
            <small>Completed Gigs (6 mo)</small>
          </Card>
        </Col>
        {/* Total Skills */}
        <Col xs={6} md={3}>
          <Card className="stat-card">
            <FaTag className="stat-icon text-success" />
            <h4>{skills.length}</h4>
            <small>Skills</small>
          </Card>
        </Col>
      </Row>

      {/* DISPLAY BADGE */}
      {ownerProfile?.badge && (
  <Card className="badge-card mb-4 shadow-sm">
    <Card.Body className="text-center">
      <h5>Badge</h5>
      {/* using bsPrefix to strip default bg-* class: */}
       <span
       className="badge p-2"
       style={{
         backgroundColor: badgeColor,
         color:            '#fff'
       }}
     >
       {badgeName.toUpperCase()}
     </span>
    </Card.Body>
  </Card>
)}


      {/* ABOUT ME */}
      <h5 className="mb-3">About Me</h5>
      <Card className="profile-card mb-4">
        <Card.Body>
          <Card.Text>{about}</Card.Text>
        </Card.Body>
      </Card>

      {/* OTHER STATS */}
      <h5 className="mb-3">Other Stats</h5>
      <Card className="profile-card mb-4">
        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Status:</strong> <Badge bg="success">{status}</Badge>
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Joined:</strong> {new Date(portfolio_created).toLocaleDateString()}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Views:</strong> {view_count}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Last Active:</strong> {new Date(last_active).toLocaleString()}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Availability:</strong> {availability}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Payment Pref.:</strong> {payment_pref}
          </ListGroup.Item>
        </ListGroup>
      </Card>

      {/* PROFICIENCIES */}
      <h5 className="mb-3">Proficiencies</h5>
      <div className="mb-4">
        {proficiencies.map((p, i) => (
          <Badge key={i} bg="success" className="me-1 mb-1">
            <FaTag /> {p}
          </Badge>
        ))}
      </div>

      {/* SKILLS GRID */}
      <h5 className="mb-3">Skills</h5>
      <Row className="skills-cards g-3 mb-4">
        {skills.map(s => (
          <Col key={s.id} xs={6} md={3}>
            <Card className="skill-card">
              <Card.Body className="text-center">
                <FaTag className="stat-icon text-success" />
                <h6 className="mt-2">{s.name}</h6>
                {s.level && (
                  <Badge bg="secondary" className="mt-1">
                    {s.level}
                  </Badge>
                )}
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

      {/* PROJECTS */}
      <h5 className="mb-3">Projects</h5>
      <InfiniteScroll
        dataLength={projects.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<Spinner className="my-3" animation="border" variant="success" />}
        endMessage={<p className="text-center mt-3">No more projects</p>}
      >
        <Row className="gy-4">
          {projects.map(proj => (
            <Col key={proj.id} xs={12} md={6} lg={4}>
              <Card className="h-100 portfolio-card position-relative">
                {proj.media?.[0] && (
                  <div className="image-wrapper">
                    <img
                      src={
                        /^https?:\/\//.test(proj.media[0])
                          ? proj.media[0]
                          : `${api.defaults.baseURL}${proj.media[0]}`
                      }
                      alt={proj.title}
                      className="card-img-top"
                    />
                    <div className="project-overlay">
                      <Button variant="outline-light" size="sm" className="me-2">
                        <FaShareAlt />
                      </Button>
                      {isOwner && (
                        <Button variant="outline-light" size="sm">
                          <FaPencilAlt />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{proj.title}</Card.Title>
                  <Card.Text className="flex-grow-1">
                    {withTooltip(proj.description)}
                  </Card.Text>
                  <div className="mb-2">
                    {proj.skills_used.map((skill, idx) => (
                      <Badge key={idx} bg="light" text="dark" className="me-1 mb-1">
                        <FaTag /> {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <Button size="sm" variant="outline-success">
                      Details
                    </Button>
                  </div>
                </Card.Body>
                {proj.is_featured === 1 && (
                  <Badge
                    bg="warning"
                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
                  >
                    Featured
                  </Badge>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </InfiniteScroll>
    </Container>
  );
}
