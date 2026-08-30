// ZeptoStickyButton.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

export default function ZeptoStickyButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 100 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef(null);
  const containerRef = useRef(null);

  // Only show on home page
  useEffect(() => {
    setIsVisible(location.pathname === '/');
  }, [location]);

  // Load saved position from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('zeptoButtonPosition');
    if (savedPosition) {
      try {
        const pos = JSON.parse(savedPosition);
        setPosition(pos);
      } catch (e) {
        console.error('Failed to load position:', e);
      }
    }
  }, []);

  // Handle drag start
  const handleDragStart = (e) => {
    e.preventDefault();
    const touch = e.touches ? e.touches[0] : e;
    const rect = buttonRef.current?.getBoundingClientRect();
    
    if (rect) {
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      });
    }
    setIsDragging(true);
  };

  // Handle drag move
  const handleDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const touch = e.touches ? e.touches[0] : e;
    const maxX = window.innerWidth - (buttonRef.current?.offsetWidth || 60);
    const maxY = window.innerHeight - (buttonRef.current?.offsetHeight || 60);
    
    let newX = touch.clientX - dragOffset.x;
    let newY = touch.clientY - dragOffset.y;
    
    // Constrain to viewport
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    
    setPosition({ x: newX, y: newY });
  };

  // Handle drag end
  const handleDragEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      // Save position
      localStorage.setItem('zeptoButtonPosition', JSON.stringify(position));
    }
  };

  // Handle click (only if not dragging)
  const handleClick = (e) => {
    if (!isDragging) {
      navigate('/zep-barcode');
    }
    setIsExpanded(false);
  };

  // Toggle expanded state
  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // Close expanded on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isExpanded && buttonRef.current && !buttonRef.current.contains(e.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isExpanded]);

  // Add drag event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
    } else {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, dragOffset]);

  // If not on home page, don't render
  if (!isVisible) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={`zepto-sticky-container ${isDragging ? 'dragging' : ''}`}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <div 
        ref={buttonRef}
        className={`zepto-sticky-button ${isHovered ? 'hovered' : ''} ${isDragging ? 'dragging' : ''} ${isExpanded ? 'expanded' : ''}`}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        title="Zepto Store Bins"
      >
        {/* Main Button */}
        <div className="zepto-button-main">
          <div className="zepto-logo">
            <span className="logo-icon">🏪</span>
            <span className="logo-text">Zepto</span>
          </div>
          <div className="zepto-badge">
            <span className="badge-dot"></span>
            <span className="badge-text">Bins</span>
          </div>
          <div className="drag-handle">
            <span className="drag-dots">⠿</span>
          </div>
        </div>

        {/* Expanded Tooltip */}
        {isExpanded && (
          <div className="zepto-expanded-tooltip">
            <div className="tooltip-header">
              <span className="tooltip-icon">🏪</span>
              <span className="tooltip-title">Zepto Store Bins</span>
            </div>
            <div className="tooltip-body">
              <p>Generate barcodes for store bin locations</p>
              <div className="tooltip-features">
                <span>📍 MYN-A-1-A-1</span>
                <span>🔢 1-30</span>
                <span>🔙 BACK/FRONT</span>
              </div>
            </div>
            <div className="tooltip-footer">
              <span className="click-hint">👆 Click to open</span>
              <span className="drag-hint">↕ Drag to move</span>
            </div>
          </div>
        )}

        {/* Expand Toggle */}
        <button 
          className="expand-toggle"
          onClick={toggleExpand}
          title="Toggle info"
        >
          {isExpanded ? '✕' : 'ℹ️'}
        </button>
      </div>

      {/* Quick Access Menu */}
      {isExpanded && (
        <div className="zepto-quick-menu">
          <button 
            className="quick-menu-item"
            onClick={() => {
              navigate('/zep-barcode');
              setIsExpanded(false);
            }}
          >
            <span>🏪</span>
            <span>Open Barcode Generator</span>
          </button>
          <button 
            className="quick-menu-item"
            onClick={() => {
              navigate('/');
              setIsExpanded(false);
            }}
          >
            <span>🏠</span>
            <span>Go to Home</span>
          </button>
        </div>
      )}
    </div>
  );
}