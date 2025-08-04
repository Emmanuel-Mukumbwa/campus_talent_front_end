// File: src/components/Terms.jsx
import React from 'react';
import { Container, Card, Accordion, ListGroup } from 'react-bootstrap';

export default function Terms() {
  const lastUpdated = 'August 4, 2025';

  const sections = [
    { key: '0', title: '1. Acceptance of Terms', 
      body: `By using CampusTalent, you agree to these terms. If you don’t agree, please don’t use the platform.` },
    { key: '1', title: '2. Eligibility', 
      body: `You must be a current Mzuzu University student to register as a student, or a verified recruiter to post gigs.` },
    { key: '2', title: '3. Your Account', 
      body: `You’re responsible for keeping your password secure and for all activity under your account.` },
    { key: '3', title: '4. Content & Conduct', 
      body: `You agree not to post unlawful, abusive, or infringing content. CampusTalent reserves the right to remove anything that violates these terms.` },
    { key: '4', title: '5. Fees & Payments', 
      body: `All gigs require escrow deposits, and we collect a platform fee as described on our Fee Schedule page.` },
    { key: '5', title: '6. Termination', 
      body: `We may suspend or terminate your account for breach of these terms, at our sole discretion.` },
    { key: '6', title: '7. Limitation of Liability', 
      body: `CampusTalent provides the service “as is.” We’re not liable for indirect, incidental, or consequential damages.` },
    { key: '7', title: '8. Changes to These Terms', 
      body: `We may update these terms; we’ll post the new date at the top. Continued use means you accept the revised terms.` },
  ];

  const tocItemStyle = {
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  };

  return (
    <Container className="py-5">
      <Card className="border-success shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-success text-white">
          <h1 className="mb-0">Terms of Service</h1>
          <small>Last updated: {lastUpdated}</small>
        </Card.Header>
        <Card.Body>
          {/* Table of Contents */}
          <h5 className="mt-3">Table of Contents</h5>
          <ListGroup variant="flush" className="mb-4">
            {sections.map(({ key, title }) => (
              <ListGroup.Item
                key={key}
                action
                href={`#section-${key}`}
                style={tocItemStyle}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e6f4ea'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {title}
              </ListGroup.Item>
            ))}
          </ListGroup>

          {/* Terms Accordion */}
          <Accordion>
            {sections.map(({ key, title, body }) => (
              <Accordion.Item eventKey={key} key={key}>
                <Accordion.Header id={`section-${key}`}>
                  <div style={{ borderLeft: '4px solid #198754', paddingLeft: '0.5rem', width: '100%' }}>
                    <strong>{title}</strong>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <p className="mb-0">{body}</p>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Card.Body>
      </Card>
    </Container>
  );
}
