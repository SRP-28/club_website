import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

const Button = ({ children, to, onClick, className = '', type = 'button', ...props }) => {
  if (to) {
    return (
      <Link to={to} className={`btn ${className}`} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={`btn ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;
