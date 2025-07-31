// src/components/discover/SearchFilters.jsx
import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const SKILL_MAP = {
  Coding:            'Coding',
  'Video Production':'Video',
  'Graphics Design': 'Design',
  'Research Writing':'Research',
  Tutoring:          'Tutoring',
};

const BADGES = ['bronze', 'silver', 'gold'];

export default function SearchFilters({ onChange }) {
  const [values, setValues] = useState({
    q: '',
    skill: '',
    badge: '',
    program: '',
  });

  // fire parent callback any time a field changes
  useEffect(() => {
    onChange(values);
  }, [values, onChange]);

  const handleChange = (field, v) => {
    setValues(vals => ({ ...vals, [field]: v }));
  };

  return (
    <div className="mb-4">
      <Row className="g-2">
        <Col>
          <Form.Control
            placeholder="Search by name or keyword"
            value={values.q}
            onChange={e => handleChange('q', e.target.value)}
          />
        </Col>
        {/*<Col>
          <Form.Select
            value={values.skill}
            onChange={e => handleChange('skill', e.target.value)}
          >
            <option value="">All Skills</option>
            {Object.entries(SKILL_MAP).map(([label, value]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Form.Select>
        </Col>*/}
        <Col>
          <Form.Select
            value={values.badge}
            onChange={e => handleChange('badge', e.target.value)}
          >
            <option value="">All Badges</option>
            {BADGES.map(b => (
              <option key={b} value={b}>
                {b.charAt(0).toUpperCase() + b.slice(1)}
              </option>
            ))}
          </Form.Select>
        </Col>
        
      </Row>
    </div>
  );
}
