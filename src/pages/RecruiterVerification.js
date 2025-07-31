import React, { useState, useEffect } from 'react';
import { Container, Card, ListGroup, Form, Accordion } from 'react-bootstrap';
import { Check2Square } from 'react-bootstrap-icons';
import BasicVerification from '../components/verification/BasicVerification';
import BusinessVerification from '../components/verification/BusinessVerification';

export default function RecruiterVerification() {
  const [agreeToTOS, setAgreeToTOS]       = useState(false);
  const [basicVerified, setBasicVerified] = useState(false);
  const [activeKey, setActiveKey]         = useState('0');

  // Auto‑check & lock the TOS when basic is done
  useEffect(() => {
    if (basicVerified) {
      setAgreeToTOS(true);
      setActiveKey('1');   // expand business verification
    }
  }, [basicVerified]);

  return (
    <Container className="py-5">
      <h2 className="mb-4 text-success">Recruiter Verification</h2>

      {/* TERMS OF REFERENCE */}
      <Card className="mb-4 shadow-sm">
        <Card.Header>
          <Check2Square className="me-2" />
          Terms of Reference
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item>
              I confirm that all information and documents provided are accurate
              and truthful.
            </ListGroup.Item>
            <ListGroup.Item>
              I agree to pay all escrow deposits in advance and abide by
              CampusTalent’s dispute resolution.
            </ListGroup.Item>
            <ListGroup.Item>
              I understand that misleading information may result in account
              suspension.
            </ListGroup.Item>
          </ListGroup>
          <Form.Check
            className="mt-3"
            type="checkbox"
            label="I have read and agree to these Terms of Reference"
            checked={agreeToTOS}
            disabled={basicVerified}
            onChange={e => setAgreeToTOS(e.target.checked)}
          />
        </Card.Body>
      </Card>

      <Accordion activeKey={activeKey} onSelect={setActiveKey} flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            Basic Verification
            {basicVerified && <Check2Square className="ms-2 text-success" />}
          </Accordion.Header>
          <Accordion.Body>
            <BasicVerification
              agreeToTOS={agreeToTOS}
              onVerified={setBasicVerified}
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>
            Business Verification
            {basicVerified && <Check2Square className="ms-2 text-success" />}
          </Accordion.Header>
          <Accordion.Body>
            <BusinessVerification basicVerified={basicVerified} />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}
