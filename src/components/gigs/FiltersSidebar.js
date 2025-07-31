// File: src/components/gigs/FiltersSidebar.jsx

import React from 'react';
import {
  Card,
  Button,
  Accordion,
  Form,
  InputGroup,
} from 'react-bootstrap';
import {
  BiSearch,
  BiMap,
  BiCalendar,
} from 'react-icons/bi';

export default function FiltersSidebar({
  filters,
  onFilterChange,
  clearFilters,
  show,
  onToggle,
}) {
  const filterDefs = [
    {
      title: 'Location',
      icon: <BiMap />,
      field: 'location',
      type: 'text',
      placeholder: 'e.g. Mzuzu City',
    },
    {
      title: 'Apply Before',
      icon: <BiCalendar />,
      field: 'deadline',
      type: 'date',
    },
  ];

  return (
    <Card className="shadow-sm mb-4 sticky-top" style={{ top: '1rem' }}>
      <Card.Body>
        {/* Search Bar */}
        <InputGroup className="mb-3">
          <InputGroup.Text><BiSearch /></InputGroup.Text>
          <Form.Control
            placeholder="Search gigs by title..."
            value={filters.search}
            onChange={e => onFilterChange('search', e.target.value)}
          />
        </InputGroup>

        {/* Accordion Filters */}
        <Accordion flush activeKey={show ? filterDefs.map((_, i) => `${i}`) : []}>
          {filterDefs.map((def, idx) => (
            <Accordion.Item eventKey={`${idx}`} key={def.field}>
              <Accordion.Header>
                {def.icon}
                <span className="ms-2">{def.title}</span>
              </Accordion.Header>
              <Accordion.Body>
                {def.type === 'text' && (
                  <Form.Control
                    type="text"
                    placeholder={def.placeholder}
                    value={filters[def.field]}
                    onChange={e => onFilterChange(def.field, e.target.value)}
                  />
                )}
                {def.type === 'date' && (
                  <Form.Control
                    type="date"
                    value={filters[def.field]}
                    onChange={e => onFilterChange(def.field, e.target.value)}
                  />
                )}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>

        {/* Clear / Toggle */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Button variant="outline-success" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
          <Button variant="outline-success" size="sm" onClick={onToggle}>
            {show ? 'Hide' : 'Show'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
