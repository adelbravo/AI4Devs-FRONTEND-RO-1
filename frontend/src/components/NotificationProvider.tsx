import React, { useEffect, useState } from 'react';
import NotificationToast, { NotificationType } from './NotificationToast';
import { NOTIFICATION_EVENT, NotificationEvent } from '../services/notificationService';

interface NotificationProviderProps {
  children: React.ReactNode;
}

/**
 * NotificationProvider component that manages notifications across the application
 * It listens for notification events and displays them using NotificationToast
 */
const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  // State to manage multiple notifications
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    show: boolean;
    message: string;
    type: NotificationType;
    duration: number;
  }>>([]);

  useEffect(() => {
    // Listen for notification events
    const handleNotification = (event: Event) => {
      const customEvent = event as CustomEvent<NotificationEvent>;
      const { show, message, type, duration = 3000 } = customEvent.detail;
      
      if (show) {
        // Generate a unique ID for this notification
        const id = `notification-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        
        // Add new notification to the list
        setNotifications(prev => [
          ...prev, 
          {
            id,
            show: true,
            message,
            type,
            duration
          }
        ]);
        
        // Automatically remove notification after its duration
        setTimeout(() => {
          setNotifications(prev => 
            prev.filter(notification => notification.id !== id)
          );
        }, duration + 500); // Add a small buffer to allow for animation
      }
    };

    // Add event listener
    document.addEventListener(NOTIFICATION_EVENT, handleNotification);

    // Clean up
    return () => {
      document.removeEventListener(NOTIFICATION_EVENT, handleNotification);
    };
  }, []);

  // Handle closing a notification
  const handleClose = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, show: false } 
          : notification
      )
    );
    
    // Remove from array after animation completes
    setTimeout(() => {
      setNotifications(prev => 
        prev.filter(notification => notification.id !== id)
      );
    }, 300); // Animation duration
  };

  return (
    <>
      {children}
      <div className="notifications-container">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification-wrapper">
            <NotificationToast
              show={notification.show}
              message={notification.message}
              type={notification.type}
              onClose={() => handleClose(notification.id)}
              autoHideDuration={notification.duration}
              position="top-end"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default NotificationProvider;