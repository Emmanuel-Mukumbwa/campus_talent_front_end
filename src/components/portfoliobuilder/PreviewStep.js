// File: src/components/portfoliobuilder/PreviewStep.jsx

import React from 'react';
import { Card, Row, Col, Image } from 'react-bootstrap';

// Utility to guess file type by URL
function fileCategory(url) {
  if (/\.(jpe?g|png|gif)$/i.test(url)) return 'image';
  if (/\.(mp4|webm)$/i.test(url)) return 'video';
  return 'doc';
}

// Renders a thumbnail or link based on category
function FilePreview({ url }) {
  const cat = fileCategory(url);
  if (cat === 'image') {
    return (
      <Image
        src={url}
        thumbnail
        style={{ maxWidth: 120, marginRight: 8, marginBottom: 8 }}
      />
    );
  }
  if (cat === 'video') {
    return (
      <video
        controls
        style={{ maxWidth: 160, maxHeight: 100, marginRight: 8, marginBottom: 8 }}
      >
        <source src={url} type="video/mp4" />
        Your browser doesn’t support video.
      </video>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="d-block mb-1"
    >
      📄 View document
    </a>
  );
}

export default function PreviewStep({ data, linkErrors }) {
  const primarySkill = data.selectedSkills[0];
  // Safely grab the proficiencies object for this skill
  const prof = primarySkill ? data.proficiencies[primarySkill] : null;

  return (
    <div className="wizard-card">
      <h5 className="mb-4">🌐 Preview &amp; Publish</h5>

      {/* About */}
      <Card className="mb-4 shadow-sm">
        <Card.Header>
          <strong>About You</strong>
        </Card.Header>
        <Card.Body>
          {data.about
            ? <p>{data.about}</p>
            : <p className="text-muted"><em>No bio provided.</em></p>
          }
        </Card.Body>
      </Card>

      {/* Core Skill & Proficiency */}
      <Card className="mb-4 shadow-sm">
        <Card.Header>
          <strong>Primary Skill &amp; Proficiency</strong>
        </Card.Header>
        <Card.Body>
          {primarySkill ? (
            <p>
              <strong>{primarySkill}</strong> —{' '}
              {prof
                ? `${prof.level} (${prof.score_pct}%)`
                : <span className="text-muted"><em>Not assessed yet</em></span>
              }
            </p>
          ) : (
            <p className="text-muted"><em>No skill selected.</em></p>
          )}
        </Card.Body>
      </Card>

      {/* Projects */}
      <Card className="mb-4 shadow-sm">
        <Card.Header>
          <strong>Projects Showcase</strong>
        </Card.Header>
        <Card.Body>
          {data.projects.length > 0 ? (
            data.projects.map((p, i) => (
              <Card key={i} className="mb-3">
                <Card.Body>
                  <Card.Title>
                    {p.title || <em>(untitled)</em>}
                  </Card.Title>
                  <Card.Text>
                    {p.description || <em>(no description)</em>}
                  </Card.Text>

                  {/* Evidence Links */}
                  <div className="mb-2">
                    <strong>Evidence:</strong>
                    <ul className="mb-0">
                      {p.evidence.map((url, j) => (
                        <li
                          key={j}
                          className={linkErrors[i]?.[j] ? 'text-danger' : undefined}
                        >
                          {url
                            ? <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                            : <em>No link provided</em>
                          }
                          {linkErrors[i]?.[j] && <span> (Invalid URL)</span>}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Media Thumbnails */}
                  {p.media && p.media.length > 0 && (
                    <div>
                      <strong>Media:</strong>
                      <Row className="mt-2">
                        {p.media.map((url, k) => (
                          <Col key={k} xs="auto">
                            <FilePreview url={url} />
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))
          ) : (
            <p className="text-muted"><em>No projects added.</em></p>
          )}
        </Card.Body>
      </Card>

      {/* Final Note */}
      <div className="alert alert-info">
        Review everything above. When you’re ready, click “Publish Portfolio” below.
      </div>
    </div>
  ); 
}
