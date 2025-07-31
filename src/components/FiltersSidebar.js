// File: src/components/FiltersSidebar.jsx

import React from 'react';
import { Card, Button, Accordion, Form, InputGroup } from 'react-bootstrap';
import { BiSearch, BiBookOpen, BiCalendar } from 'react-icons/bi';
import { programs } from '../constants/programs';

export default function FiltersSidebar({
  viewerRole = 'student',
  filters,
  onFilterChange,
  clearFilters,
}) {
  // only students viewing recruiters get the simple search
  const isSimple = viewerRole === 'student';

  return (
    <Card className="shadow-sm mb-4 sticky-top" style={{ top: '1rem' }}>
      <Card.Body>
        {/* Search by name */}
        <InputGroup className="mb-3">
          <InputGroup.Text><BiSearch /></InputGroup.Text>
          <Form.Control
            placeholder="Search by name..."
            value={filters.search || ''}
            onChange={e => onFilterChange('search', e.target.value)}
          />
        </InputGroup>

        {/* Only if not simple mode, show the other filters */}
        {!isSimple && (
          <>
            <Accordion flush>
              {/* Program / Faculty */}
              <Accordion.Item eventKey="program">
                <Accordion.Header>
                  <BiBookOpen />
                  <span className="ms-2">Program / Faculty</span>
                </Accordion.Header>
                <Accordion.Body>
                  <Form.Select
                    value={filters.program || ''}
                    onChange={e => onFilterChange('program', e.target.value)}
                  >
                    <option value="">All Programs</option>
                    {programs.map(group => (
                      <optgroup label={group.category} key={group.category}>
                        {group.programs.map(prog => (
                          <option key={prog} value={prog}>
                            {prog}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </Form.Select>
                </Accordion.Body>
              </Accordion.Item>

              {/* Joined After */}
              <Accordion.Item eventKey="dateJoined">
                <Accordion.Header>
                  <BiCalendar />
                  <span className="ms-2">Joined After</span>
                </Accordion.Header>
                <Accordion.Body>
                  <Form.Control
                    type="date"
                    value={filters.dateJoined || ''}
                    onChange={e => onFilterChange('dateJoined', e.target.value)}
                  />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </>
        )}

        {/* Clear All */}
        <div className="text-end mt-3">
          <Button variant="outline-success" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
