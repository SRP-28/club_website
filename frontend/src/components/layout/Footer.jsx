import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-column branding">
          <h4>TEAM VAJRA - RC Drone Club MMCOE</h4>
          <p>
            At Team Vajra, we aim to cater to industrial and social needs by developing skilled manpower in drone
            technology.
          </p>
        </div>

        <div className="footer-column contact">
          <h4>Contact Us</h4>
          <p><strong>Email:</strong> <a href="mailto:teamvajra_rc@mmcoe.edu.in">teamvajra_rc@mmcoe.edu.in</a></p>
          <p><strong>Phone:</strong> Tanisha K.: +91 9307832052</p>
          <p><strong>Phone:</strong> Omkar B.: +91 7058819104</p>
        </div>

        <div className="footer-column social">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="https://www.instagram.com/teamvajra_mmcoe/" target="_blank" rel="noopener noreferrer"><img src="/assets/insta-logo.png" alt="Instagram" /></a>
            <a href="https://www.linkedin.com/company/teamvajrammcoe/posts/?feedView=all" target="_blank" rel="noopener noreferrer"><img src="/assets/linkedin-logo.png" alt="LinkedIn" /></a>
            <a href="https://x.com/TeamVajra_MMCOE" target="_blank" rel="noopener noreferrer"><img src="/assets/twitter-logo.png" alt="Twitter" /></a>
          </div>
          <p>
            <strong>Location:</strong><br />Sr.No.18, Plot No.5/3, CTS No.205, Behind Vandevi Temple, Karve Nagar, Pune
            411052, Maharashtra, India.
          </p>
        </div>

        <div className="footer-column">
          <h4>Legal</h4>
          <ul className="footer-legal-list">
            <li>
              <Link to="/about" className="footer-legal-link">About Us</Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="footer-legal-link">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/disclaimer" className="footer-legal-link">Disclaimer</Link>
            </li>
            <li>
              <Link to="/terms-of-service" className="footer-legal-link">Terms of Service</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} TEAM VAJRA. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
