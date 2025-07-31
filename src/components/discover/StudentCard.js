// File: src/components/discover/StudentCard.jsx
import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

export default function StudentCard({ student, onSendMessage }) {
  // Build a self‑explanatory string for recent endorsements
  const recentEndorsements = student.recentEndorsements || [];
  const recentText = recentEndorsements.length
    ? 'Recent endorsements: ' +
      recentEndorsements.map(r => `${r.skill} (${r.count})`).join(', ')
    : '';

  // Use the full URL if provided, otherwise fallback to default
  const avatarSrc = student.avatar_url || '/default-avatar.png';

  return (
    <Card className="shadow-sm student-card w-100">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          {/* Static avatar */}
          <img
            src={avatarSrc}
            alt={student.name}
            width={40}
            height={40}
            className="rounded-circle me-2"
          />
          <div>
            <h6 className="mb-0">{student.name}</h6>
            <small className="text-muted">
              {student.university} • {student.program}
            </small>
          </div>
        </div>

        {/* Badges */}
        {student.badges?.length > 0 && (
          <div>
            {student.badges.map((b, i) => (
              <Badge
                bg="warning"
                text="dark"
                key={i}
                className="me-1"
              >
                {b.charAt(0).toUpperCase() + b.slice(1)}
              </Badge>
            ))}
          </div>
        )}
      </Card.Header>

      <Card.Body>
        {/* Stats */}
        <div className="mb-2">
          <span className="card-pill">🛡️ {student.profileStrength}% Strength</span>
          <span className="card-pill">🏆 {student.endorsements} Endorsements</span>
          <span className="card-pill">🎖️ {student.projectCount} Projects</span>
          <span className="card-pill">⭐ {student.completedGigs} Gigs Done</span>
        </div>

        {/* Recent endorsements */}
        {recentText && (
          <div className="mb-2">
            <small className="text-muted">{recentText}</small>
          </div>
        )}

        {/* Only the Send Message button */}
        <div className="d-flex">
          <Button
            variant="success"
            size="sm"
            onClick={() => onSendMessage(student)}
          >
            Send Message
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
