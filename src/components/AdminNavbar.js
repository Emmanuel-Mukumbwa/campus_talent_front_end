import React from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import './AdminNavbar.css'; // ✅ We'll define some custom styles

export default function AdminNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="admin-navbar shadow-sm">
      <Container>
        <Navbar.Brand as={NavLink} to="/admin/dashboard" className="fw-bold">
          AdminPanel
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="admin-navbar-nav" />
        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/admin/dashboard" className="admin-nav-link">
              Dashboard
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin/users" className="admin-nav-link">
              Users
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin/gigs" className="admin-nav-link">
              Gigs
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin/applications" className="admin-nav-link">
              Applications
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin/verifications" className="admin-nav-link">
              Verifications
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
