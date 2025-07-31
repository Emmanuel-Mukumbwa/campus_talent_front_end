// File: src/components/connections/ConnectionsGrid.jsx
import React from 'react';
import { Row, Spinner, Col } from 'react-bootstrap';
import ConnectionCard from './ConnectionCard';

export default function ConnectionsGrid({
  connections,
  avatars = {},      
  viewerRole,
  onAction,
  loading
}) {
  return (
    <Row xs={1} md={2} className="g-4">
      {connections.map(conn => (
        <ConnectionCard
          key={conn.id}
          conn={conn}
          avatar={avatars[conn.id]}   
          viewerRole={viewerRole}
          onAction={onAction}
        />
      ))}
      {loading && (
        <Col xs={12} className="text-center">
          <Spinner animation="border" variant="success" />
        </Col>
      )}
    </Row>
  );
}
