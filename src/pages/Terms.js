import React from 'react';
import { Container, Card } from 'react-bootstrap';

export default function Terms() {
  return (
    <Container className="py-5">
      <Card>
        <Card.Body>
          <h1 className="mb-4">Terms of Service</h1>

          <h4>1. Acceptance of Terms</h4>
          <p>
            By using CampusTalent, you agree to these terms. If you don’t agree, please don’t use the platform.
          </p>

          <h4>2. Eligibility</h4>
          <p>
            You must be a current Mzuzu University student to register as a student, or a verified recruiter to post gigs.
          </p>

          <h4>3. Your Account</h4>
          <p>
            You’re responsible for keeping your password secure and all activity under your account.
          </p>

          <h4>4. Content & Conduct</h4>
          <p>
            You agree not to post unlawful, abusive, or infringing content. CampusTalent reserves the right to remove anything that violates these terms.
          </p>

          <h4>5. Fees & Payments</h4>
          <p>
            All gigs require escrow deposits, and we collect a platform fee as described on our Fee Schedule page.
          </p>

          <h4>6. Termination</h4>
          <p>
            We may suspend or terminate your account for breach of these terms, at our sole discretion.
          </p>

          <h4>7. Limitation of Liability</h4>
          <p>
            CampusTalent provides the service “as is.” We’re not liable for indirect, incidental, or consequential damages.
          </p>

          <h4>8. Changes to These Terms</h4>
          <p>
            We may update these terms; we’ll post the new date at the top. Continued use means you accept the revised terms.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
