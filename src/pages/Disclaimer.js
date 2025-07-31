import React from 'react';
import { Container, Card } from 'react-bootstrap';

export default function Disclaimer() {
  return (
    <Container className="py-5">
      <Card>
        <Card.Body>
          <h1 className="mb-4">Disclaimer</h1>

          <p>
            The information on CampusTalent is provided “as is,” without warranty of any kind. We make no guarantees about the accuracy, completeness, or usefulness of any information.
          </p>

          <h4>Professional Advice</h4>
          <p>
            Nothing on this site constitutes legal, financial, or professional advice. You should consult a qualified professional before making decisions.
          </p>

          <h4>External Links</h4>
          <p>
            Our platform may link to external websites. We’re not responsible for their content or practices.
          </p>

          <h4>User‑Generated Content</h4>
          <p>
            Students and recruiters create their own profiles, portfolios, and gig descriptions. We do not endorse or verify every claim or qualification.
          </p>

          <h4>Limitation of Liability</h4>
          <p>
            Under no circumstances shall CampusTalent be liable for any direct, indirect, incidental, or consequential damages arising from your use of the site.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
