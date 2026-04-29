import React from 'react';
import './SectionTitle.css';

const SectionTitle = ({ children, className = '', style }) => {
  return (
    <h2 className={`section-title ${className}`} style={style}>
      {children}
    </h2>
  );
};

export default SectionTitle;
