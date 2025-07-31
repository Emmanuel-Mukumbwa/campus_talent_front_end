// File: src/components/connections/ConnectionCard.js
import React from 'react';
import {
  Card,
  Col,
  Badge,
  Button,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import {
  GeoAlt,
  Briefcase,
  Star,
  Folder2,
  BarChart,
  ChatDots,
} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

export default function ConnectionCard({
  conn,
  avatar,
  viewerRole,   // 'student' or 'recruiter'
  viewerId,     // your own user ID (for '/myprofile' logic)
}) {
  const navigate = useNavigate();

  const isViewerStudent = viewerRole === 'student';
  const isViewerRecruit = viewerRole === 'recruiter';
  const isTargetStudent = conn.role === 'student';

  // “time ago” helper
  const timeAgo = dateStr => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins   = Math.floor(diffMs / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs/24)}d ago`;
  };

  // Header title & subtitle
  const headerTitle = isTargetStudent
    ? `${conn.program} — ${conn.year}`
    : conn.company || conn.name;
  const headerSubtitle = isTargetStudent
    ? <><GeoAlt size={12} className="me-1"/> {conn.university}</>
    : conn.headline
      ? conn.headline
      : <><Briefcase size={12} className="me-1"/> {conn.position}</>;

  // AVATAR CLICK
  const handleAvatarClick = () => {
    if (conn.id === viewerId) {
      navigate('/myprofile');
    } else {
      navigate(`/profile/${conn.id}`);
    }
  };

  // PRIMARY BUTTON LOGIC
  let buttonLabel, buttonIcon, buttonAction;
  if (isViewerRecruit && isTargetStudent) {
    // Recruiter viewing a student → still show “View Portfolio”
    buttonLabel  = 'View Portfolio';
    buttonIcon   = <Briefcase className="me-1" />;
    buttonAction = () => navigate(`/recruiter/portfolioview/${conn.id}`);
  } else {
    // Everyone else → send a message
    buttonLabel  = 'Send Message';
    buttonIcon   = <ChatDots className="me-1" />;
    buttonAction = () => navigate(`/messages/${conn.id}`);
  }

  return (
    <Col xs={12} md={6}>
      <Card className="h-100 connection-card shadow-sm">
        <Card.Header className="d-flex align-items-center bg-light">
          <img
            src={avatar || '/default-avatar.png'}
            alt={conn.name}
            className="avatar rounded-circle me-3"
            width={60}
            height={60}
            style={{ cursor: 'pointer' }}
            onClick={handleAvatarClick}
          />
          <div>
            <h6 className="mb-1">{conn.name}</h6>
            <small className="text-muted">
              {headerTitle}<br/>
              {headerSubtitle}
            </small>
          </div>
        </Card.Header>

        <Card.Body>
          <div className="d-flex flex-wrap justify-content-between mb-2">
            {isTargetStudent && (
              <>
                <small>
                  <Folder2 className="me-1"/>
                  projects: {conn.majorProjects}
                </small>
                <small>
                  <BarChart className="me-1"/>
                  {conn.profileStrength}%
                </small>
              </>
            )}
            <small>
              Active: {timeAgo(conn.lastActive)}
              {conn.isVerified && (
                <Badge bg="info" className="ms-2">
                  ✔️ Verified
                </Badge>
              )}
            </small>
          </div>

          <div className="d-flex flex-wrap gap-2 mb-3">
            {isTargetStudent
              ? conn.badges?.slice(0,3).map(b => (
                  <Badge bg="success" text="light" key={b}>
                    <Star className="me-1 text-light"/>{b}
                  </Badge>
                ))
              : (
                  <Badge bg="success" text="light">
                    <Briefcase className="me-1 text-light"/>
                    {conn.openGigs} Openings
                  </Badge>
                )
            }
          </div>

          <div className="mb-3">
            <h6 className="text-muted small mb-2">
              {isTargetStudent ? 'Skills' : 'Skills Required'}
            </h6>
            <div className="d-flex flex-wrap gap-1">
              {(isTargetStudent ? conn.skillsOverlap : conn.matchedSkills)
                .slice(0,4)
                .map(skill => (
                  <OverlayTrigger
                    key={skill}
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${skill}`}>{skill}</Tooltip>}
                  >
                    <Badge bg="success" text="light" className="skill-pill">
                      {skill}
                    </Badge>
                  </OverlayTrigger>
                ))
              }
            </div>
          </div>

          <div className="d-flex gap-2">
            <Button
              variant="outline-success"
              size="sm"
              className="flex-grow-1"
              onClick={buttonAction}
            >
              {buttonIcon}
              {buttonLabel}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}
