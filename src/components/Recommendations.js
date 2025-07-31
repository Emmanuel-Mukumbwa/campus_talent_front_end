// File: src/components/Recommendations.jsx
import React from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
//import './Recommendations.css';

export default function Recommendations({ recs, columns = 1 }) {
  return (
    <Row xs={1} md={columns} className="g-3">
      {recs.map((r, i) => (
        <Col key={i}>
          <Card className="shadow-sm recommendation-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>{r.title}</div>
              <Badge bg="success">{r.count}</Badge>
            </div>
          </Card>
        </Col> 
      ))}
    </Row>
  );
}
