import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaEnvelope, FaShieldAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        {/*<div className="row">
           Contact & About 
          <div className="col-md-4 mb-3">
            <h5 className="mb-3 text-success">CampusTalent</h5>
            <p className="text-muted small">
              Bridging academic skills with professional opportunities at Mzuzu University.
            </p>
            <div className="d-flex gap-2">
              <a
                href="https://linkedin.com/company/campustalent"
                target="_blank"
                rel="noopener noreferrer"
                className="text-success"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="https://twitter.com/campustalent"
                target="_blank"
                rel="noopener noreferrer"
                className="text-success"
              >
                <FaTwitter size={20} />
              </a>
              <a href="mailto:support@campustalent.mw" className="text-success">
                <FaEnvelope size={20} />
              </a>
            </div>
          </div>*/}

          {/* Key Links 
          <div className="col-md-4 mb-3">
            <h5 className="mb-3 text-success">Resources</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/how-it-works" className="text-light">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/payment-security" className="text-light">
                  <FaShieldAlt className="me-1 text-success" />
                  Payment Security
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-light">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-light">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>*/}

          {/* Recruiter Links 
          <div className="col-md-4 mb-3">
            <h5 className="mb-3 text-success">For Recruiters</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/post-job" className="text-success fw-semibold">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-light">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/verification-process" className="text-light">
                  Skill Verification
                </Link>
              </li>
            </ul>
          </div>
        </div>*/}

        {/* Copyright + Legal */}
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
