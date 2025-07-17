import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoadingOverlayProps {
  show: boolean;
  message?: string;
  transparent?: boolean;
  fullscreen?: boolean;
}

/**
 * LoadingOverlay component displays a loading spinner with an optional message
 * It can be used to indicate loading states over other components
 * 
 * @param show - Whether to show the overlay
 * @param message - Optional message to display
 * @param transparent - Whether the background should be transparent
 * @param fullscreen - Whether the overlay should cover the entire screen
 */
const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  show, 
  message = 'Cargando...', 
  transparent = false,
  fullscreen = false
}) => {
  if (!show) return null;
  
  return (
    <div 
      className={`loading-overlay ${transparent ? 'transparent' : ''} ${fullscreen ? 'fullscreen' : ''}`}
      style={{
        position: fullscreen ? 'fixed' : 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: transparent ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)',
        zIndex: fullscreen ? 2000 : 1000,
        borderRadius: fullscreen ? '0' : '0.25rem',
        backdropFilter: 'blur(2px)'
      }}
    >
      <div className="loading-content p-3 rounded" style={{ 
        backgroundColor: transparent ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem'
      }}>
        <Spinner animation="border" role="status" variant={transparent ? 'primary' : 'light'} />
        {message && (
          <div 
            className="mt-2" 
            style={{ 
              color: transparent ? '#212529' : 'white',
              fontSize: '0.9rem',
              fontWeight: 500
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;