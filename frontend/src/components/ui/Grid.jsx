import React from 'react';
import './Grid.css';

const Grid = ({ children, variant = 'default', className = '' }) => {
  return (
    <div className={`ui-grid ${variant !== 'default' ? `grid-${variant}` : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Grid;
