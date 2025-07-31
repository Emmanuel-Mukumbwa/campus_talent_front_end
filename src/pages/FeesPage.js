// src/pages/FeesPage.jsx

import React from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  ListGroup
} from 'react-bootstrap';
import {
  CurrencyDollar,
  PersonCheckFill,
  Award,
  LightningCharge,
  Infinity
} from 'react-bootstrap-icons';

export default function FeesPage() {
  return (
    <Container className="py-5">
      <h1 className="mb-4">📑 CampusTalent Fee & Subscription Guide</h1>

      {/* 1. Subscription Plans */}
      <Card className="mb-5 shadow-sm">
        <Card.Header className="bg-light">
          <CurrencyDollar className="me-2" />
          Subscription Plans
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Plan Name</th>
                <th className="text-center">Monthly Fee</th>
                <th className="text-center">Posts / Month</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Free</td>
                <td className="text-center">MK 0</td>
                <td className="text-center">1</td>
              </tr>
              <tr>
                <td>Basic</td>
                <td className="text-center">MK 5,000</td>
                <td className="text-center">5</td>
              </tr>
              <tr>
                <td>Pro</td>
                <td className="text-center">MK 15,000</td>
                <td className="text-center">20</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* 2. Platform Fees */}
      <Card className="mb-5 shadow-sm">
        <Card.Header className="bg-light">
          <CurrencyDollar className="me-2" />
          Platform Fee Breakdown
        </Card.Header>
        <Card.Body>
          <Row className="g-4">
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex align-items-start">
                  <CurrencyDollar className="me-3 text-success" size={24} />
                  <div>
                    <strong>Recruiter Fee</strong> (10%)<br/>
                    Charged at gig creation—covers escrow, dispute protection & platform upkeep.
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex align-items-start">
                  <PersonCheckFill className="me-3 text-success" size={24} />
                  <div>
                    <strong>Student Fee</strong> (5%)<br/>
                    Deducted from final payout when work completes—ensures net payment.
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex align-items-start">
                  <Award className="me-3 text-success" size={24} />
                  <div>
                    <strong>Power‑User Rebate</strong><br/>
                    After 5+ completed gigs—you pay just 8% (recruiter) / 3% (student).
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex align-items-start">
                  <LightningCharge className="me-3 text-success" size={24} />
                  <div>
                    <strong>First‑Gig Waiver</strong><br/>
                    Your very first gig is 0% recruiter‑fee—no barrier to get started.
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex align-items-start">
                  <Infinity className="me-3 text-success" size={24} />
                  <div>
                    <strong>Fee Cap</strong><br/>
                    Combined platform fees never exceed MK 50,000—keeps large projects fair.
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* 3. Scenario Comparison */}
      <Card className="mb-5 shadow-sm">
        <Card.Header className="bg-light">
          <CurrencyDollar className="me-2" />
          Fee Scenarios at a Glance
        </Card.Header>
        <Card.Body className="p-0">
          <Table striped hover responsive className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Scenario</th>
                <th>Recruiter Pays</th>
                <th>Student Pays</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Standard Gig</td>
                <td>10%</td>
                <td>5%</td>
              </tr>
              <tr>
                <td>Power‑User (≥ 5 gigs)</td>
                <td>8%</td>
                <td>3%</td>
              </tr>
              <tr>
                <td>First Gig</td>
                <td>0%</td>
                <td>5%</td>
              </tr>
              <tr className="table-active">
                <td>Fee Cap</td>
                <td colSpan="2">Combined ≤ MK 50 000</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* 4. Example Payout */}
      <Card className="mb-5 shadow-sm">
        <Card.Header className="bg-light">
          <CurrencyDollar className="me-2" />
          Example Payout Breakdown
        </Card.Header>
        <Card.Body className="p-0">
          <Table striped bordered responsive className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Escrow Amount</th>
                <th>Platform Fee</th>
                <th>You Receive</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>MK 100 000</td>
                <td>
                  Recruiter: MK 10 000 (10%)<br/>
                  Student: MK 5 000 (5%)
                </td>
                <td>Student Net: MK 85 000</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Back */}
      <div className="text-center">
        <Button href="/" variant="success">
          ← Back to Home
        </Button>
      </div>
    </Container>
  );
}
