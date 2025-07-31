// File: src/pages/admin/GigManagement.js

import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Pagination } from 'react-bootstrap';
import api from '../../utils/api';

export default function GigManagement() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Load all gigs once
  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/api/admin/gigs');
        setGigs(res.data);
      } catch (err) {
        console.error('Error loading gigs', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleStatus = async gig => {
    const isOpen = gig.status === 'Open';
    const action = isOpen ? 'deactivate' : 'activate';
    try {
      await api.post(`/api/admin/gigs/${gig.id}/${action}`);
      setGigs(prev =>
        prev.map(g =>
          g.id === gig.id
            ? { ...g, status: isOpen ? 'Closed' : 'Open' }
            : g
        )
      );
    } catch (err) {
      console.error(`Failed to ${action} gig`, err);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(gigs.length / perPage);
  const paginatedGigs = gigs.slice((page - 1) * perPage, page * perPage);

  const pager = (
    <Pagination className="justify-content-center my-3">
      <Pagination.First onClick={() => setPage(1)} disabled={page === 1} />
      <Pagination.Prev onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} />
      {[...Array(totalPages)].map((_, i) => (
        <Pagination.Item
          key={i + 1}
          active={page === i + 1}
          onClick={() => setPage(i + 1)}
        >
          {i + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} />
      <Pagination.Last onClick={() => setPage(totalPages)} disabled={page === totalPages} />
    </Pagination>
  );

  if (loading) {
    return <Container className="py-5 text-center">Loading…</Container>;
  }

  return (
    <Container className="py-4">
      <h3 className="text-success mb-3">Gig Management</h3>

      {pager}

      <Table bordered hover responsive>
        <thead className="table-success">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Recruiter</th>
            <th>Status</th>
            <th>Escrow</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedGigs.map(g => (
            <tr key={g.id}>
              <td>{g.id}</td>
              <td>{g.title}</td>
              <td>{g.recruiterName}</td>
              <td>{g.status}</td>
              <td>
                {g.tx_ref
                  ? <a href={`/escrow/${g.tx_ref}`}>{g.tx_ref}</a>
                  : '—'}
              </td>
              <td>
                <Button
                  size="sm"
                  variant={g.status === 'Open' ? 'warning' : 'success'}
                  onClick={() => toggleStatus(g)}
                >
                  {g.status === 'Open' ? 'Deactivate' : 'Activate'}
                </Button>
              </td>
            </tr>
          ))}
          {paginatedGigs.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No gigs found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {pager}
    </Container>
  );
}
