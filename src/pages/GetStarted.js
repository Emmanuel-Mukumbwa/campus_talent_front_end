// File: src/pages/GetStarted.jsx

import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Table } from 'react-bootstrap';
import {
  ShieldLockFill,
  Wallet2,
  StopwatchFill,
  PersonCheckFill,
  PeopleFill,
  BriefcaseFill,
  ExclamationCircleFill,
  SignpostSplit,
  PersonPlusFill,
  PencilFill,
  SearchHeartFill,
  FileEarmarkArrowUpFill,
  Check2Circle,
  ClipboardData,
  CurrencyDollar,
  Percent,
  Award,
  LightningCharge,
  HandThumbsUpFill,
  Infinity,
  CreditCard2BackFill
} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

import './GetStarted.css';

const studentSteps = [
  {
    icon: <PersonPlusFill />,
    title: 'Sign Up',
    desc: 'Create your free CampusTalent student account using the Mzuzu University student email address.'
  },
  { icon: <PencilFill />, title: 'Build Portfolio', desc: 'Showcase your projects, skills, and experience.' },
  { icon: <SearchHeartFill />, title: 'Browse Gigs', desc: 'Find, and apply, to opportunities that match your skills.' },
  { icon: <FileEarmarkArrowUpFill />, title: 'Submit Applications', desc: 'Make applications by filling an application form and meeting all the requirements.' },
  { icon: <ClipboardData />, title: 'Deliver Work', desc: 'Upload deliverables securely within the platform.' },
  { icon: <Check2Circle />, title: 'Get Paid', desc: 'Escrow/Payment released once work reviewed and gig marked complete.' },
];

const recruiterSteps = [
  { icon: <PersonCheckFill />, title: 'Verify Account', desc: 'Complete email and business verification.' },
  { icon: <CreditCard2BackFill />, title: 'Choose a Subscription Plan', desc: 'Pick a subscription that fits your hiring needs. Free tier includes 1 post/month. Pro users get more reach and flexibility.' },
  { icon: <ClipboardData />, title: 'Post Gig', desc: 'Subscribe to a plan, then describe scope, rate, deliverables, and deposit escrow.' },
  { icon: <SearchHeartFill />, title: 'Review Applications', desc: 'Evaluate student application submissions side-by-side.' },
  { icon: <Check2Circle />, title: 'Select Student', desc: 'Choose the best fit and accept application.' },
  { icon: <CurrencyDollar />, title: 'Release Payment', desc: 'Approve work and release funds.' },
  { icon: <HandThumbsUpFill />, title: 'Endorse Student', desc: 'Leave feedback and endorse the student for future gigs.' }
];

export default function GetStarted() {
  const navigate = useNavigate();

  return (
    <Container className="py-5">

      {/* Hero */}
      <Row className="mb-5 text-center text-success">
        <Col>
          <h1>Hire smarter. Grow student talent.</h1>
          <p className="lead text-muted">
            CampusTalent connects Mzuni students with real opportunities, such as freelance gigs. 
            Fair pay, verified profiles, and a platform built for emerging talent.
            <br />
          </p>
        </Col>
      </Row>

      {/* 1. Core Protections */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h3 className="mb-3">
            <ShieldLockFill className="me-2 text-success" />
            Our Core Protections
          </h3>
          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex align-items-start">
              <Wallet2 className="me-3 text-success" size={24} />
              <div>
                <strong>Escrow-Backed Payments</strong><br />
                Every gig requires an upfront escrow deposit. Funds only move when you sign off on deliverables—so students work in confidence and recruiters never overpay.
              </div>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex align-items-start">
              <StopwatchFill className="me-3 text-success" size={24} />
              <div>
                <strong>Minimum Wage Enforcement</strong><br />
                We enforce a Malawi-tailored floor of <strong>MK 1,500/hr</strong>. No student is ever undercut, drawing on local best-practices and global benchmarks.
              </div>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex align-items-start">
              <PersonCheckFill className="me-3 text-success" size={24} />
              <div>
                <strong>Recruiter Verification</strong><br />
                Two-step vetting: Email Verification → Business Registration Verification.
              </div>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex align-items-start">
              <ExclamationCircleFill className="me-3 text-success" size={24} />
              <div>
                <strong>Dispute Squad</strong><br />
                48-hour resolution guarantee for payment or scope conflicts.
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      {/* 1.5 Platform Fee Schedule */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="border-bottom">
          <Percent className="me-2 text-dark" />
          CampusTalent Platform Fee Schedule
        </Card.Header>
        <Card.Body>
          <p className="text-muted mb-3">
            <strong>Note:</strong> Recruiters must subscribe to a plan (Free, Basic, or Pro) before posting gigs. Subscription fees cover posting access. The platform fees below apply at the payment/release stage.
          </p>
          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex align-items-start">
              <CurrencyDollar className="me-3 text-success" size={20} />
              <div>
                <strong>Recruiter Fee (10%)</strong><br />
                In addition to your subscription, a 10% escrow handling fee applies per gig—covering payment protection and admin costs.
              </div>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex align-items-start">
              <PersonCheckFill className="me-3 text-success" size={20} />
              <div>
                <strong>Student Fee (5%)</strong><br />
                A 5% fee is applied to your payout upon completion of the gig. This ensures you're paid securely and fairly through CampusTalent.
              </div>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex align-items-start">
              <Award className="me-3 text-success" size={20} />
              <div>
                <strong>Power-User Rebate</strong><br />
                Complete 5 or more gigs to unlock loyalty rewards: recruiters pay 8%, students only 3%.
              </div>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex align-items-start">
              <LightningCharge className="me-3 text-success" size={20} />
              <div>
                <strong>First-Gig Waiver</strong><br />
                Recruiters posting for the first time enjoy 0% platform fees—ideal for testing the waters or building your team at no extra cost.
              </div>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex align-items-start">
              <Infinity className="me-3 text-success" size={20} />
              <div>
                <strong>Fee Cap (MK 50,000)</strong><br />
                No matter the gig value, total platform fees will never exceed MK 50,000—ensuring fairness for high‑value academic or business projects.
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      {/* 2. Student Journey */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h3 className="mb-3">
            <PeopleFill className="me-2 text-primary" />
            Student Journey
          </h3>
          <Row className="g-3">
            {studentSteps.map((step, idx) => (
              <Col key={idx} xs={12} sm={6} lg={4}>
                <Card className="h-100 border-0">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex">
                      <div className="me-3 fs-2 text-primary">{step.icon}</div>
                      <div>
                        <Card.Title className="h6">{step.title}</Card.Title>
                        <Card.Text className="text-muted small mb-3">
                          {step.desc}
                        </Card.Text>
                        {idx === 0 && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => navigate('/register')}
                          >
                            Sign Up
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* 3. Recruiter Journey */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h3 className="mb-3">
            <BriefcaseFill className="me-2 text-warning" />
            Recruiter Journey
          </h3>
          <Row className="g-3">
            {recruiterSteps.map((step, idx) => (
              <Col key={idx} xs={12} sm={6} lg={4}>
                <Card className="h-100 border-0">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex">
                      <div className="me-3 fs-2 text-warning">{step.icon}</div>
                      <div>
                        <Card.Title className="h6">{step.title}</Card.Title>
                        <Card.Text className="text-muted small mb-3">
                          {step.desc}
                        </Card.Text>
                        {idx === 0 && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => navigate('/register')}
                          >
                            Sign Up
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* 4. Fair Play Rules */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="border-bottom">
          <SignpostSplit className="me-2 text-info" />
          Fair Play Rules
        </Card.Header>
        <Card.Body className="p-0">
          <Table bordered hover responsive className="mb-0">
            <thead>
              <tr className="bg-light">
                <th>Student Rights</th>
                <th>Recruiter Responsibilities</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>📌 You set your own rates</td>
                <td>❌ Must offer at least MK 1,500/hour</td>
              </tr>
              <tr className="table-active">
                <td>📌 Escrow is funded before you begin</td>
                <td>❌ Cannot demand unpaid revisions or scope creep</td>
              </tr>
              <tr>
                <td>📌 You can review recruiters privately</td>
                <td>❌ May not access your personal contact details</td>
              </tr>
              <tr>
                <td>📌 You may decline gigs without penalty</td>
                <td>❌ Cannot coerce or pressure students into acceptance</td>
              </tr>
              <tr>
                <td>📌 Respect and dignity are expected</td>
                <td>❌ Abusive or unprofessional conduct results in suspension</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* 5. Need Help? */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="border-bottom bg-white">
          <ExclamationCircleFill className="me-2 text-danger" />
          Help & Support
        </Card.Header>
        <Card.Body>
          <p className="text-muted mb-4">
            Questions or issues? Here’s how you can get support, resolve disputes, and stay protected on CampusTalent.
          </p>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h6>🛡️ Who do I contact for protection or disputes?</h6>
              <p className="mb-0">
                Email our <strong>Student Protection Team</strong> at{' '}
                <a href="mailto:shield@campustalent.mw">shield@campustalent.mw</a> if you’re facing unfair treatment, harassment, or payment issues.
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h6>📞 Is there someone I can speak to directly?</h6>
              <p className="mb-0">
                Yes! Call our <strong>Campus Hotline</strong> on <strong>+265 1 234 567</strong> (Weekdays 8:00 AM – 5:00 PM).
              </p>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

    </Container>
  );
}
