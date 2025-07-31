// src/components/myprofile/ProfileForm.jsx
import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { programs } from '../../constants/programs';

export default function ProfileForm({
  user,
  form,
  editing,
  onChange,
  onSave
}) {
  const isStudent = user.role === 'student';

  return (
    <Form>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              value={form.name}
              onChange={onChange}
              disabled={!editing}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control readOnly value={form.email} />
          </Form.Group>
        </Col>
      </Row>

      {isStudent ? (
        <>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Program</Form.Label>
                <Form.Select
                  name="program"
                  value={form.program || ''}
                  onChange={onChange}
                  disabled={!editing}
                >
                  <option value="" disabled>
                    Select program…
                  </option>
                  {programs.map(({ category, programs }) => (
                    <optgroup label={category} key={category}>
                      {programs.map(p => (
                        <option value={p} key={p}>
                          {p}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>University</Form.Label>
                <Form.Control
                  readOnly
                  name="university"
                  value={form.university || 'Mzuzu University'}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Year</Form.Label>
                <Form.Select
                  name="year"
                  value={form.year || ''}
                  onChange={onChange}
                  disabled={!editing}
                >
                  <option value="" disabled>
                    Select year…
                  </option>
                  {[1, 2, 3, 4, 5].map(n => (
                    <option value={n} key={n}>
                      Year {n}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Company</Form.Label>
                <Form.Control
                  name="company_name"
                  value={form.company_name || ''}
                  onChange={onChange}
                  disabled={!editing}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Department</Form.Label>
                <Form.Control
                  name="department"
                  value={form.department || ''}
                  onChange={onChange}
                  disabled={!editing}
                />
              </Form.Group>
            </Col>
          </Row>
        </>
      )}

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Availability</Form.Label>
            <Form.Control
              name="availability"
              value={form.availability || ''}
              onChange={onChange}
              disabled={!editing}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Phone</Form.Label>
            <Form.Control
              name="phone"
              value={form.phone || ''}
              onChange={onChange}
              disabled={!editing}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-4">
        <Form.Label>Bio</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="bio"
          value={form.bio || ''}
          onChange={onChange}
          disabled={!editing}
        />
      </Form.Group>

      {editing && (
        <Button variant="success" onClick={onSave}>
          Save Profile
        </Button>
      )}
    </Form>
  );
}
