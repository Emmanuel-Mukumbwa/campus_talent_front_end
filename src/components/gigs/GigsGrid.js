// File: src/components/connections/GigsGrid.jsx

import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Badge,
  Button,
  OverlayTrigger,
  Tooltip,
  Pagination
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './GigsGrid.css';

export default function GigsGrid({
  gigs = [],
  role = 'student',
  columns = 2,
  filters = {
    search: '',
    location: '',
    skills: '',
    duration: '',
    deadline: ''
  },
  onAction,
}) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const gigsPerPage = 4;

  // 1) Drop drafts
  const nonDrafts = gigs.filter(g => g.status !== 'Draft');

  // 2) Apply filters
  const visibleGigs = nonDrafts.filter(gig => {
    const q = filters.search.trim().toLowerCase();
    if (q) {
      const inTitle   = gig.title.toLowerCase().includes(q);
      const inCompany = (gig.companyName || '').toLowerCase().includes(q);
      if (!inTitle && !inCompany) return false;
    }

    if (filters.location) {
      if (!gig.location.toLowerCase().includes(filters.location.trim().toLowerCase()))
        return false;
    }

    if (filters.skills) {
      const wanted = filters.skills
        .split(',')
        .map(s => s.trim().toLowerCase())
        .filter(Boolean);
      const have = gig.skills.map(s => s.skill.toLowerCase());
      if (!wanted.every(w => have.includes(w))) return false;
    }

    if (filters.duration && gig.duration !== filters.duration) {
      return false;
    }

    if (filters.deadline) {
      const deadlineFilter = new Date(filters.deadline);
      const expiresAt      = new Date(gig.expires_at);
      if (expiresAt > deadlineFilter) return false;
    }

    return true;
  });

  // 3) Pagination
  const totalPages  = Math.ceil(visibleGigs.length / gigsPerPage);
  const startIndex  = (currentPage - 1) * gigsPerPage;
  const paginatedGigs = visibleGigs.slice(startIndex, startIndex + gigsPerPage);

  const handlePageChange = pageNum => setCurrentPage(pageNum);

  return (
    <>
      <Row xs={1} md={columns} className="g-4">
        {paginatedGigs.map(gig => {
          const maxBadges     = 1;
          const displaySkills = gig.skills.slice(0, maxBadges);
          const extraCount    = gig.skills.length - displaySkills.length;
          const hasApplicants = (gig.applicants || 0) > 0;

          return (
            <Col key={gig.id}>
              <Card className="h-100 shadow-sm gig-card">
                <Card.Body className="d-flex flex-column">
                  <div className="mb-3">
                    <Card.Title className="h5">{gig.title}</Card.Title>
                    {role === 'student' ? (
                      <Card.Subtitle className="text-muted small">
                        {gig.location}
                      </Card.Subtitle>
                    ) : (
                      <p className="text-muted small mb-0">
                        <strong>{gig.applicants}</strong> applicants •{' '}
                        <strong>{gig.topMatches}</strong> top matches
                      </p>
                    )}
                  </div>

                  {role === 'student' && (
                    <>
                      <div className="mb-2 text-muted small">
                        <em>{gig.duration}</em>
                      </div>
                      <div className="mb-2 small">
                        <strong>Budget:</strong> {gig.budget_type}
                        {gig.payment_amount != null && (
                          <> – {gig.payment_amount.toLocaleString()} MK</>
                        )}
                      </div>
                      <div className="mb-3 small">
                        <strong>Deliverables:</strong>{' '}
                        {gig.deliverables || 'No deliverables specified'}
                      </div>
                      <div className="mb-3 d-flex flex-wrap gap-2">
                        {displaySkills.length > 0 ? (
                          displaySkills.map(s => (
                            <Badge
                              key={s.skill_id}
                              bg="outline-success"
                              text="success"
                              className="skill-badge"
                            >
                              {s.skill}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted small">
                            No skills listed
                          </span>
                        )}
                        {extraCount > 0 && (
                          <Badge bg="outline-secondary" text="secondary">
                            +{extraCount} more
                          </Badge>
                        )}
                      </div>
                      <div className="mb-4 text-danger small">
                        Apply by{' '}
                        <strong>
                          {new Date(gig.expires_at).toLocaleDateString()}
                        </strong>
                      </div>
                    </>
                  )}

                  <div className="mt-auto">
                    <div className="d-flex flex-wrap gap-2">
                      {/* STUDENT ACTIONS */}
                      {role === 'student' && (() => {
                        const status = gig.applicationStatus;
                        const viewStatuses = [
                          'Applied', 'Shortlisted', 'Accepted', 'Completed', 'Rejected'
                        ];
                        if (viewStatuses.includes(status)) {
                          return (
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() =>
                                navigate(`/student/applications/${gig.applicationId}`)
                              }
                            >
                              View Application
                            </Button>
                          );
                        }
                        if (status === 'draft') {
                          return (
                            <Button
                              variant="outline-warning"
                              size="sm"
                              onClick={() =>
                                navigate(`/gigs2/${gig.id}/apply`)
                              }
                            >
                              Resume Application
                            </Button>
                          );
                        }
                        return (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() =>
                              navigate(`/gigs2/${gig.id}/apply`)
                            }
                          >
                            Easy Apply
                          </Button>
                        );
                      })()}

                      {/* DETAILS BUTTON FOR BOTH ROLES */}
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/gigs/${gig.id}`)}
                      >
                        Details
                      </Button>

                      {/* RECRUITER ACTIONS */}
                      {role !== 'student' && (
                        <>
                          {hasApplicants ? (
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() =>
                                navigate(`/recruiter/applications/${gig.id}`)
                              }
                            >
                              View Applicants
                            </Button>
                          ) : (
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id={`tooltip-no-apps-${gig.id}`}>
                                  No applications yet
                                </Tooltip>
                              }
                            >
                              <span className="d-inline-block">
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  disabled
                                  style={{ pointerEvents: 'none' }}
                                >
                                  View Applicants
                                </Button>
                              </span>
                            </OverlayTrigger>
                          )}

                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => navigate(`/jobs/edit/${gig.id}`)}
                          >
                            Edit Gig
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => onAction(gig, 'close')}
                          >
                            Close Gig
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            {[...Array(totalPages)].map((_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={currentPage === idx + 1}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}
    </>
  );
}
 