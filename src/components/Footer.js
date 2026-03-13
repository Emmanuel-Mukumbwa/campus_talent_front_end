// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        {/* Optional rich footer sections removed for now to avoid unused imports */}
        <div className="border-top pt-3 mt-3 text-center small">
          <p className="mb-1">
            &copy; {new Date().getFullYear()} CampusTalent. Partnered with Mzuzu University ICT Department.
          </p>
          <Link to="/terms" className="text-light me-3">
            Terms
          </Link>
          <Link to="/disclaimer" className="text-light">
            Disclaimer
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;