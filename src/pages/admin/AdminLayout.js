// File: src/pages/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Button, Offcanvas } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

export default function AdminLayout() {
  const [show, setShow] = useState(false);
  const toggle = () => setShow(s => !s);

  return (
    <>
      {/* Mobile hamburger (always visible on small screens) */}
      <Button
        variant="success"
        className="d-md-none m-2"
        onClick={toggle}
      >
        ☰ Admin Menu
      </Button>

      {/* Offcanvas ONLY on small screens */}
      <Offcanvas
        show={show}
        onHide={toggle}
        className="d-md-none"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Admin</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Sidebar />
        </Offcanvas.Body>
      </Offcanvas>

      <Container fluid>
        <Row>
          {/* Desktop sidebar: hidden on small */}
          <Col md={2} className="d-none d-md-block vh-100 bg-light p-0 border-end">
            <Sidebar />
          </Col>

          {/* Main content */}
          <Col md={10} className="p-4">
            <Outlet />
          </Col>
        </Row>
      </Container>
    </>
  );
}
