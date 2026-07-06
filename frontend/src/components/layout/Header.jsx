import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import './Header.css';

const Header = () => {
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container nav">
        <Link to="/" className="brand" aria-label="Team Vajra Home" onClick={closeMenu}>
          <img src="/assets/club-logo.jpg" alt="Team Vajra logo" />
          <div>
            <div className="title">TEAM VAJRA</div>
            <div style={{ fontSize: '12px', color: '#fff' }}>Drone Club · MMCOE</div>
          </div>
        </Link>
        
        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X size={28} color="var(--brand-yellow)" /> : <Menu size={28} color="var(--brand-yellow)" />}
        </button>

        <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <NavLink to="/" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
          <NavLink to="/achievements" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>Achievements</NavLink>
          <NavLink to="/drones" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>Drones</NavLink>
          <NavLink to="/gallery" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>Gallery</NavLink>
          <NavLink to="/team" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>Team</NavLink>
          <NavLink to="/blog" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>Blogs</NavLink>
          <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>Contact</NavLink>
          {isAdmin && (
            <NavLink to="/admin/dashboard" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')} style={{ color: 'var(--brand-maroon)' }}>Admin</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
