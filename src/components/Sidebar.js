import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return ( 
    <Nav className="flex-column p-3">
      {[
        { to: '/admin/dashboard',     label: 'Dashboard' },
        { to: '/admin/users',         label: 'Users' },
        { to: '/admin/gigs',          label: 'Gigs' },
        { to: '/admin/skills',        label: 'Manage Skills' },     
        { to: '/admin/subscriptions',  label: 'Manage Subscriptions' },
        //{ to: '/admin/applications', label: 'Applications' },
        { to: '/admin/verifications', label: 'Verifications' }, 
        //{ to: '/admin/reports',      label: 'Reports' },
        //{ to: '/admin/settings',     label: 'Settings' },
      ].map(({ to, label }) => (
        <Nav.Link
          as={NavLink}
          to={to}
          key={to}
          className={({ isActive }) =>
            isActive ? 'text-white bg-success mb-1' : 'text-success mb-1'
          }
        >
          {label}
        </Nav.Link>
      ))}
    </Nav>
  );
}
