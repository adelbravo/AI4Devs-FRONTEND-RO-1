import React, { useEffect, useState } from 'react';
import { Toast, ToastContainer, Spinner } from 'react-bootstrap';
import { CheckCircleFill, ExclamationTriangleFill, InfoCircleFill, XCircleFill } from 'react-bootstrap-icons';
import './Notifications.css';

export type NotificationType = 'success' | 'danger' | 'warning' | 'info';

export interface NotificationProps {
  show: boolean;
  message: string;
  type: NotificationType;
  onClose?: () => void;
  autoHideDuration?: number;
  position?: 'top-start' | 'top-center' | 'top-end' | 'middle-start' | 'middle-center' | 'middle-end' | 'bottom-start' | 'bottom-center' | 'bottom-end';
}

/**
 * NotificationToast component displays toast notifications with different styles based on type
 * Supports success, error, warning, and info notification types
 */
const NotificationToast: React.FC<NotificationProps> = ({
  show,
  message,
  type,
  onClose,
  autoHideDuration = 3000,
  position = 'top-end'
}) => {
  // State to track if the toast is hiding (for animation)
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (show && autoHideDuration > 0) {
      timer = setTimeout(() => {
        // Start hiding animation
        setIsHiding(true);
        
        // Wait for animation to complete before calling onClose
        setTimeout(() => {
          if (onClose) onClose();
          setIsHiding(false);
        }, 300); // Animation duration
      }, autoHideDuration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [show, autoHideDuration, onClose]);

  const getTitle = () => {
    switch (type) {
      case 'success':
        return 'Éxito';
      case 'danger':
        return 'Error';
      case 'warning':
        return 'Advertencia';
      case 'info':
        return 'Información';
      default:
        return 'Notificación';
    }
  };

  const getIcon = (): React.ReactElement | null => {
    switch (type) {
      case 'success':
        return <CheckCircleFill className="notification-icon" />;
      case 'danger':
        return <XCircleFill className="notification-icon" />;
      case 'warning':
        return <ExclamationTriangleFill className="notification-icon" />;
      case 'info':
        return <InfoCircleFill className="notification-icon" />;
      default:
        return null;
    }
  };

  // Handle close button click
  const handleClose = () => {
    setIsHiding(true);
    
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      if (onClose) onClose();
      setIsHiding(false);
    }, 300); // Animation duration
  };

  return (
    <ToastContainer className="p-3" position={position}>
      <Toast 
        show={show} 
        onClose={handleClose}
        bg={type}
        className={`notification-toast ${isHiding ? 'hiding' : ''}`}
      >
        <Toast.Header closeButton className="d-flex align-items-center">
          {getIcon()}
          <strong className="me-auto">{getTitle()}</strong>
        </Toast.Header>
        <Toast.Body className={type === 'success' || type === 'info' ? '' : 'text-white'}>
          <div className="d-flex align-items-center">
            {type === 'warning' && (
              <Spinner animation="border" size="sm" className="me-2" role="status" />
            )}
            <span>{message}</span>
          </div>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default NotificationToast;