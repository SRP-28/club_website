import React, { useEffect } from 'react';
import '@google/model-viewer';
import './ModelViewerModal.css';

const ModelViewerModal = ({ isOpen, onClose, droneName, modelSrc }) => {
  useEffect(() => {
    // Prevent scrolling on the body when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Clicking outside the container closes the modal
  const handleOverlayClick = (e) => {
    if (e.target.className === 'model-viewer-overlay') {
      onClose();
    }
  };

  return (
    <div className="model-viewer-overlay" onClick={handleOverlayClick}>
      <div className="model-viewer-container">
        <div className="model-viewer-header">
          <h2>{droneName} - 3D View</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close Viewer">
            &times;
          </button>
        </div>
        
        <model-viewer
          src={modelSrc}
          alt={`A 3D model of ${droneName}`}
          auto-rotate
          camera-controls
          shadow-intensity="1"
          exposure="1"
          environment-image="neutral"
          interaction-prompt="auto"
          ar
          ar-modes="webxr scene-viewer quick-look"
        >
        </model-viewer>
        
        <div className="model-instructions">
          Drag to rotate &middot; Scroll to zoom
        </div>
      </div>
    </div>
  );
};

export default ModelViewerModal;
