import React from 'react';
import './Card.css';

const Card = ({ imageSrc, imageAlt, children, className = '', onClick }) => {
  return (
    <div className={`ui-card ${className}`} onClick={onClick}>
      <img src={imageSrc} alt={imageAlt || 'Card image'} />
      {children}
    </div>
  );
};

export default Card;
