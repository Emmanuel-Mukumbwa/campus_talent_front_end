// File: src/components/Disclaimer.jsx
import React from 'react';
import { Container, Card } from 'react-bootstrap';

export default function Disclaimer() {
  const lastUpdated = 'August 4, 2025';

  const sectionHeadingStyle = {
    borderLeft: '4px solid #198754',
    paddingLeft: '0.5rem',
    marginTop: '1.5rem',
    marginBottom: '0.5rem'
  };

  return (
    <Container className="py-5">
      <Card className="border-success shadow-sm">
        <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
          <h1 className="mb-0" style={{ fontSize: '1.75rem' }}>Disclaimer</h1>
          <small>Last updated: {lastUpdated}</small>
        </Card.Header>
        <Card.Body>
          <p>
            The information on CampusTalent is provided <em>“as is,”</em> without warranty of any kind. We make no guarantees about the accuracy, completeness, or usefulness of any information.
          </p>

          <h4 style={sectionHeadingStyle}>Professional Advice</h4>
          <p>
            Nothing on this site constitutes legal, financial, or professional advice. You should consult a qualified professional before making any decisions.
          </p>

          <h4 style={sectionHeadingStyle}>External Links</h4>
          <p>
            Our platform may link to external websites. We are not responsible for their content, privacy policies, or practices.
          </p>

          <h4 style={sectionHeadingStyle}>User-Generated Content</h4>
          <p>
            Students and recruiters create their own profiles, portfolios, and gig descriptions. We do not endorse or verify every claim or qualification made by users.
          </p>

          <h4 style={sectionHeadingStyle}>Limitation of Liability</h4>
          <p>
            Under no circumstances shall CampusTalent be liable for any direct, indirect, incidental, or consequential damages arising from your use of the site.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
