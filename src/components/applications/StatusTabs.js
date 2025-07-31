// File: src/components/applications/StatusTabs.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';

/**
 * @param {{statuses: string[], active: string, onSelect: (key: string) => void}} props
 */
export default function StatusTabs({ statuses, active, onSelect }) {
  return (
    <Nav variant="tabs" activeKey={active} onSelect={onSelect} className="mt-3">
      {statuses.map(s => (
        <Nav.Item key={s}>
          <Nav.Link eventKey={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
}
