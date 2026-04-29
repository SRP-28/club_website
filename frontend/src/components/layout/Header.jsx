import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import './Header.css';

const Header = () => {
  const isAdmin = useAuthStore((state) => state.isAdmin);

  return (
    <header className="header">
      <div className="container nav">
        <Link to="/" className="brand" aria-label="Team Vajra Home">
          <img src="/assets/club-logo.jpg" alt="Team Vajra logo" />
          <div>
            <div className="title">TEAM VAJRA</div>
            <div style={{ fontSize: '12px', color: '#fff' }}>Drone Club · MMCOE</div>
          </div>
        </Link>
        <nav>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
          <NavLink to="/achievements" className={({ isActive }) => (isActive ? 'active' : '')}>Achievements</NavLink>
          <NavLink to="/drones" className={({ isActive }) => (isActive ? 'active' : '')}>Drones</NavLink>
          <NavLink to="/gallery" className={({ isActive }) => (isActive ? 'active' : '')}>Gallery</NavLink>
          <NavLink to="/team" className={({ isActive }) => (isActive ? 'active' : '')}>Team</NavLink>
          <NavLink to="/blog" className={({ isActive }) => (isActive ? 'active' : '')}>Blogs</NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>Contact</NavLink>
          {isAdmin && (
            <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? 'active' : '')} style={{ color: 'var(--brand-maroon)' }}>Admin</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
