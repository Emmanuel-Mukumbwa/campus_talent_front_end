// File: src/pages/admin/UserManagement.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  Button,
  Container,
  Form,
  Row,
  Col,
  Badge,
  Pagination,
  InputGroup,
} from 'react-bootstrap';
import api from '../../utils/api';

export default function UserManagement() {
  const [users, setUsers]               = useState([]);
  const [selected, setSelected]         = useState(new Set());
  const [filters, setFilters]           = useState({ role: '', status: '', search: '' });
  const [meta, setMeta]                 = useState({ page: 1, lastPage: 1, total: 0 });
  const [loading, setLoading]           = useState(false);
  const headerRef                       = useRef();

  // Fetch users with filters & pagination
  const loadUsers = async (page = 1) => {
    setLoading(true);
    const params = {
      page,
      limit: 10,
      role: filters.role || undefined,
      status: filters.status || undefined,
      search: filters.search || undefined,
    };
    const res = await api.get('/api/admin/users', { params });
    setUsers(res.data.data);
    setMeta(res.data.meta);
    setSelected(new Set());
    setLoading(false);
  };

  useEffect(() => {
    loadUsers(1);
  }, [filters]);

  // Bulk action helper
  const bulkAction = async action => {
    if (!selected.size) return;
    await api.post(`/api/admin/users/bulk/${action}`, {
      userIds: Array.from(selected),
    });
    loadUsers(meta.page);
  };

  // Individual role change
  const changeRole = async (id, newRole) => {
    await api.post(`/api/admin/users/${id}/set-role`, { role: newRole });
    loadUsers(meta.page);
  };

  // Individual status toggle
  const toggleStatus = async (id, current) => {
    const action = current === 'active' ? 'suspend' : 'activate';
    await api.post(`/api/admin/users/${id}/${action}`);
    loadUsers(meta.page);
  };

  // Selection toggle
  const toggleSelect = id => {
    setSelected(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= meta.lastPage) {
      loadUsers(newPage);
    }
  };

  // Pagination UI
  const pager = (
    <Pagination className="justify-content-center my-2">
      <Pagination.First onClick={() => handlePageChange(1)} disabled={meta.page === 1} />
      <Pagination.Prev onClick={() => handlePageChange(meta.page - 1)} disabled={meta.page === 1} />
      {[...Array(meta.lastPage)].map((_, i) => (
        <Pagination.Item
          key={i + 1}
          active={meta.page === i + 1}
          onClick={() => handlePageChange(i + 1)}
        >
          {i + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next onClick={() => handlePageChange(meta.page + 1)} disabled={meta.page === meta.lastPage} />
      <Pagination.Last onClick={() => handlePageChange(meta.lastPage)} disabled={meta.page === meta.lastPage} />
    </Pagination>
  );

  return (
    <Container fluid className="py-4">
      {/* Filter/Search Bar */}
      <div ref={headerRef} className="bg-white py-2">
        <Row className="align-items-center">
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text>🔍</InputGroup.Text>
              <Form.Control
                placeholder="Search name or email"
                value={filters.search}
                onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              />
              <Button variant="outline-secondary" onClick={() => loadUsers(1)}>
                Go
              </Button>
            </InputGroup>
          </Col>

          <Col md="auto">
            <Badge
              pill
              bg={filters.role === 'student' ? 'success' : 'light'}
              text={filters.role === 'student' ? 'light' : 'dark'}
              style={{ cursor: 'pointer', marginRight: 8 }}
              onClick={() =>
                setFilters(f => ({ ...f, role: f.role === 'student' ? '' : 'student' }))
              }
            >
              Student
            </Badge>
            <Badge
              pill
              bg={filters.role === 'recruiter' ? 'success' : 'light'}
              text={filters.role === 'recruiter' ? 'light' : 'dark'}
              style={{ cursor: 'pointer' }}
              onClick={() =>
                setFilters(f => ({ ...f, role: f.role === 'recruiter' ? '' : 'recruiter' }))
              }
            >
              Recruiter
            </Badge>
          </Col>

          <Col md="auto">
            <Badge
              pill
              bg={filters.status === 'active' ? 'success' : 'light'}
              text={filters.status === 'active' ? 'light' : 'dark'}
              style={{ cursor: 'pointer', marginRight: 8 }}
              onClick={() =>
                setFilters(f => ({ ...f, status: f.status === 'active' ? '' : 'active' }))
              }
            >
              Active
            </Badge>
            <Badge
              pill
              bg={filters.status === 'suspended' ? 'warning' : 'light'}
              text={filters.status === 'suspended' ? 'dark' : 'dark'}
              style={{ cursor: 'pointer' }}
              onClick={() =>
                setFilters(f => ({ ...f, status: f.status === 'suspended' ? '' : 'suspended' }))
              }
            >
              Suspended
            </Badge>
          </Col>

          <Col className="text-end">
            {selected.size > 0 && (
              <>
                <Button
                  size="sm"
                  variant="outline-primary"
                  className="me-2"
                  onClick={() => bulkAction('activate')}
                >
                  Activate {selected.size}
                </Button>
                <Button
                  size="sm"
                  variant="outline-warning"
                  className="me-2"
                  onClick={() => bulkAction('suspend')}
                >
                  Suspend {selected.size}
                </Button>
                <Form.Select
                  size="sm"
                  style={{ display: 'inline-block', width: 'auto' }}
                  onChange={e => bulkAction(`set-role?role=${e.target.value}`)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Change role…
                  </option>
                  <option value="student">To Student</option>
                  <option value="recruiter">To Recruiter</option>
                </Form.Select>
              </>
            )}
          </Col>
        </Row>
      </div>

      {/* Top pagination */}
      {pager}

      {/* User Table */}
      <Table bordered hover responsive>
        <thead className="table-success">
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                checked={selected.size === users.length && users.length > 0}
                onChange={() =>
                  setSelected(prev =>
                    prev.size === users.length ? new Set() : new Set(users.map(u => u.id))
                  )
                }
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Last Active</th>
            <th>Verified</th>
          </tr>
        </thead>
        <tbody>
          {!loading && users.map(u => (
            <tr key={u.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selected.has(u.id)}
                  onChange={() => toggleSelect(u.id)}
                />
              </td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <Form.Select
                  size="sm"
                  value={u.role}
                  onChange={e => changeRole(u.id, e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="recruiter">Recruiter</option>
                </Form.Select>
              </td>
              <td>
                <Badge
                  bg={u.status === 'active' ? 'success' : 'warning'}
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleStatus(u.id, u.status)}
                >
                  {u.status}
                </Badge>
              </td>
              <td>{new Date(u.last_active).toLocaleDateString()}</td>
              <td>
                {u.is_verified
                  ? <Badge bg="info">Verified</Badge>
                  : <Badge bg="secondary">Unverified</Badge>}
              </td>
            </tr>
          ))}
          {loading && (
            <tr>
              <td colSpan="7" className="text-center py-4">Loading…</td>
            </tr>
          )}
          {!loading && users.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-4">No users found.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Bottom pagination */}
      {pager}
    </Container>
  );
}
