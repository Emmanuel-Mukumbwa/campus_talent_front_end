// File: src/components/Recommendations.jsx
import React from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';

export default function Recommendations({ recs = [] }) {
  return (
    <>
      <h5 className="mb-3">Recommendations</h5>
      <Row xs={1} className="g-3 mb-4">
        {recs.map((r, i) => (
          <Col key={i}>
            <Card className="shadow-sm d-flex flex-row align-items-center p-3">
              <div className="me-auto">{r.title}</div>
              <Badge bg="success">{r.count}</Badge>
            </Card>
          </Col>
        ))}
      </Row> 
    </>
  );
}
